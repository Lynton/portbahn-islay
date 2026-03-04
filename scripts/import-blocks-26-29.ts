/**
 * import-blocks-26-29.ts
 *
 * Imports Blocks 26–29: villages overview + FAQs, archaeology overview + FAQs.
 *
 * Operations:
 *   1. Add teaserContent to canonical-block-islay-villages-overview
 *   2. Prepend intro para to canonical-block-islay-archaeology-overview fullContent
 *   3. Add teaserContent to canonical-block-islay-archaeology-overview
 *   4. Create 6 faqCanonicalBlock docs for villages (faq-guide-villages-*)
 *   5. Create 6 faqCanonicalBlock docs for archaeology (faq-guide-archaeology-*)
 *   6. Wire guide-islay-villages: contentBlocks + faqBlocks
 *   7. Wire guide-archaeology-history: contentBlocks + faqBlocks
 *
 * Source specs:
 *   cw/pbi/content/guides/GUIDE-BLOCKS-VILLAGES.md
 *   cw/pbi/content/guides/GUIDE-BLOCKS-ARCHAEOLOGY.md
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-blocks-26-29.ts
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

/** Single paragraph ending with a hyperlink */
function paraWithLinkSuffix(before: string, linkText: string, href: string): any {
  const linkKey = k();
  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    markDefs: [{ _type: 'link', _key: linkKey, href }],
    children: [
      { _type: 'span', _key: k(), text: before, marks: [] },
      { _type: 'span', _key: k(), text: linkText, marks: [linkKey] },
    ],
  };
}

function faqRef(faqId: string): any {
  return { _type: 'reference', _key: k(), _ref: faqId };
}

function blockRef(blockId: string, version: 'full' | 'teaser'): any {
  return {
    _type: 'blockReference',
    _key: k(),
    block: { _type: 'reference', _ref: `canonical-block-${blockId}` },
    version,
    showKeyFacts: false,
  };
}

// ─── Result tracking ──────────────────────────────────────────────────────────

const results: { id: string; status: '✓' | '✗' | '⚠'; note?: string }[] = [];

function ok(id: string, note?: string) {
  results.push({ id, status: '✓', note });
  console.log(`  ✓ ${id}${note ? ' — ' + note : ''}`);
}
function fail(id: string, err: any) {
  results.push({ id, status: '✗', note: String(err?.message || err) });
  console.error(`  ✗ ${id} — ${err?.message || err}`);
}
function warn(id: string, note: string) {
  results.push({ id, status: '⚠', note });
  console.warn(`  ⚠ ${id} — ${note}`);
}

// ─── 1. Villages teaserContent ────────────────────────────────────────────────

const VILLAGES_TEASER = paraWithLinkSuffix(
  "Islay's six villages are all within 45 minutes' drive. Port Charlotte is 5 minutes from our door — whitewashed, pretty, and home to the Lochindaal Seafood Kitchen. Bowmore is the main town: Co-op, distillery, the Round Church. Portnahaven has harbour seals and the island's smallest local pub. Port Ellen is the start of the south coast whisky trail. ",
  'Explore all the villages →',
  '/explore-islay/islay-villages',
);

// ─── 2. Archaeology intro paragraph (prepend to fullContent) ──────────────────

const ARCHAEOLOGY_INTRO_PARA = para(
  "Islay has been continuously inhabited for more than 8,000 years. Its surviving heritage spans from Precambrian geology through Bronze Age cairns, Iron Age duns, the finest Early Christian carved cross in Scotland, the medieval seat of a Gaelic dynasty that rivalled the Scottish crown, contested coastal castles, and two World War One memorials that mark one of the war's strangest maritime disasters. Most of these sites are free, open year-round, and remarkably unvisited. The concentration of significant history within 50 minutes' drive of our Bruichladdich properties is, by any measure, unusual.",
);

// ─── 3. Archaeology teaserContent ────────────────────────────────────────────

