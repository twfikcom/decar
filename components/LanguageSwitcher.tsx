'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Lang');

  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-black/20 bg-black/25 p-0.5 backdrop-blur-sm"
      role="navigation"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded px-2 py-1 text-[10px] font-black uppercase tracking-wider transition sm:text-[11px] ${
            loc === locale ? 'bg-white text-black shadow-sm' : 'text-white/85 hover:bg-white/15'
          }`}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
