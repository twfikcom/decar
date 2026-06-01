'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { SITE_LOGO_FRAME_CLASS, SITE_LOGO_URL } from '@/lib/site-logo';
import {
  HOME_LOADER_SESSION_KEY,
  dispatchHomeLoaderDone,
  isHomeAppPath,
  setHomeLoaderActive,
} from '@/lib/home-loader';

export default function HomeLoader() {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(false);

  useLayoutEffect(() => {
    if (!isHomeAppPath(pathname)) {
      setShowSplash(false);
      setHomeLoaderActive(false);
      return;
    }

    let timer: number | undefined;

    try {
      if (sessionStorage.getItem(HOME_LOADER_SESSION_KEY)) {
        setShowSplash(false);
        setHomeLoaderActive(false);
        dispatchHomeLoaderDone();
        return;
      }
    } catch {
      setShowSplash(false);
      setHomeLoaderActive(false);
      dispatchHomeLoaderDone();
      return;
    }

    setHomeLoaderActive(true);
    setShowSplash(true);

    timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(HOME_LOADER_SESSION_KEY, 'true');
      } catch {
        /* ignore */
      }
      setShowSplash(false);
    }, 2500);

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
      setShowSplash(false);
      setHomeLoaderActive(false);
    };
  }, [pathname]);

  const handleExitComplete = () => {
    setHomeLoaderActive(false);
    dispatchHomeLoaderDone();
  };

  if (!isHomeAppPath(pathname)) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {showSplash ? (
        <motion.div
          key="home-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black"
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-red-900/20 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.35, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="relative mb-8 flex justify-center px-4"
          >
            <div className={SITE_LOGO_FRAME_CLASS}>
              <Image
                src={SITE_LOGO_URL}
                alt="Löwe Trucks"
                width={960}
                height={330}
                unoptimized
                quality={100}
                className="block h-10 w-auto max-h-12 object-contain object-center [image-rendering:high-quality] sm:h-12 sm:max-h-14 md:h-14 md:max-h-16"
                priority
                sizes="(max-width: 768px) 320px, 400px"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ delay: 0.5 }}
            className="relative mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-zinc-900 md:w-64"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
