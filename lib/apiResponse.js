import { NextResponse } from "next/server";

/**
 * رد ناجح موحّد الشكل: { success: true, message, data }
 */
export function apiSuccess(data = null, message = "", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

/**
 * رد خطأ موحّد الشكل: { success: false, message, errors }
 * errors اختياري: object لأخطاء حقول معينة، مثلاً { phone: "رقم الهاتف غير صحيح" }
 */
export function apiError(message, status = 400, errors = null) {
  return NextResponse.json({ success: false, message, errors }, { status });
}
