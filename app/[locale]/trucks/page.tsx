import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getTrucks } from '@/lib/products';
import TrucksSearchClient from './TrucksSearchClient';
import { withSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return withSeo(locale, 'trucks', {
    title: t('trucksListTitle'),
    description: t('trucksListDescription'),
  });
}

export default async function TrucksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const trucks = await getTrucks(locale);

  return <TrucksSearchClient key={locale} trucks={trucks} />;
}
