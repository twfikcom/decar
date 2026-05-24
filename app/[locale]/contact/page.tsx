import type { Metadata } from 'next';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type ContactEmailRow = { email: string; note: string };

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
  const emails = t.raw('emails') as ContactEmailRow[];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-24">
      <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-red-600/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 className="mb-12 text-center font-heading text-5xl font-black uppercase tracking-tighter text-black drop-shadow-xl md:text-7xl">
          {t('title')}
        </h1>

        <section
          className="mb-10 transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_16px_40px_rgba(0,0,0,0.08)] md:p-10"
          aria-labelledby="contact-details-heading"
        >
          <h2
            id="contact-details-heading"
            className="mb-8 border-b-4 border-zinc-100 pb-4 font-heading text-2xl font-black uppercase tracking-tight text-black md:text-3xl"
          >
            {t('detailsTitle')}
          </h2>

          <div className="space-y-8 text-zinc-800">
            <div className="flex gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{t('labelAddress')}</p>
                <p className="mt-1 text-lg font-bold leading-snug text-black">
                  {t('addressLine1')}
                  <br />
                  {t('addressLine2')}
                  <br />
                  {t('addressCountry')}
                </p>
                <p className="mt-3 text-sm font-bold text-zinc-600">
                  <span className="font-black uppercase tracking-wider text-zinc-500">{t('labelPlz')}: </span>
                  {t('plz')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{t('labelPhone')}</p>
                <ul className="mt-2 space-y-2 text-lg font-bold">
                  <li>
                    <a href="tel:+491625340209" className="text-black underline decoration-red-600/40 underline-offset-2 hover:text-red-700">
                      {t('phone1')}
                    </a>
                  </li>
                  <li>
                    <a href="tel:+491625330280" className="text-black underline decoration-red-600/40 underline-offset-2 hover:text-red-700">
                      {t('phone2')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{t('emailsTitle')}</p>
                <ul className="mt-3 space-y-4">
                  {emails.map((row) => (
                    <li key={row.email} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                      <a
                        href={`mailto:${row.email}`}
                        className="block font-mono text-base font-black text-red-700 hover:text-red-900 sm:text-lg"
                        dir="ltr"
                      >
                        {row.email}
                      </a>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-zinc-600">{row.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500 hover:shadow-[0_25px_50px_rgba(220,38,38,0.15)] md:p-14">
          <div className="mb-12 rounded-2xl border-2 border-zinc-100 bg-zinc-50 p-8 text-center">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-widest text-black">{t('fastTitle')}</h2>
            <p className="mb-6 text-lg font-bold text-zinc-600">{t('fastText')}</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="https://wa.me/491625340209"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#25D366] to-[#1da851] px-8 py-4 text-base font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#128c3e] transition-all hover:translate-y-[4px] hover:shadow-[0_4px_0_0_#128c3e] active:translate-y-[8px] active:shadow-transparent sm:w-auto sm:px-10 sm:py-5 sm:text-lg"
              >
                <MessageCircle className="h-7 w-7 shrink-0" />
                {t('whatsappLabel')} · {t('phone1')}
              </a>
              <a
                href="https://wa.me/491625330280"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#25D366] to-[#1da851] px-8 py-4 text-base font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#128c3e] transition-all hover:translate-y-[4px] hover:shadow-[0_4px_0_0_#128c3e] active:translate-y-[8px] active:shadow-transparent sm:w-auto sm:px-10 sm:py-5 sm:text-lg"
              >
                <MessageCircle className="h-7 w-7 shrink-0" />
                {t('whatsappLabel')} · {t('phone2')}
              </a>
            </div>
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
