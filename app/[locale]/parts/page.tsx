import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { withSeo } from '@/lib/seo';
import { getParts } from '@/lib/products';
import { whatsappDeepLinkWithText } from '@/lib/public-pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return withSeo(locale, 'parts', {
    title: t('partsTitle'),
    description: t('partsDescription'),
  });
}

export default async function PartsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Parts');
  const tCommon = await getTranslations('Common');
  const parts = await getParts(locale);

  const heroAccent = t('heroTitleAccent').trim();

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="border-b-[8px] border-red-600 bg-gradient-to-r from-zinc-900 via-zinc-800 to-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-orange-400">{t('heroEyebrow')}</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            {heroAccent ? (
              <>
                <span className="text-white">{t('heroTitle')}</span>{' '}
                <span className="text-orange-500">{heroAccent}</span>
              </>
            ) : (
              <span className="text-orange-500">{t('heroTitle')}</span>
            )}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-zinc-400 sm:text-lg">{t('heroText')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {parts.length === 0 ? (
          <p className="text-center text-lg font-bold text-zinc-600">{t('empty')}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => {
              const wa = whatsappDeepLinkWithText(tCommon('whatsappAskPrefill', { title: part.title }));
              return (
                <li
                  key={part.id}
                  className="flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[0_8px_0_0_rgba(0,0,0,0.85)]"
                >
                  <div className="relative aspect-[4/3] w-full bg-zinc-200">
                    <Image
                      src={part.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-heading text-xl font-black text-zinc-900">{part.title}</h2>
                    <div
                      className="mt-3 flex-1 text-sm leading-relaxed text-zinc-700 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-5 [&_a]:text-orange-600 [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: part.description || `<p>${t('noDescription')}</p>` }}
                    />
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-gradient-to-b from-orange-500 to-red-600 px-4 py-3 text-center text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_0_0_#18181b] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#18181b] active:translate-y-1 active:shadow-none"
                    >
                      <MessageCircle className="h-5 w-5 shrink-0 text-white" aria-hidden />
                      {tCommon('askPrice')}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
