"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";

const statusColors = {
  "قيد المراجعة": "bg-yellow-100 text-yellow-800",
  "قيد التجهيز": "bg-blue-100 text-blue-800",
  "تم الشحن": "bg-purple-100 text-purple-800",
  "تم التسليم": "bg-brand-100 text-brand-800",
  "ملغي": "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?all=true")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-900 mb-6">الطلبات</h1>

      {loading ? (
        <div className="rounded-xl border border-sand-200 bg-white p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-sand-200 bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-sand-100 text-ink/60">
              <tr>
                <th className="text-right p-3">رقم الطلب</th>
                <th className="text-right p-3">العميل</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">الدفع</th>
                <th className="text-right p-3">الإجمالي</th>
                <th className="text-right p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-sand-100">
                  <td className="p-3">
                    <Link href={`/admin/orders/${o._id}`} className="text-brand-700 hover:underline">
                      #{o._id.slice(-6)}
                    </Link>
                  </td>
                  <td className="p-3">{o.user?.name || "—"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status] || "bg-gray-100"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {o.paymentStatus === "paid" ? "✓ مدفوع" : "قيد الانتظار"}
                  </td>
                  <td className="p-3">{o.totalPrice} ج.م</td>
                  <td className="p-3 text-ink/50">
                    {new Date(o.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-ink/40">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
