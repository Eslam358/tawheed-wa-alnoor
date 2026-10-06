import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";

export async function GET(request, { params }) {
  const { id } = await params;
  await dbConnect();
  const product = await Product.findById(id).populate("category", "name slug");
  if (!product) {
    return apiError("المنتج غير موجود", 404);
  }
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const body = await request.json();
  const product = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return apiError("المنتج غير موجود", 404);
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);

  return NextResponse.json(product);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return apiError("المنتج غير موجود", 404);
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);

  return NextResponse.json({ message: "تم حذف المنتج" });
}
