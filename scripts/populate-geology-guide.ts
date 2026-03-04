/**
 * populate-geology-guide.ts
 *
 * Populates the guide-islay-geology guidePage shell with content from:
 *   cw/pbi/content/guides/GUIDE-GEOLOGY.md
 *
 * Fields populated:
 *   - introduction     (Section 5 — page opening, 3 paragraphs as plain string)
 *   - extendedEditorial (Section 6 — all 6 sections as PortableText)
 *   - featuredEntities[] (Section 8 — 7 entities wired)
 *
 * Note: SEO fields (metaTitle, metaDescription, canonicalUrl) already set by
 *   wire-e1-c4f.ts / fix-block-structure.ts. Not overwritten here.
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/populate-geology-guide.ts
 */

import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const k = () => randomBytes(5).toString('hex');

function para(text: string): any {
  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

function h3(text: string): any {
  return {
    _type: 'block',
    _key: k(),
    style: 'h3',
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

function entityRef(entityId: string): any {
  return {
    _key: k(),
    _type: 'reference',
    _ref: `siteEntity.${entityId}`,
  };
}

// ─── Introduction (Section 5 — Page Opening) ─────────────────────────────────
// Stored as plain string. Three paragraphs joined with \n\n.

const GEOLOGY_INTRODUCTION = [
  "Islay sits on some of the most geologically varied ground in Britain. The island is actually two distinct landmasses, separated by a fault - the Loch Gruinart Fault, running through Loch Gruinart in the north and continuing down through Loch Indaal - with radically different rocks on either side. To the west, the Rhinns peninsula is underlain by ancient Lewisian gneiss approximately 1.8 billion years old: some of the oldest exposed rock in the British Isles, formed long before complex life existed on Earth. To the east, younger Dalradian sedimentary and metamorphic rocks tell a later story - one that includes glacial deposits, ancient seas, and some of the earliest evidence of life in Britain.",
  "For visitors, the geology is accessible in a way that geology rarely is. The Port Askaig Tillite - a world-famous Precambrian glacial deposit recording 17 separate ice advances - is exposed in the road cutting right next to the Port Askaig ferry terminal. You pass it getting off the boat to Jura. Stromatolites, fossil microbial structures around 600 million years old, can be found on the beach below Bunnahabhain Distillery. Three of the most significant geological sites in Scotland are within an afternoon's reach of each other, and most are free to visit.",
  "The islaygeology.org group runs guided geology walks through the summer and publishes an authoritative guidebook. For anyone wanting to go deeper than roadside observation, their walks are the best way to do it.",
].join('\n\n');

// ─── Extended Editorial (Section 6 — All Sections) ───────────────────────────

const GEOLOGY_EDITORIAL: any[] = [

  // Section 1: The Rhinns Complex
  h3("The Rhinns Complex — Islay's Ancient Foundation"),
  para("The western peninsula of Islay - the Rhinns - is underlain by gneiss that formed approximately 1.8 billion years ago. This is the Rhinns Complex, part of the same ancient Lewisian basement rock that underlies much of the Scottish Highlands and Western Isles. At 1.8 billion years, it predates the Cambrian explosion of complex life by more than a billion years. A visitor standing on the rocks at Portnahaven or the west coast of the Rhinns is standing on something that formed when the Earth was less than half its current age."),
  para("The gneiss is visible at many points along the west coast - the rocky foreshore at Portnahaven is a good accessible example, or the coastal outcrops around Kilchiaran Bay. The rock has a characteristic banded appearance, streaked and folded by the enormous pressures it has been through."),
  para("You don't need a geology background to appreciate standing here - but knowing what you're looking at does change the experience."),
  para("Access: West coast of the Rhinns peninsula. Portnahaven is the most accessible point - easy roadside parking and foreshore access. Kilchiaran Bay requires a short walk from the road."),

  // Section 2: The Fault in the Landscape
  h3("The Fault in the Landscape"),
  para("The Loch Gruinart Fault, connected to the larger Great Glen Fault system, runs north-south through Islay, separating the Rhinns to the west from the main body of the island to the east. The fault isn't just geological - it's visible. Loch Gruinart is a long, narrow sea inlet cutting into the island from the north; Loch Indaal does the same from the south, almost meeting in the middle. Between them, the island narrows dramatically. That pinch point is where the two geological worlds meet."),
  para("This matters for visitors not just as an abstract fact but as something you can see and orient yourself by. The landscape on the Rhinns feels different from the main island - lower, more exposed, the rock closer to the surface. The eastern part of Islay rises more steeply, with the quartzites and more rugged terrain of the Dalradian geology."),

  // Section 3: Port Askaig Tillite
  h3("Port Askaig Tillite — Ice Age in a Road Cut"),
  para("The Port Askaig Tillite is one of the most famous geological deposits in Britain, and it's one of the most accessible. It's exposed in the road cutting directly beside the Port Askaig ferry terminal - the same terminal where the Jura ferry departs every 20 minutes. If you've ever crossed to Jura and noticed the unusual grey-green rocky face beside the road, you've already seen it."),
  para("The tillite is a glacial deposit formed approximately 700 million years ago during one of the most severe glaciations in Earth's history - a period geologists refer to as Snowball Earth, when ice may have reached close to the equator. The Port Askaig deposit records 17 separate ice advances and retreats, compressed into 750 metres of rock. It's a world reference site: geologists from universities across Britain and Europe come to Port Askaig specifically to see this exposure, and geology field trips have been using it for decades."),
  para("For a non-geologist, the rock itself looks chaotic - mixed fragments of different sizes jumbled together without the clean layering of most sedimentary rock. That's what glacial till looks like. Once you know what you're looking at, the chaos makes sense."),
  para("Access: Roadside at Port Askaig ferry terminal. No walk required - the exposure is visible from the road and pavement. Free to visit, open year-round."),

  // Section 4: Stromatolites at Bunnahabhain
  h3("Stromatolites at Bunnahabhain — The Oldest Life in Scotland"),
  para("On the shore below Bunnahabhain Distillery, in the rocks of the Bonahaven Dolomite, you can find stromatolites: fossilised microbial colonies approximately 600 million years old. Stromatolites are among the earliest evidence of life on Earth - mounded structures built by photosynthetic bacteria in warm, shallow Precambrian seas. The ones at Bunnahabhain are among the best examples of Precambrian life in Britain, and some of the oldest macroscopic fossils in Scotland."),
  para("They're not immediately obvious if you don't know what you're looking for - they appear as layered, roughly dome-shaped structures in the dolomite rock of the foreshore, with a characteristic alternating calcite and dolomite banding. The islaygeology.org guidebook describes the location precisely, and their guided walks cover this site."),
  para("Visiting requires some scramble across rocky foreshore at low tide. Not difficult, but wear appropriate footwear and check the tide before you go."),
  para("Access: Foreshore south-east of Bunnahabhain Distillery. Park at the distillery (well worth combining with a visit). Walk south along the shore. Low tide recommended. The islaygeology.org guidebook maps the exact location."),

  // Section 5: Guided Walks
  h3("Guided Walks — islaygeology.org"),
  para("The islaygeology.org group is the authoritative local resource for anyone wanting to explore Islay's geology with expert guidance. They run monthly geology walks on Sundays during the summer months (June to September), as part of the weekly walk programme organised by the Islay Natural History Trust. Walks are free, though donations to the trust are welcome."),
  para("Past walks have covered everything from the Rhinns gneiss and the Portnahaven foreshore to the Ballygrant area and early evidence of human habitation. Suitable for all ages and abilities - not just for geologists. To find out about upcoming walks, contact the group at islaygeology@gmail.com or check the events section at islaygeology.org."),
  para("If you're visiting outside the walk season, the website hosts virtual field trips and the full catalogue of excursion routes as GPX files, downloadable for use on OS maps."),

  // Section 6: Further Reading and Resources
  h3("Further Reading and Resources"),
  para("A Guide to the Geology of Islay — published by islaygeology.org, £14.99. The 2025 edition is a substantial rewrite covering 12 varied geological excursions on Islay, ranging from easy coastal walks to longer hillier routes. Written for readers with some geological background, but accessible to interested non-specialists. Companion volumes cover Jura and Colonsay. Available from islaygeology.org."),
  para("Professor Steven Mithen's books — Mithen is Professor of Early Prehistory at the University of Reading and has been returning to Islay for research for decades. His books aren't geology texts, but they bring the island's deep past vividly to life in a way that connects landscape, geology and human history."),
  para("To the Islands — a personal memoir of 25 years of archaeological fieldwork in the Hebrides, focused on Mesolithic hunter-gatherers. A good read before you come."),
  para("Land of the Ilich (Birlinn, 2021) — a broader sweep of Islay's history from the earliest settlers to modern times, covering archaeology, geology, the clearances and the island as it is today. Worth reading on-island, by a fire, with a dram."),
  para("Both are in print and available as ebooks."),
];

// ─── Featured Entities (Section 8) ───────────────────────────────────────────
// Only wiring entities confirmed to exist in Sanity (from snapshot).

const GEOLOGY_ENTITIES = [
  'port-askaig-ferry-terminal',     // Port Askaig Tillite access point
  'bunnahabhain-distillery',        // Stromatolites access point
  'bunnahabhain-stromatolites',     // The actual geological site entity
  'portnahaven-village',            // Rhinns gneiss access point
  'rspb-loch-gruinart',             // Geographic / geological context (Loch Gruinart Fault)
  'loch-indaal',                    // Geographic context (fault line visible)
  'port-askaig-village',            // Village context for tillite
].map(entityRef);

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' populate-geology-guide.ts');
  console.log('═══════════════════════════════════════════════════════════════');

  // Verify the shell exists
  console.log('\nChecking guide-islay-geology exists...');
  const existing = await client.fetch<{ _id: string; metaTitle?: string } | null>(
    `*[_id == "guide-islay-geology"][0]{ _id, metaTitle }`
  );
  if (!existing) {
    console.error('  ✗ guide-islay-geology not found — run wire-e1-c4f.ts first');
    process.exit(1);
  }
  console.log(`  ✓ guide-islay-geology found (metaTitle: "${existing.metaTitle || 'not set'}")`);

  let ok = 0;
  let failed = 0;

  // 1. Set introduction
  console.log('\n── 1 — introduction (3 paragraphs, plain string) ──');
  try {
    await client
      .patch('guide-islay-geology')
      .set({ introduction: GEOLOGY_INTRODUCTION })
      .commit();
    console.log('  ✓ introduction set');
    ok++;
  } catch (err: any) {
    console.error(`  ✗ introduction failed — ${err.message}`);
    failed++;
  }

  // 2. Set extendedEditorial
  console.log('\n── 2 — extendedEditorial (6 sections, PortableText) ──');
  try {
    await client
      .patch('guide-islay-geology')
      .set({ extendedEditorial: GEOLOGY_EDITORIAL })
      .commit();
    console.log(`  ✓ extendedEditorial set (${GEOLOGY_EDITORIAL.length} blocks)`);
    ok++;
  } catch (err: any) {
    console.error(`  ✗ extendedEditorial failed — ${err.message}`);
    failed++;
  }

  // 3. Wire featuredEntities
  console.log('\n── 3 — featuredEntities[] (7 entities) ──');
  try {
    await client
      .patch('guide-islay-geology')
      .set({ featuredEntities: GEOLOGY_ENTITIES })
      .commit();
    console.log(`  ✓ featuredEntities set (${GEOLOGY_ENTITIES.length} refs)`);
    ok++;
  } catch (err: any) {
    console.error(`  ✗ featuredEntities failed — ${err.message}`);
    failed++;
  }

  console.log(`\n══ Summary: ${ok} ✓ | ${failed} ✗ ══════════════════════════════`);
  if (ok === 3) {
    console.log('guide-islay-geology is now fully populated.');
    console.log('Route: /explore-islay/islay-geology');
    console.log('Entities wired: port-askaig-ferry-terminal, bunnahabhain-distillery,');
    console.log('  bunnahabhain-stromatolites, portnahaven-village, rspb-loch-gruinart,');
    console.log('  loch-indaal, port-askaig-village');
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
