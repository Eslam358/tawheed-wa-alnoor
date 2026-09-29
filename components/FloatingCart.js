"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";

export default function FloatingCart() {
  const { itemsCount, subtotal } = useCart();
  const pathname = usePathname();
  const [badgeKey, setBadgeKey] = useState(0);

  useEffect(() => {
    setBadgeKey((k) => k + 1);
  }, [itemsCount]);

  // متخفيش الزرار في صفحة السلة نفسها
  if (pathname === "/cart" || itemsCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="floating-cart fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-brand-900 text-white pl-4 pr-3 py-3 shadow-xl hover:bg-brand-800 transition-colors"
      aria-label="عرض سلة المشتريات"
    >
      <span className="relative text-xl">
        🛒
        <span
          key={badgeKey}
          className="floating-cart-badge absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-sale-500 text-[11px] font-bold text-white"
        >
          {itemsCount}
        </span>
      </span>
      <span className="hidden sm:inline text-sm font-semibold">{subtotal} ج.م</span>
    </Link>
  );
}
