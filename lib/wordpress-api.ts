import { domainToASCII } from 'node:url';
import type { Car, Truck } from '@/lib/mock-data';
import { normalizeLocalizedBlock } from '@/lib/inventory-normalize';

export type SupportedLocale = 'de' | 'en' | 'ar';

export type LocalizedBlock = {
  title: string;
  description: string;
  features: string[];
};

export type VehicleI18n = Partial<Record<SupportedLocale, LocalizedBlock>>;

export type CarFromWP = Car & { i18n?: VehicleI18n };
export type TruckFromWP = Truck & { i18n?: VehicleI18n };

/** Spare part row for the single `/parts` listing (no per-item page). */
export type PartFromWP = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

const DEFAULT_REVALIDATE = 60;

function apiBase(): string | null {
  const url = process.env.WORDPRESS_API_URL?.trim();
  if (!url) return null;

  try {
    const parsed = new URL(url);
    parsed.hostname = domainToASCII(parsed.hostname);
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return url.replace(/\/$/, '');
  }
}

function revalidateSeconds(): number {
  const raw = process.env.WORDPRESS_REVALIDATE_SECONDS;
  const n = raw ? Number(raw) : DEFAULT_REVALIDATE;
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_REVALIDATE;
}

function normalizeLang(locale: string): SupportedLocale {
  if (locale === 'en' || locale === 'ar') return locale;
  return 'de';
}

function fetchOptions(): RequestInit {
  const seconds = revalidateSeconds();

  if (seconds === 0) {
    return {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    };
  }

  return {
    next: { revalidate: seconds },
    headers: { Accept: 'application/json' },
  };
}

type FetchWpCache = 'default' | 'no-store';

async function fetchWp<T>(path: string, locale: string, cache: FetchWpCache = 'default'): Promise<T | null> {
  const base = apiBase();
  if (!base) return null;

  const lang = normalizeLang(locale);
  const url = `${base}/wp-json/lowe-trucks/v1/${path}${path.includes('?') ? '&' : '?'}lang=${lang}`;

  const init: RequestInit =
    cache === 'no-store'
      ? {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        }
      : {
          ...fetchOptions(),
        };

  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function isWordPressConfigured(): boolean {
  return Boolean(apiBase());
}

export async function fetchCarsFromWordPress(locale: string): Promise<CarFromWP[] | null> {
  return fetchWp<CarFromWP[]>('cars', locale);
}

export async function fetchCarFromWordPress(locale: string, id: string): Promise<CarFromWP | null> {
  return fetchWp<CarFromWP>(`cars/${encodeURIComponent(id)}`, locale);
}

export async function fetchTrucksFromWordPress(locale: string): Promise<TruckFromWP[] | null> {
  return fetchWp<TruckFromWP[]>('trucks', locale);
}

export async function fetchTruckFromWordPress(locale: string, id: string): Promise<TruckFromWP | null> {
  return fetchWp<TruckFromWP>(`trucks/${encodeURIComponent(id)}`, locale);
}

/** Always fresh: avoids stale empty RSC when navigating client-side or switching locale. */
export async function fetchPartsFromWordPress(locale: string): Promise<PartFromWP[] | null> {
  return fetchWp<PartFromWP[]>('parts', locale, 'no-store');
}

export function localizedFromVehicle<T extends CarFromWP | TruckFromWP>(
  locale: string,
  vehicle: T,
): LocalizedBlock {
  const lang = normalizeLang(locale);
  const fromI18n = vehicle.i18n?.[lang];
  if (fromI18n) return normalizeLocalizedBlock(fromI18n);
  return normalizeLocalizedBlock({
    title: vehicle.title,
    description: vehicle.description,
    features: vehicle.features,
  });
}