const ARCHAEOLOGY_TEASER = paraWithLinkSuffix(
  "Islay was the seat of the Lords of the Isles — the most powerful Gaelic dynasty in medieval Scotland — and Finlaggan is 25 minutes from our door. The Kildalton Cross has stood since 800 AD. The American Monument on the Oa marks one of WW1's strangest disasters. Most sites are free and open year-round. ",
  "Islay's full archaeological and historical guide →",
  '/explore-islay/archaeology-history',
);

// ─── 4. Villages FAQ documents ────────────────────────────────────────────────

const VILLAGES_FAQS = [
  {
    _id: 'faq-guide-villages-main-town',
    question: 'What is the main town on Islay?',
    answer: [para(
      "Bowmore is Islay's main town, located at the head of Loch Indaal roughly in the centre of the island. It has the largest concentration of shops and services — the Co-op supermarket, a pharmacy, a bank, Bowmore Distillery, and several restaurants including Peatzeria and Islay's Plaice fish and chip shop. Bowmore is 15 minutes' drive from our Bruichladdich properties along the B8016 road around Loch Indaal. For practical errands during a self-catering stay, Bowmore is where you go first.",
    )],
    category: 'villages',
    priority: 10,
  },
  {
    _id: 'faq-guide-villages-port-charlotte',
    question: 'Is Port Charlotte worth visiting from Bruichladdich?',
    answer: [para(
      "Port Charlotte is 5 minutes' drive from our Bruichladdich properties and is the village we recommend most consistently. It has a safe beach, the Museum of Islay Life, Port Charlotte Stores (shop with a petrol pump), the Port Charlotte Hotel (log fire, 300+ single malts, live music on Wednesday and Sunday evenings), and Lochindaal Seafood Kitchen — our top restaurant recommendation on the island. The village is pretty, quiet, and well worth an afternoon or an evening meal. The coastal cycle path from Bruichladdich to Port Charlotte is flat tarmac and takes about 40 minutes each way — suitable for all abilities including pushchairs and bikes.",
    )],
    category: 'villages',
    priority: 20,
  },
  {
    _id: 'faq-guide-villages-port-ellen',
    question: 'What is there to do in Port Ellen on Islay?',
    answer: [para(
      "Port Ellen is where the CalMac ferry arrives on the south coast of Islay — 45 minutes from our Bruichladdich properties. Beyond the ferry, it is the starting point for the south coast distillery cluster: Laphroaig, Lagavulin, and Ardbeg are all within 10 minutes' drive east, and Port Ellen Distillery reopened in 2024. The Copper Still café by the ferry terminal serves excellent coffee and food — our guests always stop there on a south coast day. SeaSalt Bistro on the waterfront is a good dinner option if you're spending the evening on the south coast. Kilnaughton Bay near Port Ellen has a safe sandy beach suitable for families. Port Ellen itself is a functional port town rather than a picturesque village, but its position as the gateway to the best whisky drive on the island makes it essential to know.",
    )],
    category: 'villages',
    priority: 30,
  },
  {
    _id: 'faq-guide-villages-distances',
    question: 'How far apart are the main villages on Islay?',
    answer: [para(
      "Islay's villages are all within 45 minutes' drive of each other, and the roads are quiet. From our Bruichladdich properties: Port Charlotte is 5 minutes; Bowmore is 15 minutes around Loch Indaal; Portnahaven and Port Wemyss are 20 minutes south along the Rhinns; Bridgend is 10 minutes east at the head of the loch; Port Askaig on the north coast is 25 minutes; Port Ellen on the south coast is 45 minutes. The island is compact enough that two or three villages can be combined comfortably on a single day trip, and the single-track roads rarely cause delays outside July and August.",
    )],
    category: 'villages',
    priority: 40,
  },
  {
    _id: 'faq-guide-villages-portnahaven',
    question: 'What is Portnahaven like — is it worth the drive?',
    answer: [para(
      "Portnahaven — and its neighbour Port Wemyss — at the southern tip of the Rhinns is one of the most rewarding short trips from our properties. It is a 20-minute drive along a quiet road that gets progressively emptier as you go south. The harbour almost always has common seals hauled out on the rocks and swimming in the water — often close enough to observe clearly. An Tigh Seinnse is a small, genuinely local pub serving home-cooked food. Open year-round; winter hours apply from November. Regular season hours: Thursday to Sunday from noon, Wednesday from 4:30pm, closed Monday and Tuesday. Reservations required — call 01496 860725 and confirm hours for winter visits. The combination of seals, good food, and the sense of being at the very end of the road makes Portnahaven the best half-day on the Rhinns after Port Charlotte.",
    )],
    category: 'villages',
    priority: 50,
  },
  {
    _id: 'faq-guide-villages-shopping',
    question: 'What shops are there on Islay — where should I do my main food shopping?',
    answer: [para(
      "The Co-op in Bowmore is the main supermarket on Islay — the best-stocked and most reliably open year-round. It carries fresh produce, meat, alcohol, and household essentials. Aileen's Mini-Market in Bruichladdich village is 5 minutes' walk from our properties and covers daily basics, coffee, and bacon rolls. Port Charlotte Stores has a shop, post office, and petrol pump. There is no large supermarket on the island — the Co-op is as close as it gets. We recommend arriving with enough provisions for the first day and doing a proper shop at the Co-op on your first full morning.",
    )],
    category: 'villages',
    priority: 60,
  },
];

