/**
 * wire-travel-pages.ts
 *
 * 1. Creates canonical-block-flights-basics (from GETTING-HERE-V3 Section 6)
 * 2. Creates canonical-block-planning-basics (from GETTING-HERE-V3 Sections 7+8)
 * 3. Patches guide-ferry-to-islay    — fixes faqBlocks format (old wrapper → direct refs)
 * 4. Patches guide-flights-to-islay  — sets contentBlocks + fixes faqBlocks
 * 5. Patches guide-planning-your-trip — sets contentBlocks + wires all 8 planning FAQs
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

// ─── Portable Text helpers ────────────────────────────────────────────────────

function key(): string {
  return randomBytes(5).toString('hex');
}

function para(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function h3(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'h3',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function bullet(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

/** Paragraph ending with an inline link */
function paraWithLink(before: string, linkText: string, href: string) {
  const linkKey = key();
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [{ _type: 'link', _key: linkKey, href }],
    children: [
      ...(before ? [{ _type: 'span', _key: key(), text: before, marks: [] }] : []),
      { _type: 'span', _key: key(), text: linkText, marks: [linkKey] },
    ],
  };
}

function fact(f: string, v: string) {
  return { _key: key(), fact: f, value: v };
}

function ref(id: string) {
  return { _key: key(), _type: 'reference' as const, _ref: id };
}

function blockRef(refId: string, version: 'full' | 'teaser' = 'full') {
  return {
    _key: key(),
    _type: 'blockReference' as const,
    block: { _type: 'reference' as const, _ref: refId },
    version,
  };
}

// ─── flights-basics full content ──────────────────────────────────────────────

const flightsFullContent = [
  h3('Flight Details'),
  para(
    'Loganair operates two flights daily (one on Sundays) between Glasgow and Islay Airport. Flight time is approximately 25 minutes, with stunning aerial views of the islands on clear days. The aircraft are small (typically 20–30 passengers), and hand luggage space is limited. Check baggage allowances when booking.'
  ),
  h3('Islay Airport'),
  para(
    "Islay Airport is one of Scotland's smallest and most scenic airports, located on the southern tip of the island. The airport terminal has limited facilities — essentially a single room with check-in desks. Don't expect shops or lounges, and sadly the café isn't running at the moment — there is just a vending machine once you are through security. But the experience is charming and efficient."
  ),
  h3('From Airport to Bruichladdich'),
  para(
    'The drive takes about 30 minutes via the A846 through Bowmore and around the head of Loch Indaal. Car hire is available at the airport through Islay Car Hire — book in advance, especially in summer. Taxis should also be pre-booked; there is no ready-to-go taxi rank. You must arrange onward travel in advance.'
  ),
  h3('Cost Considerations'),
  para(
    'Flights are significantly more expensive than ferries, particularly if travelling as a family or with luggage — it averages £100+ per person each way. However, flying saves 4+ hours of travel time each way and avoids potential ferry disruptions. Many guests fly one direction and ferry the other to experience both.'
  ),
  h3('Weather Considerations'),
  para(
    'While the ferries are disrupted by wind, it is low cloud that disrupts the flights. Islay Airport does not have the radar required to allow landing in poor visibility — the pilots must be able to see the runway clearly to land.'
  ),
  para(
    "A general rule of thumb: if you can see the other side of Loch Indaal, the plane can land. If you can't, it won't. This can mean some strategic planning — low cloud, get the ferry; high winds, take the plane. If you're not sure, get in touch and we'll help."
  ),
];

const flightsTeaserContent = [
  paraWithLink(
    'Loganair flies from Glasgow to Islay in 25 minutes — two flights daily, one on Sundays. Islay Airport is 30 minutes\u2019 drive from Bruichladdich. Flights average £100+ per person each way but save 4+ hours of travel time. Low cloud disrupts flights; high winds disrupt ferries — knowing this helps you plan. ',
    'Flying to Islay — our complete guide \u2192',
    '/explore-islay/flights-to-islay'
  ),
];

const flightsKeyFacts = [
  fact('Flight time (Glasgow)', '25 minutes'),
  fact('Flights per day', '2 (1 on Sundays)'),
  fact('Airport to Bruichladdich', '30 minutes drive'),
  fact('Average cost (each way)', '£100+ per person'),
  fact('Aircraft size', '20–30 passengers'),
  fact('Disrupted by', 'Low cloud (not wind)'),
];

// ─── planning-basics full content ─────────────────────────────────────────────

