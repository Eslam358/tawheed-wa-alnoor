import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// POST /api/checkout -> ينشئ الطلب (paymentMethod=card) ثم جلسة دفع Stripe
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();

  const body = await request.json();
  const { items, shippingAddress } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
  }

  let itemsPrice = 0;
  const orderItems = [];
  const lineItems = [];

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
    lineItems.push({
      price_data: {
        currency: "egp",
        product_data: { name: product.name },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: qty,
    });
  }

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "لا يوجد منتجات صالحة" }, { status: 400 });
  }

  const shippingPrice = itemsPrice >= 500 ? 0 : 50;
  if (shippingPrice > 0) {
    lineItems.push({
      price_data: {
        currency: "egp",
        product_data: { name: "رسوم الشحن" },
        unit_amount: shippingPrice * 100,
      },
      quantity: 1,
    });
  }

  const order = await Order.create({
    user: session.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod: "card",
    paymentStatus: "pending",
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${baseUrl}/orders/${order._id}?paid=true`,
    cancel_url: `${baseUrl}/checkout`,
    metadata: { orderId: order._id.toString() },
  });

  order.stripeSessionId = checkoutSession.id;
  await order.save();

  return NextResponse.json({ url: checkoutSession.url });
}
