"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Skeleton from "@/components/Skeleton";

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (!order || order.error) {
    return <p className="text-center py-16 text-ink/50">لم يتم العثور على الطلب</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {searchParams.get("paid") === "true" && (
        <div className="mb-6 rounded-lg bg-brand-50 border border-brand-200 p-4 text-brand-800 text-center">
          ✓ تم الدفع بنجاح! شكراً لثقتك بنا.
        </div>
      )}

      <h1 className="font-display text-2xl text-brand-900 mb-1">
        طلب #{order._id.slice(-6)}
      </h1>
      <p className="text-sm text-ink/50 mb-6">
        {new Date(order.createdAt).toLocaleString("ar-EG")}
      </p>

      <div className="rounded-xl border border-sand-200 bg-white p-5 mb-4">
        <div className="flex justify-between mb-3">
          <span className="font-semibold">حالة الطلب</span>
          <span className="text-brand-900 font-medium">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">حالة الدفع</span>
          <span>
            {order.paymentStatus === "paid" ? "✓ مدفوع" : "قيد الانتظار"} (
            {order.paymentMethod === "cod" ? "عند الاستلام" : "بطاقة"})
          </span>
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
        <div className="flex justify-between text-sm border-t border-sand-200 pt-2">
          <span>الشحن</span>
          <span>{order.shippingPrice === 0 ? "مجاني" : `${order.shippingPrice} ج.م`}</span>
        </div>
        <div className="flex justify-between font-bold text-brand-900 border-t border-sand-200 pt-2">
          <span>الإجمالي</span>
          <span>{order.totalPrice} ج.م</span>
        </div>
      </div>

      <div className="rounded-xl border border-sand-200 bg-white p-5">
        <h2 className="font-semibold mb-2">عنوان الشحن</h2>
        <p className="text-sm text-ink/70">
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
