import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import ProductCarousel from "@/components/ProductCarousel";
import CategoryCard from "@/components/CategoryCard";
import TNLogo from "@/components/TNLogo";

export const dynamic = "force-dynamic";

async function getData() {
  await dbConnect();
  const [featured, deals, categories] = await Promise.all([
    Product.find({ isActive: true, isFeatured: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Product.find({
      isActive: true,
      $expr: { $gt: ["$compareAtPrice", "$price"] },
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Category.find().limit(8).lean(),
  ]);
  return {
    featured: JSON.parse(JSON.stringify(featured)),
    deals: JSON.parse(JSON.stringify(deals)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function HomePage() {
  const { featured, deals, categories } = await getData();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-900 text-white overflow-hidden">
        <img
          src="/hero-banner.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-950/95 via-brand-900/85 to-brand-900/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <TNLogo size={34} className="rounded-lg" />
              <span className="text-sm text-brand-200 font-medium">
                التوحيد والنور — مكان عِشناه وكبرنا معاه
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-3">
              خصومات تصل إلى ٥٠٪
            </h1>
            <p className="text-brand-100/80 mb-6 max-w-md">
              على الملابس، الأجهزة المنزلية، الأثاث، الرياضة وأدوات المكتب —
              عروض يومية وتوصيل سريع لباب بيتك.
            </p>
            <div className="flex gap-3">
              <Link
                href="/offers"
                className="rounded-md bg-brand-500 px-6 py-3 font-bold text-brand-950 hover:bg-brand-200 transition"
              >
                تسوّق الآن
              </Link>
              <Link
                href="/products"
                className="rounded-md border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10 transition"
              >
                كل الأقسام
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* كاروسيل ثلاثي الأبعاد يتحرك تلقائياً */}
      {featured.length > 0 && (
        <section className="bg-sand-100/60 py-8">
          <h2 className="font-display text-xl font-bold text-ink text-center mb-5">
            ✨ منتجات هتعجبك
          </h2>
          <ProductCarousel products={featured} />
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="font-display text-xl font-bold text-ink mb-5">
            تسوّق حسب القسم
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Deals */}
      {deals.length > 0 && (
        <section className="bg-sale-100/40">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-sale-600">
                🔥 عروض اليوم
              </h2>
              <Link href="/offers" className="text-sm font-semibold text-brand-700 hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {deals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="font-display text-xl font-bold text-ink mb-5">
          منتجات مختارة لك
        </h2>
        {featured.length === 0 ? (
          <p className="text-center text-ink/50 py-10">
            لا توجد منتجات مميزة بعد — أضِف منتجات من لوحة التحكم.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
