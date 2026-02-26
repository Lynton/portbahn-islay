/**
 * inject-description-links.ts
 *
 * Injects inline links into property description and locationIntro
 * PortableText fields. Links each entity/place name to its guide page
 * on the first occurrence only — avoids over-linking.
 *
 * Safe to re-run — checks for existing links before applying.
 */

import { createClient } from 'next-sanity';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

function key(): string {
  return randomBytes(5).toString('hex');
}

// ── Link map per property per field ────────────────────────────────────────
// phrase = exact string as it appears in the text (case-sensitive)
// href   = internal path or external URL

interface LinkSpec {
  phrase: string;
  href: string;
}

const descriptionLinks: Record<string, LinkSpec[]> = {
  'portbahn-house': [
    { phrase: 'Bruichladdich Distillery', href: '/explore-islay/islay-distilleries' },
    { phrase: 'Portbahn Beach',           href: '/explore-islay/islay-beaches' },
    { phrase: 'Port Charlotte',           href: '/explore-islay/food-and-drink' },
    { phrase: 'distillery tours',         href: '/explore-islay/islay-distilleries' },
    { phrase: 'beach days',               href: '/explore-islay/islay-beaches' },
  ],
  'shorefield-eco-house': [
    { phrase: 'Bruichladdich Distillery', href: '/explore-islay/islay-distilleries' },
    { phrase: 'bird watching',            href: '/explore-islay/islay-wildlife' },
    { phrase: 'Port Charlotte',           href: '/explore-islay/food-and-drink' },
    { phrase: 'beaches',                  href: '/explore-islay/islay-beaches' },
  ],
  'curlew-cottage': [
    { phrase: 'Bruichladdich Distillery', href: '/explore-islay/islay-distilleries' },
    { phrase: 'Port Charlotte',           href: '/explore-islay/food-and-drink' },
    { phrase: 'beaches',                  href: '/explore-islay/islay-beaches' },
    { phrase: 'distilleries',             href: '/explore-islay/islay-distilleries' },
  ],
};

const locationIntroLinks: Record<string, LinkSpec[]> = {
  'portbahn-house': [
    { phrase: 'Bruichladdich Distillery', href: '/explore-islay/islay-distilleries' },
    { phrase: 'Port Charlotte',           href: '/explore-islay/food-and-drink' },
  ],
  'shorefield-eco-house': [
    { phrase: 'Port Charlotte',           href: '/explore-islay/food-and-drink' },
  ],
  'curlew-cottage': [
    { phrase: 'Port Charlotte',           href: '/explore-islay/food-and-drink' },
  ],
};

// ── Core linkify function ──────────────────────────────────────────────────

function injectLinks(blocks: any[], links: LinkSpec[]): { blocks: any[]; count: number } {
  const usedPhrases = new Set<string>();
  let count = 0;

  const newBlocks = blocks.map((block) => {
    if (block._type !== 'block') return block;

    let children: any[] = [...block.children];
    const markDefs: any[] = [...(block.markDefs || [])];

    for (const { phrase, href } of links) {
      if (usedPhrases.has(phrase)) continue;

      let found = false;
      const newChildren: any[] = [];

      for (const span of children) {
        // Already found in this block, or not a plain span, or doesn't contain phrase
        if (found || span._type !== 'span' || !span.text.includes(phrase)) {
          newChildren.push(span);
          continue;
        }

        // Sanity check: phrase isn't already inside a link mark on this span
        const existingLinkMarks = (span.marks || []).filter((m: string) =>
          markDefs.some((md) => md._key === m && md._type === 'link')
        );
        if (existingLinkMarks.length > 0) {
          newChildren.push(span);
          continue;
        }

        const idx = span.text.indexOf(phrase);
        const before = span.text.substring(0, idx);
        const after = span.text.substring(idx + phrase.length);

        const linkKey = key();
        markDefs.push({ _key: linkKey, _type: 'link', href });

        if (before) {
          newChildren.push({ _type: 'span', _key: key(), text: before, marks: span.marks || [] });
        }
        newChildren.push({
          _type: 'span',
          _key: key(),
          text: phrase,
          marks: [...(span.marks || []), linkKey],
        });
        if (after) {
          newChildren.push({ _type: 'span', _key: key(), text: after, marks: span.marks || [] });
        }

        found = true;
        usedPhrases.add(phrase);
        count++;
      }

      if (found) children = newChildren;
    }

    return { ...block, children, markDefs };
  });

  return { blocks: newBlocks, count };
}

// ── Check if field already has any links ──────────────────────────────────

function hasExistingLinks(blocks: any[]): boolean {
  return blocks.some(
    (b) => b._type === 'block' && Array.isArray(b.markDefs) && b.markDefs.length > 0
  );
}

// ── Main ──────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== inject-description-links.ts ===\n');

  const properties = await client.fetch(
    `*[_type=="property"]{_id, name, "slug": slug.current, description, locationIntro}`
  );

  for (const prop of properties) {
    const slug = prop.slug;
    console.log(`\n── ${prop.name} (${slug}) ──`);

    const patches: Record<string, any> = {};

    // Description
    const descLinks = descriptionLinks[slug];
    if (descLinks && Array.isArray(prop.description)) {
      if (hasExistingLinks(prop.description)) {
        console.log('  description: already has links — skipping');
      } else {
        const { blocks, count } = injectLinks(prop.description, descLinks);
        if (count > 0) {
          patches.description = blocks;
          console.log(`  description: ${count} link(s) injected`);
          // Show what was linked
          blocks.forEach((b: any) => {
            b.markDefs?.forEach((md: any) => {
              if (md._type === 'link') {
                const linkedSpan = b.children?.find((c: any) => c.marks?.includes(md._key));
                if (linkedSpan) console.log(`    "${linkedSpan.text}" → ${md.href}`);
              }
            });
          });
        } else {
          console.log('  description: no phrase matches found');
        }
      }
    }

    // Location intro
    const locLinks = locationIntroLinks[slug];
    if (locLinks && Array.isArray(prop.locationIntro)) {
      if (hasExistingLinks(prop.locationIntro)) {
        console.log('  locationIntro: already has links — skipping');
      } else {
        const { blocks, count } = injectLinks(prop.locationIntro, locLinks);
        if (count > 0) {
          patches.locationIntro = blocks;
          console.log(`  locationIntro: ${count} link(s) injected`);
          blocks.forEach((b: any) => {
            b.markDefs?.forEach((md: any) => {
              if (md._type === 'link') {
                const linkedSpan = b.children?.find((c: any) => c.marks?.includes(md._key));
                if (linkedSpan) console.log(`    "${linkedSpan.text}" → ${md.href}`);
              }
            });
          });
        } else {
          console.log('  locationIntro: no phrase matches found');
        }
      }
    }

    if (Object.keys(patches).length > 0) {
      await client.patch(prop._id).set(patches).commit();
      console.log(`  ✓ patched`);
    } else {
      console.log('  nothing to patch');
    }
  }

  console.log('\n=== Done ===');
}

run().catch(console.error);
