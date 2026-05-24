import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteOrigin } from '@/lib/site-url';

/**
 * URL path for a locale and route segment (no leading locale for default `de`).
 * @param segment e.g. `''` (home), `'about'`, `'trucks'`, `'trucks/t-12'`
 */
export function localizedUrlPath(locale: string, segment: string): string {
  const s = segment.replace(/^\/+/, '');
  if (locale === routing.defaultLocale) {
    return s === '' ? '/' : `/${s}`;
  }
  return s === '' ? `/${locale}` : `/${locale}/${s}`;
}

export function absoluteUrlFromPath(path: string): string {
  const base = getSiteOrigin().replace(/\/$/, '');
  if (path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Canonical + hreflang for the current locale URL and its siblings. */
export function seoAlternatesMetadata(locale: string, segment: string): Pick<Metadata, 'alternates'> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrlFromPath(localizedUrlPath(loc, segment));
  }
  const defaultPath = localizedUrlPath(routing.defaultLocale, segment);
  return {
    alternates: {
      canonical: absoluteUrlFromPath(localizedUrlPath(locale, segment)),
      languages: {
        ...languages,
        'x-default': absoluteUrlFromPath(defaultPath),
      },
    },
  };
}

const ogLocaleMap: Record<string, string> = {
  de: 'de_DE',
  en: 'en_US',
  ar: 'ar_SA',
};

export function withSeo(locale: string, segment: string, meta: Metadata): Metadata {
  const canonical = absoluteUrlFromPath(localizedUrlPath(locale, segment));
  const rawOg = meta.openGraph;
  const og =
    rawOg && typeof rawOg === 'object' && !Array.isArray(rawOg) ? { ...rawOg } : {};
  return {
    ...meta,
    ...seoAlternatesMetadata(locale, segment),
    openGraph: {
      ...og,
      url: canonical,
      locale: ogLocaleMap[locale] ?? locale,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocaleMap[l] ?? l),
    },
  };
}
