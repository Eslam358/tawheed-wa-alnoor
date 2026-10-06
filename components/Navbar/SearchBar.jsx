"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ className = "", onSubmitNavigate }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(search)}`);
    onSubmitNavigate?.();
  }

  return (
    <form onSubmit={handleSearch} className={`flex ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        ابحث عن منتجات
      </label>
      <input
        id="site-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="ابحث عن منتجات، ماركات وأكثر..."
        className="w-full rounded-s-md bg-sand-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="submit"
        className="rounded-e-md bg-brand-700 px-5 text-white font-semibold hover:bg-brand-600 transition"
        aria-label="بحث"
      >
        🔍
      </button>
    </form>
  );
}
