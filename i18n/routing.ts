import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'ar'],
  defaultLocale: 'de',
  // German at / (no /de prefix); /en and /ar for other locales
  localePrefix: 'as-needed',
  localeDetection: false,
});
