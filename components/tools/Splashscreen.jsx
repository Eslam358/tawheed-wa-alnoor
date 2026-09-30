"use client";

import { useEffect, useState } from "react";
import { Aref_Ruqaa } from "next/font/google";

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

/**
 * شاشة تحميل (Splash Screen) لمتجر توحيد النور
 * - تظهر فقط أول مرة يفتح فيها العميل الموقع في الجلسة (sessionStorage)
 * - مدة العرض بين 1.5 و 2.2 ثانية تقريبًا، ثم تختفي بـ fade سلس
 * - الصفحة الرئيسية بترندر تحتها فورًا، فمفيش أي تأخير حقيقي في ظهور المحتوى
 * - بدل العربية (car)، دلوقتي فيها الشخص الماشي وبيدفع عربية التروللي
 * - جملة "التوحيد مكان حبناه وكبرنا معاه" فوق المشهد بخط عربي مزخرف متحرك
 *
 * الاستخدام (Next.js App Router):
 *   // app/layout.jsx
 *   import SplashScreen from "@/components/SplashScreen";
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="ar" dir="rtl">
 *         <body>
 *           <SplashScreen />
 *           {children}
 *         </body>
 *       </html>
 *     );
 *   }
 */

const MIN_VISIBLE_MS = 2600; // أقل مدة ظهور
const FADE_MS = 350; // مدة الاختفاء التدريجي

