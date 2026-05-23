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
  const remote = await fetchCarsFromWordPress(locale);
  if (remote !== null) return remote;
  return mockCars;
}

export async function getTrucks(locale: string): Promise<TruckFromWP[]> {
  const remote = await fetchTrucksFromWordPress(locale);
  if (remote !== null) return remote;
  return mockTrucks;
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

export async function getFeaturedCars(locale: string, limit = 3): Promise<CarFromWP[]> {
  const all = await getCars(locale);
  return all.filter((c) => c.featured).slice(0, limit);
}

export async function getFeaturedTrucks(locale: string, limit = 3): Promise<TruckFromWP[]> {
  const all = await getTrucks(locale);
  return all.filter((t) => t.featured).slice(0, limit);
}

export async function getInventoryCount(): Promise<number> {
  const [cars, trucks] = await Promise.all([getCars('de'), getTrucks('de')]);
  return cars.length + trucks.length;
}
