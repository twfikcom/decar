export const SITE_LOGO_URL = '/llogoa.png';
export const SITE_LOGO_URL_640 = '/llogoa-640.png';
export const SITE_LOGO_URL_1280 = '/llogoa-1280.png';

/** Intrinsic pixels of `public/llogoa.png`. */
export const SITE_LOGO_WIDTH = 1770;
export const SITE_LOGO_HEIGHT = 624;

/** Pre-downscaled assets — sharper on mobile than browser scaling full size → ~170px. */
export const SITE_LOGO_SRC_SET = `${SITE_LOGO_URL_640} 640w, ${SITE_LOGO_URL_1280} 1280w, ${SITE_LOGO_URL} 1770w`;

export const SITE_LOGO_HEADER_SIZES =
  '(max-width: 640px) 260px, (max-width: 768px) 310px, (max-width: 1024px) 400px, 470px';

export const SITE_LOGO_FOOTER_SIZES = '(max-width: 768px) 260px, 320px';

/** Integer px heights avoid sub-pixel blur on mobile; no CSS scale. */
export const SITE_LOGO_HEADER_CLASS =
  'block h-[52px] w-auto max-w-[min(78vw,260px)] object-contain object-start max-sm:[image-rendering:-webkit-optimize-contrast] sm:h-[62px] sm:max-w-[min(72vw,310px)] md:h-[70px] lg:h-[60px] lg:max-w-[min(36vw,400px)] xl:h-[64px] xl:max-w-[min(34vw,440px)] 2xl:h-[68px] 2xl:max-w-[470px]';

export const SITE_LOGO_FOOTER_CLASS =
  'block h-10 w-auto max-h-12 object-contain object-center max-sm:[image-rendering:-webkit-optimize-contrast] sm:h-12 sm:max-h-14 md:h-14 md:max-h-16';

/** Logo frame behind footer / home splash loader (matches header). */
export const SITE_LOGO_FOOTER_FRAME_CLASS =
  'rounded-md border border-zinc-800 bg-black px-2 py-1.5 sm:px-2.5 sm:py-2';
