'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import {
  CarFront,
  ChevronRight,
  Fuel,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useLocale, useTranslations, useMessages } from 'next-intl';
import type { Car } from '@/lib/mock-data';
import { numberLocale } from '@/lib/locale-format';
import BrandIconRow from '@/components/BrandIconRow';
import { CAR_BRANDS } from '@/lib/brand-icons';

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

function sortList(list: Car[], sort: SortId): Car[] {
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

function decodeParam(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function CarsSearchClient({ cars }: { cars: Car[] }) {
  const t = useTranslations('Cars');
  const tf = useTranslations('Trucks');
  const tEnum = useTranslations('VehicleEnums');
  const tCommon = useTranslations('Common');
  const messages = useMessages();
  const locale = useLocale();
  const nl = numberLocale(locale);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [brands, setBrands] = useState<Record<string, boolean>>({});
  const [bodyTypes, setBodyTypes] = useState<Record<string, boolean>>({});
  const [fuels, setFuels] = useState<Record<string, boolean>>({});
  const [condition, setCondition] = useState<'all' | Car['condition']>('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [mileageMax, setMileageMax] = useState('');
  const [sort, setSort] = useState<SortId>('year-desc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const inventory = messages.Inventory as { cars?: Record<string, { title?: string }> } | undefined;

  const carListTitle = useCallback(
    (car: Car) => inventory?.cars?.[car.id]?.title ?? car.title,
    [inventory],
  );

  const bodyTypeLabel = useCallback(
    (v: Car['bodyType']) => tEnum(`bodyType.${v}` as 'bodyType.Limousine'),
    [tEnum],
  );

  const fuelLabel = useCallback(
    (v: Car['fuel']) => tEnum(`fuel.${v}` as 'fuel.Diesel'),
    [tEnum],
  );

  const formatEur = (n: number) =>
    new Intl.NumberFormat(nl, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const brandOptions = useMemo(() => {
    const s = new Set(cars.map((c) => c.brand));
    return [...s].sort((a, b) => a.localeCompare(b, locale === 'ar' ? 'ar' : locale));
  }, [locale]);

  const bodyTypeOptions = useMemo(() => {
    const s = new Set(cars.map((c) => c.bodyType));
    return [...s].sort((a, b) => a.localeCompare(b, locale === 'ar' ? 'ar' : locale));
  }, [locale]);

  const fuelOptions = useMemo(() => {
    const s = new Set(cars.map((c) => c.fuel));
    return [...s].sort((a, b) => a.localeCompare(b, locale === 'ar' ? 'ar' : locale));
  }, [locale]);

  const toggleBrand = useCallback((b: string) => {
    setBrands((prev) => ({ ...prev, [b]: !prev[b] }));
  }, []);

  const toggleBodyType = useCallback((v: string) => {
    setBodyTypes((prev) => ({ ...prev, [v]: !prev[v] }));
  }, []);

  const toggleFuel = useCallback((v: string) => {
    setFuels((prev) => ({ ...prev, [v]: !prev[v] }));
  }, []);

  const activeBrandFilters = useMemo(
    () => brandOptions.filter((b) => brands[b]),
    [brandOptions, brands],
  );
  const activeBodyTypeFilters = useMemo(
    () => bodyTypeOptions.filter((v) => bodyTypes[v]),
    [bodyTypeOptions, bodyTypes],
  );
  const activeFuelFilters = useMemo(
    () => fuelOptions.filter((v) => fuels[v]),
    [fuelOptions, fuels],
  );

  const activeBrandFromUrl = activeBrandFilters[0];

  useEffect(() => {
    const validBodyTypes = new Set<Car['bodyType']>(bodyTypeOptions as Car['bodyType'][]);
    const fromBodyType = searchParams
      .getAll('bodyType')
      .map(decodeParam)
      .filter((v): v is Car['bodyType'] => validBodyTypes.has(v as Car['bodyType']));
    if (fromBodyType.length) {
      setBodyTypes((prev) => {
        const next = { ...prev };
        for (const v of fromBodyType) next[v] = true;
        return next;
      });
    }

    const validFuels = new Set<Car['fuel']>(fuelOptions as Car['fuel'][]);
    const fromFuel = searchParams
      .getAll('fuel')
      .map(decodeParam)
      .filter((v): v is Car['fuel'] => validFuels.has(v as Car['fuel']));
    if (fromFuel.length) {
      setFuels((prev) => {
        const next = { ...prev };
        for (const v of fromFuel) next[v] = true;
        return next;
      });
    }

    const validBrands = new Set(brandOptions);
    const fromBrand = searchParams.getAll('brand').map(decodeParam).filter((b) => validBrands.has(b));
    if (fromBrand.length) {
      setBrands((prev) => {
        const next = { ...prev };
        for (const b of fromBrand) next[b] = true;
        return next;
      });
    }

    const cond = searchParams.get('condition');
    if (cond === 'Neu' || cond === 'Gebraucht') setCondition(cond);
  }, [searchParams, bodyTypeOptions, fuelOptions, brandOptions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minP = priceMin === '' ? null : Number(priceMin);
    const maxP = priceMax === '' ? null : Number(priceMax);
    const maxKm = mileageMax === '' ? null : Number(mileageMax);

    const list = cars.filter((car) => {
      if (q) {
        const titleLoc = carListTitle(car);
        const hay =
          `${titleLoc} ${car.title} ${car.brand} ${car.model} ${car.bodyType} ${car.fuel} ${bodyTypeLabel(car.bodyType)} ${fuelLabel(car.fuel)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activeBrandFilters.length && !activeBrandFilters.includes(car.brand)) return false;
      if (activeBodyTypeFilters.length && !activeBodyTypeFilters.includes(car.bodyType)) return false;
      if (activeFuelFilters.length && !activeFuelFilters.includes(car.fuel)) return false;
      if (condition !== 'all' && car.condition !== condition) return false;
      if (minP !== null && !Number.isNaN(minP) && car.price < minP) return false;
      if (maxP !== null && !Number.isNaN(maxP) && car.price > maxP) return false;
      if (maxKm !== null && !Number.isNaN(maxKm) && car.mileage > maxKm) return false;
      return true;
    });

    return sortList(list, sort);
  }, [
    query,
    activeBrandFilters,
    activeBodyTypeFilters,
    activeFuelFilters,
    condition,
    priceMin,
    priceMax,
    mileageMax,
    sort,
    carListTitle,
    bodyTypeLabel,
    fuelLabel,
  ]);

  const resetFilters = () => {
    setQuery('');
    setBrands({});
    setBodyTypes({});
    setFuels({});
    setCondition('all');
    setPriceMin('');
    setPriceMax('');
    setMileageMax('');
    setSort('year-desc');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    activeBrandFilters.length > 0 ||
    activeBodyTypeFilters.length > 0 ||
    activeFuelFilters.length > 0 ||
    condition !== 'all' ||
    priceMin !== '' ||
    priceMax !== '' ||
    mileageMax !== '';

  const conditionLabel = (c: 'all' | Car['condition']) => {
    if (c === 'all') return tf('all');
    if (c === 'Neu') return tf('new');
    return tf('used');
  };

  const FilterFields = (
    <div id="schnellsuche" className="scroll-mt-28 space-y-6">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">{t('brandFilter')}</p>
        <BrandIconRow
          brands={CAR_BRANDS}
          basePath="/cars"
          hash="#schnellsuche"
          activeBrand={activeBrandFromUrl}
          tone="emerald"
          ariaLabel={t('brandFilterAria')}
        />
      </div>

      <div>
        <label htmlFor="car-search" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
          {tf('quickSearch')}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="car-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tf('quickSearchPh')}
            className="w-full rounded-sm border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
          />
        </div>
      </div>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{tf('brand')}</legend>
        <div className="max-h-44 space-y-2 overflow-y-auto rounded-sm border border-slate-200 bg-slate-50/80 p-3">
          {brandOptions.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={!!brands[b]}
                onChange={() => toggleBrand(b)}
                className="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
              />
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{t('bodyTypeFilter')}</legend>
        <div className="space-y-2 rounded-sm border border-slate-200 bg-slate-50/80 p-3">
          {bodyTypeOptions.map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={!!bodyTypes[v]}
                onChange={() => toggleBodyType(v)}
                className="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
              />
              {bodyTypeLabel(v as Car['bodyType'])}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{t('fuelFilter')}</legend>
        <div className="space-y-2 rounded-sm border border-slate-200 bg-slate-50/80 p-3">
          {fuelOptions.map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={!!fuels[v]}
                onChange={() => toggleFuel(v)}
                className="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
              />
              {fuelLabel(v as Car['fuel'])}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{tf('condition')}</legend>
        <div className="flex flex-wrap gap-2">
          {(['all', 'Neu', 'Gebraucht'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setCondition(v)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                condition === v
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-500'
              }`}
            >
              {conditionLabel(v)}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{tf('priceEur')}</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={tf('priceMin')}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="rounded-sm border border-slate-300 px-2 py-2 text-sm font-medium outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={tf('priceMax')}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="rounded-sm border border-slate-300 px-2 py-2 text-sm font-medium outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="car-mileage-max" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
          {tf('mileageMax')}
        </label>
        <input
          id="car-mileage-max"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={tf('mileagePh')}
          value={mileageMax}
          onChange={(e) => setMileageMax(e.target.value)}
          className="w-full rounded-sm border border-slate-300 px-2 py-2 text-sm font-medium outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white py-2.5 text-xs font-black uppercase tracking-widest text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700"
        >
          <X className="h-4 w-4" />
          {tf('filterReset')}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Link href="/" className="transition hover:text-slate-900">
              {tf('breadcrumbHome')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            <span className="text-slate-900">{t('breadcrumbSearch')}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {t('titleLine')} <span className="text-emerald-700">{t('titleAccent')}</span>
              </h1>
              <p className="mt-1 max-w-xl text-sm font-medium text-slate-600">{t('filterSubtitle')}</p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <LayoutGrid className="h-4 w-4" aria-hidden />
                {t('catalogView')}
              </p>
              <Link
                href="/trucks"
                className="text-sm font-black uppercase tracking-widest text-emerald-700 underline-offset-4 transition hover:text-emerald-600 hover:underline"
              >
                {t('linkTrucks')}
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
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white py-3 text-sm font-black uppercase tracking-widest text-slate-900 shadow-sm"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? tf('filterClose') : tf('filterOpen')}
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className={`w-full shrink-0 lg:w-80 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-black text-slate-900">{tf('filterTitle')}</h2>
                <CarFront className="h-5 w-5 text-emerald-600" aria-hidden />
              </div>
              {FilterFields}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-sm border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-slate-700">
                <span className="font-black text-slate-900">{filtered.length}</span>{' '}
                {filtered.length === 1 ? tf('foundOne') : tf('foundMany')}
              </p>
              <div className="flex flex-col gap-1 sm:items-end">
                <label htmlFor="sort-cars" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {tf('sort')}
                </label>
                <select
                  id="sort-cars"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="min-w-[220px] rounded-sm border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm font-bold text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
                >
                  {SORT_IDS.map((id) => (
                    <option key={id} value={id}>
                      {tf(SORT_LABEL_KEY[id])}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {query.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                    „{query.trim()}“
                  </span>
                )}
                {activeBrandFilters.map((b) => (
                  <span key={b} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                    {b}
                  </span>
                ))}
                {activeBodyTypeFilters.map((v) => (
                  <span key={v} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                    {bodyTypeLabel(v as Car['bodyType'])}
                  </span>
                ))}
                {activeFuelFilters.map((v) => (
                  <span key={v} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                    {fuelLabel(v as Car['fuel'])}
                  </span>
                ))}
                {condition !== 'all' && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                    {conditionLabel(condition)}
                  </span>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-sm border border-slate-200 bg-white px-8 py-20 text-center shadow-sm">
                <CarFront className="mx-auto mb-4 h-14 w-14 text-slate-300" />
                <h3 className="font-heading text-xl font-black text-slate-900">{tf('noResults')}</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">{tf('noResultsHint')}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-sm bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-700"
                >
                  {tf('showAll')}
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {filtered.map((car) => (
                  <li key={car.id}>
                    <Link
                      href={`/cars/${car.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:border-emerald-400 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] w-full bg-slate-200">
                        <Image
                          src={car.images[0]}
                          alt={carListTitle(car)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <span className="bg-emerald-700/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                            {t('badge')}
                          </span>
                          <span className="bg-slate-900/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                            {car.condition === 'Neu' ? tf('new') : tf('used')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="font-heading text-base font-black leading-snug text-slate-900 transition group-hover:text-emerald-800 sm:text-lg">
                          {carListTitle(car)}
                        </h3>
                        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-4 text-sm">
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tf('year')}</dt>
                            <dd className="font-bold text-slate-900">{car.year}</dd>
                          </div>
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tf('mileage')}</dt>
                            <dd className="font-bold text-slate-900">
                              {car.mileage.toLocaleString(nl)} {tCommon('km')}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tf('power')}</dt>
                            <dd className="font-bold text-slate-900">
                              {car.power} {tCommon('powerUnit')}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tf('brandLabel')}</dt>
                            <dd className="font-bold text-slate-900">{car.brand}</dd>
                          </div>
                        </dl>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1">
                            <Fuel className="h-3 w-3" aria-hidden />
                            {fuelLabel(car.fuel)}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-1">{bodyTypeLabel(car.bodyType)}</span>
                        </div>
                        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('price')}</p>
                            <p className="font-heading text-xl font-black text-slate-900 sm:text-2xl">{formatEur(car.price)}</p>
                          </div>
                          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-200 text-slate-900 transition group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
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
