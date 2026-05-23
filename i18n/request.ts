import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages: Record<string, unknown> = {
    ...(await import(`../messages/${locale}.json`)).default,
  };

  if (locale === 'en') {
    messages.Inventory = (await import(`../messages/inventory-en.json`)).default;
  } else if (locale === 'ar') {
    messages.Inventory = (await import(`../messages/inventory-ar.json`)).default;
  } else {
    messages.Inventory = {};
  }

  return {
    locale,
    messages,
  };
});
