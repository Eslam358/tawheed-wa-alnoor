import TNLogo from "@/components/common/TNLogo";

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <TNLogo size={36} className="rounded-lg" />
              <h3 className="font-display font-extrabold text-xl">
                التوحيد <span className="text-brand-200">والنور</span>
              </h3>
            </div>
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
              <li>📞 +201000000000</li>
              <li>✉️ support@tawheed-noor.com</li>
              <li>🚚 توصيل لكل محافظات مصر</li>
            </ul>
          </div>
        </div>
              {/*  <p className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-brand-100/50">
          © {new Date().getFullYear()} التوحيد والنور. جميع الحقوق محفوظة.
          {" · "}
          تطوير{" "}
          <a
            href="https://wa.me/201002679358"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-200 hover:text-white hover:underline"
          >
            إسلام فايز
          </a>
        </p>*/}

<div className="mt-8 border-t border-white/10 pt-6">
  <p className="text-center text-xs text-brand-100/50">
    © {new Date().getFullYear()} التوحيد والنور. جميع الحقوق محفوظة.
  </p>

  <div className="mt-5 flex flex-wrap items-center justify-center gap-6">

    {/* Portfolio */}
    <a
      href="https://portfolio-seven-snowy-z768zvebni.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="زيارة بورتفوليو إسلام فايز"
      className="group inline-flex items-center gap-2.5 rounded-full
                 transition hover:opacity-80"
    >
      <img
        src="https://portfolio-seven-snowy-z768zvebni.vercel.app/eee.jpg"
        alt="إسلام فايز"
        className="h-10 w-10 rounded-full border-2 border-brand-200/50
                   object-cover shadow-md transition group-hover:scale-105"
      />

      <span className="text-sm font-semibold text-brand-100
                       transition group-hover:text-white">
        Portfolio
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4 text-brand-200"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 3h7v7m-1-6L10 14"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"
        />
      </svg>
    </a>

    {/* WhatsApp */}
    <a
      href="https://wa.me/201002679358"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="التواصل مع إسلام فايز عبر واتساب"
      className="inline-flex items-center gap-2 text-sm font-semibold
                 text-brand-100 transition hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 text-[#25D366]"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.53 0 .16 5.37.16 11.97c0 2.11.55 4.17 1.59 5.99L0 24l6.2-1.63a11.96 11.96 0 0 0 5.93 1.57h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.59-8.49ZM12.14 21.9a9.94 9.94 0 0 1-5.06-1.38l-.36-.21-3.68.97.98-3.59-.23-.37a9.9 9.9 0 0 1-1.52-5.35c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.92 9.92Zm5.45-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.08-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
      </svg>

      <span>إسلام فايز</span>
    </a>

  </div>
</div>
  

  
      </div>
    </footer>
  );
}