const planningFullContent = [
  h3('Do You Need a Car on Islay?'),
  para(
    'Yes, a car is strongly recommended. Islay has limited public transport, and taxis must be booked in advance. Most distilleries, beaches, and attractions require driving to reach. The freedom to explore at your own pace is essential to enjoying the island.'
  ),
  h3('Car Hire'),
  bullet('Islay Car Hire operates from the airport and ferry ports'),
  bullet('Book well in advance, especially for summer and Fèis Ìle dates'),
  bullet('Expect small, practical vehicles — no luxury fleet, but perfectly adequate'),
  bullet('Daily rates are reasonable; weekly rates offer better value'),
  h3('Driving on Islay'),
  para(
    'The main roads allow traffic in both directions, but some parts of the island have single-track roads with passing places. Locals use passing places to allow faster traffic to overtake, not just for oncoming vehicles. Driving is relaxed and unhurried — expect wildlife on roads (sheep, cattle, birds).'
  ),
  para(
    "You'll also notice oncoming drivers waving at you — or more commonly lifting a finger off the wheel. This is the famous Islay wave, a simple bit of courtesy acknowledging other drivers. Reciprocate if you feel like it. It's part of island culture."
  ),
  h3('Distances from Bruichladdich'),
  bullet('Bruichladdich Distillery: 5-minute walk'),
  bullet('Port Charlotte (restaurants, shops): 5-minute drive / 40-minute walk'),
  bullet('Port Ellen ferry terminal: 35 minutes drive'),
  bullet('Port Askaig ferry terminal: 25 minutes drive'),
  bullet('Machir Bay beach: 15 minutes drive'),
  bullet('Ardbeg / Lagavulin / Laphroaig distilleries: 40–50 minutes drive'),
  h3('How Many Days?'),
  bullet('Minimum: 2–3 nights allows time to visit 3–4 distilleries and see main beaches'),
  bullet('Recommended: 5–7 nights for leisurely exploration, Jura day trip, wildlife watching'),
  bullet('Whisky-focused: 3–4 full days to visit 5–6 distilleries comfortably'),
  para(
    "Remember your first and last days are mostly travel — a week-long stay gives you 5 genuine activity days. Our guests who book for 7+ nights consistently tell us they wished they'd had longer. Also consider including a couple of days on Jura, a dramatically different island, to really experience this part of the Hebrides."
  ),
  h3('Best Time to Visit'),
  bullet('April–June: Sunniest months, good weather, fewer crowds, reasonable prices'),
  bullet('July–August: Warmest (relatively), busiest, school holiday premium'),
  bullet('Late May: Fèis Ìle whisky festival — book accommodation and ferry 12+ weeks ahead'),
  bullet('September–October: Barnacle geese arrive (30,000+ birds), beautiful autumn light'),
  bullet('Winter (November–March): Dramatic weather, limited daylight, some distilleries closed'),
  h3('What to Pack'),
  bullet('Waterproof jacket and layers (weather changes rapidly)'),
  bullet('Walking boots or sturdy shoes for coastal paths and beaches'),
  bullet('Binoculars for wildlife (optional but recommended)'),
  bullet('Sunglasses and sunscreen (surprising amounts of sun between showers)'),
  bullet('Your own beach towels or dog towels if bringing pets (we provide bath towels only)'),
  paraWithLink(
    "Once you're on the island, our full guide to distilleries, beaches, wildlife, restaurants, and family activities has everything you need. ",
    'Explore Islay \u2192',
    '/explore-islay'
  ),
];

const planningTeaserContent = [
  paraWithLink(
    "A week on Islay gives you 5 full activity days — your first and last are travel days. Best months: April–June for sun and fewer crowds; September–October for barnacle geese. A car is essential. Book ferries 12 weeks ahead for vehicle spaces. ",
    'Planning your Islay trip \u2192',
    '/explore-islay/planning-your-trip'
  ),
];

const planningKeyFacts = [
  fact('Minimum stay', '2–3 nights'),
  fact('Recommended stay', '5–7 nights'),
  fact('Best months', 'April–June'),
  fact('Fèis Ìle', 'Late May (book 12+ weeks ahead)'),
  fact('Airport to Bruichladdich', '30 minutes drive'),
  fact('Bruichladdich Distillery', '5-minute walk'),
];

// ─── FAQ IDs ──────────────────────────────────────────────────────────────────

