/**
 * Logo served from WordPress admin host (same as inventory CDN).
 * Host must match next.config `images.remotePatterns` for `admin.xn--lwetrucks-07a.de`.
 */
export const SITE_LOGO_URL = 'https://admin.xn--lwetrucks-07a.de/pics/logo241.png';

/** White plate behind logo (splash loader). */
export const SITE_LOGO_FRAME_CLASS =
  'rounded-md bg-white px-2.5 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.14)] ring-1 ring-zinc-200/90 sm:px-3 sm:py-2';

/** Matches main header bar gradient behind footer logo. */
export const SITE_LOGO_FOOTER_FRAME_CLASS =
  'rounded-md border border-black/50 bg-gradient-to-r from-red-700 via-orange-600 to-red-600 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:px-2.5 sm:py-2';
