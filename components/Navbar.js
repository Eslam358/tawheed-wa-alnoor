"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemsCount } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(search)}`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* الشريط العلوي */}
      <div className="bg-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-900 font-black text-lg">
                <Image
                  src="/icon_nt.png"
                  alt="TN Store"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </span>
              <span className="font-display font-extrabold leading-tight">
                <span className="block text-lg">التوحيد والنور</span>
              </span>
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="ابحث عن منتجات، ماركات وأكثر..."
                className="w-full rounded-s-md bg-sand-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="rounded-e-md bg-brand-700 px-5 text-white font-semibold hover:bg-brand-600 transition"
              >
                🔍
              </button>
            </form>

            <nav className="hidden md:flex items-center gap-5 text-sm shrink-0">
              {session?.user?.role === "admin" && (
                <Link href="/admin" className="hover:text-brand-200 transition">
                  لوحة التحكم
                </Link>
              )}
              {session ? (
                <>
                  <Link
                    href="/orders"
                    className="hover:text-brand-200 transition"
                  >
                    👤 حسابي
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hover:text-brand-200 transition"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:text-brand-200 transition">
                  👤 حسابي
                </Link>
              )}
              <Link
                href="/cart"
                className="relative flex items-center gap-1 rounded-md bg-brand-800 px-3 py-1.5 hover:bg-brand-700 transition"
              >
                🛒 السلة
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-sale-500 text-[11px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </nav>

            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="فتح القائمة"
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-brand-800 px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="ابحث عن منتج..."
                className="w-full rounded-s-md bg-sand-50 px-4 py-2.5 text-sm text-ink focus:outline-none"
              />
              <button className="rounded-e-md bg-brand-700 px-4 text-white font-semibold">
                🔍
              </button>
            </form>
            <Link
              href="/products"
              className="block py-1"
              onClick={() => setMenuOpen(false)}
            >
              كل الأقسام
            </Link>
            <Link
              href="/offers"
              className="block py-1 text-sale-500 font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              🔥 العروض
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="block py-1"
                onClick={() => setMenuOpen(false)}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
            <Link
              href="/cart"
              className="block py-1"
              onClick={() => setMenuOpen(false)}
            >
              السلة ({itemsCount})
            </Link>
            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="block py-1"
                onClick={() => setMenuOpen(false)}
              >
                لوحة التحكم
              </Link>
            )}
            {session ? (
              <>
                <Link
                  href="/orders"
                  className="block py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  طلباتي
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block py-1"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-1"
                onClick={() => setMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        )}
      </div>

      {/* شريط الأقسام */}
      <div className="hidden md:block bg-sand-50 border-b border-sand-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-6 h-11 text-sm text-ink/80 overflow-x-auto">
            <Link
              href="/products"
              className="shrink-0 font-medium hover:text-brand-700"
            >
              كل الأقسام
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="shrink-0 hover:text-brand-700 transition"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/offers"
              className="shrink-0 font-bold text-sale-500 hover:text-sale-600 transition"
            >
              🔥 العروض
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
