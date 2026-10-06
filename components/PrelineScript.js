"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PrelineScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Preline بتربط نفسها بعناصر الـ DOM وقت التحميل. في Next.js App Router
    // التنقل بين الصفحات client-side بيغيّر الـ DOM من غير إعادة تحميل كاملة،
    // فلازم نعيد تهيئة مكونات Preline (زي الـ sidebar) بعد كل تنقل.
    import("preline").then(() => {
      if (typeof window !== "undefined" && window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    });
  }, [pathname]);

  return null;
}
