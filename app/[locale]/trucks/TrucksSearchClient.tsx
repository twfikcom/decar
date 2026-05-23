'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import {
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Truck as TruckIcon,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { TruckFromWP } from '@/lib/products';
import { numberLocale } from '@/lib/locale-format';

const SORT_IDS = [
  'price-asc',
  'price-desc',
  'year-desc',
  'year-asc',
  'mileage-asc',
  'mileage-desc',
] as const;

type SortId = (typeof SORT_IDS)[number];

const SORT_LABEL_KEY: Record<
  SortId,
  'sortPriceAsc' | 'sortPriceDesc' | 'sortYearDesc' | 'sortYearAsc' | 'sortMileageAsc' | 'sortMileageDesc'
> = {
  'price-asc': 'sortPriceAsc',
  'price-desc': 'sortPriceDesc',
  'year-desc': 'sortYearDesc',
  'year-asc': 'sortYearAsc',
  'mileage-asc': 'sortMileageAsc',
  'mileage-desc': 'sortMileageDesc',
};

function sortList(list: TruckFromWP[], sort: SortId): TruckFromWP[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'year-desc':
      return copy.sort((a, b) => b.year - a.year);
    case 'year-asc':
      return copy.sort((a, b) => a.year - b.year);
    case 'mileage-asc':
      return copy.sort((a, b) => a.mileage - b.mileage);
    case 'mileage-desc':
      return copy.sort((a, b) => b.mileage - a.mileage);
    default:
      return copy;
  }
}

