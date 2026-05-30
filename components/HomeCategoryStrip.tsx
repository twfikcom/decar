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
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {stripItems.map(({ href, labelKey, count, iconSrc }) => {
            const n = count();
            return (
              <li key={href} className="min-w-0">
                <Link
                  href={href}
                  className="group relative grid aspect-square min-h-[156px] w-full grid-rows-[1fr_auto_auto] overflow-hidden rounded-sm border border-white/10 p-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] outline-none ring-orange-400/0 transition-[transform,box-shadow,background-position] duration-700 ease-out focus-visible:ring-2 focus-visible:ring-orange-400 sm:min-h-[172px] sm:p-2.5 active:translate-y-0.5 bg-[length:220%_220%] bg-[position:0%_50%] hover:bg-[position:100%_50%] hover:shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] bg-[linear-gradient(128deg,#fdba74_0%,#fb923c_14%,#f97316_28%,#ea580c_40%,#dc2626_55%,#991b1b_68%,#292524_82%,#0a0a0a_100%)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.45)_100%)]"
                    aria-hidden
                  />
                  <span className="relative flex min-h-0 w-full items-center justify-center px-0.5 pt-0.5">
                    <Image
                      src={iconSrc}
                      alt=""
                      width={360}
                      height={216}
                      className="max-h-full max-w-[92%] h-auto w-auto object-contain object-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 220px"
                    />
                  </span>
                  {n !== null ? (
                    <span className="relative shrink-0 font-heading text-xl font-black tabular-nums leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] sm:text-2xl">
                      {n}
                    </span>
                  ) : (
                    <span className="relative h-6 shrink-0 sm:h-7" aria-hidden />
                  )}
                  <span className="relative line-clamp-3 shrink-0 px-0.5 pb-0.5 text-[10px] font-bold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] sm:text-[11px] md:text-xs">
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
