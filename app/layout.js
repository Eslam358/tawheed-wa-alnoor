import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { MobileSidebar } from "@/components/Sidebar";
import PrelineScript from "@/components/PrelineScript";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "التوحيد والنور | تسوّق كل حاجة بسهولة",
  description:
    "متجرك الإلكتروني الشامل: ملابس، أحذية، أدوات منزلية وعروض يومية بأسعار مميزة وتوصيل سريع.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-body bg-sand-50 text-ink flex min-h-screen flex-col">
        <Providers>
          <PrelineScript />
          <Navbar />
          {/* الـ Sidebar معزولة تماماً عن الـ Navbar: عنصر مستقل بيتفعّل
              عن طريق أزرار data-hs-overlay من أي مكان في الصفحة */}
          <MobileSidebar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCart />
        </Providers>
      </body>
    </html>
  );
}
