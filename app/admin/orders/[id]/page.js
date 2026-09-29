"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Skeleton from "@/components/Skeleton";

const statuses = ["قيد المراجعة", "قيد التجهيز", "تم الشحن", "تم التسليم", "ملغي"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status) {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus: order.paymentStatus }),
    });
    const data = await res.json();
    setOrder(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function markPaid() {
    setSaving(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: order.status, paymentStatus: "paid" }),
    });
    const data = await res.json();
    setOrder(data);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (!order || order.error) return <p className="text-ink/50">لم يتم العثور على الطلب</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-brand-900 mb-1">
        طلب #{order._id.slice(-6)}
      </h1>
      <p className="text-sm text-ink/50 mb-6">
        {new Date(order.createdAt).toLocaleString("ar-EG")}
      </p>

      <div className="rounded-xl border border-sand-200 bg-white p-5 mb-4">
        <h2 className="font-semibold mb-3">حالة الطلب</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={saving}
              className={`rounded-full px-4 py-1.5 text-sm border transition ${
                order.status === s
                  ? "bg-brand-900 text-sand-50 border-brand-900"
                  : "bg-white border-sand-200 hover:border-brand-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {saved && <p className="text-brand-700 text-sm">✓ تم الحفظ</p>}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-100">
          <span className="text-sm">
            حالة الدفع: {order.paymentStatus === "paid" ? "✓ مدفوع" : "قيد الانتظار"}
            {" "}({order.paymentMethod === "cod" ? "عند الاستلام" : "بطاقة"})
          </span>
          {order.paymentStatus !== "paid" && order.paymentMethod === "cod" && (
            <button
              onClick={markPaid}
              disabled={saving}
              className="text-sm text-brand-700 hover:underline"
            >
              تحديد كمدفوع
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-sand-200 bg-white p-5 mb-4 space-y-3">
        <h2 className="font-semibold mb-2">المنتجات</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} ج.م</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-brand-900 border-t border-sand-200 pt-2">
          <span>الإجمالي</span>
          <span>{order.totalPrice} ج.م</span>
        </div>
      </div>

      <div className="rounded-xl border border-sand-200 bg-white p-5">
        <h2 className="font-semibold mb-2">بيانات العميل والشحن</h2>
        <p className="text-sm text-ink/70">
          {order.user?.name} — {order.user?.email}
          <br />
          {order.shippingAddress.fullName} — {order.shippingAddress.phone}
          <br />
          {order.shippingAddress.city}، {order.shippingAddress.area}
          <br />
          {order.shippingAddress.street}
        </p>
      </div>
    </div>
  );
}
