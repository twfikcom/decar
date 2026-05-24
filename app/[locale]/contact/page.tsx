import type { Metadata } from 'next';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactEmailRows from '@/components/ContactEmailRows';

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

const WHATSAPP_NUMBER = '491625330280';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const emails = t.raw('emails') as ContactEmailRow[];
  const colDir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-24">
      <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-red-600/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <h1 className="mb-10 text-center font-heading text-4xl font-black uppercase tracking-tighter text-black drop-shadow-xl md:mb-12 md:text-6xl lg:text-7xl">
          {t('title')}
        </h1>

        {/* dir=ltr keeps info visually left + form right on desktop regardless of page RTL */}
        <div dir="ltr" className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <section
            dir={colDir}
            className="transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] md:p-8"
            aria-labelledby="contact-details-heading"
          >
            <h2
              id="contact-details-heading"
              className="mb-6 border-b-4 border-zinc-100 pb-3 font-heading text-xl font-black uppercase tracking-tight text-black md:text-2xl"
            >
              {t('detailsTitle')}
            </h2>

            <div className="space-y-6 text-zinc-800">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('labelAddress')}</p>
                  <p className="mt-1 text-base font-bold leading-snug text-black md:text-lg">
                    {t('addressLine1')}
                    <br />
                    {t('addressLine2')}
                    <br />
                    {t('addressCountry')}
                  </p>
                  <p className="mt-2 text-xs font-bold text-zinc-600 md:text-sm">
                    <span className="font-black uppercase tracking-wider text-zinc-500">{t('labelPlz')}: </span>
                    {t('plz')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('labelPhone')}</p>
                  <ul className="mt-1.5 space-y-1.5 text-sm font-bold md:text-base">
                    <li>
                      <a
                        href="tel:+491625340209"
                        className="text-black underline decoration-red-600/40 underline-offset-2 hover:text-red-700"
                        dir="ltr"
                      >
                        {t('phone1')}
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+491625330280"
                        className="text-black underline decoration-red-600/40 underline-offset-2 hover:text-red-700"
                        dir="ltr"
                      >
                        {t('phone2')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-zinc-50/80 p-4">
                <h3 className="mb-1 text-xs font-black uppercase tracking-widest text-zinc-600">{t('fastTitle')}</h3>
                <p className="mb-3 text-xs font-semibold leading-snug text-zinc-600 md:text-sm">{t('fastText')}</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#25D366] to-[#1da851] px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#128c3e] transition-all hover:translate-y-[3px] hover:shadow-[0_3px_0_0_#128c3e] active:translate-y-[6px] active:shadow-transparent sm:text-sm"
                  dir="ltr"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                  {t('whatsappBtn')}
                </a>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('emailsTitle')}</p>
                  <ContactEmailRows
                    emails={emails}
                    copyLabel={t('copyEmail')}
                    copiedLabel={t('copiedEmail')}
                  />
                </div>
              </div>
            </div>
          </section>

          <div
            dir={colDir}
            className="transform-gpu rounded-3xl border-4 border-zinc-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500 hover:shadow-[0_25px_50px_rgba(220,38,38,0.15)] md:p-8 lg:p-10"
          >
            <h2 className="mb-1 font-heading text-xl font-black uppercase tracking-tight text-black md:text-2xl">
              {t('formTitle')}
            </h2>
            <p className="mb-6 text-xs font-semibold text-zinc-600 md:text-sm">{t('formLead')}</p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-600">{t('firstName')}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-3 text-sm font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-600">{t('lastName')}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-3 text-sm font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-600">{t('email')}</label>
                <input
                  type="email"
                  className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-3 text-sm font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-600">{t('message')}</label>
                <textarea
                  rows={6}
                  className="w-full resize-none rounded-xl border-2 border-zinc-200 bg-zinc-50 p-3 text-sm font-bold text-black transition-colors focus:border-red-500 focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-gradient-to-b from-black to-zinc-900 py-4 text-base font-black uppercase tracking-widest text-white shadow-[0_8px_0_0_#27272a] transition-all hover:translate-y-[4px] hover:shadow-[0_4px_0_0_#27272a] active:translate-y-[8px] active:shadow-transparent"
              >
                {t('submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
