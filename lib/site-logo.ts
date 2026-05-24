/**
 * Logo served from WordPress admin host (same as inventory CDN).
 * Host must match next.config `images.remotePatterns` for `admin.xn--lwetrucks-07a.de`.
 */
export const SITE_LOGO_URL = 'https://admin.xn--lwetrucks-07a.de/pics/logo241.png';

/** Dark translucent plate behind logo on bright gradient header — lifts dark logo parts. */
export const SITE_LOGO_NAVBAR_WRAP_CLASS =
  'rounded-lg bg-black/45 ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_20px_rgba(0,0,0,0.35)] backdrop-blur-[2px] px-1.5 py-0.5 sm:px-2 sm:py-1';

/** Extra image filters on the orange/red navbar (dark “TRUCKS” text reads clearer). */
export const SITE_LOGO_NAVBAR_IMG_CLASS =
  'brightness-[1.08] contrast-[1.12] saturate-[1.04] drop-shadow-[0_0_1px_rgba(255,255,255,0.35)] drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]';

/** Footer: black background — slight lift so mid-tones don’t sink into bg. */
export const SITE_LOGO_FOOTER_IMG_CLASS =
  'brightness-[1.04] contrast-[1.06] drop-shadow-[0_0_24px_rgba(255,255,255,0.08)]';

/** Splash screen on pure black — gentle pop without blowing highlights. */
export const SITE_LOGO_LOADER_IMG_CLASS =
  'brightness-[1.05] contrast-[1.08] drop-shadow-[0_12px_40px_rgba(0,0,0,0.65)]';
