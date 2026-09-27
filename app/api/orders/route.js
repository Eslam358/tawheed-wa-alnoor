import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";

// GET /api/orders -> طلبات المستخدم الحالي، أو كل الطلبات لو أدمن (?all=true)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");

  let query = {};
  if (all === "true" && session.user.role === "admin") {
    query = {};
  } else {
    query = { user: session.user.id };
  }

  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(orders);
}

// POST /api/orders -> إنشاء طلب جديد (الدفع عند الاستلام)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();

  const body = await request.json();
  const { items, shippingAddress, paymentMethod } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
  }
  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.city) {
    return NextResponse.json(
      { error: "من فضلك أكمل بيانات الشحن" },
      { status: 400 }
    );
  }

  // إعادة حساب السعر من قاعدة البيانات (لا نثق بالسعر القادم من العميل)
  let itemsPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;
    const qty = Math.max(1, item.quantity);
    itemsPrice += product.price * qty;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      quantity: qty,
    });
  }

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "لا يوجد منتجات صالحة في السلة" }, { status: 400 });
  }

  const shippingPrice = itemsPrice >= 500 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: session.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod === "card" ? "card" : "cod",
    paymentStatus: "pending",
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  return NextResponse.json(order, { status: 201 });
}
