import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeLoader from '@/components/HomeLoader';
import DocumentLang from '@/components/DocumentLang';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/site-url';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: getSiteUrl(),
    title: {
      default: t('title'),
      template: `%s`,
    },
    description: t('description'),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLang locale={locale} />
      <HomeLoader />
      <Navbar />
      <main id="site-main" className="flex-1 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
