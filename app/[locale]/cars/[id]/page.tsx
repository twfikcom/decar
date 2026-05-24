import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MessageCircle, Check, Phone, Fuel } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedCar } from '@/lib/vehicle-i18n';
import { getCarById } from '@/lib/products';
import { normalizeCarForPage } from '@/lib/inventory-normalize';
import VehicleGallery from '@/components/VehicleGallery';
import VehicleVideo from '@/components/VehicleVideo';

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
  return {
    title: `${copy.title} ${tMeta('titleSuffix')}`,
    description: String(copy.description ?? '').slice(0, 160),
  };
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

  const priceStr = new Intl.NumberFormat(nl, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(carNorm.price);

  const whatsappMessage = encodeURIComponent(t('whatsappPrefill', { title: copy.title, price: priceStr }));
  const whatsappLink = `https://wa.me/491625330280?text=${whatsappMessage}`;

  const bodyLabel = (v: string) => tEnum(`bodyType.${v}` as 'bodyType.Limousine');
  const fuelLabel = (v: string) => tEnum(`fuel.${v}` as 'fuel.Diesel');

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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div className="rounded-3xl border-4 border-slate-200 bg-white p-4 shadow-lg">
              <div className="relative">
                <VehicleGallery
                  images={carNorm.images}
                  alt={copy.title}
                  thumbAlt={(n) => t('thumbImageAlt', { title: copy.title, n })}
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

            <VehicleVideo
              videoUrl={carNorm.videoUrl}
              title={copy.title}
              heading={t('videoTitle')}
              placeholder={t('videoPlaceholder')}
              iconClassName="h-8 w-8 text-emerald-600"
              frameClassName="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-slate-900 bg-slate-900"
            />

            <div className="rounded-3xl border-4 border-slate-200 bg-white p-8 shadow-lg md:p-12">
              <h2 className="mb-4 font-heading text-3xl font-black text-slate-900">{t('description')}</h2>
              <p className="mb-10 text-lg font-medium leading-relaxed text-slate-600">{copy.description}</p>
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

          <div className="lg:col-span-1">
            <div className="sticky top-36 rounded-3xl border-4 border-slate-200 bg-white p-8 shadow-xl md:p-10">
              <span className="mb-3 inline-block rounded-md bg-slate-900 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                {carNorm.brand}
              </span>
              <h1 className="mb-6 font-heading text-3xl font-black leading-tight text-slate-900 md:text-4xl">{copy.title}</h1>
              <div className="mb-8 border-b-4 border-slate-100 pb-8">
                <p className="font-heading text-4xl font-black text-emerald-700 drop-shadow-sm lg:text-5xl">{priceStr}</p>
                <span className="mt-2 block text-xs font-black uppercase tracking-widest text-slate-400">{t('vat')}</span>
              </div>

              <div className="mb-10 grid grid-cols-2 gap-6">
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">{t('model')}</p>
                  <p className="font-black text-lg text-slate-900">{carNorm.model}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">{t('firstReg')}</p>
                  <p className="font-black text-lg text-slate-900">{carNorm.year}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">{t('mileage')}</p>
                  <p className="font-black text-lg text-slate-900">
                    {carNorm.mileage.toLocaleString(nl)} {tCommon('km')}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">{t('power')}</p>
                  <p className="font-black text-lg text-slate-900">
                    {carNorm.power} {tCommon('powerUnit')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">{t('body')}</p>
                  <p className="font-black text-lg text-slate-900">{bodyLabel(carNorm.bodyType)}</p>
                </div>
                <div className="col-span-2">
                  <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <Fuel className="h-3.5 w-3.5" aria-hidden />
                    {t('fuel')}
                  </p>
                  <p className="font-black text-lg text-slate-900">{fuelLabel(carNorm.fuel)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 py-4 font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#065f46] transition active:translate-y-1 active:shadow-none"
                >
                  <MessageCircle className="h-6 w-6" aria-hidden />
                  {t('whatsapp')}
                </a>
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#0f172a] transition hover:bg-slate-800 active:translate-y-1 active:shadow-none"
                >
                  {t('buyRequest')}
                </Link>
                <div className="border-t border-slate-100 pt-6 text-center">
                  <a
                    href="tel:+491625330280"
                    className="inline-flex items-center gap-2 font-black text-emerald-700 transition hover:text-emerald-600"
                  >
                    <Phone className="h-6 w-6" aria-hidden />
                    +49 162 5330280
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
