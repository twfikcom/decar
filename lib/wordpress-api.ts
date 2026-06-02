import { domainToASCII } from 'node:url';
import type { Car, Truck } from '@/lib/mock-data';
import { normalizeLocalizedBlock } from '@/lib/inventory-normalize';

export type SupportedLocale = 'de' | 'en' | 'ar';

export type LocalizedBlock = {
  title: string;
  description: string;
  features: string[];
};

export type PartLocalizedBlock = {
  title: string;
  description: string;
};

export type VehicleI18n = Partial<Record<SupportedLocale, LocalizedBlock>>;

export type PartI18n = Partial<Record<SupportedLocale, PartLocalizedBlock>>;

export type CarFromWP = Car & { i18n?: VehicleI18n };
export type TruckFromWP = Truck & { i18n?: VehicleI18n };

/** Spare part row for the single `/parts` listing (no per-item page). */
export type PartFromWP = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  i18n?: PartI18n;
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

export function normalizeLang(locale: string): SupportedLocale {
  if (locale === 'en' || locale === 'ar') return locale;
  return 'de';
}

/** Detail pages: allow short ISR when configured. */
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

async function fetchWp<T>(
  path: string,
  locale: string,
  cache: FetchWpCache = 'default',
): Promise<T | null> {
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

/**
 * List endpoints: always bypass Next data cache and fall back to DE on failure
 * so locale switches do not briefly show an empty catalog.
 */
async function fetchWpInventoryList<T>(path: string, locale: string): Promise<T[] | null> {
  const lang = normalizeLang(locale);
  let data = await fetchWp<T[]>(path, lang, 'no-store');

  if (data === null && lang !== 'de') {
    data = await fetchWp<T[]>(path, 'de', 'no-store');
  }

  return data;
}

export function isWordPressConfigured(): boolean {
  return Boolean(apiBase());
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

export function localizedFromPart(locale: string, part: PartFromWP): PartLocalizedBlock {
  const lang = normalizeLang(locale);
  const fromI18n = part.i18n?.[lang];
  if (fromI18n) {
    return {
      title: fromI18n.title || part.title,
      description: fromI18n.description ?? part.description,
    };
  }
  return {
    title: part.title,
    description: part.description,
  };
}

export function applyVehicleLocale<T extends CarFromWP | TruckFromWP>(locale: string, vehicle: T): T {
  const block = localizedFromVehicle(locale, vehicle);
  return {
    ...vehicle,
    title: block.title,
    description: block.description,
    features: block.features,
  };
}

export function applyPartLocale(locale: string, part: PartFromWP): PartFromWP {
  const block = localizedFromPart(locale, part);
  return {
    ...part,
    title: block.title,
    description: block.description,
  };
}

export async function fetchCarsFromWordPress(locale: string): Promise<CarFromWP[] | null> {
  return fetchWpInventoryList<CarFromWP>('cars', locale);
}

export async function fetchCarFromWordPress(locale: string, id: string): Promise<CarFromWP | null> {
  const lang = normalizeLang(locale);
  let car = await fetchWp<CarFromWP>(`cars/${encodeURIComponent(id)}`, lang);
  if (!car && lang !== 'de') {
    car = await fetchWp<CarFromWP>(`cars/${encodeURIComponent(id)}`, 'de');
  }
  return car;
}

export async function fetchTrucksFromWordPress(locale: string): Promise<TruckFromWP[] | null> {
  return fetchWpInventoryList<TruckFromWP>('trucks', locale);
}

export async function fetchTruckFromWordPress(locale: string, id: string): Promise<TruckFromWP | null> {
  const lang = normalizeLang(locale);
  let truck = await fetchWp<TruckFromWP>(`trucks/${encodeURIComponent(id)}`, lang);
  if (!truck && lang !== 'de') {
    truck = await fetchWp<TruckFromWP>(`trucks/${encodeURIComponent(id)}`, 'de');
  }
  return truck;
}

export async function fetchPartsFromWordPress(locale: string): Promise<PartFromWP[] | null> {
  return fetchWpInventoryList<PartFromWP>('parts', locale);
}
