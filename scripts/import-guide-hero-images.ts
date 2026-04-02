/**
 * import-guide-hero-images.ts
 *
 * Imports hero images from Wikimedia Commons into Sanity guide pages
 * and hub singleton pages (exploreIslayPage, gettingHerePage).
 *
 * - Fetches each image's direct URL via the Wikimedia Commons API
 * - Downloads the image and uploads it as a Sanity asset
 * - Patches the heroImage field (+ alt text) on each document
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-guide-hero-images.ts
 *
 * GAPS (not included — require manual action):
 *   guide-food-and-drink    — source images from Booking.com/TripAdvisor/Peatzeria (copyright)
 *   guide-family-holidays   — source images from islandofislay.co.uk (copyright uncertain)
 *   guide-dog-friendly-islay — needs personal photo upload (Pixel puppy Calmac)
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

// ─── Image manifest ───────────────────────────────────────────────────────────

interface ImageEntry {
  /** Sanity document ID (published) */
  docId: string;
  /** Filename as it appears in the Wikimedia Commons File: URL (unencoded) */
  wikiFilename: string;
  /** Alt text for the heroImage */
  alt: string;
}

const HERO_IMAGES: ImageEntry[] = [
  // ── Explore Islay hub ─────────────────────────────────────────────────────
  {
    docId: 'exploreIslayPage',
    wikiFilename: 'Dunyvaig_Castle,_Islay_-_geograph.org.uk_-_4150967.jpg',
    alt: 'Dunyvaig Castle on the south coast of Islay, a 16th-century MacDonald stronghold',
  },

  // ── Explore Islay spokes ──────────────────────────────────────────────────
  {
    docId: 'guide-islay-beaches',
    wikiFilename: 'Port_Ban_and_Lochindaal_-_geograph.org.uk_-_1750270.jpg',
    alt: 'Port Ban beach looking across Loch Indaal on the west coast of Islay',
  },
  {
    docId: 'guide-islay-distilleries',
    wikiFilename: 'Scotland_Argyll_Bute_Islay_Bruichladdich_Distillery.jpg',
    alt: 'Bruichladdich Distillery on the shores of Loch Indaal, Islay',
  },
  {
    docId: 'guide-islay-wildlife',
    wikiFilename: 'Barnacle_Geese_Over_Islay_-_geograph.org.uk_-_1163306.jpg',
    alt: 'Barnacle geese in flight over Islay farmland — up to 50,000 overwinter here each year',
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
    docId: 'guide-islay-villages',
    wikiFilename: 'Scotland_Argyll_Bute_Islay_Port_Charlotte_03.jpg',
    alt: 'Port Charlotte, the model village on the western shore of Loch Indaal, Islay',
  },
  {
    docId: 'guide-islay-geology',
    wikiFilename: 'Ancient_Folds_-_geograph.org.uk_-_1163336.jpg',
    alt: 'Ancient folded rock strata on the Islay coastline — over 800 million years old',
  },
  {
    docId: 'guide-visit-jura',
    wikiFilename: 'Jura_Ferry_Arriving_-_geograph.org.uk_-_2334397.jpg',
    alt: 'The Jura ferry arriving at Feolin from Port Askaig on the east coast of Islay',
  },

  // ── Islay Travel hub ──────────────────────────────────────────────────────
  {
    docId: 'gettingHerePage',
    wikiFilename: 'Ferry_-_panoramio_(9).jpg',
    alt: 'CalMac ferry crossing to Islay',
  },

  // ── Islay Travel spokes ───────────────────────────────────────────────────
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

// ─── Wikimedia Commons API ────────────────────────────────────────────────────

// Wikimedia requires a descriptive User-Agent for bot/script access
const WIKI_UA = 'PortbahnIslay-ImageImport/1.0 (portbahnislay.co.uk; lynton@portbahnislay.co.uk)';

async function fetchWithUA(url: string): Promise<Response> {
  return fetch(url, { headers: { 'User-Agent': WIKI_UA } });
}

async function getWikimediaImageUrl(filename: string): Promise<string> {
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent('File:' + filename)}` +
    `&prop=imageinfo&iiprop=url&format=json&origin=*`;

  const res = await fetchWithUA(apiUrl);
  if (!res.ok) throw new Error(`Commons API error: ${res.status}`);

  const data: any = await res.json();
  const pages = data?.query?.pages;
  if (!pages) throw new Error('No pages in Commons API response');

  const page = Object.values(pages)[0] as any;
  if (page.missing !== undefined) throw new Error(`File not found on Commons: ${filename}`);
  if (!page.imageinfo?.[0]?.url) throw new Error(`No URL in imageinfo for: ${filename}`);

  return page.imageinfo[0].url;
}

// ─── Upload + patch ───────────────────────────────────────────────────────────

async function uploadAndPatch(entry: ImageEntry): Promise<void> {
  // 1. Resolve direct image URL from Wikimedia Commons
  const imageUrl = await getWikimediaImageUrl(entry.wikiFilename);
  console.log(`  URL    : ${imageUrl}`);

  // 2. Fetch the image bytes (User-Agent required by Wikimedia for bot access)
  const imgRes = await fetchWithUA(imageUrl);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status} ${imageUrl}`);
  const buffer = await imgRes.arrayBuffer();
  console.log(`  Size   : ${(buffer.byteLength / 1024).toFixed(0)} KB`);

  // 3. Upload to Sanity media library
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: entry.wikiFilename,
    source: {
      id: `wikimedia-${entry.wikiFilename}`,
      name: 'Wikimedia Commons',
      url: `https://commons.wikimedia.org/wiki/File:${entry.wikiFilename}`,
    },
  });
  console.log(`  Asset  : ${asset._id}`);

  // 4. Patch heroImage on the guide page
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n=== Guide Page Hero Image Import ===`);
  console.log(`Importing ${HERO_IMAGES.length} images...\n`);

  const results: { docId: string; status: string }[] = [];

  for (const entry of HERO_IMAGES) {
    console.log(`\n[${entry.docId}]`);
    try {
      await uploadAndPatch(entry);
      results.push({ docId: entry.docId, status: '✓ success' });
    } catch (err: any) {
      console.error(`  ✗ ${err.message}`);
      results.push({ docId: entry.docId, status: `✗ ${err.message}` });
    }
    // Rate-limit: be polite to both Wikimedia and Sanity APIs
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('\n\n=== RESULTS ===');
  for (const r of results) {
    const pad = r.status.startsWith('✓') ? '' : '';
    console.log(`${r.docId.padEnd(40)} ${r.status}`);
  }

  console.log('\n=== GAPS — manual action required ===');
  console.log('⚠  guide-food-and-drink      — source images: Booking.com, Peatzeria, TripAdvisor (all copyrighted — do not import)');
  console.log('⚠  guide-family-holidays     — source images: islandofislay.co.uk (copyright unclear — verify or use Wikimedia alternative)');
  console.log('⚠  guide-dog-friendly-islay  — needs personal photo upload (Pixel puppy Calmac — upload via Sanity Studio)');
}

run().catch(console.error);
