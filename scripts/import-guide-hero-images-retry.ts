/**
 * import-guide-hero-images-retry.ts
 *
 * Retry-only run for the 10 entries that got HTTP 429 (Wikimedia rate limit)
 * from the initial import-guide-hero-images.ts run.
 *
 * Uses proper Wikimedia User-Agent + longer delays to avoid rate limiting.
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-guide-hero-images-retry.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Wikimedia policy: identify your script with a descriptive User-Agent
const WIKI_UA = 'PortbahnIslay-ImageImport/1.0 (portbahnislay.co.uk; bot; Sanity CMS image import)';

const FAILED_ENTRIES = [
  {
    docId: 'guide-islay-distilleries',
    wikiFilename: 'Scotland_Argyll_Bute_Islay_Bruichladdich_Distillery.jpg',
    alt: 'Bruichladdich Distillery on the shores of Loch Indaal, Islay',
  },
  {
    docId: 'guide-walking',
    wikiFilename: 'Sanaigmore_Bay_-_geograph.org.uk_-_5783393.jpg',
    alt: 'Sanaigmore Bay on the wild north-west coast of Islay',
  },
  {
    docId: 'guide-archaeology-history',
    wikiFilename: 'Kildalton_Cross_by_Mary_Williams.jpg',
    alt: 'The Kildalton High Cross, one of the finest Early Christian carved crosses in Scotland',
  },
  {
    docId: 'guide-visit-jura',
    wikiFilename: 'Jura_Ferry_Arriving_-_geograph.org.uk_-_2334397.jpg',
    alt: 'The Jura ferry arriving at Feolin from Port Askaig on the east coast of Islay',
  },
  {
    docId: 'guide-ferry-to-islay',
    wikiFilename: 'Gleann_Choireadail_with_the_Sound_of_Islay_and_the_Islay_ferry_-_geograph.org.uk_-_3485103.jpg',
    alt: 'CalMac ferry crossing the Sound of Islay with the hills of Jura behind',
  },
  {
    docId: 'guide-flights-to-islay',
    wikiFilename: 'Islay_Airport.jpg',
    alt: 'Islay Airport at Glenegedale, serving Loganair flights from Glasgow',
  },
  {
    docId: 'guide-planning-your-trip',
    wikiFilename: 'Ferry_View_Back_To_Islay_-_geograph.org.uk_-_3273976.jpg',
    alt: 'Looking back to Islay from the CalMac ferry on the crossing to the mainland',
  },
  {
    docId: 'guide-arriving-on-islay',
    wikiFilename: 'Port_Askaig_-_geograph.org.uk_-_4671547.jpg',
    alt: 'Port Askaig ferry terminal on the east coast of Islay',
  },
  {
    docId: 'guide-getting-around-islay',
    wikiFilename: 'The_Islay_bus_-_geograph.org.uk_-_6131595.jpg',
    alt: "The Islay bus service connecting the island's villages",
  },
  {
    docId: 'guide-travelling-without-a-car',
    wikiFilename: 'Island_bus_at_Nerabus_-_geograph.org.uk_-_2543142.jpg',
    alt: 'Island bus at Nerabus crossroads, Islay — connecting car-free travellers across the island',
  },
];

/**
 * Returns the URL for a 1024px thumbnail of the image.
 * Thumbnails are pre-cached on a different CDN path than originals,
 * so they avoid the upload.wikimedia.org rate limit.
 */
async function getWikimediaThumbUrl(filename: string): Promise<string> {
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent('File:' + filename)}` +
    `&prop=imageinfo&iiprop=url&iiurlwidth=1024&format=json&origin=*`;

  const res = await fetch(apiUrl, { headers: { 'User-Agent': WIKI_UA } });
  if (!res.ok) throw new Error(`Commons API error: ${res.status}`);

  const data: any = await res.json();
  const pages = data?.query?.pages;
  const page = Object.values(pages ?? {})[0] as any;
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`No imageinfo returned for: ${filename}`);
  // thumburl is the resized version; fall back to original url if no thumb
  const url = info.thumburl ?? info.url;
  if (!url) throw new Error(`No URL returned for: ${filename}`);
  return url;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadAndPatch(entry: { docId: string; wikiFilename: string; alt: string }) {
  // 1. Resolve 1024px thumbnail URL (avoids CDN rate limit on originals)
  const imageUrl = await getWikimediaThumbUrl(entry.wikiFilename);
  console.log(`  URL  : ${imageUrl}`);
  await sleep(2000); // pause between API call and download

  // 2. Fetch image bytes
  const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': WIKI_UA } });
  if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);
  const buffer = await imgRes.arrayBuffer();
  console.log(`  Size : ${(buffer.byteLength / 1024).toFixed(0)} KB`);

  // 3. Upload to Sanity
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: entry.wikiFilename,
    source: {
      id: `wikimedia-${entry.wikiFilename}`,
      name: 'Wikimedia Commons',
      url: `https://commons.wikimedia.org/wiki/File:${entry.wikiFilename}`,
    },
  });
  console.log(`  Asset: ${asset._id}`);

  // 4. Patch heroImage
  await client
    .patch(entry.docId)
    .set({
      heroImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: entry.alt,
      },
    })
    .commit();
  console.log(`  ✓ Patched ${entry.docId}`);
}

async function run() {
  console.log(`\n=== Retry: ${FAILED_ENTRIES.length} rate-limited entries ===\n`);
  const results: { docId: string; status: string }[] = [];

  for (let i = 0; i < FAILED_ENTRIES.length; i++) {
    const entry = FAILED_ENTRIES[i];
    console.log(`\n[${i + 1}/${FAILED_ENTRIES.length}] ${entry.docId}`);
    try {
      await uploadAndPatch(entry);
      results.push({ docId: entry.docId, status: '✓ success' });
    } catch (err: any) {
      console.error(`  ✗ ${err.message}`);
      results.push({ docId: entry.docId, status: `✗ ${err.message}` });
    }
    // 4s delay between images to respect Wikimedia rate limits
    if (i < FAILED_ENTRIES.length - 1) {
      console.log('  (waiting 4s...)');
      await sleep(4000);
    }
  }

  console.log('\n\n=== RESULTS ===');
  for (const r of results) {
    console.log(`${r.docId.padEnd(40)} ${r.status}`);
  }
}

run().catch(console.error);
