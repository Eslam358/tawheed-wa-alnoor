import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

// بيهرّب الرموز الخاصة بالـ regex عشان البحث يشتغل مظبوط لو المستخدم كتب
// رمز زي ( أو + من غير ما يبوّظ الاستعلام
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getData({ search, category }) {
  await dbConnect();

  const query = { isActive: true };
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: pattern }, { description: pattern }];
  }
  if (category) {
    query.category = category;
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
  // في Next.js 15+ بقى searchParams عبارة عن Promise لازم تستناه
  const resolvedSearchParams = await searchParams;
  const { products, categories } = await getData(resolvedSearchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        {resolvedSearchParams.search
          ? `نتائج البحث عن "${resolvedSearchParams.search}"`
          : "كل المنتجات"}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        <Link
          href="/products"
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm border ${
            !resolvedSearchParams.category
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
              resolvedSearchParams.category === cat._id
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
