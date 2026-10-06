"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";
import { shippingAddressSchema } from "@/lib/validation";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    fullName: session?.user?.name || "",
    phone: "",
    city: "",
    area: "",
    street: "",
    notes: "",
  });

  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateField(field, value) {
    const fieldSchema = shippingAddressSchema.shape[field];
    if (!fieldSchema) return;
    const result = fieldSchema.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: result.success ? "" : result.error.issues[0].message,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("سلتك فارغة");
      return;
    }

    const parsed = shippingAddressSchema.safeParse(form);
    if (!parsed.success) {
      const errors = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0]] = issue.message;
      }
      setFieldErrors(errors);
      setError("في بيانات شحن محتاجة تصحيح قبل ما نكمّل");
      return;
    }

    setLoading(true);

    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      shippingAddress: form,
      paymentMethod,
    };

    try {
      if (paymentMethod === "card") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "حدث خطأ");
        window.location.href = data.url;
      } else {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "حدث خطأ");
        clearCart();
        router.push(`/orders/${data._id}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function fieldClass(field) {
    return `rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600 ${
      fieldErrors[field] ? "border-red-400" : "border-sand-200"
    }`;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        إتمام الطلب
      </h1>

      <form onSubmit={handleSubmit} noValidate className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg">عنوان الشحن</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="sr-only">الاسم بالكامل</label>
              <input
                id="fullName"
                required
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                onBlur={(e) => validateField("fullName", e.target.value)}
                placeholder="الاسم بالكامل"
                aria-invalid={!!fieldErrors.fullName}
                className={`w-full ${fieldClass("fullName")}`}
              />
              {fieldErrors.fullName && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.fullName}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">رقم الجوال</label>
              <input
                id="phone"
                required
                name="phone"
                value={form.phone}
                onChange={updateField}
                onBlur={(e) => validateField("phone", e.target.value)}
                placeholder="رقم الجوال (01xxxxxxxxx)"
                aria-invalid={!!fieldErrors.phone}
                className={`w-full ${fieldClass("phone")}`}
              />
              {fieldErrors.phone && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="sr-only">المدينة</label>
              <input
                id="city"
                required
                name="city"
                value={form.city}
                onChange={updateField}
                onBlur={(e) => validateField("city", e.target.value)}
                placeholder="المدينة"
                aria-invalid={!!fieldErrors.city}
                className={`w-full ${fieldClass("city")}`}
              />
              {fieldErrors.city && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="area" className="sr-only">الحي</label>
              <input
                id="area"
                name="area"
                value={form.area}
                onChange={updateField}
                placeholder="الحي (اختياري)"
                className={`w-full ${fieldClass("area")}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="street" className="sr-only">اسم الشارع ورقم المبنى</label>
            <input
              id="street"
              name="street"
              value={form.street}
              onChange={updateField}
              onBlur={(e) => validateField("street", e.target.value)}
              placeholder="اسم الشارع ورقم المبنى"
              aria-invalid={!!fieldErrors.street}
              className={`w-full ${fieldClass("street")}`}
            />
            {fieldErrors.street && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.street}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="sr-only">ملاحظات إضافية</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={updateField}
              placeholder="ملاحظات إضافية (اختياري)"
              rows={2}
              className={`w-full ${fieldClass("notes")}`}
            />
          </div>

          <h2 className="font-semibold text-lg pt-2">طريقة الدفع</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 rounded-lg border border-sand-200 p-4 cursor-pointer has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>💵 الدفع عند الاستلام</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-sand-200 p-4 cursor-pointer has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span>💳 الدفع الإلكتروني (بطاقة ائتمان)</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-sand-200 bg-white p-5 h-fit space-y-2">
          <h2 className="font-semibold mb-2">ملخص الطلب</h2>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm text-ink/70">
              <span>{i.name} × {i.quantity}</span>
              <span>{i.price * i.quantity} ج.م</span>
            </div>
          ))}
          <div className="flex justify-between text-sm border-t border-sand-200 pt-2">
            <span>الشحن</span>
            <span>{shipping === 0 ? "مجاني" : `${shipping} ج.م`}</span>
          </div>
          <div className="flex justify-between font-bold text-brand-900 text-lg border-t border-sand-200 pt-2">
            <span>الإجمالي</span>
            <span>{total} ج.م</span>
          </div>

          {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full mt-3 rounded-full bg-sale-500 py-3 font-semibold text-brand-950 hover:bg-sale-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "جارِ التنفيذ..." : "تأكيد الطلب"}
          </button>
        </div>
      </form>
    </div>
  );
}
