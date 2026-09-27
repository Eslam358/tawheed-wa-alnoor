import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  await dbConnect();
  const product = await Product.findById(params.id).populate(
    "category",
    "name slug"
  );
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  await dbConnect();
  const body = await request.json();
  const product = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  await dbConnect();
  const product = await Product.findByIdAndDelete(params.id);
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }
  return NextResponse.json({ message: "تم حذف المنتج" });
}
