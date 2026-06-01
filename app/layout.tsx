import type { ReactNode } from 'react';
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from 'next/font/google';
import { HOME_LOADER_INIT_SCRIPT } from '@/lib/home-loader';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['400', '600', '700'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${space.variable} ${notoArabic.variable} scroll-smooth`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HOME_LOADER_INIT_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-zinc-100 font-sans text-zinc-900 antialiased selection:bg-orange-500 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
