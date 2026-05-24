/**
 * Homepage warranty mark: flat “Löwe Trucks” style — shield, localized wordmark, truck front.
 * (Reference: metallic shield + orange type; adapted to site zinc/orange/red UI.)
 */
type Props = {
  className?: string;
  /** Short label inside the shield (e.g. ضمان / Warranty / Garantie). */
  wordmark: string;
  textDir?: 'ltr' | 'rtl';
  /** Used for wordmark styling (e.g. uppercase only for English). */
  locale?: string;
};

export default function WarrantyShieldTruckIcon({ className, wordmark, textDir = 'ltr', locale = 'en' }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="ws-shield-rim" x1="8" y1="8" x2="112" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e4e4e7" />
          <stop offset="0.45" stopColor="#a1a1aa" />
          <stop offset="1" stopColor="#52525b" />
        </linearGradient>
        <linearGradient id="ws-shield-face" x1="60" y1="18" x2="60" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3f3f46" />
          <stop offset="0.55" stopColor="#27272a" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="ws-orange" x1="36" y1="72" x2="84" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="ws-orange-soft" x1="40" y1="60" x2="80" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fdba74" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
        <filter id="ws-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shield body */}
      <path
        d="M60 6 108 22v42c0 28-20 52-48 62C32 116 12 92 12 64V22L60 6Z"
        fill="url(#ws-shield-face)"
        stroke="url(#ws-shield-rim)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner bevel */}
      <path
        d="M60 14 100 27v36c0 22-16 42-40 50-24-8-40-28-40-50V27L60 14Z"
        fill="none"
        stroke="#18181b"
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Wordmark — HTML for correct Arabic shaping + site fonts */}
      <foreignObject x="8" y="22" width="104" height="34">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          dir={textDir}
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: 'var(--font-heading), var(--font-arabic), system-ui, sans-serif',
            fontWeight: 700,
            fontSize: textDir === 'rtl' ? 22 : 17,
            letterSpacing: textDir === 'rtl' ? '0.02em' : '0.06em',
            textTransform: locale === 'en' ? 'uppercase' : 'none',
            lineHeight: 1,
            color: '#fb923c',
            textShadow: '0 1px 0 rgba(0,0,0,0.65), 0 0 18px rgba(234,88,12,0.35)',
          }}
        >
          {wordmark}
        </div>
      </foreignObject>

      {/* Truck front — centered under wordmark */}
      <g filter="url(#ws-soft-glow)">
        {/* Mirrors */}
        <rect x="28" y="56" width="5" height="10" rx="1" fill="url(#ws-orange)" opacity="0.95" />
        <rect x="87" y="56" width="5" height="10" rx="1" fill="url(#ws-orange)" opacity="0.95" />

        {/* Windshield */}
        <path
          d="M46 54h28l4 18H42l4-18Z"
          fill="#18181b"
          stroke="url(#ws-orange)"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <path d="M50 58h20l2.5 12H47.5L50 58Z" fill="#27272a" opacity="0.9" />

        {/* Headlights */}
        <circle cx="39" cy="68" r="5.2" fill="url(#ws-orange-soft)" stroke="#c2410c" strokeWidth="0.9" />
        <circle cx="81" cy="68" r="5.2" fill="url(#ws-orange-soft)" stroke="#c2410c" strokeWidth="0.9" />
        <circle cx="39" cy="68" r="2" fill="#fff7ed" opacity="0.55" />
        <circle cx="81" cy="68" r="2" fill="#fff7ed" opacity="0.55" />

        {/* Grille */}
        <rect x="48" y="74" width="24" height="15" rx="2" fill="#0c0a09" stroke="url(#ws-orange)" strokeWidth="1.1" />
        <path
          d="M51 78h18M51 81.5h18M51 85h18"
          stroke="url(#ws-orange)"
          strokeWidth="1.15"
          strokeLinecap="round"
        />

        {/* Bumper */}
        <path
          d="M34 92h52v5c0 2-1.5 3.5-3.5 3.5h-45c-2 0-3.5-1.5-3.5-3.5v-5Z"
          fill="#27272a"
          stroke="#52525b"
          strokeWidth="0.9"
        />
        <path d="M40 96h40" stroke="url(#ws-orange)" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      </g>
    </svg>
  );
}
