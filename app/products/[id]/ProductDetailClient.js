"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

export default function ProductDetailClient({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push("/cart");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square rounded-2xl bg-sand-100 overflow-hidden mb-3">
          {product.images?.length > 0 ? (
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl text-brand-900/20">
              🛍️
            </div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${
                  activeImage === i ? "border-sale-500" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category?.name && (
          <span className="text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-3 py-1">
            {product.category.name}
          </span>
        )}
        <h1 className="font-display text-2xl md:text-3xl text-ink mt-3 mb-2">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-bold text-brand-900">
            {product.price} ر.س
          </span>
          {hasDiscount && (
            <span className="text-base text-ink/40 line-through">
              {product.compareAtPrice} ر.س
            </span>
          )}
        </div>

        <p className="text-ink/70 leading-relaxed whitespace-pre-line mb-6">
          {product.description || "لا يوجد وصف لهذا المنتج بعد."}
        </p>

        <p className="text-sm mb-4">
          {product.stock > 0 ? (
            <span className="text-brand-700">✓ متوفر بالمخزون ({product.stock})</span>
          ) : (
            <span className="text-red-600">غير متوفر حالياً</span>
          )}
        </p>

        {product.stock > 0 && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm">الكمية:</span>
              <div className="flex items-center border border-sand-200 rounded-full">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-lg"
                >
                  −
                </button>
                <span className="px-3">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 rounded-full border-2 border-brand-900 py-3 font-semibold text-brand-900 hover:bg-brand-50 transition"
              >
                {added ? "تمت الإضافة ✓" : "أضف للسلة"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-brand-900 py-3 font-semibold text-sand-50 hover:bg-brand-800 transition"
              >
                اشترِ الآن
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
