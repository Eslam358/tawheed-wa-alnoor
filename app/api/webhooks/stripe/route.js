import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("خطأ في التحقق من Webhook:", err.message);
    return NextResponse.json({ error: "توقيع غير صالح" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;
    const orderId = checkoutSession.metadata?.orderId;

    if (orderId) {
      await dbConnect();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "قيد التجهيز",
      });
    }
  }

  return NextResponse.json({ received: true });
}
