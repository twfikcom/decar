'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Menu, X, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SITE_LOGO_URL } from '@/lib/site-logo';
import { HOME_LOADER_DONE_EVENT } from '@/lib/home-loader';

const SCROLL_UP_THRESHOLD = 8;
const SCROLL_TOP_LOCK = 24;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const t = useTranslations('Nav');

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const measure = () => {
      const h = header.offsetHeight;
      setHeaderHeight(h);
      document.documentElement.style.setProperty('--site-navbar-height', `${h}px`);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(header);
    window.addEventListener('resize', measure);
    window.addEventListener(HOME_LOADER_DONE_EVENT, measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener(HOME_LOADER_DONE_EVENT, measure);
    };
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y <= SCROLL_TOP_LOCK) {
        setHeaderVisible(true);
      } else if (delta < -SCROLL_UP_THRESHOLD) {
        setHeaderVisible(true);
      } else if (delta > SCROLL_UP_THRESHOLD) {
        setHeaderVisible(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showHeader = headerVisible || isOpen;

  const links = [
    { labelKey: 'home' as const, href: '/' },
    { labelKey: 'trucks' as const, href: '/trucks' },
    { labelKey: 'cars' as const, href: '/cars' },
    { labelKey: 'parts' as const, href: '/parts' },
    { labelKey: 'service' as const, href: '/service' },
    { labelKey: 'about' as const, href: '/about' },
    { labelKey: 'contact' as const, href: '/contact' },
  ];

  return (
    <>
      <div
        id="site-navbar-spacer"
        className="w-full shrink-0 min-h-[5.5rem] md:min-h-[8.25rem]"
        style={headerHeight > 0 ? { height: headerHeight } : undefined}
        aria-hidden
      />
      <header
        ref={headerRef}
        id="site-navbar"
        className={`fixed inset-x-0 top-0 z-[100] flex w-full flex-col ${
          headerHeight > 0
            ? 'transition-transform duration-300 ease-out motion-reduce:transition-none'
            : ''
        } ${showHeader ? 'translate-y-0' : '-translate-y-full pointer-events-none'}`}
      >
      {/* Top Bar - Contact Info (Small) */}
      <div className="bg-black text-zinc-400 py-1.5 px-4 sm:px-6 lg:px-8 text-xs font-bold uppercase tracking-widest hidden md:block border-b border-zinc-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-default">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Musterstraße 123, 12345 Berlin
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-default">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              Mo-Fr: 08:00 - 18:00 Uhr
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+491625330280" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              +49 162 5330280
            </a>
            <a href="mailto:info@xn--lwetrucks-07a.de" className="hover:text-white transition-colors duration-200">
              info@löwetrucks.de
            </a>
          </div>
        </div>
      </div>

      {/* Main Header (Single Row) */}
      <div className="bg-gradient-to-r from-red-700 via-orange-600 to-red-600 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-b-[4px] border-black">
        <div className="mx-auto max-w-7xl ps-2 pe-3 sm:ps-3 sm:pe-5 lg:ps-4 lg:pe-6">
          {/* شبكة: لوجو | عمود مرن (قائمة في المنتصف) | لغة + واتساب — الموبايل: لوجو | فراغ | أزرار */}
          <div className="grid min-h-[5rem] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 py-1.5 sm:gap-3 sm:py-2 lg:min-h-[5.75rem] lg:gap-3 lg:py-2.5 xl:min-h-[6.25rem]">
            <Link
              href="/"
              aria-label={`LÖWE TRUCKS, ${t('companyLegal')}`}
              className="relative z-30 inline-flex min-w-0 shrink-0 items-center justify-start justify-self-start"
            >
              <div className="relative shrink-0">
                <Image
                  src={SITE_LOGO_URL}
                  alt=""
                  width={960}
                  height={330}
                  unoptimized
                  quality={100}
                  className="block h-10 w-auto max-w-[min(78vw,195px)] object-contain object-start [image-rendering:high-quality] sm:h-[3rem] sm:max-w-[min(72vw,230px)] md:h-12 lg:h-16 lg:max-w-[min(42vw,340px)] xl:h-[4.5rem] xl:max-w-[min(40vw,400px)] 2xl:h-[4.75rem] 2xl:max-w-[430px]"
                  priority
                  sizes="(max-width: 640px) 480px, (max-width: 768px) 560px, (max-width: 1024px) 720px, (max-width: 1536px) 900px, 960px"
                  aria-hidden
                />
              </div>
            </Link>

            <div className="flex min-w-0 items-center justify-center justify-self-stretch self-center">
              <nav
                className="hidden min-w-0 max-w-full items-center justify-center gap-x-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex xl:gap-x-3 2xl:gap-x-4"
                aria-label="Main"
              >
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="shrink-0 text-[11px] font-black uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-0.5 hover:text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] lg:text-xs xl:text-sm 2xl:text-base"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 justify-self-end xl:gap-2.5">
              <div className="hidden items-center gap-2 lg:flex xl:gap-2.5">
                <LanguageSwitcher />
                <a
                  href="https://wa.me/491625330280"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-[0_4px_0_0_#18181b] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#18181b] active:translate-y-[4px] active:shadow-none xl:px-4 xl:py-2 xl:text-xs"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366] xl:h-5 xl:w-5" />
                  WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <LanguageSwitcher />
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-white transition-colors hover:text-black focus:outline-none"
                  aria-label="Menu"
                >
                  {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, rotateX: -20 }}
            animate={{ height: "auto", opacity: 1, rotateX: 0 }}
            exit={{ height: 0, opacity: 0, rotateX: -20 }}
            style={{ transformOrigin: "top" }}
            className="lg:hidden overflow-hidden bg-black border-b-4 border-red-600 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] absolute w-full top-[100%] left-0 z-40"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-black text-white hover:text-red-500 uppercase tracking-widest"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="h-0.5 bg-zinc-900 my-2" />
              <div className="flex flex-col gap-4">
                <span className="flex items-center gap-3 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  <Clock className="w-4 h-4 text-red-600" /> Mo-Fr: 08:00 - 18:00
                </span>
                <a href="tel:+491625330280" className="flex items-center gap-3 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  <Phone className="w-4 h-4 text-red-600" /> +49 162 5330280
                </a>
                <a
                  href="https://wa.me/491625330280"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gradient-to-b from-orange-500 to-red-600 text-white px-6 py-4 rounded-xl text-lg font-black uppercase tracking-widest shadow-[0_4px_0_0_#7f1d1d] active:shadow-transparent active:translate-y-[4px] transition-all mt-4"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
