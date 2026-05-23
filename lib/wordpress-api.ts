import type { Car, Truck } from '@/lib/mock-data';

export type SupportedLocale = 'de' | 'en' | 'ar';

export type LocalizedBlock = {
  title: string;
  description: string;
  features: string[];
};

export type VehicleI18n = Partial<Record<SupportedLocale, LocalizedBlock>>;

export type CarFromWP = Car & { i18n?: VehicleI18n };
export type TruckFromWP = Truck & { i18n?: VehicleI18n };

const DEFAULT_REVALIDATE = 300;

function apiBase(): string | null {
  const url = process.env.WORDPRESS_API_URL?.trim();
  return url ? url.replace(/\/$/, '') : null;
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

async function fetchWp<T>(path: string, locale: string): Promise<T | null> {
  const base = apiBase();
  if (!base) return null;

  const lang = normalizeLang(locale);
  const url = `${base}/wp-json/lowe-trucks/v1/${path}${path.includes('?') ? '&' : '?'}lang=${lang}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: revalidateSeconds() },
      headers: { Accept: 'application/json' },
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

export function localizedFromVehicle<T extends CarFromWP | TruckFromWP>(
  locale: string,
  vehicle: T,
): LocalizedBlock {
  const lang = normalizeLang(locale);
  const fromI18n = vehicle.i18n?.[lang];
  if (fromI18n) return fromI18n;
  return {
    title: vehicle.title,
    description: vehicle.description,
    features: vehicle.features,
  };
}
