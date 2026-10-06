"use client";

import Link from "next/link";
import { useState } from "react";
import TNLogo from "@/components/common/TNLogo";
import { useCart } from "@/components/CartContext";
import SearchBar from "./SearchBar";
import { SIDEBAR_ID } from "@/components/Sidebar/MobileSidebar";

export default function MobileNavbar() {
  const { itemsCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="md:hidden bg-brand-900 text-white">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <button
            type="button"
            data-hs-overlay={`#${SIDEBAR_ID}`}
            aria-controls={SIDEBAR_ID}
            aria-label="فتح القائمة"
            className="text-2xl"
          >
            ☰
          </button>

          <Link href="/" className="flex items-center gap-2">
            <TNLogo size={30} className="rounded-lg" />
            <span className="font-display font-extrabold">التوحيد والنور</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
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

        {searchOpen && (
          <div className="pb-3">
            <SearchBar onSubmitNavigate={() => setSearchOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
