"use client";

import { useState } from "react";
import Link from "next/link";

export default function CategoryCard({ category }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = category.image && !imgFailed;

  return (
    <Link
      href={`/products?category=${category._id}`}
      className="card-hover group rounded-lg border border-sand-200 bg-white overflow-hidden text-center"
    >
      <div className="aspect-[4/3] bg-sand-100 overflow-hidden">
        {showImage ? (
          <img
            src={category.image}
            alt={category.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            {category.icon || "🏷️"}
          </div>
        )}
      </div>
      <span className="block text-sm font-medium py-2 px-1">{category.name}</span>
    </Link>
  );
}
