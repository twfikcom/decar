import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  let req = request;

  // CDN/proxy may forward RSC headers without ?_rsc= — that returns raw payload instead of HTML
  if (request.headers.get('Rsc') === '1' && !request.nextUrl.searchParams.has('_rsc')) {
    const headers = new Headers(request.headers);
    headers.delete('Rsc');
    headers.delete('Next-Router-State-Tree');
    headers.delete('Next-Router-Prefetch');
    headers.delete('Next-Router-Segment-Prefetch');
    req = new NextRequest(request.nextUrl, {
      headers,
      method: request.method,
    });
  }

  const response = intlMiddleware(req);
  response.headers.set('Vary', 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