export default function SplashScreen() {
  const [phase, setPhase] = useState("hidden"); // hidden | visible | fading

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem("tn-splash-shown") === "1";
    } catch (e) {
      // sessionStorage غير متاح (نادر جدًا) - نكمل عادي بدون splash
    }

    if (alreadyShown) return;

    setPhase("visible");

    const hideTimer = setTimeout(() => {
      setPhase("fading");
      try {
        sessionStorage.setItem("tn-splash-shown", "1");
      } catch (e) {}
    }, MIN_VISIBLE_MS);

    return () => clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    if (phase !== "fading") return;
    const removeTimer = setTimeout(() => setPhase("hidden"), FADE_MS);
    return () => clearTimeout(removeTimer);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      className={`tn-splash ${phase === "fading" ? "tn-splash--out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل توحيد النور"
    >
      <div className="tn-road">
        <div className="tn-road-line" />
        <div className="tn-road-line" />
        <div className="tn-road-line" />
      </div>

      <h1 className={`tn-title ${arefRuqaa.className}`}>
        <span>التوحيد مكان حبناه وكبرنا معاه</span>
      </h1>

      <div className="tn-scene">
        <svg
          className="tn-walker"
          width="220"
          height="140"
          viewBox="0 0 220 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tnPersonBody" x1="0" y1="0" x2="0" y2="100">
              <stop offset="0%" stopColor="#2FBE89" />
              <stop offset="100%" stopColor="#155A43" />
            </linearGradient>
            <linearGradient id="tnCartBody" x1="0" y1="0" x2="80" y2="60">
              <stop offset="0%" stopColor="#2FBE89" />
              <stop offset="100%" stopColor="#155A43" />
            </linearGradient>
          </defs>

          {/* ظل الأرض */}
          <ellipse cx="110" cy="128" rx="85" ry="6" fill="#000000" opacity="0.25" />

          {/* ===== العربية (تروللي) ===== */}
          <g className="tn-cart-group">
            {/* هيكل السلة */}
            <path
              d="M118 58 L168 58 L160 96 H110 Z"
              fill="url(#tnCartBody)"
              stroke="#BEE8D3"
              strokeWidth="1.2"
            />
            {/* خطوط السلة */}
            <line x1="122" y1="66" x2="156" y2="66" stroke="#0A2E22" strokeWidth="2" opacity="0.5" />
            <line x1="120" y1="76" x2="158" y2="76" stroke="#0A2E22" strokeWidth="2" opacity="0.5" />
            <line x1="118" y1="86" x2="160" y2="86" stroke="#0A2E22" strokeWidth="2" opacity="0.5" />

            {/* أكياس تسوق جوه العربية */}
            <rect x="126" y="40" width="14" height="20" rx="2" fill="#F5A623" />
            <rect x="141" y="36" width="14" height="24" rx="2" fill="#E3F5EC" />

            {/* يد الدفع */}
            <path
              d="M118 58 L104 40"
              stroke="#BEE8D3"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* عجل خلفي */}
            <g className="tn-wheel tn-wheel--a">
              <circle cx="122" cy="104" r="8" fill="#0A2E22" />
              <circle cx="122" cy="104" r="3.5" fill="#BEE8D3" />
            </g>
            {/* عجل أمامي */}
            <g className="tn-wheel tn-wheel--b">
              <circle cx="154" cy="104" r="8" fill="#0A2E22" />
              <circle cx="154" cy="104" r="3.5" fill="#BEE8D3" />
            </g>
          </g>

          {/* ===== الشخص ===== */}
          <g className="tn-person-group">
            {/* الراس */}
            <circle cx="90" cy="30" r="10" fill="#F2C29A" />
            {/* الجسم */}
            <path
              d="M90 40 C82 40 76 46 74 56 L70 82 H100 L98 60 C97 50 96 40 90 40 Z"
              fill="url(#tnPersonBody)"
            />
            {/* الذراع الممدودة للعربية */}
            <path
              d="M94 50 L106 42"
              stroke="url(#tnPersonBody)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* الرجل اليسرى */}
            <path
              className="tn-leg tn-leg--front"
              d="M80 82 L74 112"
              stroke="#E3F5EC"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* الرجل اليمنى */}
            <path
              className="tn-leg tn-leg--back"
              d="M92 82 L98 112"
              stroke="#BEE8D3"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* خط الأرض المتحرك */}
        <div className="tn-ground-line" />
      </div>

      <div className="tn-progress-wrap">
        <div className="tn-progress-bar" />
      </div>

      <p className="tn-label">توحيد النور</p>

      <style jsx>{`
        .tn-splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          overflow: hidden;
          background: radial-gradient(
              circle at 50% 30%,
              #123c2c 0%,
              #0a2e22 60%,
              #071f18 100%
            );
          animation: tn-fade-in 0.25s ease-out;
          padding: 20px;
        }
        .tn-splash--out {
          animation: tn-fade-out ${FADE_MS}ms ease-in forwards;
          pointer-events: none;
        }
        @keyframes tn-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes tn-fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        /* خطوط الطريق المتحركة في الخلفية */
        .tn-road {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 46px;
          opacity: 0.18;
          pointer-events: none;
        }
        .tn-road-line {
          height: 3px;
          width: 200%;
          background: repeating-linear-gradient(
            90deg,
            #2fbe89 0px,
            #2fbe89 40px,
            transparent 40px,
            transparent 80px
          );
          animation: tn-road-move 1.1s linear infinite;
        }
        .tn-road-line:nth-child(2) {
          animation-duration: 0.85s;
        }
        .tn-road-line:nth-child(3) {
          animation-duration: 1.35s;
        }
        @keyframes tn-road-move {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-80px);
          }
        }

        /* عنوان مزخرف فوق المشهد */
        .tn-title {
          position: relative;
          z-index: 1;
          margin: 0;
          text-align: center;
          font-size: clamp(18px, 4.5vw, 30px);
          line-height: 1.6;
          font-weight: 700;
          max-width: 320px;
        }
        .tn-title span {
          background: linear-gradient(
            90deg,
            #bee8d3,
            #2fbe89,
            #f5a623,
            #2fbe89,
            #bee8d3
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: tn-shine 4.5s linear infinite,
            tn-title-in 0.9s ease-out both;
          text-shadow: 0 2px 22px rgba(47, 190, 137, 0.35);
        }
        @keyframes tn-shine {
          to {
            background-position: -300% center;
          }
        }
        @keyframes tn-title-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
            letter-spacing: 2px;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: normal;
          }
        }

        .tn-scene {
          position: relative;
          z-index: 1;
        }
        .tn-walker {
          animation: tn-walk-bounce 0.5s ease-in-out infinite;
          filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.35));
        }
        @keyframes tn-walk-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .tn-cart-group {
          animation: tn-cart-sway 0.5s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        @keyframes tn-cart-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(0.6deg);
          }
        }

        .tn-wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: tn-spin 0.45s linear infinite;
        }
        @keyframes tn-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .tn-leg {
          transform-box: fill-box;
          transform-origin: top center;
          animation: tn-leg-swing 0.5s ease-in-out infinite;
        }
        .tn-leg--front {
          animation-delay: 0s;
        }
        .tn-leg--back {
          animation-delay: 0.25s;
        }
        @keyframes tn-leg-swing {
          0%,
          100% {
            transform: rotate(-12deg);
          }
          50% {
            transform: rotate(12deg);
          }
        }

        .tn-ground-line {
          position: absolute;
          bottom: 8px;
          left: -20%;
          width: 140%;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #2fbe89 0,
            #2fbe89 18px,
            transparent 18px,
            transparent 36px
          );
          opacity: 0.35;
          animation: tn-ground-move 0.7s linear infinite;
        }
        @keyframes tn-ground-move {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-36px);
          }
        }

        .tn-progress-wrap {
          position: relative;
          z-index: 1;
          width: 160px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }
        .tn-progress-bar {
          height: 100%;
          width: 0%;
          border-radius: 999px;
          background: linear-gradient(90deg, #155a43, #2fbe89);
          animation: tn-progress ${MIN_VISIBLE_MS}ms ease-out forwards;
        }
        @keyframes tn-progress {
          0% {
            width: 6%;
          }
          70% {
            width: 85%;
          }
          100% {
            width: 100%;
          }
        }

        .tn-label {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #e3f5ec;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}