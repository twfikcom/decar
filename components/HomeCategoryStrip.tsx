import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { CATEGORY_STRIP_ICON_URLS } from '@/lib/category-strip-icons';
import { getTrucks } from '@/lib/products';
import type { Truck } from '@/lib/mock-data';

type Cat = Truck['category'];

function countCategory(trucks: Truck[], cat: Cat) {
  return trucks.filter((t) => t.category === cat).length;
}

type StripLabelKey = 'zugmaschinen' | 'aufbau' | 'kipper' | 'kasten' | 'trailers' | 'search';

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
      labelKey: 'trailers',
      count: () => countCategory(trucks, 'Auflieger'),
      iconSrc: CATEGORY_STRIP_ICON_URLS.trailers,
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
      className="border-b-[8px] border-orange-600 bg-zinc-950 px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      aria-labelledby="category-strip-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="category-strip-heading"
          className="mb-6 text-center font-sans text-base font-bold leading-snug text-zinc-100 sm:mb-8 sm:text-xl md:text-2xl"
        >
          {t('heading')}
        </h2>
        <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6 lg:gap-4">
          {stripItems.map(({ href, labelKey, count, iconSrc }) => {
            const n = count();
            return (
              <li key={href} className="min-w-0">
                <Link
                  href={href}
                  className="group relative grid aspect-square w-full grid-rows-[1fr_auto] overflow-hidden rounded-md border border-white/10 p-0.5 text-center shadow-[0_6px_18px_rgba(0,0,0,0.4)] outline-none ring-orange-400/0 transition-[transform,box-shadow,background-position] duration-700 ease-out focus-visible:ring-2 focus-visible:ring-orange-400 sm:rounded-sm sm:p-2 sm:shadow-[0_8px_24px_rgba(0,0,0,0.45)] active:translate-y-0.5 max-sm:bg-orange-500 sm:bg-[length:220%_220%] sm:bg-[position:0%_50%] sm:hover:bg-[position:100%_50%] sm:hover:shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:bg-[linear-gradient(128deg,#fdba74_0%,#fb923c_14%,#f97316_28%,#ea580c_40%,#dc2626_55%,#991b1b_68%,#292524_82%,#0a0a0a_100%)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 max-sm:hidden bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.45)_100%)] sm:block"
                    aria-hidden
                  />
                  <span className="relative flex h-full min-h-0 w-full items-end justify-center max-sm:pt-0.5 sm:items-center">
                    <Image
                      src={iconSrc}
                      alt=""
                      width={400}
                      height={240}
                      className="h-full w-full max-h-full max-w-full object-contain object-bottom object-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-[1.03] sm:max-h-full sm:max-w-[92%] sm:h-auto sm:w-auto sm:object-center sm:drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 31vw, 16vw"
                    />
                  </span>
                  <div className="relative z-10 flex w-full min-w-0 flex-col items-center justify-end gap-0 px-0.5 pb-0.5 max-sm:gap-0 max-sm:pb-1 sm:gap-0.5 sm:pb-1">
                    {n !== null ? (
                      <span className="font-heading text-base font-black tabular-nums leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-xl lg:text-2xl">
                        {n}
                      </span>
                    ) : (
                      <span className="h-3 shrink-0 sm:h-6" aria-hidden />
                    )}
                    <span className="line-clamp-2 w-full text-[11px] font-bold leading-[1.15] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] sm:line-clamp-3 sm:text-xs sm:leading-tight">
                      {t(labelKey)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
