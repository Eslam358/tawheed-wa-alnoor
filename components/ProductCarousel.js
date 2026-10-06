"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function ProductCarousel({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      loop={products.length > 4}
      slidesPerView={2}
      spaceBetween={14}
      breakpoints={{
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
      pagination={{ clickable: true }}
      navigation
      className="!pb-10 !px-4"
    >
      {products.map((product) => {
        const hasDiscount =
          product.compareAtPrice && product.compareAtPrice > product.price;
        const discountPercent = hasDiscount
          ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
          : 0;

        return (
          <SwiperSlide key={product._id} className="pb-2">
            <Link
              href={`/products/${product._id}`}
              className="block rounded-xl border border-sand-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative aspect-square bg-sand-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">
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
                <p className="line-clamp-1 text-sm font-medium text-ink">
                  {product.name}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-bold text-brand-900">
                    {product.price} ج.م
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-ink/40 line-through">
                      {product.compareAtPrice} ج.م
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
