import { domainToASCII } from 'node:url';

/** Canonical site origin — punycode for IDN domains (löwetrucks.de → xn--lwetrucks-07a.de). */
export function getSiteUrl(): URL {
  const raw = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://löwetrucks.de';

  try {
    const parsed = new URL(raw);
    parsed.hostname = domainToASCII(parsed.hostname);
    return parsed;
  } catch {
    return new URL('https://xn--lwetrucks-07a.de');
  }
}

export function getSiteOrigin(): string {
  return getSiteUrl().origin;
}
