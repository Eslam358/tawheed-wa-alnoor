import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "من فضلك أكمل كل الحقول" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مسجل بالفعل" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isAdmin ? "admin" : "customer",
    });

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", userId: user._id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ، حاول مرة أخرى" }, { status: 500 });
  }
}
