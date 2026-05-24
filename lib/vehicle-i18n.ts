import { getMessages } from 'next-intl/server';
import type { Car, Truck } from '@/lib/mock-data';
import { localizedFromVehicle, type CarFromWP, type TruckFromWP } from '@/lib/wordpress-api';
import { normalizeLocalizedBlock } from '@/lib/inventory-normalize';

export type LocalizedVehicle = {
  title: string;
  description: string;
  features: string[];
};

type InventoryBlock = {
  cars?: Record<string, LocalizedVehicle>;
  trucks?: Record<string, LocalizedVehicle>;
};

function hasWpI18n(vehicle: Car | Truck): vehicle is CarFromWP | TruckFromWP {
  return 'i18n' in vehicle && Boolean((vehicle as CarFromWP).i18n);
}

export async function getLocalizedCar(locale: string, car: Car | CarFromWP): Promise<LocalizedVehicle> {
  if (hasWpI18n(car)) {
    return localizedFromVehicle(locale, car);
  }

  if (locale === 'de') {
    return normalizeLocalizedBlock({ title: car.title, description: car.description, features: car.features });
  }

  const messages = await getMessages();
  const inv = messages.Inventory as InventoryBlock | undefined;
  const block = inv?.cars?.[car.id];
  if (block) return normalizeLocalizedBlock(block);
  return normalizeLocalizedBlock({ title: car.title, description: car.description, features: car.features });
}

export async function getLocalizedTruck(locale: string, truck: Truck | TruckFromWP): Promise<LocalizedVehicle> {
  if (hasWpI18n(truck)) {
    return localizedFromVehicle(locale, truck);
  }

  if (locale === 'de') {
    return normalizeLocalizedBlock({ title: truck.title, description: truck.description, features: truck.features });
  }

  const messages = await getMessages();
  const inv = messages.Inventory as InventoryBlock | undefined;
  const block = inv?.trucks?.[truck.id];
  if (block) return normalizeLocalizedBlock(block);
  return normalizeLocalizedBlock({ title: truck.title, description: truck.description, features: truck.features });
}
