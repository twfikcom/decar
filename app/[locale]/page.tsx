import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight, CheckCircle, CarFront, MessageCircle, Package } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { withSeo } from '@/lib/seo';
import { getFeaturedCars, getFeaturedParts, getFeaturedTrucks } from '@/lib/products';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedCar, getLocalizedTruck } from '@/lib/vehicle-i18n';
import HeroSlider from '@/components/HeroSlider';
import HeroTextAnimation from '@/components/HeroTextAnimation';
import HomeCategoryStrip from '@/components/HomeCategoryStrip';
import HomeHighlightCards from '@/components/HomeHighlightCards';
import HomeBrandIcons from '@/components/HomeBrandIcons';
import { showPublicPrices, whatsappDeepLinkWithText } from '@/lib/public-pricing';

function excerptFromHtml(html: string, max = 140): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Shared card + section CTA buttons (PKW section style) on the homepage. */
const homeAskPriceBtn =
  'inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-orange-500 to-orange-700 px-2.5 py-2 text-[10px] font-black uppercase leading-tight tracking-wide text-white shadow-[0_4px_0_0_#9a3412] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm sm:tracking-widest';

const homeCardArrowBtn =
  'shrink-0 rounded-xl bg-slate-900 p-2.5 text-white shadow-[0_4px_0_0_#334155] transition group-hover:bg-red-600 group-hover:shadow-[0_4px_0_0_#7f1d1d] active:translate-y-1 active:shadow-none sm:p-3';

const homeSectionCtaBtn =
  'inline-flex max-w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-black uppercase leading-tight tracking-wide text-white shadow-[0_6px_0_0_#7f1d1d] transition hover:translate-y-[2px] hover:bg-orange-600 hover:shadow-[0_4px_0_0_#9a3412] active:translate-y-[6px] active:shadow-none sm:gap-3 sm:px-8 sm:py-5 sm:text-lg sm:tracking-widest';

/** Mobile type scale aligned with Hero (badge 11px, h1 3xl, body base, btn sm). */
const homeSectionTitle = 'font-heading text-2xl font-black tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl';
const homeSectionSubtitle = 'mt-2 text-xs font-bold uppercase tracking-wider text-zinc-500 sm:text-sm sm:tracking-widest';
const homeSectionNavLink =
  'inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide transition sm:gap-2 sm:text-sm sm:tracking-widest';
const homeCardBody = 'flex flex-1 flex-col bg-gradient-to-b from-white to-zinc-50 p-5 sm:p-8';
const homeCardBodySlate = 'flex flex-1 flex-col bg-gradient-to-b from-white to-slate-50 p-5 sm:p-8';
const homeCardExcerpt = 'line-clamp-3 text-sm font-semibold leading-relaxed sm:text-base';
const homeCardTitle =
  'mb-3 line-clamp-2 font-heading text-lg font-black leading-tight sm:mb-4 sm:text-2xl';
const homeCardTags =
  'flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider sm:gap-x-4 sm:gap-y-3 sm:text-sm sm:tracking-widest';
const homeBrandBadge =
  'font-black uppercase tracking-wider text-white sm:tracking-widest';
