import { setRequestLocale } from 'next-intl/server';
import { getTrucks } from '@/lib/products';
import TrucksSearchClient from './TrucksSearchClient';

export const dynamic = 'force-dynamic';

export default async function TrucksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const trucks = await getTrucks(locale);

  return <TrucksSearchClient key={locale} trucks={trucks} />;
}
