import {
  SITE_LOGO_HEIGHT,
  SITE_LOGO_SRC_SET,
  SITE_LOGO_URL,
  SITE_LOGO_WIDTH,
} from '@/lib/site-logo';

type SiteLogoProps = {
  className: string;
  sizes: string;
  alt?: string;
  priority?: boolean;
  ariaHidden?: boolean;
};

/** Native img + srcSet for crisp downscaling on mobile (avoids Next/Image + huge PNG). */
export default function SiteLogo({
  className,
  sizes,
  alt = '',
  priority,
  ariaHidden,
}: SiteLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SITE_LOGO_URL}
      srcSet={SITE_LOGO_SRC_SET}
      sizes={sizes}
      width={SITE_LOGO_WIDTH}
      height={SITE_LOGO_HEIGHT}
      alt={alt}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      aria-hidden={ariaHidden || undefined}
      draggable={false}
    />
  );
}
