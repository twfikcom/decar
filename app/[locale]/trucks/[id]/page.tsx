import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trucks } from '@/lib/mock-data';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MessageCircle, Check, Phone, Video } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedTruck } from '@/lib/vehicle-i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const truck = trucks.find((x) => x.id === id);
  if (!truck) return {};
  setRequestLocale(locale);
  const copy = await getLocalizedTruck(locale, truck);
  const tMeta = await getTranslations({ locale, namespace: 'PageMeta' });
  return {
    title: `${copy.title} ${tMeta('titleSuffix')}`,
    description: copy.description.slice(0, 160),
  };
}

export default async function TruckDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const truck = trucks.find((x) => x.id === id);

  if (!truck) {
    notFound();
  }

  const copy = await getLocalizedTruck(locale, truck);
  const t = await getTranslations('TruckDetail');
  const tEnum = await getTranslations('VehicleEnums');
  const tTrucks = await getTranslations('Trucks');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);

  const priceStr = new Intl.NumberFormat(nl, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(truck.price);

  const whatsappMessage = encodeURIComponent(t('whatsappPrefill', { title: copy.title, price: priceStr }));
  const whatsappLink = `https://wa.me/201027266627?text=${whatsappMessage}`;

  const condLabel = truck.condition === 'Neu' ? tTrucks('new') : tTrucks('used');
  const categoryLabel = tEnum(`truckCategory.${truck.category}` as 'truckCategory.Sattelzugmaschine');

  return (
    <div className="min-h-screen bg-zinc-100 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/trucks"
          className="mb-10 inline-flex items-center font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="mr-3 h-5 w-5" /> {t('back')}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div className="rounded-3xl border-4 border-zinc-200 bg-white p-4 shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
                <Image src={truck.images[0]} alt={copy.title} fill className="object-cover" priority />
                <div className="absolute left-6 top-6 flex gap-2">
                  <span className="rounded-lg border border-red-500 bg-red-600 px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_10px_rgba(220,38,38,0.5)]">
                    {condLabel}
                  </span>
                </div>
              </div>
              <div className="custom-scrollbar flex gap-4 overflow-x-auto px-2 pb-4">
                {truck.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative h-24 w-40 shrink-0 cursor-pointer overflow-hidden rounded-xl border-4 shadow-sm transition-all ${
                      idx === 0 ? 'border-orange-500 hover:scale-105' : 'border-zinc-200 hover:scale-105 hover:border-orange-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={t('thumbImageAlt', { title: copy.title, n: idx + 1 })}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] md:p-12">
              <h2 className="mb-8 flex items-center gap-3 border-b-4 border-zinc-100 pb-4 font-heading text-3xl font-black text-black">
                <Video className="h-8 w-8 text-red-600 drop-shadow-md" /> {t('videoTitle')}
              </h2>
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-black bg-zinc-900 shadow-inner">
                <div className="text-center text-zinc-500">
                  <Video className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <p className="font-bold uppercase tracking-widest">{t('videoPlaceholder')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] md:p-12">
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

          <div className="lg:col-span-1">
            <div className="sticky top-40 transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] md:p-10">
              <div className="mb-4">
                <span className="mb-4 inline-block rounded-md bg-black px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                  {truck.brand}
                </span>
              </div>

              <h1 className="mb-6 font-heading text-3xl font-black leading-tight text-black drop-shadow-sm md:text-4xl">
                {copy.title}
              </h1>

              <div className="mb-10 border-b-4 border-zinc-100 pb-8">
                <div className="mb-2 font-heading text-4xl font-black text-red-600 drop-shadow-sm lg:text-5xl">{priceStr}</div>
                <span className="block text-sm font-black uppercase tracking-widest text-zinc-400">{t('vat')}</span>
              </div>

              <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('model')}</p>
                  <p className="font-black text-lg text-black">{truck.model}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('firstReg')}</p>
                  <p className="font-black text-lg text-black">{truck.year}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('mileage')}</p>
                  <p className="font-black text-lg text-black">
                    {truck.mileage.toLocaleString(nl)} {tCommon('km')}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('power')}</p>
                  <p className="font-black text-lg text-black">
                    {truck.power} {tCommon('powerUnit')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">{t('body')}</p>
                  <p className="font-black text-lg text-black">{categoryLabel}</p>
                </div>
              </div>

              <div className="space-y-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full transform-gpu items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-orange-500 to-orange-700 py-5 font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#9a3412] transition-all active:translate-y-[8px] active:shadow-transparent"
                >
                  <MessageCircle className="h-6 w-6" /> {t('whatsapp')}
                </a>

                <Link
                  href="/contact"
                  className="flex w-full transform-gpu items-center justify-center gap-3 rounded-xl bg-black py-5 font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#3f3f46] transition-all hover:bg-zinc-800 active:translate-y-[8px] active:shadow-transparent"
                >
                  {t('emailRequest')}
                </Link>

                <div className="border-t-2 border-zinc-100 pt-6 text-center">
                  <a
                    href="tel:+201027266627"
                    className="inline-flex items-center gap-3 text-xl font-black text-red-600 transition-colors hover:text-orange-600"
                  >
                    <Phone className="h-6 w-6" /> +20 102 726 6627
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
