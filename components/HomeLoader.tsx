'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export default function HomeLoader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (pathname !== '/') {
      setLoading(false);
      return;
    }

    if (sessionStorage.getItem('appLoaded')) {
      setLoading(false);
      return;
    }

    setLoading(true);
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('appLoaded', 'true');
      document.body.style.overflow = '';
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [pathname]);

  if (!mounted || pathname !== '/' || !loading) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.4 } }}
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.35, ease: 'easeIn' } }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="relative mb-8 h-28 w-[min(92vw,28rem)] md:h-32 md:w-[min(92vw,36rem)]"
        >
          <Image
            src={SITE_LOGO_URL}
            alt="Löwe Trucks"
            fill
            unoptimized
            quality={100}
            className="object-contain drop-shadow-[0_15px_30px_rgba(220,38,38,0.4)] [image-rendering:high-quality]"
            priority
            sizes="(max-width: 768px) 640px, 960px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ delay: 0.5 }}
          className="w-48 md:w-64 h-1.5 bg-zinc-900 rounded-full mt-10 overflow-hidden relative"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
