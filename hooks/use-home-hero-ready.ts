'use client';

import { useLayoutEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import {
  HOME_LOADER_DONE_EVENT,
  HOME_LOADER_SESSION_KEY,
  isHomeAppPath,
} from '@/lib/home-loader';

/**
 * False while the home splash is visible; true when hero motion should run.
 * Prevents the hero from animating behind the loader (invisible), then appearing static.
 */
export function useHomeHeroReady(): boolean {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!isHomeAppPath(pathname)) {
      setReady(true);
      return;
    }

    try {
      if (sessionStorage.getItem(HOME_LOADER_SESSION_KEY)) {
        setReady(true);
        return;
      }
    } catch {
      setReady(true);
      return;
    }

    setReady(false);

    const onDone = () => setReady(true);
    window.addEventListener(HOME_LOADER_DONE_EVENT, onDone, { once: true });
    return () => window.removeEventListener(HOME_LOADER_DONE_EVENT, onDone);
  }, [pathname]);

  return ready;
}
