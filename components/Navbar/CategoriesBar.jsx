"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MAX_VISIBLE = 6;

export default function CategoriesBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  const visible = categories.slice(0, MAX_VISIBLE);

  return (
    <div className="hidden md:block bg-sand-50 border-b border-sand-200">
      <div className="mx-auto max-w-7xl px-4">
        {/* flex-wrap بدل overflow-x-auto: مفيش سكرول هنا خالص */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2.5 text-sm text-ink/80">
          <Link href="/products" className="font-medium hover:text-brand-700">
            كل الأقسام
          </Link>
          {visible.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="hover:text-brand-700 transition"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/offers" className="font-bold text-sale-500 hover:text-sale-600 transition">
            🔥 العروض
          </Link>
        </div>
      </div>
    </div>
  );
}
