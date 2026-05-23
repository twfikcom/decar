import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import {
  Wrench,
  Gauge,
  Snowflake,
  CircleDot,
  Cpu,
  Truck,
  ShieldCheck,
  CalendarClock,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const SERVICE_ICONS = [ShieldCheck, Gauge, CircleDot, Cpu, Snowflake, Truck, CalendarClock, Wrench] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return {
    title: t('serviceTitle'),
    description: t('serviceDescription'),
  };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Service');
  const tCta = await getTranslations('ServiceCta');
  const items = t.raw('items') as { title: string; text: string }[];
  const heroTitle = t('heroTitle');
  const heroAccent = t('heroTitleAccent').trim();

  return (
    <div className="min-h-screen bg-zinc-100">
      <div
        className="relative border-b-[8px] border-red-600 bg-black px-4 py-20 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(127,29,29,0.35), transparent), url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/65" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-orange-400">{t('heroEyebrow')}</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            {heroAccent ? (
              <>
                <span className="text-white">{heroTitle}</span>{' '}
                <span className="text-orange-500">{heroAccent}</span>
              </>
            ) : (
              <span className="text-orange-500">{heroTitle}</span>
            )}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-bold text-zinc-300">{t('heroText')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-black text-zinc-900 sm:text-4xl">{t('sectionTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-zinc-600">{t('sectionText')}</p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, text }, i) => {
            const Icon = SERVICE_ICONS[i] ?? Wrench;
            return (
              <li
                key={`${title}-${i}`}
                className="flex flex-col rounded-2xl border-4 border-zinc-200 bg-white p-8 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition hover:border-red-500 hover:shadow-[0_20px_40px_rgba(220,38,38,0.12)]"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-lg">
                  <Icon className="h-7 w-7" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="font-heading text-xl font-black text-zinc-900">{title}</h3>
                <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-zinc-600">{text}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 rounded-2xl border-4 border-zinc-900 bg-zinc-900 p-8 text-center text-white sm:p-12">
          <h2 className="font-heading text-2xl font-black sm:text-3xl">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-zinc-400">{t('ctaText')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+491625330280"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-widest transition hover:bg-white hover:text-zinc-900"
            >
              <Phone className="h-5 w-5" aria-hidden />
              +49 162 5330280
            </a>
            <a
              href="https://wa.me/491625330280"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_0_0_#166534] transition hover:brightness-110 active:translate-y-0.5 active:shadow-none"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {tCta('whatsappLabel')}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-orange-500 bg-orange-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-orange-500"
            >
              {t('ctaForm')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
