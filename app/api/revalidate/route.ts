import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { WP_INVENTORY_CACHE_TAG } from '@/lib/wordpress-api';

const INVENTORY_PATHS = ['/', '/cars', '/trucks', '/new-arrivals'];

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, message: 'REVALIDATE_SECRET is not configured' }, { status: 503 });
  }

  const provided =
    request.nextUrl.searchParams.get('secret') ??
    request.headers.get('x-revalidate-secret') ??
    '';

  if (provided !== secret) {
    return NextResponse.json({ ok: false, message: 'Invalid secret' }, { status: 401 });
  }

  revalidateTag(WP_INVENTORY_CACHE_TAG);

  for (const path of INVENTORY_PATHS) {
    revalidatePath(path, 'layout');
    revalidatePath(path, 'page');
  }

  revalidatePath('/[locale]', 'layout');
  revalidatePath('/[locale]/cars', 'page');
  revalidatePath('/[locale]/trucks', 'page');
  revalidatePath('/[locale]/new-arrivals', 'page');
  revalidatePath('/[locale]/cars/[id]', 'page');
  revalidatePath('/[locale]/trucks/[id]', 'page');

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: WP_INVENTORY_CACHE_TAG,
    at: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
