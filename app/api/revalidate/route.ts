/**
 * On-demand revalidation endpoint.
 *
 * Clears Next.js Data Cache and Full Route Cache for specified paths.
 * Use after Sanity content changes to force pages to re-fetch immediately.
 *
 * Usage:
 *   GET /api/revalidate?secret=<REVALIDATE_SECRET>&path=/explore-islay
 *   GET /api/revalidate?secret=<REVALIDATE_SECRET>&path=all
 *
 * Set REVALIDATE_SECRET in Vercel environment variables and .env.local.
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const ALL_PATHS = [
  '/',
  '/accommodation',
  '/accommodation/portbahn-house',
  '/accommodation/shorefield-eco-house',
  '/accommodation/curlew-cottage',
  '/explore-islay',
  '/explore-islay/islay-distilleries',
  '/explore-islay/islay-beaches',
  '/explore-islay/islay-wildlife',
  '/explore-islay/food-and-drink',
  '/explore-islay/walking',
  '/explore-islay/family-holidays',
  '/explore-islay/islay-villages',
  '/explore-islay/visit-jura',
  '/explore-islay/archaeology-history',
  '/explore-islay/dog-friendly-islay',
  '/islay-travel',
  '/islay-travel/ferry-to-islay',
  '/islay-travel/flights-to-islay',
  '/islay-travel/planning-your-trip',
  '/islay-travel/travelling-without-a-car',
  '/islay-travel/travelling-to-islay-with-your-dog',
  '/islay-travel/arriving-on-islay',
  '/islay-travel/getting-around-islay',
  '/about-us',
  '/contact',
];

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Missing path parameter' }, { status: 400 });
  }

  try {
    if (path === 'all') {
      for (const p of ALL_PATHS) {
        revalidatePath(p);
      }
      return NextResponse.json({ revalidated: true, paths: ALL_PATHS });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 });
  }
}
