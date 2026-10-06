import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { requireAuth } from "@/lib/authHelpers";
import { apiError } from "@/lib/apiResponse";
import { accountUpdateSchema, formatZodError } from "@/lib/validation";

// GET /api/account -> بيانات المستخدم الحالي
export async function GET() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  await dbConnect();
  const user = await User.findById(session.user.id).select("name email phone image");
  if (!user) {
    return apiError("المستخدم غير موجود", 404);
  }
  return NextResponse.json(user);
}

// PUT /api/account -> تحديث الاسم / الهاتف، أو تغيير كلمة المرور
export async function PUT(request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const body = await request.json();
  const parsed = accountUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const { message } = formatZodError(parsed.error);
    return apiError(message, 400);
  }
  const { name, phone, currentPassword, newPassword } = parsed.data;

  await dbConnect();
  const user = await User.findById(session.user.id).select("+password");
  if (!user) {
    return apiError("المستخدم غير موجود", 404);
  }

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  if (newPassword) {
    // لو عنده كلمة مرور بالفعل (مش داخل بجوجل بس)، لازم يتأكد من الحالية
    if (user.password) {
      if (!currentPassword) {
        return apiError("من فضلك أدخل كلمة المرور الحالية", 400);
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return apiError("كلمة المرور الحالية غير صحيحة", 400);
      }
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  return NextResponse.json({
    message: "تم تحديث بياناتك بنجاح",
    user: { name: user.name, email: user.email, phone: user.phone },
  });
}
