export const SITE_LOGO_URL = '/lionlogo.png';

/** Intrinsic pixels of `public/lionlogo.png` — keeps Next/Image aspect ratio correct. */
export const SITE_LOGO_WIDTH = 2065;
export const SITE_LOGO_HEIGHT = 762;

/** Header: native display size (no CSS scale — scale blurs raster logos). */
export const SITE_LOGO_HEADER_CLASS =
  'block h-[3.85rem] w-auto max-w-[min(82vw,308px)] object-contain object-start sm:h-[4.65rem] sm:max-w-[min(76vw,370px)] md:h-[5.3rem] lg:h-[5.85rem] lg:max-w-[min(44vw,580px)] xl:h-[6.4rem] xl:max-w-[min(42vw,682px)] 2xl:h-[6.75rem] 2xl:max-w-[740px]';

export const SITE_LOGO_FOOTER_CLASS =
  'block h-10 w-auto max-h-12 object-contain object-center sm:h-12 sm:max-h-14 md:h-14 md:max-h-16';

/** Logo frame behind footer / home splash loader (matches header). */
export const SITE_LOGO_FOOTER_FRAME_CLASS =
  'rounded-md border border-zinc-800 bg-black px-2 py-1.5 sm:px-2.5 sm:py-2';
