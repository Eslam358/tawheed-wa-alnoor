import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export const dynamic = "force-dynamic";

async function getStats() {
  await dbConnect();
  const [productsCount, ordersCount, usersCount, orders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const codRevenueAgg = await Order.aggregate([
    { $match: { paymentMethod: "cod", status: { $ne: "ملغي" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const revenue =
    (revenueAgg[0]?.total || 0) + (codRevenueAgg[0]?.total || 0);

  return {
    productsCount,
    ordersCount,
    usersCount,
    revenue,
    recentOrders: JSON.parse(JSON.stringify(orders)),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "إجمالي المنتجات", value: stats.productsCount, icon: "🛍️" },
    { label: "إجمالي الطلبات", value: stats.ordersCount, icon: "📦" },
    { label: "المستخدمون", value: stats.usersCount, icon: "👥" },
    { label: "الإيرادات التقديرية", value: `${stats.revenue} ر.س`, icon: "💰" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-900 mb-6">
        نظرة عامة
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-sand-200 bg-white p-4">
            <p className="text-2xl mb-1">{card.icon}</p>
            <p className="text-xl font-bold text-brand-900">{card.value}</p>
            <p className="text-xs text-ink/50">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-lg mb-3">أحدث الطلبات</h2>
      <div className="rounded-xl border border-sand-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand-100 text-ink/60">
            <tr>
              <th className="text-right p-3">العميل</th>
              <th className="text-right p-3">الحالة</th>
              <th className="text-right p-3">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((o) => (
              <tr key={o._id} className="border-t border-sand-100">
                <td className="p-3">{o.user?.name || "—"}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.totalPrice} ر.س</td>
              </tr>
            ))}
            {stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-ink/40">
                  لا توجد طلبات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
