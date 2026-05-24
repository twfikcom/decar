import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MessageCircle, Check, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedTruck } from '@/lib/vehicle-i18n';
import { getTruckById } from '@/lib/products';
import { normalizeTruckForPage } from '@/lib/inventory-normalize';
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
  const truck = await getTruckById(locale, id);
  if (!truck) return {};
  setRequestLocale(locale);
  const truckNorm = normalizeTruckForPage(truck);
  const copy = await getLocalizedTruck(locale, truckNorm);
  const tMeta = await getTranslations({ locale, namespace: 'PageMeta' });
  return withSeo(locale, `trucks/${id}`, {
    title: `${copy.title} ${tMeta('titleSuffix')}`,
    description: String(copy.description ?? '').slice(0, 160),
  });
}

export default async function TruckDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const truck = await getTruckById(locale, id);

  if (!truck) {
    notFound();
  }

  const truckNorm = normalizeTruckForPage(truck);
  const copy = await getLocalizedTruck(locale, truckNorm);
  const t = await getTranslations('TruckDetail');
  const tEnum = await getTranslations('VehicleEnums');
  const tTrucks = await getTranslations('Trucks');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);
  const showPrice = showPublicPrices();

  const priceStr = new Intl.NumberFormat(nl, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(truckNorm.price);

  const whatsappPlain = showPrice
    ? t('whatsappPrefill', { title: copy.title, price: priceStr })
    : tCommon('whatsappAskPrefill', { title: copy.title });
  const whatsappLink = whatsappDeepLinkWithText(whatsappPlain);

  const condLabel = truckNorm.condition === 'Neu' ? tTrucks('new') : tTrucks('used');
  const categoryLabel = tEnum(`truckCategory.${truckNorm.category}` as 'truckCategory.Sattelzugmaschine');

  return (
    <div className="min-h-screen bg-zinc-100 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/trucks"
          className="mb-10 inline-flex items-center font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="mr-3 h-5 w-5" /> {t('back')}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2 lg:row-start-1">
            <div className="rounded-3xl border-4 border-zinc-200 bg-white p-4 shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
              <div className="relative">
                <VehicleGallery
                  images={truckNorm.images}
                  alt={copy.title}
                  thumbAlts={truckNorm.images.map((_, i) => t('thumbImageAlt', { title: copy.title, n: i + 1 }))}
                />
                <div className="pointer-events-none absolute left-6 top-6 flex gap-2">
                  <span className="rounded-lg border border-red-500 bg-red-600 px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_10px_rgba(220,38,38,0.5)]">
                    {condLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:self-start">
            <div className="transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] md:p-10 lg:sticky lg:top-40">
              <div className="mb-4">
                <span className="mb-4 inline-block rounded-md bg-black px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                  {truckNorm.brand}
                </span>
              </div>

              <h1 className="mb-6 font-heading text-3xl font-black leading-tight text-black drop-shadow-sm md:text-4xl">
                {copy.title}
              </h1>

              <div className="mb-10 border-b-4 border-zinc-100 pb-8">
                {showPrice ? (
                  <>
                    <div className="mb-2 font-heading text-4xl font-black text-red-600 drop-shadow-sm lg:text-5xl">{priceStr}</div>
                    <span className="block text-sm font-black uppercase tracking-widest text-zinc-400">{t('vat')}</span>
                  </>
                ) : (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full transform-gpu items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-orange-500 to-orange-700 py-5 font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#9a3412] transition-all hover:brightness-105 active:translate-y-[8px] active:shadow-transparent"
                  >
                    <MessageCircle className="h-6 w-6" aria-hidden />
                    {tCommon('askPrice')}
                  </a>
                )}
              </div>

              <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('model')}</p>
                  <p className="font-black text-lg text-black">{truckNorm.model}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('firstReg')}</p>
                  <p className="font-black text-lg text-black">{truckNorm.year}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('mileage')}</p>
                  <p className="font-black text-lg text-black">
                    {truckNorm.mileage.toLocaleString(nl)} {tCommon('km')}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('power')}</p>
                  <p className="font-black text-lg text-black">
                    {truckNorm.power} {tCommon('powerUnit')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('body')}</p>
                  <p className="font-black text-lg text-black">{categoryLabel}</p>
                </div>
              </div>

              <div className="space-y-6">
                {showPrice ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full transform-gpu items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-orange-500 to-orange-700 py-5 font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#9a3412] transition-all active:translate-y-[8px] active:shadow-transparent"
                  >
                    <MessageCircle className="h-6 w-6" aria-hidden /> {t('whatsapp')}
                  </a>
                ) : null}

                <Link
                  href="/contact"
                  className="flex w-full transform-gpu flex-col items-center justify-center gap-0 rounded-xl bg-black px-2 py-4 text-center text-sm font-black uppercase leading-snug tracking-wide text-white shadow-[0_8px_0_0_#3f3f46] transition-all hover:bg-zinc-800 active:translate-y-[8px] active:shadow-transparent max-lg:min-h-[3.25rem] max-lg:whitespace-pre-line max-lg:text-[0.7rem] max-lg:leading-tight lg:flex-row lg:gap-3 lg:whitespace-normal lg:py-5 lg:text-base lg:tracking-widest"
                >
                  {t('emailRequest')}
                </Link>

                <div className="border-t-2 border-zinc-100 pt-6 text-center">
                  <a
                    href="tel:+491625330280"
                    className="inline-flex items-center gap-3 text-xl font-black text-red-600 transition-colors hover:text-orange-600"
                  >
                    <Phone className="h-6 w-6" /> +49 162 5330280
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
            <VehicleVideo
              videoUrl={truckNorm.videoUrl}
              title={copy.title}
              heading={t('videoTitle')}
              placeholder={t('videoPlaceholder')}
            />
          </div>

          <div className="rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] md:p-12 lg:col-span-2 lg:col-start-1 lg:row-start-3">
            <h2 className="mb-6 font-heading text-3xl font-black text-black">{t('description')}</h2>
            <p className="mb-12 max-w-none text-lg font-medium leading-relaxed text-zinc-600">{copy.description}</p>

            <h2 className="mb-8 border-b-4 border-zinc-100 pb-4 font-heading text-3xl font-black text-black">
              {t('featuresTitle')}
            </h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {copy.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 rounded-xl border-2 border-zinc-100 bg-zinc-50 p-4 text-lg font-bold text-black shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <Check className="h-5 w-5 text-red-600" />
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
