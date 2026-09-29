import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// GET /api/account -> بيانات المستخدم الحالي
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();
  const user = await User.findById(session.user.id).select("name email phone image");
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }
  return NextResponse.json(user);
}

// PUT /api/account -> تحديث الاسم / الهاتف، أو تغيير كلمة المرور
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "من فضلك سجّل الدخول" }, { status: 401 });
  }
  await dbConnect();

  const body = await request.json();
  const { name, phone, currentPassword, newPassword } = body;

  const user = await User.findById(session.user.id).select("+password");
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // تحديث البيانات الأساسية
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  // تغيير كلمة المرور (لو طلب المستخدم ذلك)
  if (newPassword) {
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }
    // لو عنده كلمة مرور بالفعل (مش داخل بجوجل بس)، لازم يتأكد من الحالية
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "من فضلك أدخل كلمة المرور الحالية" },
          { status: 400 }
        );
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "كلمة المرور الحالية غير صحيحة" },
          { status: 400 }
        );
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
