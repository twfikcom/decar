'use client';

import { motion } from 'motion/react';
import { Search, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useHomeHeroReady } from '@/hooks/use-home-hero-ready';
import { HOME_LOADER_SESSION_KEY, isHomeAppPath } from '@/lib/home-loader';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.22 },
  },
};

const itemVariants = {
  hidden: { scale: 1.5, opacity: 0, y: -20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 350, damping: 10, mass: 1 },
  },
};

const textVariants = {
  hidden: { scale: 1.2, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 350, damping: 10, mass: 1 },
  },
};

function initialHeroReady(pathname: string): boolean {
  if (!isHomeAppPath(pathname)) return true;
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(sessionStorage.getItem(HOME_LOADER_SESSION_KEY));
  } catch {
    return true;
  }
}

export default function HeroTextAnimation() {
  const pathname = usePathname();
  const heroReady = useHomeHeroReady();
  const t = useTranslations('Hero');
  const [skipEntrance] = useState(() => initialHeroReady(pathname));
  const motionState = heroReady ? 'visible' : 'hidden';

  return (
    <motion.div
      className="max-w-3xl rtl:ms-auto"
      initial={skipEntrance ? false : 'hidden'}
      animate={motionState}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <span className="mb-4 inline-block max-w-full rounded-sm bg-red-600 px-3 py-1 text-[11px] font-black leading-tight tracking-wide text-white shadow-[0_4px_0_0_#7f1d1d] drop-shadow-[0_4px_10px_rgba(220,38,38,0.8)] sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-wider">
          {t('badge')}
        </span>
      </motion.div>

      <motion.h1
        variants={textVariants}
        className="mb-4 font-heading text-3xl font-black leading-[1.1] tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] sm:mb-6 sm:text-5xl md:mb-8 md:text-7xl"
      >
        {t('titleLine1')} <br />
        <span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_5px_10px_rgba(239,68,68,0.5)]">
          {t('titleHighlight')}
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-6 max-w-2xl text-base font-medium leading-relaxed text-zinc-300 drop-shadow-md sm:mb-10 sm:text-xl md:mb-12 md:text-2xl"
      >
        {t('subtitle')}
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col gap-2.5 sm:flex-row sm:gap-6">
        <Link
          href="/trucks"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-red-600 to-red-800 px-5 py-3 text-sm font-black uppercase leading-tight tracking-wide text-white shadow-[0_6px_0_0_#7f1d1d,0_12px_24px_rgba(220,38,38,0.35)] transition-all hover:translate-y-[3px] hover:shadow-[0_3px_0_0_#7f1d1d,0_8px_16px_rgba(220,38,38,0.45)] active:translate-y-[6px] active:shadow-none sm:gap-3 sm:px-10 sm:py-5 sm:text-xl sm:tracking-wider sm:shadow-[0_8px_0_0_#7f1d1d,0_15px_30px_rgba(220,38,38,0.4)] sm:hover:translate-y-[4px] sm:active:translate-y-[8px]"
        >
          <Search className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 sm:h-6 sm:w-6" />
          {t('ctaSearch')}
        </Link>
        <a
          href="https://wa.me/491625330280"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-black uppercase leading-tight tracking-wide text-white shadow-[0_6px_0_0_#27272a] transition-all hover:border-orange-500 hover:bg-black hover:translate-y-[3px] active:translate-y-[6px] active:shadow-none sm:gap-3 sm:px-10 sm:py-5 sm:text-xl sm:tracking-wider sm:shadow-[0_8px_0_0_#27272a] sm:hover:translate-y-[4px] sm:active:translate-y-[8px]"
        >
          <MessageCircle className="h-5 w-5 shrink-0 text-orange-500 sm:h-6 sm:w-6" />
          {t('ctaWhatsapp')}
        </a>
      </motion.div>
    </motion.div>
  );
}
