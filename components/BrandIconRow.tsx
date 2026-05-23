import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  brandFilterHref,
  brandIconUrl,
  type BrandConfig,
} from '@/lib/brand-icons';

type BrandIconRowProps = {
  brands: BrandConfig[];
  basePath: '/trucks' | '/cars';
  hash: string;
  activeBrand?: string;
  tone: 'red' | 'emerald';
  ariaLabel: string;
  id?: string;
};

export default function BrandIconRow({
  brands,
  basePath,
  hash,
  activeBrand,
  tone,
  ariaLabel,
  id,
}: BrandIconRowProps) {
  const hoverBorder = tone === 'red' ? 'hover:border-red-500 hover:shadow-red-500/15' : 'hover:border-emerald-500 hover:shadow-emerald-500/15';
  const activeBorder =
    tone === 'red'
      ? 'border-red-600 bg-red-50 shadow-red-500/20 ring-2 ring-red-500/30'
      : 'border-emerald-600 bg-emerald-50 shadow-emerald-500/20 ring-2 ring-emerald-500/30';

  return (
    <nav id={id} className="scroll-mt-28" aria-label={ariaLabel}>
      <ul className="flex flex-wrap items-center gap-3 sm:gap-4">
        {brands.map((brand) => {
          const isActive = activeBrand === brand.name;
          return (
            <li key={brand.name}>
              <Link
                href={brandFilterHref(basePath, brand.name, hash)}
                title={brand.name}
                aria-label={brand.name}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex h-16 w-[5.5rem] items-center justify-center rounded-xl border-2 bg-white px-3 shadow-sm transition-all duration-200 sm:h-[4.5rem] sm:w-24 ${
                  isActive ? activeBorder : `border-zinc-200 ${hoverBorder} hover:-translate-y-0.5 hover:shadow-md`
                }`}
              >
                <Image
                  src={brandIconUrl(brand.iconSlug, isActive ? (tone === 'red' ? 'DC2626' : '059669') : '111827')}
                  alt=""
                  width={88}
                  height={40}
                  unoptimized
                  className="h-7 w-auto max-w-[4.5rem] object-contain opacity-90 transition group-hover:opacity-100 sm:h-8 sm:max-w-[5rem]"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
