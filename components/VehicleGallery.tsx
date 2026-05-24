'use client';

import { useState } from 'react';
import Image from 'next/image';

type VehicleGalleryProps = {
  images: string[];
  alt: string;
  /** Per-thumbnail alt strings (must be serializable from Server Components — no functions). */
  thumbAlts: string[];
  activeBorderClass?: string;
  idleBorderClass?: string;
};

export default function VehicleGallery({
  images,
  alt,
  thumbAlts,
  activeBorderClass = 'border-orange-500 hover:scale-105',
  idleBorderClass = 'border-zinc-200 hover:scale-105 hover:border-orange-300',
}: VehicleGalleryProps) {
  const entries = images
    .map((src, i) => ({
      src,
      thumbLabel: thumbAlts[i]?.trim() ? thumbAlts[i] : `${alt} (${i + 1})`,
    }))
    .filter((e) => Boolean(e.src));
  const safeImages = entries.map((e) => e.src);
  const thumbLabels = entries.map((e) => e.thumbLabel);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  if (!activeImage) {
    return (
      <div className="relative mb-6 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-200 text-sm font-bold uppercase tracking-widest text-zinc-500">
        {alt}
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
        <Image src={activeImage} alt={alt} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
      </div>
      {safeImages.length > 1 ? (
        <div className="custom-scrollbar flex gap-4 overflow-x-auto px-2 pb-4">
          {safeImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-24 w-40 shrink-0 cursor-pointer overflow-hidden rounded-xl border-4 shadow-sm transition-all ${
                idx === activeIndex ? activeBorderClass : idleBorderClass
              }`}
              aria-label={thumbLabels[idx]}
              aria-pressed={idx === activeIndex}
            >
              <Image src={img} alt={thumbLabels[idx]} fill className="object-cover" sizes="160px" />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
