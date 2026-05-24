'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

type VehicleGalleryProps = {
  images: string[];
  alt: string;
  /** Per-thumbnail alt strings (must be serializable from Server Components — no functions). */
  thumbAlts: string[];
  activeBorderClass?: string;
  idleBorderClass?: string;
};

const SWIPE_PX = 48;

export default function VehicleGallery({
  images,
  alt,
  thumbAlts,
  activeBorderClass = 'border-orange-500 ring-2 ring-orange-500/40',
  idleBorderClass = 'border-zinc-200 hover:border-orange-300',
}: VehicleGalleryProps) {
  const t = useTranslations('VehicleGallery');
  const entries = images
    .map((src, i) => ({
      src,
      thumbLabel: thumbAlts[i]?.trim() ? thumbAlts[i] : `${alt} (${i + 1})`,
    }))
    .filter((e) => Boolean(e.src));
  const safeImages = entries.map((e) => e.src);
  const thumbLabels = entries.map((e) => e.thumbLabel);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);

  const n = safeImages.length;
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  const goPrev = useCallback(() => {
    if (n <= 1) return;
    setActiveIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    if (n <= 1) return;
    setActiveIndex((i) => (i + 1) % n);
  }, [n]);

  useEffect(() => {
    setActiveIndex((i) => {
      if (n === 0) return 0;
      return Math.min(i, n - 1);
    });
  }, [n]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goPrev, goNext]);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip || n <= 1) return;
    const activeThumb = strip.querySelector<HTMLElement>(`[data-thumb-index="${activeIndex}"]`);
    activeThumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex, n]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || n <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -SWIPE_PX) goNext();
    else if (dx > SWIPE_PX) goPrev();
  };

  if (!activeImage) {
    return (
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-200 text-sm font-bold uppercase tracking-widest text-zinc-500">
        {alt}
      </div>
    );
  }

  const openLightbox = () => setLightboxOpen(true);

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={openLightbox}
            className="relative block h-full w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label={t('openFullscreen')}
          >
            <Image
              src={activeImage}
              alt={alt}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </button>

          {n > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 md:left-3 md:h-12 md:w-12"
                aria-label={t('prev')}
              >
                <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 md:right-3 md:h-12 md:w-12"
                aria-label={t('next')}
              >
                <ChevronRight className="h-7 w-7 md:h-8 md:w-8" aria-hidden />
              </button>
              <div
                className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex max-w-[90%] -translate-x-1/2 gap-1.5 overflow-hidden rounded-full bg-black/45 px-2 py-1.5 backdrop-blur-sm"
                aria-hidden
              >
                {safeImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 shrink-0 rounded-full transition ${i === activeIndex ? 'bg-white' : 'bg-white/35'}`}
                  />
                ))}
              </div>
            </>
          ) : null}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox();
            }}
            className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-md backdrop-blur-sm transition hover:bg-black/70 md:right-3 md:top-3 md:h-11 md:w-11"
            aria-label={t('openFullscreen')}
          >
            <ZoomIn className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
          </button>

          {n > 1 ? (
            <p className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm md:text-xs">
              {t('counter', { current: activeIndex + 1, total: n })}
            </p>
          ) : null}
        </div>

        {n > 1 ? (
          <div
            ref={thumbStripRef}
            className="custom-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-0.5 pb-1 md:gap-3"
            role="tablist"
            aria-label={t('thumbnailsLabel')}
          >
            {safeImages.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                data-thumb-index={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-20 w-28 shrink-0 snap-center overflow-hidden rounded-xl border-[3px] shadow-sm transition-all md:h-24 md:w-40 ${
                  idx === activeIndex ? activeBorderClass : idleBorderClass
                } ${idx === activeIndex ? 'scale-[1.02] shadow-md' : 'opacity-90 hover:opacity-100'}`}
                aria-label={thumbLabels[idx]}
              >
                <Image src={img} alt="" fill unoptimized className="object-cover" sizes="(max-width:768px) 112px, 160px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={t('dialogLabel')}>
          <button
            type="button"
            className="absolute inset-0 bg-black/95"
            aria-label={t('closeBackdrop')}
            onClick={() => setLightboxOpen(false)}
          />
          <div className="relative z-10 flex h-[100dvh] flex-col p-2 pointer-events-none md:p-6">
            <div className="pointer-events-auto flex shrink-0 items-center justify-between gap-3 pb-2 text-white">
              <p className="truncate text-xs font-bold uppercase tracking-widest text-white/80 md:text-sm">
                {n > 1 ? t('counter', { current: activeIndex + 1, total: n }) : alt}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label={t('close')}
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <div
              className="pointer-events-auto relative min-h-0 flex-1 touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full max-h-[min(78dvh,880px)] w-full max-w-[min(100%,1400px)]">
                  <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>

              {n > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:left-2 md:h-14 md:w-14"
                    aria-label={t('prev')}
                  >
                    <ChevronLeft className="h-8 w-8" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-2 md:h-14 md:w-14"
                    aria-label={t('next')}
                  >
                    <ChevronRight className="h-8 w-8" aria-hidden />
                  </button>
                </>
              ) : null}
            </div>

            {n > 1 ? (
              <div className="pointer-events-auto custom-scrollbar mt-2 flex max-h-[22vh] snap-x snap-mandatory gap-2 overflow-x-auto py-2 md:max-h-28 md:gap-2">
                {safeImages.map((img, idx) => (
                  <button
                    key={`lb-${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 snap-center overflow-hidden rounded-lg border-2 md:h-[4.5rem] md:w-32 ${
                      idx === activeIndex ? 'border-white ring-2 ring-white/50' : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={thumbLabels[idx]}
                  >
                    <Image src={img} alt="" fill unoptimized className="object-cover" sizes="128px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
