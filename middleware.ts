import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Prevent CDNs/proxies from serving cached RSC payloads as HTML documents.
 * See: https://www.contentstack.com/docs/developers/launch/handling-nextjs-rsc-issues-on-launch
 */
function sanitizeRscRequest(request: NextRequest): NextRequest {
  const hasRscHeader = request.headers.get('Rsc') === '1';
  const hasRscQuery = request.nextUrl.searchParams.has('_rsc');

  if (!hasRscHeader || hasRscQuery) {
    return request;
  }

  const headers = new Headers(request.headers);
  headers.delete('Rsc');
  headers.delete('Next-Router-State-Tree');
  headers.delete('Next-Router-Prefetch');
  headers.delete('Next-Router-Segment-Prefetch');

  return new NextRequest(request.url, {
    headers,
    method: request.method,
  });
}

export default function middleware(request: NextRequest) {
  const sanitized = sanitizeRscRequest(request);
  const response = intlMiddleware(sanitized);

  response.headers.set('Vary', 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
