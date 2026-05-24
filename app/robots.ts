import type { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin().replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ''),
  };
}
