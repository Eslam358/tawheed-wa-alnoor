export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 text-sm">
          <div className="md:col-span-2">
            <h3 className="font-display font-extrabold text-xl mb-3">
              التوحيد <span className="text-brand-200">والنور</span>
            </h3>
            <p className="text-brand-100/70 leading-relaxed max-w-sm">
              وجهتك للتسوّق الإلكتروني: ملابس، أحذية، أدوات منزلية، ومنتجات
              مختارة بعناية بأسعار تنافسية وتوصيل سريع لباب بيتك.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-brand-100 mb-3">تسوّق</h4>
            <ul className="space-y-2 text-brand-100/70">
              <li><a href="/products" className="hover:text-white">كل المنتجات</a></li>
              <li><a href="/offers" className="hover:text-white">العروض</a></li>
              <li><a href="/orders" className="hover:text-white">تتبع طلباتي</a></li>
              <li><a href="/login" className="hover:text-white">تسجيل الدخول</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-brand-100 mb-3">تواصل معنا</h4>
            <ul className="space-y-2 text-brand-100/70">
              <li>📞 966500000000+</li>
              <li>✉️ support@tawheed-noor.com</li>
              <li>🚚 توصيل لكل مدن المملكة</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-brand-100/50">
          © {new Date().getFullYear()} التوحيد والنور. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
