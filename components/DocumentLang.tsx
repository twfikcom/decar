'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

/** Keeps `<html lang/dir>` in sync when locale layout wraps content inside root html shell. */
export default function DocumentLang() {
  const locale = useLocale();

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
