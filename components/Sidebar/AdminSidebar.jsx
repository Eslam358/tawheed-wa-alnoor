"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "الرئيسية", icon: "📊", exact: true },
  { href: "/admin/products", label: "المنتجات", icon: "🛍️" },
  { href: "/admin/categories", label: "التصنيفات", icon: "🗂️" },
  { href: "/admin/orders", label: "الطلبات", icon: "📦" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0 md:min-h-[calc(100vh-4rem)] bg-brand-950 text-sand-100 p-4">
      <p className="font-display text-lg text-brand-200 mb-4 px-2">لوحة التحكم</p>
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-brand-800 text-brand-100 font-semibold"
                  : "hover:bg-brand-900"
              }`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
