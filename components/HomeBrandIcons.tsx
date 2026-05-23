import { getTranslations } from 'next-intl/server';
import BrandIconRow from '@/components/BrandIconRow';
import { CAR_BRANDS, TRUCK_BRANDS } from '@/lib/brand-icons';

type HomeBrandIconsProps = {
  kind: 'trucks' | 'cars';
};

export default async function HomeBrandIcons({ kind }: HomeBrandIconsProps) {
  const t = await getTranslations('Home');
  const isTrucks = kind === 'trucks';

  return (
    <div className="mb-10 w-full md:mb-12">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
        {isTrucks ? t('brandStripTrucks') : t('brandStripCars')}
      </p>
      <BrandIconRow
        brands={isTrucks ? TRUCK_BRANDS : CAR_BRANDS}
        basePath={isTrucks ? '/trucks' : '/cars'}
        hash={isTrucks ? '#schnellsuche' : '#brand-filter'}
        tone={isTrucks ? 'red' : 'emerald'}
        ariaLabel={isTrucks ? t('brandStripTrucksAria') : t('brandStripCarsAria')}
      />
    </div>
  );
}
