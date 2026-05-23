/** Custom warranty mark: shield + stylized truck (no external asset). */
export default function WarrantyShieldTruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="wsh-stroke" x1="60" y1="4" x2="60" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fafafa" />
          <stop offset="1" stopColor="#71717a" />
        </linearGradient>
        <linearGradient id="wsh-fill" x1="60" y1="28" x2="60" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#27272a" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <linearGradient id="wsh-orange" x1="36" y1="72" x2="92" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path
        d="M60 6 108 22v42c0 28-20 52-48 62C32 116 12 92 12 64V22L60 6Z"
        fill="url(#wsh-fill)"
        stroke="url(#wsh-stroke)"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        d="M60 18c-18 6-30 18-30 34v8c0 14 10 28 30 36 20-8 30-22 30-36v-8c0-16-12-28-30-34Z"
        fill="#18181b"
        opacity="0.85"
      />
      {/* Cab */}
      <path
        d="M38 78h28v18H38V78Zm6-14h16l6 14H38l6-14Z"
        fill="url(#wsh-orange)"
      />
      {/* Cargo box */}
      <rect x="64" y="66" width="22" height="22" rx="1.5" fill="#f4f4f5" opacity="0.92" />
      <rect x="66" y="68" width="18" height="3" rx="0.5" fill="#ea580c" opacity="0.9" />
      {/* Wheels */}
      <circle cx="44" cy="100" r="7" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
      <circle cx="44" cy="100" r="3" fill="#a1a1aa" />
      <circle cx="78" cy="100" r="7" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
      <circle cx="78" cy="100" r="3" fill="#a1a1aa" />
      {/* Check / trust mark */}
      <path
        d="M52 44 58 52 72 36"
        stroke="#f97316"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
