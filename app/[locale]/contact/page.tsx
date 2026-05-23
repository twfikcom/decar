import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-24">
      <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-red-600/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="mb-12 text-center font-heading text-5xl font-black uppercase tracking-tighter text-black drop-shadow-xl md:text-7xl">
          {t('title')}
        </h1>

        <div className="transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500 hover:shadow-[0_25px_50px_rgba(220,38,38,0.15)] md:p-14">
          <div className="mb-12 rounded-2xl border-2 border-zinc-100 bg-zinc-50 p-8 text-center">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-widest text-black">{t('fastTitle')}</h2>
            <p className="mb-6 text-lg font-bold text-zinc-600">{t('fastText')}</p>
            <a
              href="https://wa.me/201027266627"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#25D366] to-[#1da851] px-10 py-5 text-xl font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#128c3e] transition-all hover:translate-y-[4px] hover:shadow-[0_4px_0_0_#128c3e] active:translate-y-[8px] active:shadow-transparent"
            >
              <MessageCircle className="h-8 w-8" />
              {t('whatsappBtn')}
            </a>
          </div>

          <div className="relative mb-8 flex items-center py-5">
            <div className="flex-grow border-t-4 border-zinc-100" />
            <span className="mx-6 flex-shrink-0 font-black uppercase tracking-widest text-zinc-400">{t('orEmail')}</span>
            <div className="flex-grow border-t-4 border-zinc-100" />
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-black uppercase tracking-widest text-zinc-600">{t('firstName')}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-black uppercase tracking-widest text-zinc-600">{t('lastName')}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-3 block text-sm font-black uppercase tracking-widest text-zinc-600">{t('email')}</label>
              <input
                type="email"
                className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-3 block text-sm font-black uppercase tracking-widest text-zinc-600">{t('message')}</label>
              <textarea
                rows={6}
                className="w-full resize-none rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-gradient-to-b from-black to-zinc-900 py-5 text-xl font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#27272a] transition-all hover:translate-y-[4px] hover:shadow-[0_4px_0_0_#27272a] active:translate-y-[8px] active:shadow-transparent"
            >
              {t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
