import type { ReactNode } from 'react';
import Script from 'next/script';
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from 'next/font/google';
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
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-zinc-100 font-sans text-zinc-900 antialiased selection:bg-orange-500 selection:text-white"
      >
        <Script id="home-loader-init" strategy="beforeInteractive">
          {`(function(){try{var p=location.pathname.replace(/\\/$/,'')||'/';var home=p==='/'||p==='/en'||p==='/ar';if(home&&!sessionStorage.getItem('appLoaded')){document.documentElement.classList.add('home-loader-active');}}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
