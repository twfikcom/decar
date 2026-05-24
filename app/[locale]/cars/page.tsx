import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCars } from '@/lib/products';
import CarsSearchClient from './CarsSearchClient';
import { withSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return withSeo(locale, 'cars', {
    title: t('carsTitle'),
    description: t('carsDescription'),
  });
}

export default async function CarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cars = await getCars(locale);

  return <CarsSearchClient key={locale} cars={cars} />;
}
