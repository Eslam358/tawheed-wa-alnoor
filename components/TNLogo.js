export default function TNLogo({ className = "", size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="tnGradient" x1="15" y1="15" x2="85" y2="85">
          <stop offset="0%" stopColor="#2FBE89" />
          <stop offset="50%" stopColor="#239C70" />
          <stop offset="100%" stopColor="#155A43" />
        </linearGradient>
        <linearGradient id="tnBgGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#0F3D2E" />
          <stop offset="100%" stopColor="#0A2E22" />
        </linearGradient>
      </defs>

      {/* الخلفية */}
      <rect width="100" height="100" rx="24" fill="url(#tnBgGradient)" />

      {/* خطوط الحركة */}
      <path d="M12 39H27" stroke="#2FBE89" strokeWidth="5" strokeLinecap="round" />
      <path d="M9 50H25" stroke="#239C70" strokeWidth="5" strokeLinecap="round" />
      <path d="M13 61H27" stroke="#1C7A59" strokeWidth="5" strokeLinecap="round" />

      {/* حرف T */}
      <path d="M31 27H62L58 35H49L44 70H35L40 35H29L31 27Z" fill="#E3F5EC" />

      {/* N / عربة التسوق */}
      <path
        d="M49 40L57 39L68 53L75 34H84L77 59C76 63 73 66 69 66H53L55 58H67L59 47L54 66H46L49 40Z"
        fill="url(#tnGradient)"
      />

      {/* قاعدة العربة */}
      <path d="M53 66H73" stroke="#2FBE89" strokeWidth="5" strokeLinecap="round" />

      {/* العجلات */}
      <circle cx="58" cy="75" r="4" fill="#BEE8D3" />
      <circle cx="72" cy="75" r="4" fill="#BEE8D3" />
    </svg>
  );
}
