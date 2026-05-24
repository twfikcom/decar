import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight, CheckCircle, CarFront, MessageCircle } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getFeaturedCars, getFeaturedTrucks } from '@/lib/products';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedCar, getLocalizedTruck } from '@/lib/vehicle-i18n';
import HeroSlider from '@/components/HeroSlider';
import HeroTextAnimation from '@/components/HeroTextAnimation';
import HomeCategoryStrip from '@/components/HomeCategoryStrip';
import HomeHighlightCards from '@/components/HomeHighlightCards';
import HomeBrandIcons from '@/components/HomeBrandIcons';
import { showPublicPrices, whatsappDeepLinkWithText } from '@/lib/public-pricing';

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tEnum = await getTranslations('VehicleEnums');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);
  const featuredTrucks = await getFeaturedTrucks(locale, 3);
  const featuredCars = await getFeaturedCars(locale, 3);
  const featuredTruckRows = await Promise.all(
    featuredTrucks.map(async (truck) => ({
      truck,
      copy: await getLocalizedTruck(locale, truck),
    })),
  );
  const featuredCarRows = await Promise.all(
    featuredCars.map(async (car) => ({
      car,
      copy: await getLocalizedCar(locale, car),
    })),
  );
  const valueItems = [t('value1'), t('value2'), t('value3')] as const;
  const bodyLabel = (v: string) => tEnum(`bodyType.${v}` as 'bodyType.Limousine');
  const fuelLabel = (v: string) => tEnum(`fuel.${v}` as 'fuel.Diesel');
  const showPrice = showPublicPrices();

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative flex min-h-[min(100dvh,920px)] w-full flex-col overflow-hidden border-b-[8px] border-orange-600 bg-black">
        <HeroSlider />
        <div className="relative z-20 flex flex-1 flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:py-32 lg:px-8">
          <div className="mx-auto w-full max-w-7xl transform-gpu">
            <HeroTextAnimation />
          </div>
        </div>
      </section>

      <HomeCategoryStrip />

      <section className="bg-zinc-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] py-24 [background-size:16px_16px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end md:mb-16">
            <div>
              <h2 className="font-heading text-4xl font-black tracking-tight text-black drop-shadow-sm md:text-5xl">
                <span className="text-black">{t('trucksLine1')}</span>{' '}
                <span className="text-red-600">{t('trucksLine2')}</span>{' '}
                <span className="text-zinc-500">{t('trucksLine3')}</span>
              </h2>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-zinc-500">{t('trucksSubtitle')}</p>
            </div>
            <Link
              href="/trucks"
              className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-red-600 transition-all hover:translate-x-1 hover:text-orange-600"
            >
              {t('allTrucks')} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <HomeBrandIcons kind="trucks" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featuredTruckRows.map(({ truck, copy }) => {
              const waTruck = whatsappDeepLinkWithText(tCommon('whatsappAskPrefill', { title: copy.title }));
              return showPrice ? (
                <Link
                  href={`/trucks/${truck.id}`}
                  key={truck.id}
                  className="group flex transform-gpu flex-col overflow-hidden rounded-2xl border-4 border-zinc-200 bg-zinc-50 shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-4 hover:rotate-1 hover:border-red-500 hover:shadow-[0_30px_60px_-15px_rgba(220,38,38,0.5)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-zinc-200 bg-black transition-colors group-hover:border-red-500">
                    <Image
                      src={truck.images[0]}
                      alt={copy.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                    />
                    <div className="absolute left-4 top-4 flex gap-2 shadow-xl">
                      <span className="bg-black px-4 py-2 text-sm font-black uppercase tracking-widest text-white">
                        {truck.brand}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-zinc-50 p-8">
                    <h3 className="mb-4 line-clamp-2 font-heading text-2xl font-black leading-tight text-black transition-colors group-hover:text-red-700">
                      {copy.title}
                    </h3>
                    <div className="mb-8 flex flex-wrap gap-x-4 gap-y-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                      <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">{truck.year}</span>
                      <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">
                        {truck.power} {tCommon('powerUnit')}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t-2 border-zinc-200 pt-6 transition-colors group-hover:border-red-200">
                      <span className="font-heading text-3xl font-black text-black drop-shadow-sm">
                        {new Intl.NumberFormat(nl, {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(truck.price)}
                      </span>
                      <span className="rounded-xl bg-black p-3 text-white shadow-[0_4px_0_0_#52525b] transition-all group-hover:bg-red-600 group-hover:shadow-[0_4px_0_0_#7f1d1d] active:translate-y-1 active:shadow-none">
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={truck.id}
                  className="group flex transform-gpu flex-col overflow-hidden rounded-2xl border-4 border-zinc-200 bg-zinc-50 shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-4 hover:rotate-1 hover:border-red-500 hover:shadow-[0_30px_60px_-15px_rgba(220,38,38,0.5)]"
                >
                  <Link
                    href={`/trucks/${truck.id}`}
                    className="flex min-h-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-zinc-200 bg-black transition-colors group-hover:border-red-500">
                      <Image
                        src={truck.images[0]}
                        alt={copy.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                      />
                      <div className="absolute left-4 top-4 flex gap-2 shadow-xl">
                        <span className="bg-black px-4 py-2 text-sm font-black uppercase tracking-widest text-white">
                          {truck.brand}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-zinc-50 p-8">
                      <h3 className="mb-4 line-clamp-2 font-heading text-2xl font-black leading-tight text-black transition-colors group-hover:text-red-700">
                        {copy.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">{truck.year}</span>
                        <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">
                          {truck.power} {tCommon('powerUnit')}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between border-t-2 border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-8 pb-8 pt-6">
                    <a
                      href={waTruck}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-orange-500 to-orange-700 px-5 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_0_0_#9a3412] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none"
                    >
                      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                      {tCommon('askPrice')}
                    </a>
                    <Link
                      href={`/trucks/${truck.id}`}
                      className="rounded-xl bg-black p-3 text-white shadow-[0_4px_0_0_#52525b] transition-all hover:bg-red-600 hover:shadow-[0_4px_0_0_#7f1d1d] active:translate-y-1 active:shadow-none"
                      aria-label={copy.title}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/trucks"
              className="inline-flex items-center gap-3 rounded-xl bg-red-600 px-8 py-5 text-lg font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#7f1d1d] transition-all hover:translate-y-[2px] hover:bg-orange-600 hover:shadow-[0_4px_0_0_#9a3412] active:translate-y-[6px] active:shadow-none"
            >
              {t('allTrucksCta')} <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-emerald-600/50 bg-gradient-to-b from-slate-100 to-slate-200 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end md:mb-16">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                <CarFront className="h-4 w-4" aria-hidden />
                {t('pkwBadge')}
              </div>
              <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 drop-shadow-sm md:text-5xl">
                {t('pkwTitle')} <span className="text-emerald-700">{t('pkwTitleAccent')}</span>
              </h2>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">{t('pkwSubtitle')}</p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-emerald-700 transition hover:translate-x-1 hover:text-emerald-600"
            >
              {t('allPkw')} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <HomeBrandIcons kind="cars" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featuredCarRows.map(({ car, copy }) => {
              const waCar = whatsappDeepLinkWithText(tCommon('whatsappAskPrefill', { title: copy.title }));
              return showPrice ? (
                <Link
                  href={`/cars/${car.id}`}
                  key={car.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:border-emerald-500 hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-slate-200 bg-slate-900 transition group-hover:border-emerald-500">
                    <Image
                      src={car.images[0]}
                      alt={copy.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow-lg">
                        {t('pkwBadge')}
                      </span>
                      <span className="bg-black/75 px-3 py-1 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm">
                        {car.brand}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-slate-50 p-8">
                    <h3 className="mb-4 line-clamp-2 font-heading text-2xl font-black leading-tight text-slate-900 transition group-hover:text-emerald-800">
                      {copy.title}
                    </h3>
                    <div className="mb-8 flex flex-wrap gap-2 text-sm font-bold uppercase tracking-widest text-slate-600">
                      <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{car.year}</span>
                      <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{bodyLabel(car.bodyType)}</span>
                      <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{fuelLabel(car.fuel)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t-2 border-slate-200 pt-6 transition group-hover:border-emerald-200">
                      <span className="font-heading text-3xl font-black text-slate-900">
                        {new Intl.NumberFormat(nl, {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(car.price)}
                      </span>
                      <span className="rounded-xl bg-slate-900 p-3 text-white shadow-[0_4px_0_0_#334155] transition group-hover:bg-emerald-600 group-hover:shadow-[0_4px_0_0_#065f46] active:translate-y-1 active:shadow-none">
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={car.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:border-emerald-500 hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]"
                >
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex min-h-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-slate-200 bg-slate-900 transition group-hover:border-emerald-500">
                      <Image
                        src={car.images[0]}
                        alt={copy.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute left-4 top-4 flex gap-2">
                        <span className="bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow-lg">
                          {t('pkwBadge')}
                        </span>
                        <span className="bg-black/75 px-3 py-1 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm">
                          {car.brand}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-slate-50 p-8">
                      <h3 className="mb-4 line-clamp-2 font-heading text-2xl font-black leading-tight text-slate-900 transition group-hover:text-emerald-800">
                        {copy.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-widest text-slate-600">
                        <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{car.year}</span>
                        <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{bodyLabel(car.bodyType)}</span>
                        <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{fuelLabel(car.fuel)}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between border-t-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 px-8 pb-8 pt-6">
                    <a
                      href={waCar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_0_0_#065f46] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none"
                    >
                      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                      {tCommon('askPrice')}
                    </a>
                    <Link
                      href={`/cars/${car.id}`}
                      className="rounded-xl bg-slate-900 p-3 text-white shadow-[0_4px_0_0_#334155] transition group-hover:bg-emerald-600 group-hover:shadow-[0_4px_0_0_#065f46] active:translate-y-1 active:shadow-none"
                      aria-label={copy.title}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/cars"
              className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-5 text-lg font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#065f46] transition hover:translate-y-[2px] hover:bg-emerald-500 hover:shadow-[0_4px_0_0_#047857] active:translate-y-[6px] active:shadow-none"
            >
              {t('allPkwCta')} <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      <HomeHighlightCards />

      <section className="relative overflow-hidden bg-black py-32 text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="perspective-1000">
              <div className="relative aspect-square transform-gpu rounded-3xl border-2 border-zinc-800 bg-gradient-to-tr from-zinc-900 to-zinc-800 p-4 shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-transform duration-700 rotate-y-6 hover:rotate-y-0">
                <Image
                  src="https://twfik.com/pics/doen.webp"
                  alt={t('valueBlockImageAlt')}
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>

            <div className="lg:pl-10">
              <h2 className="mb-8 font-heading text-4xl font-black leading-[1.1] tracking-tighter text-white md:text-6xl">
                {t('valueHeading')}{' '}
                <span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">
                  {t('valueHighlight')}
                </span>{' '}
                {t('valueRest')}
              </h2>
              <ul className="space-y-8">
                {valueItems.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-inner"
                  >
                    <div className="rounded-lg bg-gradient-to-br from-red-600 to-orange-600 p-3 shadow-[0_4px_10px_rgba(220,38,38,0.5)]">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
