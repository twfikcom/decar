import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTrucks } from '@/lib/products';
import TrucksSearchClient from './TrucksSearchClient';

export default async function TrucksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const trucks = await getTrucks(locale);
  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 font-bold uppercase tracking-widest text-zinc-500">
          {t('loading')}
        </div>
      }
    >
      <TrucksSearchClient trucks={trucks} />
    </Suspense>
  );
}