// ─── 5. Archaeology FAQ documents ────────────────────────────────────────────

const ARCHAEOLOGY_FAQS = [
  {
    _id: 'faq-guide-archaeology-finlaggan',
    question: 'What is Finlaggan on Islay — why is it historically significant?',
    answer: [para(
      "Finlaggan, on the shores of Loch Finlaggan in central Islay, was the seat of the Lordship of the Isles from the 12th to the 16th century — the administrative and ceremonial centre of the most powerful Gaelic dynasty in medieval Scotland. The Lords of the Isles controlled the Hebrides and much of the western mainland from Finlaggan's two islands: Eilean Mòr (the great island, with the great hall and chapel) and Eilean na Comhairle (Council Island, where the Council of the Isles convened). The Lordship was forfeited to the Scottish Crown in 1493 and never re-established; Finlaggan was abandoned and has remained largely undisturbed since. A small visitor centre with finds from excavations is open from Saturday 5 April, Monday to Saturday 1100–1630, closed Sunday; entry is by donation (tel: +44(0)1496 840 644; email: finlaggan@outlook.com). The islands are accessible year-round via a short causeway path. It is 25 minutes' drive from our Bruichladdich properties.",
    )],
    category: 'archaeology',
    priority: 10,
  },
  {
    _id: 'faq-guide-archaeology-kildalton-cross',
    question: 'What is the Kildalton Cross and how do I visit it?',
    answer: [para(
      "The Kildalton Cross is an 8th-century ringed high cross at Kildalton Church on the south-east coast of Islay — widely considered the finest surviving example of Early Christian carved stonework in Scotland. It has stood in its original outdoor location since it was carved, approximately 800 AD, and the quality of the carving remains remarkable: Old Testament scenes, Virgin and Child, and intricate knotwork on a cross 2.65 metres high. There is no admission fee, no booking required, and the site is open year-round. To reach it by car, drive east from Port Ellen for approximately 8 miles on the A846 and the minor road beyond Ardbeg — about 50 minutes from our properties. The Kildalton Shoreline Walk from Port Ellen provides an alternative approach on foot, combining the cross with Ardbeg, Lagavulin, and Laphroaig distilleries and Dunyvaig Castle on a single south coast walk.",
    )],
    category: 'archaeology',
    priority: 20,
  },
  {
    _id: 'faq-guide-archaeology-american-monument',
    question: 'Who are the American soldiers commemorated at the American Monument on the Oa?',
    answer: [para(
      "The American Monument on the clifftop of the Oa peninsula commemorates hundreds of American servicemen who drowned when two troopships — the USS Tuscania and the HMT Otranto — sank off the Oa in 1918 during World War One. The Tuscania was torpedoed by a German U-boat on 5 February 1918 with the loss of around 200 lives. The Otranto collided with another vessel in a storm on 6 October 1918 and sank with the loss of over 400, including many American soldiers. Their bodies came ashore on the beaches of the Oa. The monument was erected by the American Red Cross in 1920 and is maintained by the War Graves Commission. It stands on a clifftop above the Atlantic, 35–40 minutes' drive from our properties plus a 20-minute walk from the RSPB car park at PA42 7AU. Views on a clear day reach to Ireland.",
    )],
    category: 'archaeology',
    priority: 30,
  },
  {
    _id: 'faq-guide-archaeology-stromatolites',
    question: 'What are the Bunnahabhain Stromatolites — and how old are they?',
    answer: [para(
      "The Bunnahabhain Stromatolites are fossilised microbial structures visible in rock exposures near Bunnahabhain Distillery on the north coast of Islay, dating to approximately 1.2 billion years ago — among the oldest macroscopic fossils in Britain. Stromatolites are layered structures formed by microbial mats in shallow ancient seas; the Bunnahabhain examples are exceptionally well preserved in the Dalradian quartzite of the Islay coast. To find them: park at the Bunnahabhain Distillery car park, walk through the distillery buildings toward the southern end past the distillery cottages, and take the gate at the end onto a rough coastal path toward Rubha a'Mhill. The first fossilised exposures appear approximately 50 metres after the gate, in boulders of Bonahaven Dolomite on the shore. Best at low tide — many of the best exposures are on the intertidal rocks. Combining the stromatolites with a visit to Bunnahabhain, Caol Ila, or Ardnahoe distillery makes a good north coast half-day.",
    )],
    category: 'archaeology',
    priority: 40,
  },
  {
    _id: 'faq-guide-archaeology-kilnave',
    question: 'What is Kilnave Chapel and what happened there?',
    answer: [para(
      "Kilnave Chapel is a ruined medieval chapel on the shores of Loch Gruinart on the northern Rhinns of Islay, built in the late 14th or early 15th century. On 5 August 1598 it was the site of the final act of the Battle of Traigh Gruinart — the last major clan battle on Islay, fought between the MacDonalds and the MacLeans of Mull over possession of the Rhinns. Thirty MacLean survivors retreated to the chapel; the MacDonalds fired the thatched roof. All died except one man — a Mac Mhuirich (Currie) who escaped through a hole as the burning thatch collapsed. The ruins remain open to the sky. Immediately to the west stands an 8th-century carved cross — ringless, 3.35 metres tall, and roughly 600 years older than the chapel beside it. The site is 20 minutes' drive from our properties on the road to RSPB Loch Gruinart — combine it with a visit to the reserve's wildlife hides for a morning on the northern Rhinns.",
    )],
    category: 'archaeology',
    priority: 50,
  },
  {
    _id: 'faq-guide-archaeology-bowmore-church',
    question: 'Is the Bowmore Round Church open to visitors?',
    answer: [para(
      "Bowmore Round Church — formally Kilarrow Parish Church — is a functioning Church of Scotland parish church, built in 1767, at the top of Bowmore's main street. It is open for regular services and to visitors outside service times; the door is usually unlocked during the day. The church is circular in plan, the only round church on Islay, and local tradition attributes the unusual design to a desire to prevent the Devil finding a corner to hide in. Whether or not that story is true, the building is genuinely distinctive and worth five minutes on any visit to Bowmore. It is 15 minutes' drive from our Bruichladdich properties.",
    )],
    category: 'archaeology',
    priority: 60,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' import-blocks-26-29.ts');
  console.log('═══════════════════════════════════════════════════════════════');

  // ── Step 1: Add teaserContent to islay-villages-overview ─────────────────────
  console.log('\n── 1 — canonical-block-islay-villages-overview · teaserContent ──');
  try {
    await client
      .patch('canonical-block-islay-villages-overview')
      .set({ teaserContent: [VILLAGES_TEASER] })
      .commit();
    ok('1', 'villages teaserContent set');
  } catch (err) { fail('1', err); }

  // ── Step 2: Prepend intro para to islay-archaeology-overview fullContent ──────
  console.log('\n── 2 — canonical-block-islay-archaeology-overview · intro para ──');
  try {
    const doc = await client.fetch<{ fullContent: any[] }>(
      `*[_id == "canonical-block-islay-archaeology-overview"][0]{ fullContent }`
    );
    const existing = doc?.fullContent || [];
    // Only prepend if the intro para is missing (check for text starting with "Islay has been")
    const hasIntro = existing.some((b: any) =>
      b?._type === 'block' &&
      b?.children?.[0]?.text?.startsWith('Islay has been continuously inhabited')
    );
    if (hasIntro) {
      ok('2', 'intro para already present — skipped');
    } else {
      await client
        .patch('canonical-block-islay-archaeology-overview')
        .set({ fullContent: [ARCHAEOLOGY_INTRO_PARA, ...existing] })
        .commit();
      ok('2', `intro para prepended (fullContent now ${existing.length + 1} blocks)`);
    }
  } catch (err) { fail('2', err); }

  // ── Step 3: Add teaserContent to islay-archaeology-overview ──────────────────
  console.log('\n── 3 — canonical-block-islay-archaeology-overview · teaserContent ──');
  try {
    await client
      .patch('canonical-block-islay-archaeology-overview')
      .set({ teaserContent: [ARCHAEOLOGY_TEASER] })
      .commit();
    ok('3', 'archaeology teaserContent set');
  } catch (err) { fail('3', err); }

  // ── Step 4: Create 6 villages FAQ documents ───────────────────────────────────
  console.log('\n── 4 — villages faqCanonicalBlock documents (6) ──');
  for (const faq of VILLAGES_FAQS) {
    try {
      await client.createOrReplace({
        _type: 'faqCanonicalBlock',
        _id: faq._id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        priority: faq.priority,
        searchVolume: 'unknown',
      });
      ok(`4/${faq._id}`);
    } catch (err) { fail(`4/${faq._id}`, err); }
  }

  // ── Step 5: Create 6 archaeology FAQ documents ────────────────────────────────
  console.log('\n── 5 — archaeology faqCanonicalBlock documents (6) ──');
  for (const faq of ARCHAEOLOGY_FAQS) {
    try {
      await client.createOrReplace({
        _type: 'faqCanonicalBlock',
        _id: faq._id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        priority: faq.priority,
        searchVolume: 'unknown',
      });
      ok(`5/${faq._id}`);
    } catch (err) { fail(`5/${faq._id}`, err); }
  }

  // ── Step 6: Wire guide-islay-villages ─────────────────────────────────────────
  console.log('\n── 6 — guide-islay-villages · contentBlocks + faqBlocks ──');
  try {
    await client
      .patch('guide-islay-villages')
      .set({
        contentBlocks: [blockRef('islay-villages-overview', 'full')],
        faqBlocks: VILLAGES_FAQS.map(f => faqRef(f._id)),
      })
      .commit();
    ok('6', `guide-islay-villages wired (1 content block, ${VILLAGES_FAQS.length} FAQs)`);
  } catch (err) { fail('6', err); }

  // ── Step 7: Wire guide-archaeology-history ────────────────────────────────────
  console.log('\n── 7 — guide-archaeology-history · contentBlocks + faqBlocks ──');
  try {
    await client
      .patch('guide-archaeology-history')
      .set({
        contentBlocks: [blockRef('islay-archaeology-overview', 'full')],
        faqBlocks: ARCHAEOLOGY_FAQS.map(f => faqRef(f._id)),
      })
      .commit();
    ok('7', `guide-archaeology-history wired (1 content block, ${ARCHAEOLOGY_FAQS.length} FAQs)`);
  } catch (err) { fail('7', err); }

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log('\n══ Summary ════════════════════════════════════════════════════');
  const counts = { '✓': 0, '⚠': 0, '✗': 0 } as Record<string, number>;
  for (const r of results) {
    console.log(`  ${r.status} ${r.id}${r.note ? ' — ' + r.note : ''}`);
    counts[r.status]++;
  }
  console.log(`\n  ${counts['✓']} ✓ | ${counts['⚠'] || 0} ⚠ | ${counts['✗'] || 0} ✗`);
  console.log('\nDone. Run semantic audit --no-cache to check scores.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
