import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getCars } from '@/lib/products';
import CarsSearchClient from './CarsSearchClient';

export const dynamic = 'force-dynamic';

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
  const cars = await getCars(locale);
  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 font-bold uppercase tracking-widest text-slate-500">
          {t('loading')}
        </div>
      }
    >
      <CarsSearchClient key={locale} cars={cars} />
    </Suspense>
  );
}
