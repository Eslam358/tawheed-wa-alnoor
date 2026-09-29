"use client";

import { useEffect, useState } from "react";

/**
 * شاشة تحميل (Splash Screen) لمتجر توحيد النور
 * - تظهر فقط أول مرة يفتح فيها العميل الموقع في الجلسة (sessionStorage)
 * - مدة العرض بين 1.5 و 2.2 ثانية تقريبًا، ثم تختفي بـ fade سلس
 * - الصفحة الرئيسية بترندر تحتها فورًا، فمفيش أي تأخير حقيقي في ظهور المحتوى
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
 *
 * الاستخدام (Pages Router):
 *   // pages/_app.jsx
 *   import SplashScreen from "../components/SplashScreen";
 *   export default function App({ Component, pageProps }) {
 *     return (
 *       <>
 *         <SplashScreen />
 *         <Component {...pageProps} />
 *       </>
 *     );
 *   }
 */

const MIN_VISIBLE_MS = 3600; // أقل مدة ظهور
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

      <div className="tn-scene">
        <svg
          className="tn-car"
          width="170"
          height="100"
          viewBox="0 0 170 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tnBody" x1="10" y1="10" x2="160" y2="80">
              <stop offset="0%" stopColor="#2FBE89" />
              <stop offset="55%" stopColor="#239C70" />
              <stop offset="100%" stopColor="#155A43" />
            </linearGradient>
          </defs>

          {/* خطوط سرعة خلف العربية */}
          <g className="tn-motion-lines">
            <rect x="0" y="30" width="26" height="5" rx="2.5" fill="#2FBE89" />
            <rect x="0" y="45" width="18" height="5" rx="2.5" fill="#239C70" />
            <rect x="0" y="60" width="22" height="5" rx="2.5" fill="#1C7A59" />
          </g>

          {/* جسم العربية */}
          <path
            d="M34 62 L40 40 C42 34 47 30 53 30 H118 C126 30 133 35 136 43 L145 62 H150 C154 62 157 65 157 69 V72 H27 V69 C27 65 30 62 34 62 Z"
            fill="url(#tnBody)"
          />

          {/* الشبّاك */}
          <path
            d="M55 40 L59 33 C60.5 30.5 63 29 66 29 H95 C99 29 102.5 31 104.5 34.5 L109 40 Z"
            fill="#0F3D2E"
            opacity="0.85"
          />

          {/* حرفي TN على العربية */}
          <text
            x="70"
            y="59"
            fontFamily="Arial, sans-serif"
            fontWeight="800"
            fontSize="20"
            fill="#E3F5EC"
            letterSpacing="1"
          >
            TN
          </text>

          {/* مصباح أمامي */}
          <circle cx="150" cy="52" r="4" fill="#FFE9C7" />

          {/* عجلة خلفية */}
          <g className="tn-wheel tn-wheel--back">
            <circle cx="58" cy="72" r="11" fill="#0A2E22" />
            <circle cx="58" cy="72" r="5.5" fill="#BEE8D3" />
            <rect x="57" y="63" width="2" height="18" fill="#0A2E22" />
            <rect x="49" y="71" width="18" height="2" fill="#0A2E22" />
          </g>

          {/* عجلة أمامية */}
          <g className="tn-wheel tn-wheel--front">
            <circle cx="130" cy="72" r="11" fill="#0A2E22" />
            <circle cx="130" cy="72" r="5.5" fill="#BEE8D3" />
            <rect x="129" y="63" width="2" height="18" fill="#0A2E22" />
            <rect x="121" y="71" width="18" height="2" fill="#0A2E22" />
          </g>
        </svg>
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
          gap: 22px;
          overflow: hidden;
          background: radial-gradient(
              circle at 50% 30%,
              #123c2c 0%,
              #0a2e22 60%,
              #071f18 100%
            );
          animation: tn-fade-in 0.25s ease-out;
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

        .tn-scene {
          position: relative;
          z-index: 1;
        }
        .tn-car {
          animation: tn-bounce 1s ease-in-out infinite;
          filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.35));
        }
        @keyframes tn-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .tn-wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: tn-spin 0.5s linear infinite;
        }
        @keyframes tn-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .tn-motion-lines rect {
          animation: tn-motion 0.6s ease-in-out infinite;
        }
        .tn-motion-lines rect:nth-child(2) {
          animation-delay: 0.08s;
        }
        .tn-motion-lines rect:nth-child(3) {
          animation-delay: 0.16s;
        }
        @keyframes tn-motion {
          0%,
          100% {
            opacity: 0.4;
            transform: translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateX(-6px);
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