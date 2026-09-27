import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

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
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }
  await dbConnect();
  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "اسم التصنيف مطلوب" }, { status: 400 });
  }
  const category = await Category.create({
    ...body,
    slug: slugify(body.name),
  });
  return NextResponse.json(category, { status: 201 });
}
