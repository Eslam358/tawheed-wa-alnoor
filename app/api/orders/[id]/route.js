import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireAuth, requireAdmin } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";

export async function GET(request, { params }) {
  const { id } = await params;
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const order = await Order.findById(id).populate("user", "name email");
  if (!order) {
    return apiError("الطلب غير موجود", 404);
  }
  if (
    session.user.role !== "admin" &&
    order.user._id.toString() !== session.user.id
  ) {
    return apiError("غير مصرح لك بعرض هذا الطلب", 403);
  }
  return NextResponse.json(order);
}

// PUT -> تحديث حالة الطلب (أدمن فقط)
export async function PUT(request, { params }) {
  const { id } = await params;
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const body = await request.json();
  const order = await Order.findByIdAndUpdate(
    id,
    { status: body.status, paymentStatus: body.paymentStatus },
    { new: true }
  );
  if (!order) {
    return apiError("الطلب غير موجود", 404);
  }
  return NextResponse.json(order);
}
