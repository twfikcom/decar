/**
 * Toggle public price display vs. “Ask price” (WhatsApp) flow.
 * Default: prices hidden (ask-price mode). Set NEXT_PUBLIC_SHOW_PRICES=true to show EUR prices.
 */
export function showPublicPrices(): boolean {
  const raw = process.env.NEXT_PUBLIC_SHOW_PRICES;
  if (raw === undefined || raw === '') return false;
  const v = String(raw).trim().toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return true;
  return false;
}

/** E.164 digits only, no + prefix. */
export function whatsAppNumberE164(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_E164 || '491625330280').replace(/\D/g, '');
}

export function whatsappDeepLinkWithText(plainText: string): string {
  const n = whatsAppNumberE164();
  return `https://wa.me/${n}?text=${encodeURIComponent(plainText)}`;
}
