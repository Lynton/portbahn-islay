/**
 * create-new-guide-pages.ts
 *
 * Creates two new guide pages and updates the existing visit-jura page:
 *   - guide-islay-villages    (new)
 *   - guide-archaeology-history (new)
 *   - guide-visit-jura        (update: add Block 25 FAQs + extended editorial + intro)
 *
 * Depends on:
 *   1. populate-entities.ts (entities must exist)
 *   2. import-new-guide-blocks.ts (blocks 25–29 must exist)
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/create-new-guide-pages.ts
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

const generateKey = () => Math.random().toString(36).substring(2, 11);

// ─── Types ───────────────────────────────────────────────────────────────────

type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
type Block = { _type: 'block'; _key: string; style: string; markDefs: any[]; children: Span[] };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const h3 = (key: string, text: string): Block => ({
  _type: 'block', _key: key, style: 'h3', markDefs: [],
  children: [{ _type: 'span', _key: `${key}c0`, text, marks: [] }],
});

const p = (key: string, text: string): Block => ({
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: `${key}c0`, text, marks: [] }],
});

const pBold = (key: string, boldPart: string, rest: string): Block => ({
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [
    { _type: 'span', _key: `${key}c0`, text: boldPart, marks: ['strong'] },
    { _type: 'span', _key: `${key}c1`, text: rest, marks: [] },
  ],
});

const canonicalRef = (blockId: string) => ({
  _type: 'reference' as const,
  _ref: `canonical-block-${blockId}`,
});

const blockRef = (blockId: string, version: 'full' | 'teaser', customHeading?: string) => ({
  _type: 'blockReference' as const,
  _key: generateKey(),
  block: canonicalRef(blockId),
  version,
  showKeyFacts: false,
  ...(customHeading ? { customHeading } : {}),
});

const faqRef = (faqId: string) => ({
  _type: 'reference' as const,
  _key: generateKey(),
  _ref: faqId,
});

// ─── ISLAY VILLAGES — Extended Editorial ─────────────────────────────────────

const villagesExtendedEditorial: Block[] = [

  h3('v01', 'Getting Oriented: The Rhinns and the Rest of the Island'),

  p('v02', "Most guests staying in our Bruichladdich properties spend the first day or two on the Rhinns peninsula — the hammer-shaped landmass that forms the western side of Islay and is home to Bruichladdich, Port Charlotte, and Portnahaven. The Rhinns runs roughly north to south, with Bruichladdich and Port Charlotte on the eastern shore of Loch Indaal and Portnahaven at the foot. The peninsula has a different pace from the rest of the island — quieter roads, fewer visitors, and the particular feeling of being at the edge of things. Port Charlotte is the most visited village on the Rhinns; Portnahaven is the most remote."),

  p('v03', "For the rest of the island, Bowmore is the natural hub — most practical errands (Co-op, pharmacy, bank) happen there, and Bowmore Distillery on the main street makes it a natural stop on any distillery day. Bridgend, at the head of Loch Indaal where the main island roads meet, is a useful refuelling and provisions point rather than a destination in itself — the petrol pump at Bridgend Village Stores is important to know about on an island with limited options. Port Askaig on the north coast is a functional stop: ferry terminal, Port Askaig Hotel bar, and the turning for Caol Ila and Bunnahabhain distilleries. Port Ellen on the south coast is the island's other major port and the anchor for any south coast day."),

  h3('v04', "Port Charlotte: The Rhinns' Best Village"),

  p('v05', "Port Charlotte was built as a planned village in the early 19th century — neat white-painted terraces running back from the shore of Loch Indaal. It has more going on than its size suggests: the Museum of Islay Life is one of the better small local museums in the Hebrides, the Port Charlotte Hotel has a log fire, 300+ malt whiskies, and live music on Wednesday and Sunday evenings, and Lochindaal Seafood Kitchen is our top restaurant recommendation on the island. The village beach is safe for swimming and usually empty. If you do only one other village from our properties, Port Charlotte should be it."),

  h3('v06', 'Bowmore: Main Town, Main Services'),

  p('v07', "Bowmore is Islay's main town — the largest concentration of shops and services on the island, and the most reliable year-round. The Co-op is the main supermarket; Peatzeria does good wood-fired pizza; Islay's Plaice does fish and chips. The Mactaggart Leisure Centre has a swimming pool — useful for families or a rainy afternoon. Bowmore Distillery sits at the foot of the main street and claims to be Islay's oldest distillery (1779). At the top of the street, the Round Church (Kilarrow Parish Church, 1767) is small, unusual, and worth five minutes — the local tradition holds it was built round so the Devil could find no corner to hide in. Bowmore is not a picturesque village in the way Port Charlotte is, but it is an honest and useful town."),

  h3('v08', 'Portnahaven and Port Wemyss: The End of the Road'),

  p('v09', "Portnahaven and Port Wemyss are two connected villages that together form a small settlement at the southern tip of the Rhinns — 20 minutes from our properties along a single-track road that gets emptier the further south you go. The harbour at Portnahaven almost always has common seals hauled out on the rocks, and An Tigh Seinnse pub serves honest home-cooked food in a genuinely tiny, genuinely local room. The combination of seals in the harbour, the pub for lunch, and the empty Atlantic coast on the way back makes this the best half-day on the Rhinns beyond Bruichladdich and Port Charlotte. Book ahead — An Tigh Seinnse seats perhaps 20 people."),

  h3('v10', 'Port Askaig and Port Ellen: Functional Ports Worth Knowing'),

  p('v11', "Port Askaig is where the CalMac ferry from Kennacraig arrives in 2 hours (the faster of the two Islay crossings), and where the 5-minute crossing to Jura departs. The Port Askaig Hotel has a decent bar and is worth a stop if you're up on the north coast for distilleries. Port Ellen, on the south coast, is the longer ferry crossing (2 hours 20 minutes from Kennacraig) but puts you closer to the south coast distillery cluster — Laphroaig, Lagavulin, and Ardbeg are all within a 10-minute drive, and Port Ellen Distillery reopened in 2024. The Copper Still café by the ferry terminal is the best café on the island."),

  h3('v12', "What's Open When"),

  p('v13', "One important piece of island reality: hours change by season, and some smaller businesses close entirely in winter. The Port Charlotte Hotel, Co-op Bowmore, Lochindaal Seafood Kitchen, and Islay's Plaice are the most reliably open year-round. An Tigh Seinnse in Portnahaven is open year-round. Winter hours apply from November — always book ahead and confirm current hours for winter visits. The Museum of Islay Life is typically open April to October. We update our house notes for each property with current opening hours for local businesses — if you're arriving in shoulder season or winter, ask us when you book and we'll tell you what's operating."),

];

// ─── ARCHAEOLOGY HISTORY — Extended Editorial ─────────────────────────────────

const archaeologyExtendedEditorial: Block[] = [

  h3('a01', 'Planning an Archaeology and History Day on Islay'),

  p('a02', "Islay's heritage sites are spread across the island, which means the best approach is to pair them with other activities on the same route rather than making each a standalone trip. Three natural combinations work well:"),

  pBold('a03', "The Lords of the Isles day (central Islay): ", "Finlaggan in central Islay is 25 minutes from our properties — half a day including the walk to Eilean Mòr and time at the visitor centre. On the same road east, Bunnahabhain Distillery is 30–35 minutes north, and the stromatolite outcrops are walkable from the distillery car park. Caol Ila and Ardnahoe distilleries are on the same north coast route. Combine Finlaggan with one or two north coast distilleries for a full day that covers medieval history, geology, and whisky."),

  pBold('a04', "The south coast cluster (Kildalton): ", "The Kildalton Shoreline Walk connects Port Ellen with Laphroaig, Lagavulin, Ardbeg, and the Kildalton Cross in a single linear route — distilleries and an 8th-century carved cross on the same coastal walk. The cross and the ruined Kildalton Chapel are at the eastern end; Dunyvaig Castle ruins are visible from the path near Lagavulin. A south coast day combining three distilleries and two heritage sites is genuinely excellent. See the walking guide for the route."),

  pBold('a05', "The WW1 day (west coast and Oa): ", "Kilchoman Military Cemetery is on the west coast of Islay, 20 minutes from our properties — 5 minutes from Kilchoman Distillery and café. The American Monument on the Oa is 35–40 minutes further south. Both sites commemorate the same 1918 disasters — the Tuscania and Otranto troopships — and visiting both in a single day gives a more complete picture of the event than either alone. Start at Kilchoman (morning, distillery and cemetery), drive south, walk the Oa to the American Monument (1–1.5 hours), and return via Port Ellen for The Copper Still café."),

  h3('a06', 'The Lords of the Isles: Why Finlaggan Matters'),

  p('a07', "Finlaggan is not well known outside Scotland, and even within Scotland it is undervisited. That is partly its appeal. The Lordship of the Isles, which administered its domain from the islands of Loch Finlaggan between approximately 1150 and 1493, was the last major Gaelic polity in Scotland — a maritime empire that at its height controlled the Hebrides and much of the west coast under a system of Gaelic law and administration separate from the Scottish crown. The Council of the Isles met on Eilean na Comhairle (Council Island), the smaller of Finlaggan's two islands. The larger island, Eilean Mòr, held a chapel, a great hall, and the buildings of the Lordship. After the forfeiture of the Lordship in 1493, Finlaggan was abandoned and has remained undisturbed. The visitor centre is open from Saturday 5 April, Monday to Saturday 1100–1630, closed Sunday; entry is by donation. The islands are accessible year-round via a short path and causeway."),

  h3('a08', 'The Kildalton Cross: Context for Visitors'),

  p('a09', "The Kildalton Cross stands in the graveyard of Kildalton Church on the south-east coast of Islay, roughly 8 miles east of Ardbeg, and has stood in that location since it was carved in approximately 800 AD. It is a ringed high cross carved from a single block of blue-grey epidiorite, standing 2.65 metres high. The quality and condition of the carving — Old Testament scenes on the west face, interlaced knotwork on the east, a Virgin and Child in the central roundel — is exceptional for its age and outdoor situation. It is one of only two surviving 8th-century ringed high crosses in Scotland and is listed by Historic Environment Scotland as a Scheduled Monument. The site is open year-round, free, and rarely crowded. The Kildalton Shoreline Walk from Port Ellen (see walking guide) provides the most scenic approach; driving directly from Port Ellen to Kildalton takes about 20 minutes on a single-track road."),

  h3('a10', 'Islay Archaeology Week and Active Research'),

  p('a11', "Islay Archaeology Week, usually held in August, is the best opportunity for visitors to access active excavations and meet the researchers. The event is organised by Islay Heritage — the local charity that also runs ongoing research excavations at Dunyvaig Castle and, until recently, at Rubha Port an t-Seilich on the east coast. Dig days typically include guided walks to current excavation sites, public talks, and volunteer taster sessions. The Council for British Archaeology Festival (2026: 18 July–2 August) may also include Islay-specific events. Check the Museum of Islay Life and Islay Heritage websites for the current programme closer to the date."),

  h3('a12', 'Access Practicalities'),

  p('a13', "Most heritage sites on Islay are free to visit and require no booking. Finlaggan visitor centre is open from Saturday 5 April, Monday–Saturday 11:00–16:30, closed Sunday; entry is by donation (tel: +44(0)1496 840 644). The islands are accessible at any time. The American Monument is reached via a 20-minute walk from the RSPB car park at PA42 7AU — the car park has information boards and picnic tables. Kilchoman Military Cemetery is immediately adjacent to the public road at Kilchoman Church — no walking required. The Kildalton Cross and Kildalton Chapel graveyard are accessible year-round from the road end at Kildalton. Dunyvaig Castle is viewable from the Kildalton Shoreline Walk path — do not attempt to enter the ruined structure. Bunnahabhain Stromatolites are accessible from the distillery car park: walk through the distillery buildings toward the southern end, pass the gate beyond the distillery cottages, and follow the rough coastal path toward Rubha a'Mhill — the first exposures appear approximately 50–100 metres after the gate on the exposed shoreline. Grid reference NR 4294 7021 (approx. 55.883, -6.123). Best at low tide."),

];

// ─── VISIT JURA — Extended Editorial ─────────────────────────────────────────

const visitJuraExtendedEditorial: Block[] = [

  h3('j01', 'Fitting Jura into an Islay Week'),

  p('j02', "A Jura day trip is one of the most consistent highlights our guests report from their Islay stays - and it is genuinely easy to do. The logistics are simple: drive 30 minutes to Port Askaig, walk on to the ferry (no booking needed for foot passengers), cross in 5 minutes, and you're on Jura. For a comfortable day, leave by 9:30 in the morning and plan to be back at Port Askaig by 8pm or later if you book the 21:30 sailing. That gives you a full day on the island. We'd recommend it for at least one day of any stay of 5 nights or more."),

  p('j03', "For guests with a car, the question is not whether to go but how long to stay. A day covers Jura Distillery, lunch, Small Isles Bay, and if you push north, a view of Ardlussa. A two-night stay adds Barnhill, the Corryvreckan, a Pap climb if conditions are right, and the slower experience of Jura at its own pace. We're here either way and can help with planning when you book."),

  h3('j04', 'The Character Difference'),

  p('j05', "Block 13 describes Jura as \"all Highland\" compared to Islay's \"gentle borders feel\" - and that description holds. Jura's landscape is more dramatic, more vertical, and more remote-feeling than Islay's. The single road gives you no choice about the route. The hills are always in view. The deer are everywhere. The silence is more total. For guests who've spent a week on Islay and are ready for something sharper, Jura delivers that contrast immediately - you feel it on the ferry crossing."),

  p('j06', "Islay has villages, distilleries, a functioning community with shops and restaurants. Jura has Craighouse, a handful of scattered farms, and the long single-track north. Both are worth experiencing. If we had to advise a first-time Hebrides visitor, we'd say: base on Islay, day trip to Jura, consider returning to Jura for longer once you know what you're coming back to."),

  h3('j07', 'Practical Notes for a Jura Stay'),

  pBold('j08', "Getting around on Jura: ", "The single-track road requires patience and courtesy - use the passing places correctly, pull fully off the road to let oncoming vehicles through, and never reverse from a passing place up to a car behind you. Deer on the road are a near-constant hazard, especially at dawn and dusk. Drive slowly in the early morning and evening, particularly north of Craighouse. The road deteriorates beyond Lealt - the last section to Barnhill is 4 miles of rough track that must be walked."),

  pBold('j09', "Shopping and supplies: ", "The Jura Hotel has a small shop at Craighouse for basics. For anything more than that, Islay is better stocked - do your main shopping on Islay before you cross. The distillery and Lussa Gin at Ardlussa both sell bottles if you want something to take home, but neither is a general provisions stop."),

  pBold('j10', "Mobile signal: ", "EE and Vodafone are the most reliable networks on Jura; others are patchy north of Craighouse. This is not theoretical - guests who rely on Three or O2 have found themselves without signal. Download offline maps before you go."),

  pBold('j11', "The Tayvallich ferry: ", "From March to September, the Jura Passenger Ferry runs twice daily between Tayvallich on the mainland and Craighouse. For mainland visitors arriving or departing via Jura, this is a genuine alternative to coming via Islay. It also makes a multi-island loop possible - arrive on Islay via CalMac from Kennacraig, spend days on Islay, cross to Jura via Port Askaig, and return to the mainland on the Tayvallich ferry. Contact us when planning and we'll help make the logistics work."),

  h3('j12', 'We Live Here'),

  p('j13', "We moved to Jura in 2017 and absolutely love it. We're here through the winters, when the geese fill the skies and the deer rut echoes across the hills, and through the summers, when the light goes on until almost midnight and Corran Sands at the bottom of the Bothan drive feels like the end of the world in the best possible way. If you want to understand what Jura is actually like - not the tourist brochure version - come and see for yourself. We're here, and we're happy to talk about it."),

];

// ─── Guide page definitions ───────────────────────────────────────────────────

const pages = [

  // ── islay-villages (new) ──────────────────────────────────────────────────
  {
    _id: 'guide-islay-villages',
    _type: 'guidePage' as const,
    title: 'Islay Villages',
    slug: { _type: 'slug' as const, current: 'islay-villages' },
    introduction: "Islay has six villages of distinct character within 45 minutes' drive of each other, spread across the island's two coasts and the southern tip of the Rhinns peninsula. The Portbahn Islay properties sit in Bruichladdich on the eastern shore of the Rhinns, with Port Charlotte 5 minutes to the south, Bowmore — Islay's main town — 15 minutes east across Loch Indaal, and Portnahaven and Port Wemyss a 20-minute drive further south at the tip of the peninsula. Port Askaig on the north coast, 25 minutes from Bruichladdich, is the gateway to Jura. Port Ellen on the south coast, 45 minutes away, is where the CalMac ferry arrives from Kennacraig and where the south coast distillery cluster begins.",
    extendedEditorial: villagesExtendedEditorial,
    contentBlocks: [
      blockRef('islay-villages-overview', 'full', 'The Villages of Islay'),
    ],
    faqBlocks: [
      faqRef('faq-guide-villages-main-town'),
      faqRef('faq-guide-villages-port-charlotte'),
      faqRef('faq-guide-villages-port-ellen'),
      faqRef('faq-guide-villages-distances'),
      faqRef('faq-guide-villages-portnahaven'),
      faqRef('faq-guide-villages-shopping'),
    ],
    schemaType: 'Article',
    seoTitle: 'Islay Villages | Port Charlotte, Bowmore, Port Ellen & More',
    seoDescription: "Islay's villages run from Port Charlotte on our doorstep to Port Ellen on the south coast. Each has its own character. Here's what's in each and what to do — from hosts who've lived here since 2017.",
  },

  // ── archaeology-history (new) ──────────────────────────────────────────────
  {
    _id: 'guide-archaeology-history',
    _type: 'guidePage' as const,
    title: 'Islay Archaeology & History',
    slug: { _type: 'slug' as const, current: 'archaeology-history' },
    introduction: "Islay has been continuously inhabited for more than 8,000 years. The island's surviving heritage runs from Precambrian fossilised microbial structures at Bunnahabhain — among the oldest macroscopic fossils in Britain at 1.2 billion years — through Bronze Age cairns and Iron Age duns, the Kildalton Cross of the 8th century (widely considered the finest surviving Early Christian carved ringed cross in Scotland), the medieval seat of the Lordship of the Isles at Finlaggan, the contested castles and clan battles of the 16th and 17th centuries, and the World War One memorials on the Oa peninsula and at Kilchoman. For its size, the island carries an unusual density of historically significant sites. Most are free to visit and open year-round.",
    extendedEditorial: archaeologyExtendedEditorial,
    contentBlocks: [
      blockRef('islay-archaeology-overview', 'full', "Islay's Archaeological and Historical Sites"),
    ],
    faqBlocks: [
      faqRef('faq-guide-archaeology-finlaggan'),
      faqRef('faq-guide-archaeology-kildalton-cross'),
      faqRef('faq-guide-archaeology-american-monument'),
      faqRef('faq-guide-archaeology-stromatolites'),
      faqRef('faq-guide-archaeology-kilnave'),
      faqRef('faq-guide-archaeology-bowmore-church'),
    ],
    schemaType: 'Article',
    seoTitle: "Islay Archaeology & History | Finlaggan, Kildalton Cross & More",
    seoDescription: "Islay's history runs from 1.2-billion-year-old fossilised life at Bunnahabhain to the seat of the Lords of the Isles at Finlaggan, the finest early Christian carved cross in Scotland, and WW1 war graves.",
  },

  // ── visit-jura (update existing) ──────────────────────────────────────────
  {
    _id: 'guide-visit-jura',
    _type: 'guidePage' as const,
    title: 'Visiting Jura from Islay',
    slug: { _type: 'slug' as const, current: 'visit-jura' },
    introduction: "The Isle of Jura is Islay's closest neighbour - 5 minutes by ferry from Port Askaig across the Sound of Islay - and a genuinely different island in character. Where Islay has a gentle lowland feel, Jura is Highland: raw, wild, and still. Jura has approximately 250 people and more than 6,000 red deer, a single road running 28 miles from the ferry slip at Feolin to the houses at Barnhill near the north tip, one pub, one whisky distillery, and one gin distillery at the end of the road. We moved to Jura in 2017 - we now live here year-round - and run Bothan Jura Retreat, four units with hot tubs and saunas at the foot of the Paps of Jura. Our three Islay properties - Portbahn House, Shorefield Eco House, and Curlew Cottage - are all about 30 minutes' drive from Port Askaig, which makes them a natural base for a Jura day trip or a launching point for a multi-island stay.",
    extendedEditorial: visitJuraExtendedEditorial,
    contentBlocks: [
      blockRef('jura-day-trip',      'full', 'A Day Trip to Jura from Islay'),
      blockRef('jura-longer-stay',   'full', 'Staying Longer on Jura'),
      blockRef('bothan-jura-teaser', 'full', 'Bothan Jura Retreat'),
    ],
    faqBlocks: [
      faqRef('faq-guide-jura-how-to-get'),
      faqRef('faq-guide-jura-book-ferry'),
      faqRef('faq-guide-jura-day-trip-duration'),
      faqRef('faq-guide-jura-beyond-distillery'),
      faqRef('faq-guide-jura-staying-on-jura'),
      faqRef('faq-guide-jura-best-time'),
    ],
    schemaType: 'Article',
    seoTitle: 'Visiting Jura from Islay | Day Trips, Walks & Where to Stay',
    seoDescription: "Jura is 5 minutes by ferry from Port Askaig. We moved here in 2017 and run Bothan Jura Retreat on the island. Day trip guide, walks, ferry tips and honest advice from people who actually live here.",
  },

];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n======================================================');
  console.log('  create-new-guide-pages.ts');
  console.log('  3 pages: islay-villages (new), archaeology-history (new), visit-jura (update)');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const page of pages) {
    try {
      const existing = await client.fetch(`*[_id == $id][0]{_id}`, { id: page._id });
      await client.createOrReplace(page);
      const label = `${page.contentBlocks.length} content + ${page.extendedEditorial.length} editorial + ${page.faqBlocks.length} FAQs`;
      if (existing) {
        console.log(`  ✓ Updated: ${page.title} — ${label}`);
        updated++;
      } else {
        console.log(`  ✓ Created: ${page.title} — ${label}`);
        created++;
      }
    } catch (err: any) {
      console.error(`  ✗ Failed: ${page.title} — ${err.message}`);
      failed++;
    }
  }

  console.log('\n======================================================');
  console.log(`  Pages: ${created} created, ${updated} updated, ${failed} failed`);
  console.log('======================================================');
  console.log('\nNext: run wire-entity-guide-pages.ts to add featuredEntities[] to all pages');
}

run().catch(console.error);
