'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

function HeroContent({ animated }: { animated: boolean }) {
  const t = useTranslations('Hero');

  const wrapper = animated ? motion.div : 'div';
  const item = animated ? motion.div : 'div';
  const heading = animated ? motion.h1 : 'h1';
  const paragraph = animated ? motion.p : 'p';

  const containerProps = animated
    ? {
        initial: 'hidden' as const,
        animate: 'visible' as const,
        variants: {
          hidden: {},
          visible: {
            transition: { delayChildren: 0.15, staggerChildren: 0.25 },
          },
        },
      }
    : {};

  const itemProps = animated
    ? {
        variants: {
          hidden: { scale: 1.5, opacity: 0, y: -20 },
          visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 350, damping: 10, mass: 1 },
          },
        },
      }
    : {};

  const textProps = animated
    ? {
        variants: {
          hidden: { scale: 1.2, opacity: 0, y: 20 },
          visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 350, damping: 10, mass: 1 },
          },
        },
      }
    : {};

  const Wrapper = wrapper;
  const Item = item;
  const Heading = heading;
  const Paragraph = paragraph;

  return (
    <Wrapper className="max-w-3xl rtl:ms-auto" {...containerProps}>
      <Item {...itemProps}>
        <span className="inline-block py-1 px-4 bg-red-600 text-white font-black uppercase tracking-[0.3em] rounded-sm mb-6 drop-shadow-[0_4px_10px_rgba(220,38,38,0.8)] shadow-[0_4px_0_0_#7f1d1d] rotate-1">
          {t('badge')}
        </span>
      </Item>

      <Heading
        {...textProps}
        className="font-heading text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
      >
        {t('titleLine1')} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-500 drop-shadow-[0_5px_10px_rgba(239,68,68,0.5)]">
          {t('titleHighlight')}
        </span>
      </Heading>

      <Paragraph
        {...itemProps}
        className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-2xl leading-relaxed font-medium drop-shadow-md"
      >
        {t('subtitle')}
      </Paragraph>

      <Item {...itemProps} className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/trucks"
          className="group inline-flex items-center justify-center gap-3 bg-gradient-to-b from-red-600 to-red-800 text-white font-black px-10 py-5 rounded-xl transition-all text-xl uppercase tracking-wider shadow-[0_8px_0_0_#7f1d1d,0_15px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_4px_0_0_#7f1d1d,0_10px_20px_rgba(220,38,38,0.5)] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px]"
        >
          <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {t('ctaSearch')}
        </Link>
        <a
          href="https://wa.me/491625330280"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-zinc-900 border-2 border-zinc-700 hover:border-orange-500 hover:bg-black text-white font-black px-10 py-5 rounded-xl transition-all text-xl uppercase tracking-wider shadow-[0_8px_0_0_#27272a] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px]"
        >
          <MessageCircle className="w-6 h-6 text-orange-500" />
          {t('ctaWhatsapp')}
        </a>
      </Item>
    </Wrapper>
  );
}

export default function HeroTextAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <HeroContent animated={mounted} />;
}
