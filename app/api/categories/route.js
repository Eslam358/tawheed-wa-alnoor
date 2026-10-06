import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";

function slugify(text) {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
}

export async function GET() {
  await dbConnect();
  const categories = await Category.find().sort({ name: 1 });
  return NextResponse.json(categories);
}

export async function POST(request) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const body = await request.json();
  if (!body.name) {
    return apiError("اسم التصنيف مطلوب", 400);
  }
  const category = await Category.create({
    ...body,
    slug: slugify(body.name),
  });

  revalidatePath("/");
revalidatePath("/products");

  return NextResponse.json(category, { status: 201 });
}