const FERRY_FAQS = [
  'faqCanonicalBlock.faq-trvl-ferries-how-long-is-the-ferry-to-islay',
  'faqCanonicalBlock.faq-trvl-ferries-do-you-help-with-ferry-disruptions',
];

const FLIGHTS_FAQS = [
  'faqCanonicalBlock.faq-trvl-flights-can-you-fly-to-islay-from-glasgow',
];

const PLANNING_FAQS = [
  'faqCanonicalBlock.faq-trvl-planning-is-islay-worth-visiting',
  'faqCanonicalBlock.faq-trvl-planning-how-do-i-pronounce-islay',
  'faqCanonicalBlock.faq-trvl-planning-how-many-days-do-i-need-on-islay',
  'faqCanonicalBlock.faq-trvl-planning-where-is-islay-located',
  'faqCanonicalBlock.faq-trvl-planning-when-is-the-best-time-to-visit-islay',
  'faqCanonicalBlock.faq-trvl-planning-can-you-get-around-islay-without-a-car',
  'faqCanonicalBlock.faq-trvl-planning-how-big-is-islay',
  'faqCanonicalBlock.faq-trvl-planning-whats-the-weather-like-on-islay',
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== wire-travel-pages.ts ===\n');

  // 1. Create canonical-block-flights-basics
  console.log('Creating canonical-block-flights-basics...');
  await client.createOrReplace({
    _id: 'canonical-block-flights-basics',
    _type: 'canonicalBlock',
    blockId: { _type: 'slug', current: 'flights-basics' },
    title: 'Flights to Islay',
    entityType: 'travel',
    canonicalHome: '/explore-islay/flights-to-islay',
    fullContent: flightsFullContent,
    teaserContent: flightsTeaserContent,
    keyFacts: flightsKeyFacts,
    usedOn: ['/explore-islay/flights-to-islay'],
    notes: 'Created by wire-travel-pages.ts from GETTING-HERE-V3-CORRECTED.md Section 6',
  });
  console.log('  ✓ canonical-block-flights-basics created');

  // 2. Create canonical-block-planning-basics
  console.log('Creating canonical-block-planning-basics...');
  await client.createOrReplace({
    _id: 'canonical-block-planning-basics',
    _type: 'canonicalBlock',
    blockId: { _type: 'slug', current: 'planning-basics' },
    title: 'Planning Your Trip to Islay',
    entityType: 'travel',
    canonicalHome: '/explore-islay/planning-your-trip',
    fullContent: planningFullContent,
    teaserContent: planningTeaserContent,
    keyFacts: planningKeyFacts,
    usedOn: ['/explore-islay/planning-your-trip'],
    notes: 'Created by wire-travel-pages.ts from GETTING-HERE-V3-CORRECTED.md Sections 7+8',
  });
  console.log('  ✓ canonical-block-planning-basics created');

  // 3. Patch ferry-to-islay — fix faqBlocks format only (contentBlocks already correct)
  console.log('\nPatching guide-ferry-to-islay (faqBlocks)...');
  await client
    .patch('guide-ferry-to-islay')
    .set({ faqBlocks: FERRY_FAQS.map(ref) })
    .commit();
  console.log('  ✓ guide-ferry-to-islay faqBlocks re-wired');

  // 4. Patch flights-to-islay — contentBlocks + faqBlocks
  console.log('Patching guide-flights-to-islay (contentBlocks + faqBlocks)...');
  await client
    .patch('guide-flights-to-islay')
    .set({
      contentBlocks: [blockRef('canonical-block-flights-basics', 'full')],
      faqBlocks: FLIGHTS_FAQS.map(ref),
    })
    .commit();
  console.log('  ✓ guide-flights-to-islay wired');

  // 5. Patch planning-your-trip — contentBlocks + all 8 planning FAQs
  console.log('Patching guide-planning-your-trip (contentBlocks + faqBlocks)...');
  await client
    .patch('guide-planning-your-trip')
    .set({
      contentBlocks: [blockRef('canonical-block-planning-basics', 'full')],
      faqBlocks: PLANNING_FAQS.map(ref),
    })
    .commit();
  console.log('  ✓ guide-planning-your-trip wired');

  console.log('\n=== Done ===');
  console.log('  2 new canonical blocks created');
  console.log('  3 guide pages patched');
  console.log('\nVerify at:');
  console.log('  /explore-islay/ferry-to-islay');
  console.log('  /explore-islay/flights-to-islay');
  console.log('  /explore-islay/planning-your-trip');
}

run().catch(console.error);
