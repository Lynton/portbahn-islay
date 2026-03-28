/**
 * llms.txt — AI content discovery index
 *
 * Per the llms.txt spec (https://llmstxt.org/), provides a structured
 * markdown index of all site content with links to markdown versions.
 *
 * Fetches live slugs from Sanity so new pages appear automatically.
 */

import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk';

const TRAVEL_SLUGS = [
  'ferry-to-islay',
  'flights-to-islay',
  'planning-your-trip',
  'travelling-without-a-car',
  'travelling-to-islay-with-your-dog',
  'arriving-on-islay',
  'getting-around-islay',
];

interface SlugDoc {
  slug: { current: string };
  title?: string;
  name?: string;
  _updatedAt?: string;
}

export async function GET() {
  try {
    const [properties, explorePages, travelPages] = await Promise.all([
      client.fetch<SlugDoc[]>(
        `*[_type == "property" && defined(slug.current) && !(_id in path("drafts.**"))]{
          slug, name, _updatedAt
        } | order(name asc)`
      ),
      client.fetch<SlugDoc[]>(
        `*[_type == "guidePage" && defined(slug.current) && !(slug.current in $travelSlugs) && !(_id in path("drafts.**"))]{
          slug, title, _updatedAt
        } | order(title asc)`,
        { travelSlugs: TRAVEL_SLUGS }
      ),
      client.fetch<SlugDoc[]>(
        `*[_type == "guidePage" && slug.current in $travelSlugs && !(_id in path("drafts.**"))]{
          slug, title, _updatedAt
        } | order(title asc)`,
        { travelSlugs: TRAVEL_SLUGS }
      ),
    ]);

    const lines: string[] = [
      '# Portbahn Islay',
      '',
      '> Three self-catering holiday rentals in Bruichladdich, Isle of Islay, Scotland.',
      '> Managed by Pi & Lynton. 600+ guests hosted, 4.97/5 average rating.',
      '',
      `- [Website](${baseUrl})`,
      `- [Full content (markdown)](${baseUrl}/llms-full.txt)`,
      '',
    ];

    // Properties
    if (properties.length) {
      lines.push('## Holiday Properties', '');
      for (const p of properties) {
        const slug = p.slug.current;
        lines.push(
          `- [${p.name || slug}](${baseUrl}/accommodation/${slug}): [markdown](${baseUrl}/api/md/accommodation/${slug})`
        );
      }
      lines.push('');
    }

    // Explore Islay guides
    if (explorePages.length) {
      lines.push('## Explore Islay Guides', '');
      for (const g of explorePages) {
        const slug = g.slug.current;
        lines.push(
          `- [${g.title || slug}](${baseUrl}/explore-islay/${slug}): [markdown](${baseUrl}/api/md/explore-islay/${slug})`
        );
      }
      lines.push('');
    }

    // Travel guides
    if (travelPages.length) {
      lines.push('## Getting to Islay', '');
      for (const g of travelPages) {
        const slug = g.slug.current;
        lines.push(
          `- [${g.title || slug}](${baseUrl}/islay-travel/${slug}): [markdown](${baseUrl}/api/md/islay-travel/${slug})`
        );
      }
      lines.push('');
    }

    const content = lines.join('\n');

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('[/llms.txt] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
