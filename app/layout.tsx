import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from 'next/font/google';
import { routing } from '@/i18n/routing';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['400', '600', '700'],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') ?? routing.defaultLocale;
  const isRtl = locale === 'ar';
  const htmlClass = `${inter.variable} ${space.variable} ${notoArabic.variable} scroll-smooth`;
  const bodyClass = [
    'flex min-h-screen flex-col text-zinc-900 bg-zinc-100 antialiased selection:bg-orange-500 selection:text-white',
    isRtl ? 'font-[family-name:var(--font-arabic),sans-serif]' : 'font-sans',
  ].join(' ');

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={htmlClass} suppressHydrationWarning>
      <body className={bodyClass} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
