import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'ar'],
  defaultLocale: 'de',
  // Explicit /de /en /ar prefixes — more reliable on Hostinger than "as-needed"
  localePrefix: 'always',
  localeDetection: false,
});
