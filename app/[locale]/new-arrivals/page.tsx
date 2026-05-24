import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCars, getTrucks } from '@/lib/products';
import { getLocalizedCar, getLocalizedTruck } from '@/lib/vehicle-i18n';
import { numberLocale } from '@/lib/locale-format';
import type { Car, Truck } from '@/lib/mock-data';
import { showPublicPrices, whatsappDeepLinkWithText } from '@/lib/public-pricing';
import { withSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type Entry =
  | { kind: 'car'; id: string; year: number; image: string }
  | { kind: 'truck'; id: string; year: number; image: string };

function buildEntries(cars: Car[], trucks: Truck[]): Entry[] {
  const c = cars.map(
    (car): Entry => ({
      kind: 'car',
      id: car.id,
      year: car.year,
      image: car.images[0],
    }),
  );
  const tr = trucks.map(
    (truck): Entry => ({
      kind: 'truck',
      id: truck.id,
      year: truck.year,
      image: truck.images[0],
    }),
  );
  return [...c, ...tr].sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return withSeo(locale, 'new-arrivals', {
    title: t('newArrivalsTitle'),
    description: t('newArrivalsDescription'),
  });
}

export default async function NewArrivalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('NewArrivals');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);
  const showPrice = showPublicPrices();
  const [cars, trucks] = await Promise.all([getCars(locale), getTrucks(locale)]);
  const entries = buildEntries(cars, trucks);

  const rows = await Promise.all(
    entries.map(async (e) => {
      if (e.kind === 'car') {
        const car = cars.find((c) => c.id === e.id)!;
        const copy = await getLocalizedCar(locale, car);
        return { ...e, href: `/cars/${e.id}` as const, title: copy.title, price: car.price };
      }
      const truck = trucks.find((tr) => tr.id === e.id)!;
      const copy = await getLocalizedTruck(locale, truck);
      return { ...e, href: `/trucks/${e.id}` as const, title: copy.title, price: truck.price };
    }),
  );

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <div className="border-b border-orange-600/40 bg-gradient-to-b from-zinc-950 to-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 flex justify-center">
            <Sparkles className="h-12 w-12 text-orange-400" aria-hidden />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-400">{t('eyebrow')}</p>
          <h1 className="mt-3 font-heading text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {t('titleAccent')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-zinc-400">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => {
            const waRow = whatsappDeepLinkWithText(tCommon('whatsappAskPrefill', { title: row.title }));
            return (
              <li key={`${row.kind}-${row.id}`}>
                {showPrice ? (
                  <Link
                    href={row.href}
                    className="group flex h-full flex-col overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition hover:border-orange-500/50 hover:shadow-[0_20px_50px_rgba(234,88,12,0.18)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                      <Image
                        src={row.image}
                        alt={row.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className="bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                          {row.kind === 'truck' ? t('badgeTruck') : t('badgeCar')}
                        </span>
                        <span className="bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                          {row.year}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="mb-4 line-clamp-2 font-heading text-xl font-black leading-snug text-white group-hover:text-orange-200">
                        {row.title}
                      </h2>
                      <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-4">
                        <span className="font-heading text-2xl font-black text-white">
                          {new Intl.NumberFormat(nl, {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(row.price)}
                        </span>
                        <span className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-2.5 text-white shadow-md transition group-hover:brightness-110">
                          <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition hover:border-orange-500/50 hover:shadow-[0_20px_50px_rgba(234,88,12,0.18)]">
                    <Link href={row.href} className="block flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                        <Image
                          src={row.image}
                          alt={row.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <span className="bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                            {row.kind === 'truck' ? t('badgeTruck') : t('badgeCar')}
                          </span>
                          <span className="bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                            {row.year}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h2 className="line-clamp-2 font-heading text-xl font-black leading-snug text-white group-hover:text-orange-200">
                          {row.title}
                        </h2>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between border-t border-zinc-800 px-6 pb-6 pt-4">
                      <a
                        href={waRow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-md transition hover:brightness-110"
                      >
                        <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                        {tCommon('askPrice')}
                      </a>
                      <Link
                        href={row.href}
                        className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-2.5 text-white shadow-md transition hover:brightness-110"
                        aria-label={row.title}
                      >
                        <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-sm font-medium text-zinc-500">{t('hint')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/trucks"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:border-orange-500 hover:text-orange-300"
          >
            {t('linkTrucks')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:border-orange-500 hover:text-orange-300"
          >
            {t('linkCars')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
