import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireAuth } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";
import { checkoutSchema, formatZodError } from "@/lib/validation";
import { createCodOrder, InsufficientStockError } from "@/lib/services/orderService";

// GET /api/orders -> طلبات المستخدم الحالي، أو كل الطلبات لو أدمن (?all=true)
export async function GET(request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const wantsAll = searchParams.get("all") === "true" && session.user.role === "admin";

  const query = wantsAll ? {} : { user: session.user.id };
  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(orders);
}

// POST /api/orders -> إنشاء طلب جديد (الدفع عند الاستلام)
export async function POST(request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const { message } = formatZodError(parsed.error);
    return apiError(message, 400);
  }

  await dbConnect();

  try {
    const order = await createCodOrder({
      userId: session.user.id,
      cartItems: parsed.data.items,
      shippingAddress: parsed.data.shippingAddress,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return apiError(err.message, 409);
    }
    console.error("خطأ في إنشاء الطلب:", err);
    return apiError("تعذّر إتمام الطلب، حاول مرة أخرى", 500);
  }
}
