import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/authHelpers";

// GET /api/cart -> سلة المستخدم الحالي المحفوظة (سلة فاضية لو زائر غير مسجّل)
export async function GET() {
  const { session } = await requireAuth();
  if (!session) {
    return NextResponse.json({ items: [] });
  }
  await dbConnect();
  const cart = await Cart.findOne({ user: session.user.id });
  return NextResponse.json({ items: cart?.items || [] });
}

// PUT /api/cart -> حفظ/تحديث سلة المستخدم الحالي بالكامل
export async function PUT(request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const { items } = await request.json();

  const cart = await Cart.findOneAndUpdate(
    { user: session.user.id },
    { items: Array.isArray(items) ? items : [] },
    { upsert: true, new: true }
  );

  return NextResponse.json({ items: cart.items });
}
