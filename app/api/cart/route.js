import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

// GET /api/cart -> سلة المستخدم الحالي المحفوظة
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ items: [] });
  }
  await dbConnect();
  const cart = await Cart.findOne({ user: session.user.id });
  return NextResponse.json({ items: cart?.items || [] });
}

// PUT /api/cart -> حفظ/تحديث سلة المستخدم الحالي بالكامل
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();

  const { items } = await request.json();

  const cart = await Cart.findOneAndUpdate(
    { user: session.user.id },
    { items: Array.isArray(items) ? items : [] },
    { upsert: true, new: true }
  );

  return NextResponse.json({ items: cart.items });
}
