import { getMessages } from 'next-intl/server';
import type { Car, Truck } from '@/lib/mock-data';

export type LocalizedVehicle = {
  title: string;
  description: string;
  features: string[];
};

type InventoryBlock = {
  cars?: Record<string, LocalizedVehicle>;
  trucks?: Record<string, LocalizedVehicle>;
};

export async function getLocalizedCar(locale: string, car: Car): Promise<LocalizedVehicle> {
  if (locale === 'de') {
    return { title: car.title, description: car.description, features: car.features };
  }
  const messages = await getMessages();
  const inv = messages.Inventory as InventoryBlock | undefined;
  const block = inv?.cars?.[car.id];
  if (block) return block;
  return { title: car.title, description: car.description, features: car.features };
}

export async function getLocalizedTruck(locale: string, truck: Truck): Promise<LocalizedVehicle> {
  if (locale === 'de') {
    return { title: truck.title, description: truck.description, features: truck.features };
  }
  const messages = await getMessages();
  const inv = messages.Inventory as InventoryBlock | undefined;
  const block = inv?.trucks?.[truck.id];
  if (block) return block;
  return { title: truck.title, description: truck.description, features: truck.features };
}
