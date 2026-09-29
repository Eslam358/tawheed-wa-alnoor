"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const statusColors = {
  "قيد المراجعة": "bg-yellow-100 text-yellow-800",
  "قيد التجهيز": "bg-blue-100 text-blue-800",
  "تم الشحن": "bg-purple-100 text-purple-800",
  "تم التسليم": "bg-brand-100 text-brand-800",
  "ملغي": "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-16 text-ink/50">جارِ التحميل...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="font-display text-2xl text-brand-900 mb-2">
          لا توجد طلبات بعد
        </h1>
        <Link
          href="/products"
          className="inline-block mt-4 rounded-full bg-brand-900 px-6 py-3 text-sand-50 font-semibold"
        >
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">طلباتي</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block rounded-xl border border-sand-200 bg-white p-4 hover:border-brand-700 transition"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">
                طلب #{order._id.slice(-6)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  statusColors[order.status] || "bg-gray-100"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-ink/50">
              {new Date(order.createdAt).toLocaleDateString("ar-EG")}
            </p>
            <p className="text-brand-900 font-bold mt-2">
              {order.totalPrice} ج.م
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
