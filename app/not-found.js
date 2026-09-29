import Link from "next/link";
import TNLogo from "@/components/TNLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <TNLogo size={64} className="rounded-2xl" />
      <h1 className="font-display text-3xl font-extrabold text-brand-900">404</h1>
      <p className="text-lg font-semibold text-ink">الصفحة اللي بتدور عليها مش موجودة</p>
      <p className="text-ink/60 max-w-sm">
        ممكن يكون الرابط اتغيّر أو المنتج مش متاح حالياً. جرّب ترجع للرئيسية أو تصفّح الأقسام.
      </p>
      <div className="flex gap-3 mt-2">
        <Link
          href="/"
          className="rounded-md bg-brand-900 px-6 py-3 font-semibold text-white hover:bg-brand-800 transition"
        >
          الرئيسية
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-sand-200 px-6 py-3 font-semibold text-ink hover:bg-sand-100 transition"
        >
          تصفّح المنتجات
        </Link>
      </div>
    </div>
  );
}
