import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { getInventoryCount } from '@/lib/products';
import WarrantyShieldTruckIcon from '@/components/icons/WarrantyShieldTruckIcon';

const NEW_IMG =
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80';
const SERVICE_IMG =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80';

export default async function HomeHighlightCards() {
  const t = await getTranslations('HomeHighlight');
  const locale = await getLocale();
  const total = await getInventoryCount();

  const barRow = (label: string) => (
    <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-4 py-3 sm:px-5">
      <span className="text-left text-sm font-black uppercase tracking-wide text-white sm:text-[13px]">
        {label}
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-white opacity-95 rtl:rotate-180"
        strokeWidth={2.5}
        aria-hidden
      />
    </div>
  );

  return (
    <section className="border-y border-zinc-800 bg-black py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Warranty — icon only, informational card */}
          <article className="flex flex-col overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <div className="relative flex aspect-square items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
              <WarrantyShieldTruckIcon
                className="h-[min(52%,220px)] w-[min(52%,220px)] drop-shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
                wordmark={t('warrantyIconWord')}
                textDir={locale === 'ar' ? 'rtl' : 'ltr'}
                locale={locale}
              />
            </div>
            {barRow(t('warrantyBar'))}
            <p className="grow px-4 py-5 text-sm font-medium leading-relaxed text-zinc-300 sm:px-5 sm:text-[15px]">
              {t('warrantyDesc')}
            </p>
          </article>

          <Link
            href="/new-arrivals"
            className="group flex flex-col overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-[0_12px_40px_rgba(0,0,0,0.45)] outline-none ring-orange-500/0 transition hover:border-orange-500/40 hover:shadow-[0_16px_48px_rgba(234,88,12,0.2)] focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
              <Image
                src={NEW_IMG}
                alt={t('newArrivalsImageAlt')}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {barRow(t('newArrivalsBar', { count: total }))}
            <p className="grow px-4 py-5 text-sm font-medium leading-relaxed text-zinc-300 sm:px-5 sm:text-[15px]">
              {t('newArrivalsDesc')}
            </p>
          </Link>

          <Link
            href="/service"
            className="group flex flex-col overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-[0_12px_40px_rgba(0,0,0,0.45)] outline-none ring-orange-500/0 transition hover:border-orange-500/40 hover:shadow-[0_16px_48px_rgba(234,88,12,0.2)] focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
              <Image
                src={SERVICE_IMG}
                alt={t('maintenanceImageAlt')}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            </div>
            {barRow(t('maintenanceBar'))}
            <p className="grow px-4 py-5 text-sm font-medium leading-relaxed text-zinc-300 sm:px-5 sm:text-[15px]">
              {t('maintenanceDesc')}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
