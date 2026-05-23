export type BrandConfig = {
  name: string;
  iconSlug: string;
};

/** Truck brands present in inventory — icon slugs from Simple Icons CDN. */
export const TRUCK_BRANDS: BrandConfig[] = [
  { name: 'Mercedes-Benz', iconSlug: 'mercedes' },
  { name: 'Volvo', iconSlug: 'volvo' },
  { name: 'Scania', iconSlug: 'scania' },
  { name: 'MAN', iconSlug: 'man' },
  { name: 'Ford', iconSlug: 'ford' },
];

/** Car brands present in inventory. */
export const CAR_BRANDS: BrandConfig[] = [
  { name: 'BMW', iconSlug: 'bmw' },
  { name: 'Mercedes-Benz', iconSlug: 'mercedes' },
  { name: 'Volkswagen', iconSlug: 'volkswagen' },
  { name: 'Audi', iconSlug: 'audi' },
];

export function brandIconUrl(slug: string, color = '111827'): string {
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

export function brandFilterHref(basePath: '/trucks' | '/cars', brand: string, hash: string): string {
  return `${basePath}?brand=${encodeURIComponent(brand)}${hash}`;
}

export function isKnownTruckBrand(name: string): boolean {
  return TRUCK_BRANDS.some((b) => b.name === name);
}

export function isKnownCarBrand(name: string): boolean {
  return CAR_BRANDS.some((b) => b.name === name);
}
