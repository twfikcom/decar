'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  brandFilterHref,
  brandIconUrl,
  MERCEDES_BRAND_ICON_URL,
  type BrandConfig,
} from '@/lib/brand-icons';

type BrandIconRowProps = {
  brands: BrandConfig[];
  basePath: '/trucks' | '/cars';
  hash: string;
  activeBrand?: string;
  tone: 'red' | 'emerald';
  ariaLabel: string;
  /** Shown on the mobile scroll hint control (accessibility). */
  scrollMoreLabel: string;
  id?: string;
};

function BrandLogo({
  brand,
  isActive,
  tone,
}: {
  brand: BrandConfig;
  isActive: boolean;
  tone: 'red' | 'emerald';
}) {
  const hex = isActive ? (tone === 'red' ? 'DC2626' : '059669') : '111827';
  const activeGlow =
    isActive && tone === 'red'
      ? 'drop-shadow-[0_0_0_2px_rgba(220,38,38,0.35)]'
      : isActive && tone === 'emerald'
        ? 'drop-shadow-[0_0_0_2px_rgba(5,150,105,0.4)]'
        : '';

  if (brand.icon.type === 'mercedes-benz') {
    return (
      <Image
        src={MERCEDES_BRAND_ICON_URL}
        alt=""
        width={200}
        height={200}
        unoptimized
        className={`h-10 w-auto max-w-[7.5rem] object-contain sm:h-14 sm:max-w-[10.75rem] ${activeGlow}`}
      />
    );
  }

  return (
    <Image
      src={brandIconUrl(brand.icon.slug, hex)}
      alt=""
      width={140}
      height={64}
      unoptimized
      className={`h-10 w-auto max-w-[7.5rem] object-contain sm:h-14 sm:max-w-[10.75rem] ${activeGlow}`}
    />
  );
}

export default function BrandIconRow({
  brands,
  basePath,
  hash,
  activeBrand,
  tone,
  ariaLabel,
  scrollMoreLabel,
  id,
}: BrandIconRowProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [showRightHint, setShowRightHint] = useState(false);

  const shellClass =
    tone === 'red'
      ? 'border-red-200/80 bg-gradient-to-br from-white via-red-50/40 to-orange-50/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(220,38,38,0.08)]'
      : 'border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/40 to-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(16,185,129,0.08)]';

  const hoverBorder =
    tone === 'red'
      ? 'hover:border-red-400 hover:bg-white hover:shadow-[0_8px_24px_rgba(220,38,38,0.12)]'
      : 'hover:border-emerald-400 hover:bg-white hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)]';

  const activeBorder =
    tone === 'red'
      ? 'border-red-500 bg-white shadow-[0_8px_24px_rgba(220,38,38,0.16)] ring-2 ring-red-500/25'
      : 'border-emerald-500 bg-white shadow-[0_8px_24px_rgba(16,185,129,0.16)] ring-2 ring-emerald-500/25';

  const gridCols =
    brands.length >= 5
      ? 'md:grid-cols-3 lg:grid-cols-5'
      : 'md:grid-cols-4';

  const arrowClass =
    tone === 'red' ? 'text-red-600' : 'text-zinc-900';

  const updateScrollHint = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNarrow = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    if (!isNarrow) {
      setShowRightHint(false);
      return;
    }
    setShowRightHint(el.scrollWidth > el.clientWidth + 4 && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useLayoutEffect(() => {
    updateScrollHint();
  }, [brands.length, updateScrollHint]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollHint, { passive: true });
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => updateScrollHint();
    mq.addEventListener('change', onMq);
    const ro = new ResizeObserver(() => updateScrollHint());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollHint);
      mq.removeEventListener('change', onMq);
      ro.disconnect();
    };
  }, [updateScrollHint]);

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(120, el.clientWidth * 0.45), behavior: 'smooth' });
  };

  return (
    <nav id={id} className="scroll-mt-28 w-full" aria-label={ariaLabel}>
      <div className={`relative w-full overflow-hidden rounded-2xl border-2 px-2 py-3 sm:px-5 sm:py-5 ${shellClass}`}>
        <ul
          ref={scrollRef}
          className={`max-md:flex max-md:snap-x max-md:snap-mandatory max-md:flex-nowrap max-md:gap-3 max-md:overflow-x-auto max-md:overflow-y-hidden max-md:pb-1 max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid md:w-full md:gap-4 md:overflow-visible md:pb-0 ${gridCols}`}
        >
          {brands.map((brand) => {
            const isActive = activeBrand === brand.name;
            return (
              <li
                key={brand.name}
                className="max-md:snap-start max-md:shrink-0 max-md:basis-[calc((100%-1.5rem)/2.5)] md:min-w-0"
              >
                <Link
                  href={brandFilterHref(basePath, brand.name, hash)}
                  title={brand.name}
                  aria-label={brand.name}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 min-h-[5.25rem] transition-all duration-200 md:min-h-[7.25rem] md:gap-2 md:px-4 md:py-4 ${
                    isActive ? activeBorder : `border-white/80 bg-white/70 ${hoverBorder} hover:-translate-y-0.5`
                  }`}
                >
                  <BrandLogo brand={brand} isActive={isActive} tone={tone} />
                  <span
                    className={`line-clamp-2 text-center text-[10px] font-black uppercase leading-tight tracking-wide sm:text-[11px] ${
                      isActive
                        ? tone === 'red'
                          ? 'text-red-700'
                          : 'text-emerald-700'
                        : 'text-zinc-600 group-hover:text-zinc-900'
                    }`}
                  >
                    {brand.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {showRightHint ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-14 bg-gradient-to-l from-white from-40% to-transparent max-md:block"
              aria-hidden
            />
            <button
              type="button"
              onClick={scrollNext}
              className={`absolute right-1 top-1/2 z-[2] hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 shadow-md max-md:flex ${arrowClass}`}
              aria-label={scrollMoreLabel}
            >
              <ChevronRight className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
