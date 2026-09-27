import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  await dbConnect();
  const body = await request.json();
  const category = await Category.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(category);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  await dbConnect();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "تم حذف التصنيف" });
}
