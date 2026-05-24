import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteOrigin } from '@/lib/site-url';
import { localizedUrlPath } from '@/lib/seo';
import { getCars, getTrucks } from '@/lib/products';

const STATIC_SEGMENTS = ['', 'about', 'contact', 'service', 'cars', 'trucks', 'new-arrivals'] as const;

function abs(path: string): string {
  const base = getSiteOrigin().replace(/\/$/, '');
  if (path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function sitemapEntry(segment: string, priority: number, changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']): MetadataRoute.Sitemap[0] {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = abs(localizedUrlPath(loc, segment));
  }
  const defaultPath = localizedUrlPath(routing.defaultLocale, segment);
  return {
    url: abs(defaultPath),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ...languages,
        'x-default': abs(defaultPath),
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const seg of STATIC_SEGMENTS) {
    entries.push(sitemapEntry(seg, seg === '' ? 1 : 0.85, seg === '' ? 'daily' : 'weekly'));
  }

  try {
    const [trucks, cars] = await Promise.all([getTrucks(routing.defaultLocale), getCars(routing.defaultLocale)]);
    for (const tr of trucks) {
      entries.push(sitemapEntry(`trucks/${tr.id}`, 0.65, 'weekly'));
    }
    for (const car of cars) {
      entries.push(sitemapEntry(`cars/${car.id}`, 0.65, 'weekly'));
    }
  } catch {
    // WordPress unreachable: keep static routes only
  }

  return entries;
}
