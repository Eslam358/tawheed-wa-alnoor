"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import TNLogo from "@/components/common/TNLogo";
import { useCart } from "@/components/CartContext";
import SearchBar from "./SearchBar";
import CategoriesBar from "./CategoriesBar";
import { SIDEBAR_ID } from "@/components/Sidebar/MobileSidebar";

export default function DesktopNavbar() {
  const { data: session } = useSession();
  const { itemsCount } = useCart();

  return (
    <div className="hidden md:block">
      <div className="bg-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <TNLogo size={34} className="rounded-lg" />
              <span className="font-display font-extrabold text-lg">
                التوحيد والنور
              </span>
            </Link>

            <SearchBar className="flex-1 max-w-2xl" />

            <nav className="flex items-center gap-5 text-sm shrink-0">
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
          </div>
        </div>
      </div>

      <CategoriesBar />
    </div>
  );
}
