import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MessageCircle, Check, Phone, Fuel, Cog } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedCar } from '@/lib/vehicle-i18n';
import { getCarById } from '@/lib/products';
import { normalizeCarForPage } from '@/lib/inventory-normalize';
import VehicleGallery from '@/components/VehicleGallery';
import VehicleVideo from '@/components/VehicleVideo';
import { showPublicPrices, whatsappDeepLinkWithText } from '@/lib/public-pricing';
import { withSeo } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const car = await getCarById(locale, id);
  if (!car) return {};
  setRequestLocale(locale);
  const carNorm = normalizeCarForPage(car);
  const copy = await getLocalizedCar(locale, carNorm);
  const tMeta = await getTranslations({ locale, namespace: 'PageMeta' });
  return withSeo(locale, `cars/${id}`, {
    title: `${copy.title} ${tMeta('titleSuffix')}`,
    description: String(copy.description ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160),
  });
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const car = await getCarById(locale, id);

  if (!car) {
    notFound();
  }

  const carNorm = normalizeCarForPage(car);
  const copy = await getLocalizedCar(locale, carNorm);
  const t = await getTranslations('CarDetail');
  const tCars = await getTranslations('Cars');
  const tTrucks = await getTranslations('Trucks');
  const tEnum = await getTranslations('VehicleEnums');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);
  const showPrice = showPublicPrices();

  const priceStr = new Intl.NumberFormat(nl, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(carNorm.price);

  const whatsappPlain = showPrice
    ? t('whatsappPrefill', { title: copy.title, price: priceStr })
    : tCommon('whatsappAskPrefill', { title: copy.title });
  const whatsappLink = whatsappDeepLinkWithText(whatsappPlain);

  const bodyLabel = (v: string) => tEnum(`bodyType.${v}` as 'bodyType.Limousine');
  const fuelLabel = (v: string) => tEnum(`fuel.${v}` as 'fuel.Diesel');
  const transmissionLabel = (v: NonNullable<typeof carNorm.transmission>) =>
    tEnum(`transmission.${v}` as 'transmission.Manual');

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Link
            href="/cars"
            className="inline-flex items-center font-black uppercase tracking-widest text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" aria-hidden />
            {t('backList')}
          </Link>
          <span className="hidden text-slate-300 sm:inline" aria-hidden>
            |
          </span>
          <Link href="/trucks" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-red-600">
            {t('linkTrucks')}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2 lg:row-start-1">
            <div className="rounded-3xl border-4 border-slate-200 bg-white p-4 shadow-lg">
              <div className="relative">
                <VehicleGallery
                  images={carNorm.images}
                  alt={copy.title}
                  thumbAlts={carNorm.images.map((_, i) => t('thumbImageAlt', { title: copy.title, n: i + 1 }))}
                  activeBorderClass="border-emerald-500"
                  idleBorderClass="border-slate-200 hover:border-emerald-300"
                />
                <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
                  <span className="rounded-lg border border-emerald-400 bg-emerald-600 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
                    {tCars('badge')}
                  </span>
                  <span className="rounded-lg bg-black/80 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm">
                    {carNorm.condition === 'Neu' ? tTrucks('new') : tTrucks('used')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:self-start">
            <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border-4 border-slate-200 bg-white p-6 shadow-xl md:p-8 lg:sticky lg:top-36">
              <span className="mb-3 inline-block rounded-md bg-slate-900 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                {carNorm.brand}
              </span>
              <h1 className="mb-4 min-w-0 max-w-full break-words font-heading text-2xl font-black leading-snug text-slate-900 [overflow-wrap:anywhere] md:text-3xl">
                {copy.title}
              </h1>
              <div className="mb-6 border-b-2 border-slate-100 pb-6">
                {showPrice ? (
                  <>
                    <p className="font-heading text-3xl font-black text-emerald-700 lg:text-4xl">{priceStr}</p>
                    <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('vat')}</span>
                  </>
                ) : (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 py-4 font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#065f46] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
                  >
                    <MessageCircle className="h-6 w-6" aria-hidden />
                    {tCommon('askPrice')}
                  </a>
                )}
              </div>

              <dl className="mb-8 grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                  <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('model')}</dt>
                  <dd className="text-base font-bold leading-snug text-slate-900">{carNorm.model}</dd>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                  <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('firstReg')}</dt>
                  <dd className="text-base font-bold leading-snug text-slate-900">{carNorm.year}</dd>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                  <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('mileage')}</dt>
                  <dd className="text-base font-bold leading-snug text-slate-900">
                    {carNorm.mileage.toLocaleString(nl)} {tCommon('km')}
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                  <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('power')}</dt>
                  <dd className="text-base font-bold leading-snug text-slate-900">
                    {carNorm.power} {tCommon('powerUnit')}
                  </dd>
                </div>
                <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                  <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('body')}</dt>
                  <dd className="text-base font-bold leading-snug text-slate-900">{bodyLabel(carNorm.bodyType)}</dd>
                </div>
                <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                  <dt className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Fuel className="h-3 w-3 shrink-0" aria-hidden />
                    {t('fuel')}
                  </dt>
                  <dd className="text-base font-bold leading-snug text-slate-900">{fuelLabel(carNorm.fuel)}</dd>
                </div>
                {carNorm.engine ? (
                  <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                    <dt className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Cog className="h-3 w-3 shrink-0" aria-hidden />
                      {t('engine')}
                    </dt>
                    <dd className="text-base font-bold leading-snug text-slate-900">{carNorm.engine}</dd>
                  </div>
                ) : null}
                {carNorm.transmission ? (
                  <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                    <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t('transmission')}
                    </dt>
                    <dd className="text-base font-bold leading-snug text-slate-900">
                      {transmissionLabel(carNorm.transmission)}
                    </dd>
                  </div>
                ) : null}
                {carNorm.fuelEconomy ? (
                  <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2.5">
                    <dt className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t('fuelEconomy')}
                    </dt>
                    <dd className="text-base font-bold leading-snug text-slate-900">{carNorm.fuelEconomy}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="space-y-4">
                {showPrice ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 py-4 font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#065f46] transition active:translate-y-1 active:shadow-none"
                  >
                    <MessageCircle className="h-6 w-6" aria-hidden />
                    {t('whatsapp')}
                  </a>
                ) : null}

                <Link
                  href="/contact"
                  className="flex w-full flex-col items-center justify-center gap-0 rounded-xl bg-slate-900 px-2 py-4 text-center text-sm font-black uppercase leading-snug tracking-wide text-white shadow-[0_6px_0_0_#0f172a] transition hover:bg-slate-800 active:translate-y-1 active:shadow-none max-lg:min-h-[3.25rem] max-lg:text-[0.7rem] max-lg:leading-tight lg:flex-row lg:gap-2 lg:py-4 lg:text-base lg:tracking-widest"
                >
                  {t('buyRequest')}
                </Link>
                <div className="border-t border-slate-100 pt-5 text-center">
                  <a
                    href="tel:+491625330280"
                    className="inline-flex items-center gap-2 text-base font-bold text-emerald-700 transition hover:text-emerald-600 sm:text-lg"
                  >
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    +49 162 5330280
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
            <VehicleVideo
              videoUrl={carNorm.videoUrl}
              title={copy.title}
              heading={t('videoTitle')}
              placeholder={t('videoPlaceholder')}
              iconClassName="h-8 w-8 text-emerald-600"
              frameClassName="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-slate-900 bg-slate-900"
            />
          </div>

          <div className="rounded-3xl border-4 border-slate-200 bg-white p-8 shadow-lg md:p-12 lg:col-span-2 lg:col-start-1 lg:row-start-3">
            <h2 className="mb-4 font-heading text-3xl font-black text-slate-900">{t('description')}</h2>
            <div
              className="prose prose-slate mb-10 max-w-none text-lg leading-relaxed text-slate-600 prose-headings:font-heading prose-headings:font-black prose-p:font-medium prose-a:text-orange-600 prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: copy.description }}
            />
            <h2 className="mb-6 border-b-4 border-slate-100 pb-4 font-heading text-3xl font-black text-slate-900">
              {t('featuresTitle')}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {copy.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border-2 border-slate-100 bg-slate-50 p-4 font-bold text-slate-900"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-700" aria-hidden />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
