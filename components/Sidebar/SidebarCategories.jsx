"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SidebarCategories({ sidebarId, onNavigate }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="px-4 pb-4 ">
      <p className="px-3 text-xs font-semibold text-ink/40  mb-1">الأقسام</p>
      <div className="space-y-1">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products?category=${cat._id}`}
            data-hs-overlay={sidebarId ? `#${sidebarId}` : undefined}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink  hover:bg-sand-100"
          >
            <span>{cat.icon || "🏷️"}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
