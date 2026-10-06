import mongoose from "mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

/**
 * خطأ مخصص لنفاد المخزون، بيحمل اسم المنتج اللي المشكلة فيه
 * عشان نقدر نوريه للمستخدم برسالة واضحة.
 */
export class InsufficientStockError extends Error {
  constructor(productName) {
    super(`الكمية المتاحة من "${productName}" غير كافية حالياً`);
    this.name = "InsufficientStockError";
    this.productName = productName;
  }
}

/**
 * بيعيد حساب أسعار السلة من قاعدة البيانات (منقدرش نثق بالسعر القادم
 * من العميل)، وبيتأكد إن كل منتج لسه متاح ومخزونه كافي.
 * بيرجع orderItems جاهزة للحفظ + itemsPrice + shippingPrice + totalPrice.
 */
export async function buildOrderItems(cartItems) {
  let itemsPrice = 0;
  const orderItems = [];

  for (const cartItem of cartItems) {
    const product = await Product.findById(cartItem.productId);
    if (!product || !product.isActive) continue;

    const quantity = Math.max(1, cartItem.quantity);
    if (product.stock < quantity) {
      throw new InsufficientStockError(product.name);
    }

    itemsPrice += product.price * quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      quantity,
    });
  }

  if (orderItems.length === 0) {
    throw new Error("لا يوجد منتجات صالحة في السلة");
  }

  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return {
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  };
}

/**
 * بيخصم المخزون لكل منتجات الطلب بشكل ذرّي (atomic)، مع شرط
 * stock >= quantity في نفس الاستعلام عشان يمنع negative stock لو
 * حصل تزامن بين أكتر من طلب في نفس اللحظة.
 * لو فشل أي منتج، بيرجّع كل المنتجات اللي اتخصمت قبله (rollback يدوي)
 * ويرمي InsufficientStockError.
 */
async function decrementStock(orderItems, mongoSession) {
  const decremented = [];

  for (const item of orderItems) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true, session: mongoSession }
    );

    if (!updated) {
      // رجّع المنتجات اللي اتخصمت قبل الفشل ده
      for (const done of decremented) {
        await Product.findByIdAndUpdate(
          done.product,
          { $inc: { stock: done.quantity } },
          { session: mongoSession }
        );
      }
      throw new InsufficientStockError(item.name);
    }

    decremented.push(item);
  }
}

/**
 * إنشاء طلب "الدفع عند الاستلام": بيخصم المخزون فوراً لأن الطلب
 * بيتأكد مباشرة من غير خطوة دفع إلكتروني منفصلة.
 * العملية كلها جوه transaction واحدة: لو أي خطوة فشلت، كل حاجة بترجع
 * زي ما كانت (مفيش طلب ناقص أو مخزون متخصم غلط).
 */
export async function createCodOrder({ userId, cartItems, shippingAddress }) {
  const mongoSession = await mongoose.startSession();
  try {
    let order;
    await mongoSession.withTransaction(async () => {
      const { orderItems, itemsPrice, shippingPrice, totalPrice } =
        await buildOrderItems(cartItems);

      await decrementStock(orderItems, mongoSession);

      const created = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod: "cod",
            paymentStatus: "pending",
            itemsPrice,
            shippingPrice,
            totalPrice,
          },
        ],
        { session: mongoSession }
      );
      order = created[0];
    });
    return order;
  } finally {
    await mongoSession.endSession();
  }
}

/**
 * إنشاء طلب "دفع إلكتروني": الطلب بيتعمل بحالة pending من غير خصم
 * مخزون (الخصم بيحصل بس لما الدفع يتأكد فعلاً عبر الـ webhook، عشان
 * منحجزش مخزون لطلبات هتتلغي أو الدفع فيها هيفشل).
 */
export async function createPendingCardOrder({ userId, cartItems, shippingAddress }) {
  const { orderItems, itemsPrice, shippingPrice, totalPrice } =
    await buildOrderItems(cartItems);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod: "card",
    paymentStatus: "pending",
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  return order;
}

/**
 * بتتنفذ من Stripe webhook بعد تأكيد نجاح الدفع فعلياً.
 * بتخصم المخزون دلوقتي (أول مرة في دورة حياة طلب الدفع الإلكتروني).
 * لو المخزون مش كافي لمنتج معين وقت التأكيد (حد تاني اشتراه قبله)،
 * الطلب بيتحط في حالة "قيد المراجعة" مع ملاحظة واضحة بدل ما يتعلّق
 * بصمت — الأدمن يقدر يراجعه ويتواصل مع العميل يدوياً.
 */
export async function confirmPaidCardOrder(orderId) {
  const order = await Order.findById(orderId);
  if (!order) return null;

  const mongoSession = await mongoose.startSession();
  try {
    await mongoSession.withTransaction(async () => {
      try {
        await decrementStock(order.items, mongoSession);
        order.status = "قيد التجهيز";
        order.stockNote = undefined;
      } catch (err) {
        if (err instanceof InsufficientStockError) {
          order.status = "قيد المراجعة";
          order.stockNote = `تنبيه: ${err.message} — الدفع تم لكن المخزون غير كافٍ، يحتاج مراجعة يدوية.`;
        } else {
          throw err;
        }
      }
      order.paymentStatus = "paid";
      await order.save({ session: mongoSession });
    });
  } finally {
    await mongoSession.endSession();
  }

  return order;
}
