import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getDeals() {
  await dbConnect();
  const deals = await Product.find({
    isActive: true,
    $expr: { $gt: ["$compareAtPrice", "$price"] },
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(deals));
}

export default async function OffersPage() {
  const deals = await getDeals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-xl bg-gradient-to-l from-sale-600 to-sale-500 text-white p-6 mb-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">🔥 العروض</h1>
        <p className="text-white/80">أفضل الأسعار لفترة محدودة — اطلب قبل نفاد الكمية</p>
      </div>

      {deals.length === 0 ? (
        <p className="text-center text-ink/50 py-16">
          لا توجد عروض حالياً، تابعنا قريباً لعروض جديدة.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
