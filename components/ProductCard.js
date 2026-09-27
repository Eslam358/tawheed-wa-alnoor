"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="card-hover group rounded-lg border border-sand-200 bg-white overflow-hidden">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-sand-100 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl text-brand-900/15">
              🛍️
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 rounded bg-sale-500 px-2 py-1 text-[11px] font-bold text-white">
              -{discountPercent}%
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-ink min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-ink font-bold">
              {product.price} ر.س
            </span>
            {hasDiscount && (
              <span className="text-xs text-ink/40 line-through">
                {product.compareAtPrice} ر.س
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          onClick={() => addItem(product, 1)}
          disabled={product.stock === 0}
          className="w-full rounded-md bg-brand-900 py-2 text-sm font-semibold text-white hover:bg-brand-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "غير متوفر" : "أضف للسلة"}
        </button>
      </div>
    </div>
  );
}
