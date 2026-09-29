"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import TNLogo from "@/components/TNLogo";

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <TNLogo size={56} className="mx-auto mb-4 rounded-xl opacity-70" />
        <h1 className="font-display text-2xl text-brand-900 mb-2">
          سلتك فارغة
        </h1>
        <p className="text-ink/60 mb-6">لم تضف أي منتجات بعد.</p>
        <Link
          href="/products"
          className="inline-block rounded-md bg-brand-900 px-6 py-3 text-white font-semibold hover:bg-brand-800 transition"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-brand-900">سلة المشتريات</h1>
        <Link href="/products" className="text-sm font-medium text-brand-700 hover:underline">
          ← متابعة التسوق
        </Link>
      </div>

      {/* شريط الشحن المجاني */}
      <div className="rounded-xl border border-sand-200 bg-white p-4 mb-6">
        {remaining > 0 ? (
          <p className="text-sm mb-2">
            أضف <span className="font-bold text-brand-700">{remaining} ج.م</span> كمان
            واحصل على <span className="font-bold text-brand-700">شحن مجاني 🚚</span>
          </p>
        ) : (
          <p className="text-sm mb-2 font-semibold text-brand-700">
            🎉 مبروك! طلبك مؤهل للشحن المجاني
          </p>
        )}
        <div className="h-2 rounded-full bg-sand-100 overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-sand-200 bg-white p-3"
            >
              <Link
                href={`/products/${item.productId}`}
                className="h-20 w-20 shrink-0 rounded-lg bg-sand-100 overflow-hidden"
              >
                {item.image ? (
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🛍️</div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="font-medium text-sm line-clamp-2 hover:text-brand-700"
                >
                  {item.name}
                </Link>
                <p className="text-ink/50 text-xs mt-1">سعر القطعة: {item.price} ج.م</p>
                <p className="text-brand-900 font-bold mt-1">
                  {item.price * item.quantity} ج.م
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border border-sand-200 rounded-full">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-2.5 py-1 text-ink/70 hover:text-ink"
                    aria-label="تقليل الكمية"
                  >
                    −
                  </button>
                  <span className="px-2 text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2.5 py-1 text-ink/70 hover:text-ink"
                    aria-label="زيادة الكمية"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 text-xs hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-sand-200 bg-white p-5 h-fit space-y-2 sticky top-24">
          <h2 className="font-semibold mb-1">ملخص الطلب</h2>
          <div className="flex justify-between text-sm">
            <span>المجموع الفرعي</span>
            <span>{subtotal} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>الشحن</span>
            <span className={shipping === 0 ? "text-brand-700 font-medium" : ""}>
              {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-brand-900 text-lg border-t border-sand-200 pt-2">
            <span>الإجمالي</span>
            <span>{total} ج.م</span>
          </div>
          <Link
            href="/checkout"
            className="block text-center mt-4 rounded-md bg-sale-500 py-3 font-semibold text-white hover:bg-sale-600 transition"
          >
            متابعة الشراء
          </Link>
          <p className="text-[11px] text-ink/40 text-center pt-1">
            🔒 دفع آمن — الدفع عند الاستلام أو بالبطاقة
          </p>
        </div>
      </div>
    </div>
  );
}
