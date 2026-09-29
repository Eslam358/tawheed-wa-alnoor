"use client";

/**
 * بانر ترحيبي: شخص بيدفع عربية تروللي متحركة + جملة مزخرفة متحركة فوقها
 *
 * الخط المستخدم: Aref Ruqaa (خط عربي مزخرف من Google Fonts عبر next/font،
 * بيتحمّل وقت الـ build مرة واحدة ومش محتاج اتصال إنترنت وقت التشغيل)
 *
 * الاستخدام:
 *   import HeroBanner from "@/components/HeroBanner";
 *   export default function HomePage() {
 *     return (
 *       <main>
 *         <HeroBanner />
 *         { محتوى باقي الصفحة }
 *       </main>
 *     );
 *   }
 */

import { Aref_Ruqaa } from "next/font/google";

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export default function HeroBanner() {
  return (
    <section className="tn-hero">
      <h1 className={`tn-hero-title ${arefRuqaa.className}`}>
        <span>التوحيد مكان كبرنا وعشنا معاه</span>
      </h1>

      <div className="tn-hero-scene">
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
          <ellipse cx="110" cy="128" rx="85" ry="6" fill="#0A2E22" opacity="0.35" />

          {/* ===== العربية (تروللي) ===== */}
          <g className="tn-cart-group">
            {/* هيكل السلة */}
            <path
              d="M118 58 L168 58 L160 96 H110 Z"
              fill="url(#tnCartBody)"
              stroke="#0F3D2E"
              strokeWidth="1.5"
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
              stroke="#155A43"
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
              stroke="#0F3D2E"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* الرجل اليمنى */}
            <path
              className="tn-leg tn-leg--back"
              d="M92 82 L98 112"
              stroke="#155A43"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* خط الأرض المتحرك */}
        <div className="tn-ground-line" />
      </div>

      <style jsx>{`
        .tn-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px 20px 24px;
          text-align: center;
          background: radial-gradient(
            circle at 50% 0%,
            #f4fbf7 0%,
            #ffffff 70%
          );
          overflow: hidden;
        }

        .tn-hero-title {
          margin: 0;
          font-size: clamp(22px, 4.2vw, 40px);
          line-height: 1.5;
          font-weight: 700;
        }

        .tn-hero-title span {
          background: linear-gradient(
            90deg,
            #155a43,
            #2fbe89,
            #f5a623,
            #2fbe89,
            #155a43
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: tn-shine 4.5s linear infinite,
            tn-title-in 0.9s ease-out both;
          text-shadow: 0 2px 18px rgba(47, 190, 137, 0.18);
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

        .tn-hero-scene {
          position: relative;
          width: 100%;
          max-width: 320px;
          display: flex;
          justify-content: center;
        }

        .tn-walker {
          animation: tn-walk-bounce 0.5s ease-in-out infinite;
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
      `}</style>
    </section>
  );
}