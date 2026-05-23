import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeLoader from '@/components/HomeLoader';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['400', '600', '700'],
});

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
    title: t('title'),
    description: t('description'),
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
  const isRtl = locale === 'ar';
  const htmlClass = `${inter.variable} ${space.variable} ${notoArabic.variable} scroll-smooth`;
  const bodyClass = [
    'flex min-h-screen flex-col text-zinc-900 bg-zinc-100 antialiased selection:bg-orange-500 selection:text-white',
    isRtl ? 'font-[family-name:var(--font-arabic),sans-serif]' : 'font-sans',
  ].join(' ');

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={htmlClass} suppressHydrationWarning>
      <body className={bodyClass} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <HomeLoader />
          <Navbar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
