'use client';

import { useTranslations } from 'next-intl';

const HERO_BG_SRC = '/image.png';

export default function HeroSlider() {
  const t = useTranslations('Hero');
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 max-sm:-inset-x-[8%] max-sm:-inset-y-[6%] sm:inset-0">
        <img
          src={HERO_BG_SRC}
          alt={t('bgAlt')}
          width={1920}
          height={1080}
          className="absolute inset-0 z-0 h-full w-full object-cover object-[72%_48%] max-sm:scale-[1.12] sm:object-center sm:scale-100"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/65 to-black/25 max-sm:via-black/75 sm:via-black/50 sm:to-transparent" />
    </div>
  );
}
