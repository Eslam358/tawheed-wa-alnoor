import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import SplashScreen from "@/components/tools/Splashscreen"

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
          <SplashScreen/>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCart />
        </Providers>
      </body>
    </html>
  );
}
