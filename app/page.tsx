import { redirect } from 'next/navigation';

/** Fallback redirect if middleware is bypassed by the CDN/proxy. */
export default function RootPage() {
  redirect('/de');
}
