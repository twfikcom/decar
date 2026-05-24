import type { Car, Truck } from '@/lib/mock-data';

export type LocalizedBlockShape = {
  title: string;
  description: string;
  features: string[];
};

const TRUCK_CATEGORIES: readonly Truck['category'][] = [
  'Sattelzugmaschine',
  'Festaufbau',
  'Kipper',
  'Kastenwagen',
];

const CAR_BODY: readonly Car['bodyType'][] = ['Limousine', 'SUV', 'Kombi', 'Kompakt', 'Coupé'];

const CAR_FUEL: readonly Car['fuel'][] = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'];

/** Normalize title/description/features from WP REST or i18n blocks (prevents server crashes). */
export function normalizeLocalizedBlock(raw: {
  title?: unknown;
  description?: unknown;
  features?: unknown;
}): LocalizedBlockShape {
  const title = typeof raw.title === 'string' ? raw.title : String(raw.title ?? '');
  const description =
    typeof raw.description === 'string' ? raw.description : String(raw.description ?? '');
  let features: string[] = [];
  if (Array.isArray(raw.features)) {
    features = raw.features.map((x) => String(x));
  } else if (typeof raw.features === 'string') {
    features = raw.features
      .split(/\r\n|\r|\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return { title, description, features };
}

export function normalizeTruckCategory(raw: string): Truck['category'] {
  const v = (raw ?? '').trim();
  return (TRUCK_CATEGORIES as readonly string[]).includes(v) ? (v as Truck['category']) : 'Festaufbau';
}

export function normalizeCarBodyType(raw: string): Car['bodyType'] {
  const v = (raw ?? '').trim();
  return (CAR_BODY as readonly string[]).includes(v) ? (v as Car['bodyType']) : 'Limousine';
}

export function normalizeCarFuel(raw: string): Car['fuel'] {
  const v = (raw ?? '').trim();
  return (CAR_FUEL as readonly string[]).includes(v) ? (v as Car['fuel']) : 'Diesel';
}

/** Coerce numeric / array fields from REST so server render never throws. */
export function normalizeTruckForPage(t: Truck): Truck {
  return {
    ...t,
    year: Number(t.year) || 0,
    mileage: Number(t.mileage) || 0,
    price: Number(t.price) || 0,
    power: Number(t.power) || 0,
    category: normalizeTruckCategory(String(t.category)),
    images: Array.isArray(t.images) ? t.images.filter(Boolean).map(String) : [],
    description: typeof t.description === 'string' ? t.description : String(t.description ?? ''),
    features: Array.isArray(t.features) ? t.features.map(String) : [],
  };
}

export function normalizeCarForPage(c: Car): Car {
  return {
    ...c,
    year: Number(c.year) || 0,
    mileage: Number(c.mileage) || 0,
    price: Number(c.price) || 0,
    power: Number(c.power) || 0,
    bodyType: normalizeCarBodyType(String(c.bodyType)),
    fuel: normalizeCarFuel(String(c.fuel)),
    images: Array.isArray(c.images) ? c.images.filter(Boolean).map(String) : [],
    description: typeof c.description === 'string' ? c.description : String(c.description ?? ''),
    features: Array.isArray(c.features) ? c.features.map(String) : [],
  };
}
