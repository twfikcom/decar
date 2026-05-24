import Image from 'next/image';
import { Link } from '@/i18n/navigation';
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
        className={`h-12 w-auto max-w-[8.75rem] object-contain sm:h-14 sm:max-w-[10.75rem] ${activeGlow}`}
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
      className={`h-12 w-auto max-w-[8.75rem] object-contain sm:h-14 sm:max-w-[10.75rem] ${activeGlow}`}
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
  id,
}: BrandIconRowProps) {
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
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-2 sm:grid-cols-4';

  return (
    <nav id={id} className="scroll-mt-28 w-full" aria-label={ariaLabel}>
      <div className={`w-full rounded-2xl border-2 px-3 py-4 sm:px-5 sm:py-5 ${shellClass}`}>
        <ul className={`grid w-full gap-3 sm:gap-4 ${gridCols}`}>
          {brands.map((brand) => {
            const isActive = activeBrand === brand.name;
            return (
              <li key={brand.name} className="min-w-0">
                <Link
                  href={brandFilterHref(basePath, brand.name, hash)}
                  title={brand.name}
                  aria-label={brand.name}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex min-h-[6.25rem] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 transition-all duration-200 sm:min-h-[7.25rem] sm:px-4 ${
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
      </div>
    </nav>
  );
}
