import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { CarFront, ArrowRight, Fuel } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCars } from '@/lib/products';
import { numberLocale } from '@/lib/locale-format';
import { getLocalizedCar } from '@/lib/vehicle-i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return {
    title: t('carsTitle'),
    description: t('carsDescription'),
  };
}

export default async function CarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Cars');
  const tTrucks = await getTranslations('Trucks');
  const tEnum = await getTranslations('VehicleEnums');
  const tCommon = await getTranslations('Common');
  const nl = numberLocale(locale);
  const cars = await getCars(locale);

  const label = (group: 'bodyType' | 'fuel', value: string) =>
    tEnum(`${group}.${value}` as 'bodyType.Limousine');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b-4 border-emerald-600 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 flex justify-center">
            <CarFront className="h-14 w-14 text-emerald-400" aria-hidden />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-400">{t('eyebrow')}</p>
          <h1 className="mt-3 font-heading text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            {t('titleLine')} <span className="text-emerald-400">{t('titleAccent')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-slate-300">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <p className="text-sm font-black uppercase tracking-widest text-slate-500">
            <span className="text-slate-900">{cars.length}</span> {t('count')}
          </p>
          <Link
            href="/trucks"
            className="text-sm font-black uppercase tracking-widest text-emerald-700 underline-offset-4 hover:text-emerald-600 hover:underline"
          >
            {t('linkTrucks')}
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {await Promise.all(
            cars.map(async (car) => {
              const copy = await getLocalizedCar(locale, car);
              const condLabel = car.condition === 'Neu' ? tTrucks('new') : tTrucks('used');
              return (
                <li key={car.id}>
                  <Link
                    href={`/cars/${car.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition hover:border-emerald-500 hover:shadow-[0_20px_45px_rgba(16,185,129,0.15)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                      <Image
                        src={car.images[0]}
                        alt={copy.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className="bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                          {t('badge')}
                        </span>
                        <span className="bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                          {condLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-heading text-xl font-black leading-snug text-slate-900 group-hover:text-emerald-800">
                        {copy.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-800">{car.year}</span>
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-800">
                          {car.mileage.toLocaleString(nl)} {tCommon('km')}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-800">
                          {car.power} {tCommon('powerUnit')}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-slate-800">
                          <Fuel className="h-3 w-3" aria-hidden />
                          {label('fuel', car.fuel)}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-800">{label('bodyType', car.bodyType)}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="font-heading text-2xl font-black text-slate-900">
                          {new Intl.NumberFormat(nl, {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(car.price)}
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition group-hover:bg-emerald-600">
                          <ArrowRight className="h-5 w-5" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            }),
          )}
        </ul>
      </div>
    </div>
  );
}