export default function TrucksSearchClient({ trucks }: { trucks: TruckFromWP[] }) {
  const t = useTranslations('Trucks');
  const tEnum = useTranslations('VehicleEnums');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const nl = numberLocale(locale);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [brands, setBrands] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<Record<string, boolean>>({});
  const [condition, setCondition] = useState<'all' | TruckFromWP['condition']>('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [mileageMax, setMileageMax] = useState('');
  const [sort, setSort] = useState<SortId>('year-desc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const truckListTitle = useCallback(
    (truck: TruckFromWP) => truck.i18n?.[locale as 'de' | 'en' | 'ar']?.title ?? truck.title,
    [locale],
  );

  const truckCategoryLabel = useCallback(
    (c: TruckFromWP['category']) => tEnum(`truckCategory.${c}` as 'truckCategory.Sattelzugmaschine'),
    [tEnum],
  );

  const formatEur = (n: number) =>
    new Intl.NumberFormat(nl, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const brandOptions = useMemo(() => {
    const s = new Set(trucks.map((tr) => tr.brand));
    return [...s].sort((a, b) => a.localeCompare(b, locale === 'ar' ? 'ar' : locale));
  }, [locale]);

  const categoryOptions = useMemo(() => {
    const s = new Set(trucks.map((tr) => tr.category));
    return [...s].sort((a, b) => a.localeCompare(b, locale === 'ar' ? 'ar' : locale));
  }, [locale]);

  const toggleBrand = useCallback((b: string) => {
    setBrands((prev) => ({ ...prev, [b]: !prev[b] }));
  }, []);

  const toggleCategory = useCallback((c: string) => {
    setCategories((prev) => ({ ...prev, [c]: !prev[c] }));
  }, []);

  const activeBrandFilters = useMemo(
    () => brandOptions.filter((b) => brands[b]),
    [brandOptions, brands],
  );
  const activeCategoryFilters = useMemo(
    () => categoryOptions.filter((c) => categories[c]),
    [categoryOptions, categories],
  );

  useEffect(() => {
    const valid = new Set<TruckFromWP['category']>(categoryOptions as TruckFromWP['category'][]);
    const fromUrl = searchParams
      .getAll('category')
      .map((raw) => {
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      })
      .filter((c): c is TruckFromWP['category'] => valid.has(c as TruckFromWP['category']));
    if (fromUrl.length) {
      setCategories((prev) => {
        const next = { ...prev };
        for (const c of fromUrl) next[c] = true;
        return next;
      });
    }
    const cond = searchParams.get('condition');
    if (cond === 'Neu' || cond === 'Gebraucht') setCondition(cond);
  }, [searchParams, categoryOptions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minP = priceMin === '' ? null : Number(priceMin);
    const maxP = priceMax === '' ? null : Number(priceMax);
    const maxKm = mileageMax === '' ? null : Number(mileageMax);

    const list = trucks.filter((tr) => {
      if (q) {
        const titleLoc = truckListTitle(tr);
        const hay = `${titleLoc} ${tr.title} ${tr.brand} ${tr.model} ${tr.category} ${truckCategoryLabel(tr.category)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activeBrandFilters.length && !activeBrandFilters.includes(tr.brand)) return false;
      if (activeCategoryFilters.length && !activeCategoryFilters.includes(tr.category)) return false;
      if (condition !== 'all' && tr.condition !== condition) return false;
      if (minP !== null && !Number.isNaN(minP) && tr.price < minP) return false;
      if (maxP !== null && !Number.isNaN(maxP) && tr.price > maxP) return false;
      if (maxKm !== null && !Number.isNaN(maxKm) && tr.mileage > maxKm) return false;
      return true;
    });

    return sortList(list, sort);
  }, [
    query,
    activeBrandFilters,
    activeCategoryFilters,
    condition,
    priceMin,
    priceMax,
    mileageMax,
    sort,
    truckListTitle,
    truckCategoryLabel,
  ]);

  const resetFilters = () => {
    setQuery('');
    setBrands({});
    setCategories({});
    setCondition('all');
    setPriceMin('');
    setPriceMax('');
    setMileageMax('');
    setSort('year-desc');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    activeBrandFilters.length > 0 ||
    activeCategoryFilters.length > 0 ||
    condition !== 'all' ||
    priceMin !== '' ||
    priceMax !== '' ||
    mileageMax !== '';

  const conditionLabel = (c: 'all' | TruckFromWP['condition']) => {
    if (c === 'all') return t('all');
    if (c === 'Neu') return t('new');
    return t('used');
  };

  const FilterFields = (
    <div id="schnellsuche" className="scroll-mt-28 space-y-6">
      <div>
        <label htmlFor="truck-search" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
          {t('quickSearch')}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="truck-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('quickSearchPh')}
            className="w-full rounded-sm border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-zinc-900 outline-none ring-zinc-900/10 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2"
          />
        </div>
      </div>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{t('brand')}</legend>
        <div className="max-h-44 space-y-2 overflow-y-auto rounded-sm border border-zinc-200 bg-zinc-50/80 p-3">
          {brandOptions.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-800">
              <input
                type="checkbox"
                checked={!!brands[b]}
                onChange={() => toggleBrand(b)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{t('vehicleType')}</legend>
        <div className="space-y-2 rounded-sm border border-zinc-200 bg-zinc-50/80 p-3">
          {categoryOptions.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-800">
              <input
                type="checkbox"
                checked={!!categories[c]}
                onChange={() => toggleCategory(c)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              {truckCategoryLabel(c as TruckFromWP['category'])}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{t('condition')}</legend>
        <div className="flex flex-wrap gap-2">
          {(['all', 'Neu', 'Gebraucht'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setCondition(v)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                condition === v
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
              }`}
            >
              {conditionLabel(v)}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{t('priceEur')}</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={t('priceMin')}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="rounded-sm border border-zinc-300 px-2 py-2 text-sm font-medium outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={t('priceMax')}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="rounded-sm border border-zinc-300 px-2 py-2 text-sm font-medium outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mileage-max" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
          {t('mileageMax')}
        </label>
        <input
          id="mileage-max"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={t('mileagePh')}
          value={mileageMax}
          onChange={(e) => setMileageMax(e.target.value)}
          className="w-full rounded-sm border border-zinc-300 px-2 py-2 text-sm font-medium outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-zinc-300 bg-white py-2.5 text-xs font-black uppercase tracking-widest text-zinc-800 transition hover:border-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
          {t('filterReset')}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100 pb-16">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <Link href="/" className="transition hover:text-zinc-900">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
            <span className="text-zinc-900">{t('breadcrumbSearch')}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">{t('title')}</h1>
              <p className="mt-1 max-w-xl text-sm font-medium text-zinc-600">{t('subtitle')}</p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <p className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                <LayoutGrid className="h-4 w-4" aria-hidden />
                {t('catalogView')}
              </p>
              <Link
                href="/cars"
                className="text-sm font-black uppercase tracking-widest text-emerald-700 underline-offset-4 transition hover:text-emerald-600 hover:underline"
              >
                {t('linkPkw')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-zinc-300 bg-white py-3 text-sm font-black uppercase tracking-widest text-zinc-900 shadow-sm"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? t('filterClose') : t('filterOpen')}
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className={`w-full shrink-0 lg:w-80 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 rounded-sm border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-4">
                <h2 className="font-heading text-lg font-black text-zinc-900">{t('filterTitle')}</h2>
                <TruckIcon className="h-5 w-5 text-zinc-400" aria-hidden />
              </div>
              {FilterFields}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-sm border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-zinc-700">
                <span className="font-black text-zinc-900">{filtered.length}</span>{' '}
                {filtered.length === 1 ? t('foundOne') : t('foundMany')}
              </p>
              <div className="flex flex-col gap-1 sm:items-end">
                <label htmlFor="sort-trucks" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {t('sort')}
                </label>
                <select
                  id="sort-trucks"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="min-w-[220px] rounded-sm border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                >
                  {SORT_IDS.map((id) => (
                    <option key={id} value={id}>
                      {t(SORT_LABEL_KEY[id])}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {query.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700">
                    „{query.trim()}“
                  </span>
                )}
                {activeBrandFilters.map((b) => (
                  <span key={b} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-800">
                    {b}
                  </span>
                ))}
                {activeCategoryFilters.map((c) => (
                  <span key={c} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-800">
                    {truckCategoryLabel(c as TruckFromWP['category'])}
                  </span>
                ))}
                {condition !== 'all' && (
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-800">
                    {conditionLabel(condition)}
                  </span>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-sm border border-zinc-200 bg-white px-8 py-20 text-center shadow-sm">
                <TruckIcon className="mx-auto mb-4 h-14 w-14 text-zinc-300" />
                <h3 className="font-heading text-xl font-black text-zinc-900">{t('noResults')}</h3>
                <p className="mt-2 text-sm font-medium text-zinc-600">{t('noResultsHint')}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-sm bg-zinc-900 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-700"
                >
                  {t('showAll')}
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {filtered.map((truck) => (
                  <li key={truck.id}>
                    <Link
                      href={`/trucks/${truck.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-400 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] w-full bg-zinc-200">
                        <Image
                          src={truck.images[0]}
                          alt={truckListTitle(truck)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <span className="bg-zinc-900/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                            {truck.condition === 'Neu' ? t('new') : t('used')}
                          </span>
                          <span className="border border-white/30 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-900 backdrop-blur-sm">
                            {truckCategoryLabel(truck.category)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="font-heading text-base font-black leading-snug text-zinc-900 transition group-hover:text-red-700 sm:text-lg">
                          {truckListTitle(truck)}
                        </h3>
                        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-zinc-100 pt-4 text-sm">
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('year')}</dt>
                            <dd className="font-bold text-zinc-900">{truck.year}</dd>
                          </div>
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('mileage')}</dt>
                            <dd className="font-bold text-zinc-900">
                              {truck.mileage.toLocaleString(nl)} {tCommon('km')}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('power')}</dt>
                            <dd className="font-bold text-zinc-900">
                              {truck.power} {tCommon('powerUnit')}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('brandLabel')}</dt>
                            <dd className="font-bold text-zinc-900">{truck.brand}</dd>
                          </div>
                        </dl>
                        <div className="mt-auto flex items-end justify-between border-t border-zinc-100 pt-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('price')}</p>
                            <p className="font-heading text-xl font-black text-zinc-900 sm:text-2xl">{formatEur(truck.price)}</p>
                          </div>
                          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-200 text-zinc-900 transition group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white">
                            <ChevronRight className="h-5 w-5" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
