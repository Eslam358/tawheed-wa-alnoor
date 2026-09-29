"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  async function handleDelete(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-brand-900">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-sand-50 hover:bg-brand-800"
        >
          + إضافة منتج
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl border border-sand-200 bg-white p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-sand-200 bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-sand-100 text-ink/60">
              <tr>
                <th className="text-right p-3">المنتج</th>
                <th className="text-right p-3">التصنيف</th>
                <th className="text-right p-3">السعر</th>
                <th className="text-right p-3">المخزون</th>
                <th className="text-right p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-sand-100">
                  <td className="p-3 flex items-center gap-2">
                    <div className="h-10 w-10 rounded bg-sand-100 overflow-hidden shrink-0">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="line-clamp-1">{p.name}</span>
                  </td>
                  <td className="p-3">{p.category?.name || "—"}</td>
                  <td className="p-3">{p.price} ج.م</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/admin/products/${p._id}/edit`}
                      className="text-brand-700 hover:underline"
                    >
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-ink/40">
                    لا توجد منتجات بعد
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
