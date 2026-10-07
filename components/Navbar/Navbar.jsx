"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import TNLogo from "@/components/common/TNLogo";
import { useCart } from "@/components/CartContext";
import { SIDEBAR_ID } from "@/components/Sidebar/MobileSidebar";

const MAX_VISIBLE_CATEGORIES = 6;

export default function Navbar() {
  const { data: session } = useSession();
  const { itemsCount } = useCart();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (searchCategory) params.set("category", searchCategory);
    router.push(`/products?${params.toString()}`);
    setMobileSearchOpen(false);
  }

  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="bg-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* القائمة + الشعار (موبايل) */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                data-hs-overlay={`#${SIDEBAR_ID}`}
                aria-controls={SIDEBAR_ID}
                aria-label="فتح القائمة"
                className="text-2xl"
              >
                ☰
              </button>
            </div>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <TNLogo size={34} className="rounded-lg" />
              <span className="font-display font-extrabold md:text-lg">
                التوحيد والنور
              </span>
            </Link>

            {/* البحث + فلتر القسم (ديسكتوب) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <label htmlFor="search-category" className="sr-only">القسم</label>
              <select
                id="search-category"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="rounded-s-md bg-sand-100 border-e border-sand-200 px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 max-w-[9rem]"
              >
                <option value="">كل الأقسام</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <label htmlFor="site-search" className="sr-only">ابحث عن منتجات</label>
              <input
                id="site-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="ابحث عن منتجات، ماركات وأكثر..."
                className="w-full bg-sand-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="rounded-e-md bg-brand-700 px-5 text-white font-semibold hover:bg-brand-600 transition"
                aria-label="بحث"
              >
                🔍
              </button>
            </form>

            {/* روابط ديسكتوب */}
            <nav className="hidden md:flex items-center gap-5 text-sm shrink-0">
              {session?.user?.role === "admin" && (
                <Link href="/admin" className="hover:text-brand-200 transition">
                  لوحة التحكم
                </Link>
              )}
              {session ? (
                <>
                  <Link href="/orders" className="hover:text-brand-200 transition">
                    طلباتي
                  </Link>
                  <Link href="/account" className="hover:text-brand-200 transition">
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
              <button
                type="button"
                data-hs-overlay={`#${SIDEBAR_ID}`}
                aria-controls={SIDEBAR_ID}
                aria-label="فتح القائمة الجانبية"
                className="text-xl hover:text-brand-200 transition"
              >
                ☰
              </button>
            </nav>

            {/* السلة + البحث (موبايل) */}
            <div className="flex md:hidden items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-label="بحث"
                className="text-xl"
              >
                🔍
              </button>
              <Link href="/cart" className="relative text-xl" aria-label="السلة">
                🛒
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-sale-500 text-[11px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* البحث + فلتر القسم (موبايل) */}
          {mobileSearchOpen && (
            <form onSubmit={handleSearch} className="md:hidden pb-3 space-y-2">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full rounded-md bg-sand-50 px-3 py-2 text-sm text-ink focus:outline-none"
              >
                <option value="">كل الأقسام</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex">
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
              </div>
            </form>
          )}
        </div>

        {/* شريط لون البراند المميّز */}
        <div className="h-1 bg-gradient-to-l from-brand-500 via-sale-500 to-brand-500" />
      </div>

      {/* شريط الأقسام (ديسكتوب فقط) — flex-wrap، مفيش سكرول */}
      {visibleCategories.length > 0 && (
        <div className="hidden md:block bg-sand-50 border-b border-sand-200">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2.5 text-sm text-ink/80">
              <Link href="/products" className="font-medium hover:text-brand-700">
                كل الأقسام
              </Link>
              {visibleCategories.map((cat) => (
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
      )}
    </header>
  );
}
