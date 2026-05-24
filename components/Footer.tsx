import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import SocialLinks from '@/components/SocialLinks';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export default async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="bg-black text-zinc-300 py-16 md:py-24 border-t-[8px] border-red-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-red-900/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-6 inline-block">
              <div className="relative h-12 w-[220px] md:h-14 md:w-[280px] lg:h-16 lg:w-[320px]">
                <Image
                  src={SITE_LOGO_URL}
                  alt={t('logoAlt')}
                  fill
                  unoptimized
                  quality={100}
                  className="object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:high-quality]"
                  sizes="(max-width: 768px) 480px, 640px"
                />
              </div>
            </Link>

            <p className="text-zinc-400 max-w-md text-lg leading-relaxed mb-8 font-medium">{t('tagline')}</p>
            <SocialLinks
              labels={{
                facebook: t('facebook'),
                instagram: t('instagram'),
                x: t('x'),
              }}
            />
          </div>

          <div>
            <h4 className="text-white font-black text-xl mb-6 uppercase tracking-wider">{t('navTitle')}</h4>
            <ul className="space-y-4 text-base font-bold text-zinc-400">
              <li>
                <Link href="/" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/trucks" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('trucks')}
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('cars')}
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('service')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xl mb-6 uppercase tracking-wider">{t('legalTitle')}</h4>
            <ul className="space-y-4 text-base font-bold text-zinc-400">
              <li>
                <a href="/impressum" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('impressum')}
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('datenschutz')}
                </a>
              </li>
              <li>
                <a href="/agb" className="hover:text-orange-500 hover:pl-2 transition-all flex items-center">
                  {t('agb')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t-2 border-zinc-900 pt-8">
          <p className="text-center text-sm font-bold tracking-widest text-zinc-500 md:text-start">
            © {new Date().getFullYear()} {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
