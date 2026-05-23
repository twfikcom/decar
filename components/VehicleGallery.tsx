'use client';

import { useState } from 'react';
import Image from 'next/image';

type VehicleGalleryProps = {
  images: string[];
  alt: string;
  thumbAlt: (index: number) => string;
  activeBorderClass?: string;
  idleBorderClass?: string;
};

export default function VehicleGallery({
  images,
  alt,
  thumbAlt,
  activeBorderClass = 'border-orange-500 hover:scale-105',
  idleBorderClass = 'border-zinc-200 hover:scale-105 hover:border-orange-300',
}: VehicleGalleryProps) {
  const safeImages = images.filter(Boolean);
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
              aria-label={thumbAlt(idx + 1)}
              aria-pressed={idx === activeIndex}
            >
              <Image src={img} alt={thumbAlt(idx + 1)} fill className="object-cover" sizes="160px" />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
