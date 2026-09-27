import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();
  const order = await Order.findById(params.id).populate("user", "name email");
  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  if (
    session.user.role !== "admin" &&
    order.user._id.toString() !== session.user.id
  ) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  return NextResponse.json(order);
}

// PUT -> تحديث حالة الطلب (أدمن فقط)
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  await dbConnect();
  const body = await request.json();
  const order = await Order.findByIdAndUpdate(
    params.id,
    { status: body.status, paymentStatus: body.paymentStatus },
    { new: true }
  );
  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  return NextResponse.json(order);
}
