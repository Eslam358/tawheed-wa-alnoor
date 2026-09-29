"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("سلتك فارغة");
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
        if (!res.ok) throw new Error(data.error || "حدث خطأ");
        window.location.href = data.url;
      } else {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "حدث خطأ");
        clearCart();
        router.push(`/orders/${data._id}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        إتمام الطلب
      </h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg">عنوان الشحن</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              placeholder="الاسم بالكامل"
              className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
            />
            <input
              required
              name="phone"
              value={form.phone}
              onChange={updateField}
              placeholder="رقم الجوال"
              className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
            />
            <input
              required
              name="city"
              value={form.city}
              onChange={updateField}
              placeholder="المدينة"
              className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
            />
            <input
              name="area"
              value={form.area}
              onChange={updateField}
              placeholder="الحي"
              className="rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
            />
          </div>
          <input
            name="street"
            value={form.street}
            onChange={updateField}
            placeholder="اسم الشارع ورقم المبنى"
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={updateField}
            placeholder="ملاحظات إضافية (اختياري)"
            rows={2}
            className="w-full rounded-lg border border-sand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sale-600"
          />

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

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 rounded-full bg-sale-500 py-3 font-semibold text-brand-950 hover:bg-sale-600 transition disabled:opacity-60"
          >
            {loading ? "جارِ التنفيذ..." : "تأكيد الطلب"}
          </button>
        </div>
      </form>
    </div>
  );
}
