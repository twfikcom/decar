import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { CATEGORY_STRIP_ICON_URLS } from '@/lib/category-strip-icons';
import { getTrucks } from '@/lib/products';
import type { Truck } from '@/lib/mock-data';

type Cat = Truck['category'];

function countCategory(trucks: Truck[], cat: Cat) {
  return trucks.filter((t) => t.category === cat).length;
}

type StripLabelKey = 'zugmaschinen' | 'aufbau' | 'kipper' | 'kasten' | 'auflieger' | 'allStock' | 'search';

export default async function HomeCategoryStrip() {
  const t = await getTranslations('CategoryStrip');
  const locale = await getLocale();
  const trucks = await getTrucks(locale);

  const stripItems: {
    href: string;
    labelKey: StripLabelKey;
    count: () => number | null;
    iconSrc: string;
  }[] = [
    {
      href: `/trucks?category=${encodeURIComponent('Sattelzugmaschine')}`,
      labelKey: 'zugmaschinen',
      count: () => countCategory(trucks, 'Sattelzugmaschine'),
      iconSrc: CATEGORY_STRIP_ICON_URLS.zugmaschinen,
    },
    {
      href: `/trucks?category=${encodeURIComponent('Festaufbau')}`,
      labelKey: 'aufbau',
      count: () => countCategory(trucks, 'Festaufbau'),
      iconSrc: CATEGORY_STRIP_ICON_URLS.aufbau,
    },
    {
      href: `/trucks?category=${encodeURIComponent('Kipper')}`,
      labelKey: 'kipper',
      count: () => countCategory(trucks, 'Kipper'),
      iconSrc: CATEGORY_STRIP_ICON_URLS.kipper,
    },
    {
      href: `/trucks?category=${encodeURIComponent('Kastenwagen')}`,
      labelKey: 'kasten',
      count: () => countCategory(trucks, 'Kastenwagen'),
      iconSrc: CATEGORY_STRIP_ICON_URLS.kasten,
    },
    {
      href: `/trucks?category=${encodeURIComponent('Auflieger')}`,
      labelKey: 'auflieger',
      count: () => countCategory(trucks, 'Auflieger'),
      iconSrc: CATEGORY_STRIP_ICON_URLS.auflieger,
    },
    {
      href: '/trucks',
      labelKey: 'allStock',
      count: () => trucks.length,
      iconSrc: CATEGORY_STRIP_ICON_URLS.allStock,
    },
    {
      href: '/trucks#schnellsuche',
      labelKey: 'search',
      count: () => null,
      iconSrc: CATEGORY_STRIP_ICON_URLS.search,
    },
  ];

  return (
    <section
      className="border-b-[8px] border-orange-600 bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="category-strip-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="category-strip-heading"
          className="mb-8 text-center font-sans text-lg font-bold leading-snug text-zinc-100 sm:text-xl md:text-2xl"
        >
          {t('heading')}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-7">
          {stripItems.map(({ href, labelKey, count, iconSrc }) => {
            const n = count();
            return (
              <li key={href} className="min-w-0">
                <Link
                  href={href}
                  className="group relative flex aspect-square min-h-[140px] flex-col items-center justify-between overflow-hidden rounded-sm border border-white/10 p-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] outline-none ring-orange-400/0 transition-[transform,box-shadow,background-position] duration-700 ease-out focus-visible:ring-2 focus-visible:ring-orange-400 sm:min-h-[160px] sm:p-4 active:translate-y-0.5 bg-[length:220%_220%] bg-[position:0%_50%] hover:bg-[position:100%_50%] hover:shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] bg-[linear-gradient(128deg,#fdba74_0%,#fb923c_14%,#f97316_28%,#ea580c_40%,#dc2626_55%,#991b1b_68%,#292524_82%,#0a0a0a_100%)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.45)_100%)]"
                    aria-hidden
                  />
                  <span className="relative flex min-h-[4.5rem] flex-1 flex-col items-center justify-center sm:min-h-[5.25rem]">
                    <Image
                      src={iconSrc}
                      alt=""
                      width={200}
                      height={120}
                      className="h-auto max-h-[4rem] w-full max-w-[9rem] object-contain object-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-105 sm:max-h-[5.5rem] sm:max-w-[10.5rem]"
                      sizes="(max-width: 640px) 144px, 168px"
                    />
                  </span>
                  {n !== null ? (
                    <span className="relative font-heading text-2xl font-black tabular-nums text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] sm:text-3xl">
                      {n}
                    </span>
                  ) : (
                    <span className="relative h-8 sm:h-9" aria-hidden />
                  )}
                  <span className="relative line-clamp-3 text-[11px] font-bold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] sm:text-xs md:text-[13px]">
                    {t(labelKey)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
