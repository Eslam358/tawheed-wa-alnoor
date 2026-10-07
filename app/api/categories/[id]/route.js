import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/authHelpers";

export async function PUT(request, { params }) {
  const { id } = await params;
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const body = await request.json();
  const category = await Category.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(category);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "تم حذف التصنيف" });
}
