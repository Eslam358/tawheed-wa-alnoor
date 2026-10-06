import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { apiError } from "@/lib/apiResponse";
import { registerSchema, formatZodError } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const REGISTER_LIMIT = 3;
const REGISTER_WINDOW_MS = 60 * 60 * 1000; // ساعة واحدة

export async function POST(request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit("register", ip, REGISTER_LIMIT, REGISTER_WINDOW_MS);
  if (!rateLimit.allowed) {
    return apiError(
      `محاولات كتير لإنشاء حساب. حاول تاني بعد ${Math.ceil(rateLimit.retryAfterSeconds / 60)} دقيقة`,
      429
    );
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const { message } = formatZodError(parsed.error);
    return apiError(message, 400);
  }
  const { name, email, password } = parsed.data;

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    return apiError("هذا البريد الإلكتروني مسجل بالفعل", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isAdmin =
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL.toLowerCase();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: isAdmin ? "admin" : "customer",
  });

  return NextResponse.json(
    { message: "تم إنشاء الحساب بنجاح", userId: user._id },
    { status: 201 }
  );
}
