import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";

// بيهرّب الرموز الخاصة بالـ regex عشان البحث يشتغل مظبوط لو المستخدم كتب
// رمز زي ( أو + من غير ما يبوّظ الاستعلام
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: pattern }, { description: pattern }];
  }
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
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const body = await request.json();

  if (!body.name || !body.price || !body.category) {
    return apiError("اسم المنتج والسعر والتصنيف مطلوبين", 400);
  }

  const slug = slugify(body.name) + "-" + Date.now().toString(36);

  const product = await Product.create({ ...body, slug });
  return NextResponse.json(product, { status: 201 });
}