const homeBrandBadgeTruck = `bg-black px-2.5 py-1 text-xs ${homeBrandBadge} sm:px-4 sm:py-2 sm:text-sm`;
const homeBrandBadgeCar = `bg-orange-600 px-2.5 py-1 text-xs ${homeBrandBadge} shadow-lg sm:px-3 sm:py-1 sm:text-xs`;
const homeCardPrice = 'font-heading text-xl font-black drop-shadow-sm sm:text-3xl';
const homeEyebrowBadge =
  'mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return withSeo(locale, '', {
    title: t('title'),
    description: t('description'),
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tEnum = await getTranslations('VehicleEnums');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);
  const featuredTrucks = await getFeaturedTrucks(locale, 3);
  const featuredCars = await getFeaturedCars(locale, 3);
  const featuredParts = await getFeaturedParts(locale, 3);
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
      <section className="relative flex w-full flex-col overflow-hidden border-b-[8px] border-orange-600 bg-black sm:min-h-[min(100dvh,920px)]">
        <HeroSlider />
        <div className="relative z-20 flex flex-col justify-start px-4 pb-10 pt-16 max-sm:flex-none sm:flex-1 sm:justify-center sm:px-6 sm:py-24 md:py-32 lg:px-8">
          <div className="mx-auto w-full max-w-7xl transform-gpu">
            <HeroTextAnimation />
          </div>
        </div>
      </section>

      <HomeCategoryStrip />

      <section className="border-y-4 border-orange-600/40 bg-gradient-to-b from-slate-100 to-slate-200 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:gap-6 sm:flex-row sm:items-end md:mb-16">
            <div>
              <h2 className={`text-slate-900 ${homeSectionTitle}`}>
                <span className="text-slate-900">{t('trucksLine1')}</span>{' '}
                <span className="text-red-600">{t('trucksLine2')}</span>{' '}
                <span className="text-zinc-500">{t('trucksLine3')}</span>
              </h2>
              <p className={`${homeSectionSubtitle} text-slate-500`}>{t('trucksSubtitle')}</p>
            </div>
            <Link
              href="/trucks"
              className={`text-red-600 hover:translate-x-1 hover:text-orange-600 ${homeSectionNavLink}`}
            >
              {t('allTrucks')} <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            </Link>
          </div>

          <HomeBrandIcons kind="trucks" />

          <div className="grid grid-cols-1 gap-6 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
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
                      <span className={homeBrandBadgeTruck}>{truck.brand}</span>
                    </div>
                  </div>

                  <div className={homeCardBody}>
                    <h3 className={`text-black transition-colors group-hover:text-red-700 ${homeCardTitle}`}>
                      {copy.title}
                    </h3>
                    <div className={`mb-6 text-zinc-500 sm:mb-8 ${homeCardTags}`}>
                      <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">{truck.year}</span>
                      <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">
                        {truck.power} {tCommon('powerUnit')}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t-2 border-zinc-200 pt-4 transition-colors group-hover:border-red-200 sm:pt-6">
                      <span className={`text-black ${homeCardPrice}`}>
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
                        <span className={homeBrandBadgeTruck}>{truck.brand}</span>
                      </div>
                    </div>

                    <div className={homeCardBody}>
                      <h3 className={`text-black transition-colors group-hover:text-red-700 ${homeCardTitle}`}>
                        {copy.title}
                      </h3>
                      <div className={`text-zinc-500 ${homeCardTags}`}>
                        <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">{truck.year}</span>
                        <span className="rounded-sm bg-zinc-200 px-3 py-1 text-black">
                          {truck.power} {tCommon('powerUnit')}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-2 border-t-2 border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
                    <a
                      href={waTruck}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={homeAskPriceBtn}
                    >
                      <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      {tCommon('askPrice')}
                    </a>
                    <Link
                      href={`/trucks/${truck.id}`}
                      className={homeCardArrowBtn}
                      aria-label={copy.title}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center sm:mt-16">
            <Link href="/trucks" className={homeSectionCtaBtn}>
              {t('allTrucksCta')} <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-orange-600/40 bg-gradient-to-b from-slate-100 to-slate-200 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:gap-6 sm:flex-row sm:items-end md:mb-16">
            <div>
              <div className={`border-orange-600/40 bg-orange-50 text-orange-900 ${homeEyebrowBadge}`}>
                <CarFront className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                {t('pkwBadge')}
              </div>
              <h2 className={`text-slate-900 ${homeSectionTitle}`}>
                {t('pkwTitle')} <span className="text-orange-600">{t('pkwTitleAccent')}</span>
              </h2>
              <p className={`${homeSectionSubtitle} text-slate-500`}>{t('pkwSubtitle')}</p>
            </div>
            <Link
              href="/cars"
              className={`text-red-600 hover:translate-x-1 hover:text-orange-600 ${homeSectionNavLink}`}
            >
              {t('allPkw')} <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            </Link>
          </div>

          <HomeBrandIcons kind="cars" />

          <div className="grid grid-cols-1 gap-6 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featuredCarRows.map(({ car, copy }) => {
              const waCar = whatsappDeepLinkWithText(tCommon('whatsappAskPrefill', { title: copy.title }));
              return showPrice ? (
                <Link
                  href={`/cars/${car.id}`}
                  key={car.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:border-orange-500 hover:shadow-[0_24px_50px_rgba(234,88,12,0.18)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-slate-200 bg-slate-900 transition group-hover:border-orange-500">
                    <Image
                      src={car.images[0]}
                      alt={copy.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className={homeBrandBadgeCar}>{t('pkwBadge')}</span>
                      <span className="bg-black/75 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white backdrop-blur-sm sm:px-3 sm:tracking-widest">
                        {car.brand}
                      </span>
                    </div>
                  </div>
                  <div className={homeCardBodySlate}>
                    <h3 className={`text-slate-900 transition group-hover:text-orange-800 ${homeCardTitle}`}>
                      {copy.title}
                    </h3>
                    <div className={`mb-6 text-slate-600 sm:mb-8 ${homeCardTags}`}>
                      <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{car.year}</span>
                      <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{bodyLabel(car.bodyType)}</span>
                      <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{fuelLabel(car.fuel)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t-2 border-slate-200 pt-4 transition group-hover:border-orange-200 sm:pt-6">
                      <span className={`text-slate-900 ${homeCardPrice}`}>
                        {new Intl.NumberFormat(nl, {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(car.price)}
                      </span>
                      <span className="rounded-xl bg-slate-900 p-3 text-white shadow-[0_4px_0_0_#334155] transition group-hover:bg-red-600 group-hover:shadow-[0_4px_0_0_#7f1d1d] active:translate-y-1 active:shadow-none">
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={car.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:border-orange-500 hover:shadow-[0_24px_50px_rgba(234,88,12,0.18)]"
                >
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex min-h-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-slate-200 bg-slate-900 transition group-hover:border-orange-500">
                      <Image
                        src={car.images[0]}
                        alt={copy.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute left-4 top-4 flex gap-2">
                        <span className={homeBrandBadgeCar}>{t('pkwBadge')}</span>
                        <span className="bg-black/75 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white backdrop-blur-sm sm:px-3 sm:tracking-widest">
                          {car.brand}
                        </span>
                      </div>
                    </div>
                    <div className={homeCardBodySlate}>
                      <h3 className={`text-slate-900 transition group-hover:text-orange-800 ${homeCardTitle}`}>
                        {copy.title}
                      </h3>
                      <div className={`text-slate-600 ${homeCardTags}`}>
                        <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{car.year}</span>
                        <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{bodyLabel(car.bodyType)}</span>
                        <span className="rounded-sm bg-slate-200 px-3 py-1 text-slate-900">{fuelLabel(car.fuel)}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-2 border-t-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
                    <a href={waCar} target="_blank" rel="noopener noreferrer" className={homeAskPriceBtn}>
                      <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      {tCommon('askPrice')}
                    </a>
                    <Link href={`/cars/${car.id}`} className={homeCardArrowBtn} aria-label={copy.title}>
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center sm:mt-16">
            <Link href="/cars" className={homeSectionCtaBtn}>
              {t('allPkwCta')} <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-orange-600/40 bg-gradient-to-b from-slate-100 to-slate-200 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:gap-6 sm:flex-row sm:items-end md:mb-16">
            <div>
              <div className={`border-orange-600/40 bg-orange-50 text-orange-900 ${homeEyebrowBadge}`}>
                <Package className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                {t('partsBadge')}
              </div>
              <h2 className={`text-slate-900 ${homeSectionTitle}`}>
                {t('partsTitle')} <span className="text-orange-600">{t('partsTitleAccent')}</span>
              </h2>
              <p className={`${homeSectionSubtitle} text-slate-500`}>{t('partsSubtitle')}</p>
            </div>
            <Link
              href="/parts"
              className={`text-red-600 hover:translate-x-1 hover:text-orange-600 ${homeSectionNavLink}`}
            >
              {t('allParts')} <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            </Link>
          </div>

          {featuredParts.length === 0 ? (
            <p className="mb-8 text-center text-sm font-bold text-slate-600 sm:mb-10 sm:text-base">{t('partsEmpty')}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
              {featuredParts.map((part) => {
                const waPart = whatsappDeepLinkWithText(tCommon('whatsappAskPrefill', { title: part.title }));
                const excerpt = excerptFromHtml(part.description);
                return (
                  <div
                    key={part.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:border-orange-500 hover:shadow-[0_24px_50px_rgba(234,88,12,0.18)]"
                  >
                    <Link
                      href="/parts"
                      className="flex min-h-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-slate-200 bg-slate-900 transition group-hover:border-orange-500">
                        <Image
                          src={part.imageUrl}
                          alt={part.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-110"
                          unoptimized
                        />
                        <div className="absolute left-4 top-4 flex gap-2">
                          <span className={homeBrandBadgeCar}>{t('partsBadge')}</span>
                        </div>
                      </div>
                      <div className={homeCardBodySlate}>
                        <h3
                          className={`min-w-0 max-w-full break-words text-slate-900 [overflow-wrap:anywhere] transition group-hover:text-orange-800 line-clamp-2 ${homeCardTitle}`}
                        >
                          {part.title}
                        </h3>
                        <p className={`text-slate-600 ${homeCardExcerpt}`}>{excerpt}</p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-2 border-t-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
                      <a href={waPart} target="_blank" rel="noopener noreferrer" className={homeAskPriceBtn}>
                        <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                        {tCommon('askPrice')}
                      </a>
                      <Link href="/parts" className={homeCardArrowBtn} aria-label={t('allParts')}>
                        <ArrowRight className="h-6 w-6" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10 text-center sm:mt-16">
            <Link href="/parts" className={homeSectionCtaBtn}>
              {t('allPartsCta')} <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            </Link>
          </div>
        </div>
      </section>

      <HomeHighlightCards />

      <section className="relative overflow-hidden bg-black py-16 text-white sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 sm:gap-16 lg:grid-cols-2">
            <div className="perspective-1000">
              <div className="relative aspect-square transform-gpu rounded-3xl border-2 border-zinc-800 bg-gradient-to-tr from-zinc-900 to-zinc-800 p-4 shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-transform duration-700 rotate-y-6 hover:rotate-y-0">
                <Image
                  src="/b38).png"
                  alt={t('valueBlockImageAlt')}
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>

            <div className="lg:pl-10">
              <h2 className="mb-6 font-heading text-2xl font-black leading-[1.1] tracking-tighter text-white sm:mb-8 sm:text-4xl md:text-6xl">
                {t('valueHeading')}{' '}
                <span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">
                  {t('valueHighlight')}
                </span>{' '}
                {t('valueRest')}
              </h2>
              <ul className="space-y-4 sm:space-y-8">
                {valueItems.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-inner sm:gap-6 sm:p-6"
                  >
                    <div className="rounded-lg bg-gradient-to-br from-red-600 to-orange-600 p-2 shadow-[0_4px_10px_rgba(220,38,38,0.5)] sm:p-3">
                      <CheckCircle className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                    </div>
                    <span className="text-base font-bold text-white sm:text-lg">{feature}</span>
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
