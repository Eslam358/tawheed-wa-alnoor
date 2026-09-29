import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import ProductCarousel from "@/components/ProductCarousel";

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
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
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
            <div className="hidden md:flex justify-center">
              <div className="grid grid-cols-3 gap-3">
                {["👗", "👔", "🧸", "🍳", "🔌", "🏀"].map((emoji, i) => (
                  <div
                    key={i}
                    className="h-24 w-24 rounded-xl bg-white/10 flex items-center justify-center text-4xl"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="font-display text-xl font-bold text-ink mb-5">
            تسوّق حسب القسم
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="card-hover group rounded-lg border border-sand-200 bg-white overflow-hidden text-center"
              >
                <div className="aspect-[4/3] bg-sand-100 overflow-hidden">
                  {cat.image ? (
                    <img
                      // src="https://m.media-amazon.com/images/I/81qy6cWw4wL.jpg"
                      src={cat.image}
                      alt={cat.name}
                      
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      {cat.icon || "🏷️"}
                    </div>
                  )}
                </div>
                <span className="block text-sm font-medium py-2 px-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* كاروسيل ثلاثي الأبعاد يتحرك تلقائياً */}
      {featured.length > 0 && (
        <section className="bg-sand-100/60 py-8">
          <h2 className="font-display text-xl font-bold text-ink text-center mb-5">
            ✨ منتجات هتعجبك
          </h2>
          <ProductCarousel products={featured} />
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
