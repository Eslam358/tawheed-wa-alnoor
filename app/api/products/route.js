import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

function slugify(text) {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
}

// GET /api/products?search=&category=&page=&limit=&featured=
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const query = { isActive: true };
  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (featured === "true") query.isFeatured = true;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// POST /api/products (أدمن فقط)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
  }

  await dbConnect();
  const body = await request.json();

  if (!body.name || !body.price || !body.category) {
    return NextResponse.json(
      { error: "اسم المنتج والسعر والتصنيف مطلوبين" },
      { status: 400 }
    );
  }

  const slug = slugify(body.name) + "-" + Date.now().toString(36);

  const product = await Product.create({ ...body, slug });
  return NextResponse.json(product, { status: 201 });
}
