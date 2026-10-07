"use client";

import Link from "next/link";
import Image from "next/image"
import { useSession, signOut } from "next-auth/react";
import TNLogo from "@/components/common/TNLogo";
import SidebarCategories from "./SidebarCategories";

export const SIDEBAR_ID = "hs-sidebar";

export default function MobileSidebar() {
  const { data: session } = useSession();

  return (
    <div
      id={SIDEBAR_ID}
      className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 translate-x-full fixed top-0 right-0 transition-all duration-300 transform h-full max-w-xs w-full z-[70] bg-white border-s border-sand-200 overflow-y-auto"
      role="dialog"
      tabIndex={-1}
      aria-label="القائمة الجانبية"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-sand-200">
        <Link href="/" className="flex items-center gap-2">
          <TNLogo size={32} className="rounded-lg" />
      
          <span className="font-display font-extrabold text-brand-900">
            التوحيد والنور
          </span>
        </Link>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-ink/60 hover:bg-sand-100"
          aria-label="إغلاق القائمة"
          data-hs-overlay={`#${SIDEBAR_ID}`}
        >
          ✕
        </button>
      </div>

      <nav className="p-4 space-y-1 text-sm">
        <Link
          href="/products"
          data-hs-overlay={`#${SIDEBAR_ID}`}
          className="block rounded-md px-3 py-2 font-medium text-ink hover:bg-sand-100"
        >
          كل الأقسام
        </Link>
        <Link
          href="/offers"
          data-hs-overlay={`#${SIDEBAR_ID}`}
          className="block rounded-md px-3 py-2 font-bold text-sale-500 hover:bg-sand-100"
        >
          🔥 العروض
        </Link>
        <Link
          href="/branches"
          data-hs-overlay={`#${SIDEBAR_ID}`}
          className="block rounded-md px-3 py-2 text-ink hover:bg-sand-100"
        >
          📍 فروعنا
        </Link>
      </nav>

      <SidebarCategories sidebarId={SIDEBAR_ID} />

      <div className="border-t border-sand-200 p-4 space-y-1 text-sm">
        {session ? (
          <>
            <Link
              href="/orders"
              data-hs-overlay={`#${SIDEBAR_ID}`}
              className="block rounded-md px-3 py-2 text-ink hover:bg-sand-100"
            >
              طلباتي
            </Link>
            <Link
              href="/account"
              data-hs-overlay={`#${SIDEBAR_ID}`}
              className="block rounded-md px-3 py-2 text-ink hover:bg-sand-100"
            >
              👤 إعدادات الحساب
            </Link>
            {session.user?.role === "admin" && (
              <Link
                href="/admin"
                data-hs-overlay={`#${SIDEBAR_ID}`}
                className="block rounded-md px-3 py-2 text-ink hover:bg-sand-100"
              >
                لوحة التحكم
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-right rounded-md px-3 py-2 text-ink hover:bg-sand-100"
            >
              تسجيل الخروج
            </button>
          </>
        ) : (
          <Link
            href="/login"
            data-hs-overlay={`#${SIDEBAR_ID}`}
            className="block rounded-md px-3 py-2 font-semibold text-brand-800 hover:bg-sand-100"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </div>
  );
}
