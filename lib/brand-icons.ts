export type BrandIconSource =
  | { type: 'cdn'; slug: string }
  | { type: 'mercedes-benz' };

export type BrandConfig = {
  name: string;
  icon: BrandIconSource;
};

/** Truck brands present in inventory. */
export const TRUCK_BRANDS: BrandConfig[] = [
  { name: 'Mercedes-Benz', icon: { type: 'mercedes-benz' } },
  { name: 'Volvo', icon: { type: 'cdn', slug: 'volvo' } },
  { name: 'Scania', icon: { type: 'cdn', slug: 'scania' } },
  { name: 'MAN', icon: { type: 'cdn', slug: 'man' } },
  { name: 'Ford', icon: { type: 'cdn', slug: 'ford' } },
];

/** Car brands present in inventory. */
export const CAR_BRANDS: BrandConfig[] = [
  { name: 'BMW', icon: { type: 'cdn', slug: 'bmw' } },
  { name: 'Mercedes-Benz', icon: { type: 'mercedes-benz' } },
  { name: 'Volkswagen', icon: { type: 'cdn', slug: 'volkswagen' } },
  { name: 'Audi', icon: { type: 'cdn', slug: 'audi' } },
];

export function brandIconUrl(slug: string, color = '111827'): string {
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

/** Mercedes-Benz mark (PNG on WP admin — clearer than Simple Icons). */
export const MERCEDES_BRAND_ICON_URL = 'https://admin.xn--lwetrucks-07a.de/pics/mercedes_benz.png';

export function brandFilterHref(basePath: '/trucks' | '/cars', brand: string, hash: string): string {
  return `${basePath}?brand=${encodeURIComponent(brand)}${hash}`;
}

export function isKnownTruckBrand(name: string): boolean {
  return TRUCK_BRANDS.some((b) => b.name === name);
}

export function isKnownCarBrand(name: string): boolean {
  return CAR_BRANDS.some((b) => b.name === name);
}
