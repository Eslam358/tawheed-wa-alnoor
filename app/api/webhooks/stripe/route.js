import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import { confirmPaidCardOrder } from "@/lib/services/orderService";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   apiVersion: "2024-06-20",
// });

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  : null;

export async function POST(request) {
  
  return NextResponse.json(
  { message: "Stripe webhook غير مفعّل حاليًا" },
  { status: 503 }
);
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
      // بيخصم المخزون فعلياً دلوقتي (أول مرة) ويحدّث حالة الطلب،
      // كل ده جوه transaction واحدة لضمان عدم تضارب المخزون.
      await confirmPaidCardOrder(orderId);
    }
  }

  return NextResponse.json({ received: true });
}
