import type { Metadata } from 'next';
import { Building2, MapPin, Phone, Languages, User } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PageMeta' });
  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  const tel1 = t('phone1').replace(/\s/g, '');
  const tel2 = t('phone2').replace(/\s/g, '');

  return (
    <div className="min-h-screen bg-zinc-100 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center md:text-start">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-red-600">{t('sectionData')}</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">{t('pageTitle')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-zinc-600 md:mx-0">{t('pageLead')}</p>
        </header>

        <div className="space-y-8">
          <section className="rounded-2xl border-4 border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="mb-6 flex items-center gap-2 border-b-2 border-zinc-100 pb-4 font-heading text-xl font-black text-zinc-900">
              <User className="h-6 w-6 text-red-600" aria-hidden />
              {t('sectionData')}
            </h2>
            <ul className="space-y-8">
              <li>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">{t('labelName')}</p>
                <p className="mt-1 text-lg font-black text-zinc-900">{t('person1Name')}</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-600">{t('person1Role')}</p>
              </li>
              <li>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">{t('labelName')}</p>
                <p className="mt-1 text-lg font-black text-zinc-900">{t('person2Name')}</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-600">{t('person2Role')}</p>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border-4 border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="mb-6 flex items-center gap-2 border-b-2 border-zinc-100 pb-4 font-heading text-xl font-black text-zinc-900">
              <Building2 className="h-6 w-6 text-red-600" aria-hidden />
              {t('labelCompanyName')}
            </h2>
            <p className="text-lg font-black text-zinc-900">{t('companyName')}</p>
          </section>

          <section className="rounded-2xl border-4 border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="mb-6 flex items-center gap-2 border-b-2 border-zinc-100 pb-4 font-heading text-xl font-black text-zinc-900">
              <MapPin className="h-6 w-6 text-red-600" aria-hidden />
              {t('labelAddress')}
            </h2>
            <address className="not-italic text-base font-medium leading-relaxed text-zinc-700">
              {t('addressLine1')}
              <br />
              {t('addressLine2')}
              <br />
              {t('addressLine3')}
            </address>
            <dl className="mt-6 border-t border-zinc-100 pt-6">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">{t('labelPlz')}</dt>
              <dd className="mt-1 font-bold text-zinc-900">{t('plz')}</dd>
            </dl>
          </section>

          <section className="rounded-2xl border-4 border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="mb-6 flex items-center gap-2 border-b-2 border-zinc-100 pb-4 font-heading text-xl font-black text-zinc-900">
              <Phone className="h-6 w-6 text-red-600" aria-hidden />
              {t('labelPhone')}
            </h2>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${tel1}`} className="text-lg font-black text-red-700 underline-offset-2 hover:text-red-600 hover:underline">
                  {t('phone1')}
                </a>
              </li>
              <li>
                <a href={`tel:${tel2}`} className="text-lg font-black text-red-700 underline-offset-2 hover:text-red-600 hover:underline">
                  {t('phone2')}
                </a>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border-4 border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-black text-zinc-900">
              <Languages className="h-6 w-6 text-red-600" aria-hidden />
              {t('labelLanguages')}
            </h2>
            <p className="text-base font-medium leading-relaxed text-zinc-700">{t('languages')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
