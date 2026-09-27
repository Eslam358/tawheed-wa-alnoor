"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-display text-2xl text-brand-900 mb-2">
          سلتك فارغة
        </h1>
        <p className="text-ink/60 mb-6">لم تضف أي منتجات بعد.</p>
        <Link
          href="/products"
          className="inline-block rounded-full bg-brand-900 px-6 py-3 text-sand-50 font-semibold hover:bg-brand-800 transition"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">سلة المشتريات</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border border-sand-200 bg-white p-3"
          >
            <div className="h-20 w-20 shrink-0 rounded-lg bg-sand-100 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">🛍️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-2">{item.name}</p>
              <p className="text-brand-900 font-bold mt-1">{item.price} ر.س</p>
            </div>
            <div className="flex items-center border border-sand-200 rounded-full">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-2 py-1"
              >
                −
              </button>
              <span className="px-2 text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-2 py-1"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 text-sm px-2"
              aria-label="حذف"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-sand-200 bg-white p-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span>المجموع الفرعي</span>
          <span>{subtotal} ر.س</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>الشحن</span>
          <span>{shipping === 0 ? "مجاني" : `${shipping} ر.س`}</span>
        </div>
        <div className="flex justify-between font-bold text-brand-900 text-lg border-t border-sand-200 pt-2">
          <span>الإجمالي</span>
          <span>{total} ر.س</span>
        </div>
        <Link
          href="/checkout"
          className="block text-center mt-4 rounded-full bg-sale-500 py-3 font-semibold text-brand-950 hover:bg-sale-600 transition"
        >
          متابعة الشراء
        </Link>
      </div>
    </div>
  );
}
