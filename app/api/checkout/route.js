import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";
import { checkoutSchema, formatZodError } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createPendingCardOrder, InsufficientStockError } from "@/lib/services/orderService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const CHECKOUT_LIMIT = 10;
const CHECKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 دقيقة

// POST /api/checkout -> ينشئ الطلب (paymentMethod=card) ثم جلسة دفع Stripe
export async function POST(request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit("checkout", ip, CHECKOUT_LIMIT, CHECKOUT_WINDOW_MS);
  if (!rateLimit.allowed) {
    return apiError(
      `محاولات كتير. حاول تاني بعد ${Math.ceil(rateLimit.retryAfterSeconds / 60)} دقيقة`,
      429
    );
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const { message } = formatZodError(parsed.error);
    return apiError(message, 400);
  }

  await dbConnect();

  let order;
  try {
    order = await createPendingCardOrder({
      userId: session.user.id,
      cartItems: parsed.data.items,
      shippingAddress: parsed.data.shippingAddress,
    });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return apiError(err.message, 409);
    }
    console.error("خطأ في إنشاء طلب الدفع الإلكتروني:", err);
    return apiError("تعذّر إتمام الطلب، حاول مرة أخرى", 500);
  }

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "egp",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (order.shippingPrice > 0) {
    lineItems.push({
      price_data: {
        currency: "egp",
        product_data: { name: "رسوم الشحن" },
        unit_amount: order.shippingPrice * 100,
      },
      quantity: 1,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
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
  } catch (err) {
    console.error("خطأ في إنشاء جلسة الدفع:", err);
    return apiError("تعذّر الاتصال ببوابة الدفع، حاول مرة أخرى", 502);
  }
}
