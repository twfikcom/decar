import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import TrucksSearchClient from './TrucksSearchClient';

export default async function TrucksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 font-bold uppercase tracking-widest text-zinc-500">
          {t('loading')}
        </div>
      }
    >
      <TrucksSearchClient />
    </Suspense>
  );
}
