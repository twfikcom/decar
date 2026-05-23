'use client';

import { useTranslations } from 'next-intl';

const HERO_BG_SRC =
  'https://wheat-duck-884743.hostingersite.com/backk.png';

export default function HeroSlider() {
  const t = useTranslations('Hero');
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <div className="absolute inset-0">
        <img
          src={HERO_BG_SRC}
          alt={t('bgAlt')}
          width={1920}
          height={1080}
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>
  );
}
