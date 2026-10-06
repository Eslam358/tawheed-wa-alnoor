import { z } from "zod";

// رقم هاتف مصري: يبدأ بـ 01 ويتكون من 11 رقم، أو بصيغة +20
export const egyptianPhoneSchema = z
  .string()
  .trim()
  .regex(
    /^(01[0125][0-9]{8}|\+201[0125][0-9]{8})$/,
    "رقم الهاتف غير صحيح، لازم يكون رقم مصري زي 01012345678"
  );

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("البريد الإلكتروني غير صحيح");

// كلمة سر: 8 أحرف على الأقل، وفيها رقم وحرف على الأقل
export const passwordSchema = z
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .regex(/[A-Za-z]/, "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل")
  .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: emailSchema,
  password: passwordSchema,
});

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, "الاسم بالكامل مطلوب"),
  phone: egyptianPhoneSchema,
  city: z.string().trim().min(2, "المدينة مطلوبة"),
  area: z.string().trim().optional().or(z.literal("")),
  street: z.string().trim().min(3, "العنوان التفصيلي مطلوب (الشارع ورقم المبنى)"),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "السلة فارغة"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["cod", "card"]).optional(),
});

export const accountUpdateSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").optional(),
  phone: z
    .union([egyptianPhoneSchema, z.literal("")])
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: passwordSchema.optional(),
});

/**
 * يحوّل أخطاء Zod لشكل بسيط: { fieldName: "رسالة الخطأ" }
 * ورسالة عامة تجمع أول خطأ، مناسبة للعرض المباشر للمستخدم.
 */
export function formatZodError(zodError) {
  const fieldErrors = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0] || "general";
    if (!fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  const firstMessage = zodError.issues[0]?.message || "البيانات المدخلة غير صحيحة";
  return { fieldErrors, message: firstMessage };
}
