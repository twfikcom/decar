import { cars as mockCars, trucks as mockTrucks, type Car, type Truck } from '@/lib/mock-data';
import {
  fetchCarFromWordPress,
  fetchCarsFromWordPress,
  fetchTruckFromWordPress,
  fetchTrucksFromWordPress,
  isWordPressConfigured,
  type CarFromWP,
  type TruckFromWP,
} from '@/lib/wordpress-api';

export type { Car, Truck, CarFromWP, TruckFromWP };

export async function getCars(locale: string): Promise<CarFromWP[]> {
  if (!isWordPressConfigured()) return mockCars;
  const remote = await fetchCarsFromWordPress(locale);
  return remote ?? [];
}

export async function getTrucks(locale: string): Promise<TruckFromWP[]> {
  if (!isWordPressConfigured()) return mockTrucks;
  const remote = await fetchTrucksFromWordPress(locale);
  return remote ?? [];
}

export async function getCarById(locale: string, id: string): Promise<CarFromWP | undefined> {
  const remote = await fetchCarFromWordPress(locale, id);
  if (remote) return remote;
  if (isWordPressConfigured()) return undefined;
  return mockCars.find((c) => c.id === id);
}

export async function getTruckById(locale: string, id: string): Promise<TruckFromWP | undefined> {
  const remote = await fetchTruckFromWordPress(locale, id);
  if (remote) return remote;
  if (isWordPressConfigured()) return undefined;
  return mockTrucks.find((t) => t.id === id);
}

function pickFeaturedWithFallback<T extends { id: string; year: number; featured?: boolean }>(
  all: T[],
  limit: number,
): T[] {
  const featured = all.filter((v) => v.featured === true);
  const rest = all.filter((v) => v.featured !== true);
  rest.sort((a, b) => b.year - a.year || b.id.localeCompare(a.id));
  const merged = [...featured, ...rest];
  const seen = new Set<string>();
  const out: T[] = [];
  for (const v of merged) {
    if (seen.has(v.id)) continue;
    seen.add(v.id);
    out.push(v);
    if (out.length >= limit) break;
  }
  return out;
}

export async function getFeaturedCars(locale: string, limit = 3): Promise<CarFromWP[]> {
  const all = await getCars(locale);
  return pickFeaturedWithFallback(all, limit);
}

export async function getFeaturedTrucks(locale: string, limit = 3): Promise<TruckFromWP[]> {
  const all = await getTrucks(locale);
  return pickFeaturedWithFallback(all, limit);
}

export async function getInventoryCount(): Promise<number> {
  const [cars, trucks] = await Promise.all([getCars('de'), getTrucks('de')]);
  return cars.length + trucks.length;
}
