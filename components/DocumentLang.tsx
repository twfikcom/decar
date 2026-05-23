'use client';

import { useEffect } from 'react';

/** Keeps `<html lang/dir>` in sync when the root layout owns the document shell. */
export default function DocumentLang({ locale }: { locale: string }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
