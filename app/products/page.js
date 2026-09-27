import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getData(searchParams) {
  await dbConnect();

  const query = { isActive: true };
  if (searchParams.search) {
    query.$text = { $search: searchParams.search };
  }
  if (searchParams.category) {
    query.category = searchParams.category;
  }

  const [products, categories] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function ProductsPage({ searchParams }) {
  const { products, categories } = await getData(searchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        {searchParams.search
          ? `نتائج البحث عن "${searchParams.search}"`
          : "كل المنتجات"}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        <Link
          href="/products"
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm border ${
            !searchParams.category
              ? "bg-brand-900 text-sand-50 border-brand-900"
              : "bg-white border-sand-200 text-ink"
          }`}
        >
          الكل
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products?category=${cat._id}`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm border ${
              searchParams.category === cat._id
                ? "bg-brand-900 text-sand-50 border-brand-900"
                : "bg-white border-sand-200 text-ink"
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-ink/50 py-16">
          لا توجد منتجات مطابقة. جرّب تصنيفاً آخر أو كلمة بحث مختلفة.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
