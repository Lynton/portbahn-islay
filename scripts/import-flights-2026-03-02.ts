/**
 * import-flights-2026-03-02.ts
 *
 * Applies the full voice pass from FLIGHTS-UPDATE-2026-03-02.md:
 *  1. guide-flights-to-islay · introduction (SET — audience framing, 25 min corrected)
 *  2. canonical-block-flights-basics · fullContent (REPLACE — full rebuild from spec)
 *
 * Source: _work/cw/pbi/handoffs/FLIGHTS-UPDATE-2026-03-02.md
 * Notes:
 *   - Section headings preserved in PortableText as h3 blocks (matching original structure)
 *   - Factual fix: "40 minutes" → "25 minutes" in Flight Details section
 *   - Audience framing added as guide page introduction (not in canonical block)
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-flights-2026-03-02.ts
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

// ─── Content ──────────────────────────────────────────────────────────────────

// guide-flights-to-islay.introduction — audience framing
const FLIGHTS_INTRODUCTION =
  'The flight suits a specific kind of trip. A whisky group travelling without a car, a couple where speed matters more than cost, someone squeezing Islay into a longer Scottish itinerary. For most guests - families especially, or anyone planning to explore the island properly - the ferry makes far more sense. It\'s cheaper, you take your car, and the crossing itself is genuinely one of the best parts of arriving on Islay. But when the flight fits, Loganair covers the route from Glasgow in 25 minutes.';

// canonical-block-flights-basics.fullContent — full rebuild from spec
const FLIGHTS_FULL_CONTENT: any[] = [
  h3('Flight Details'),
  para('Loganair operates two flights a day during the week, one on Sundays, between Glasgow and Islay Airport. The flight takes about 25 minutes. The aircraft are small - around 30 seats - and hold luggage is limited, so check your baggage allowances when you book.'),
  para('On a clear day, the approach is something. You come in low over the Rhinns, sea on both sides, the Paps of Jura straight ahead across the sound. Not a bad view for a short hop. We\'ve done it. It doesn\'t make up for missing the ferry crossing - but it\'s a perfectly good way to arrive.'),

  h3('Islay Airport'),
  para("Islay Airport is essentially one room with check-in desks. There's no café running at the moment - a vending machine once you're through security. Don't expect shops or a lounge. What you do get is a very short walk to the plane and one of the quieter arrivals you'll experience anywhere. Efficient the way small things are efficient - no queues, no noise, no fuss. The runway sits on the flat southern end of the island, and you're on the road to Bruichladdich within minutes of landing."),

  h3('From Airport to Bruichladdich'),
  para('The drive to Bruichladdich takes about 30 minutes via the A846 through Bowmore and around the head of Loch Indaal. Car hire is available at the airport through Islay Car Hire - book well in advance, especially in summer. Taxis are available but there\'s no rank; you\'ll need to pre-book before you arrive.'),
  para("Worth being direct about this: without a car, Islay is genuinely hard to explore. The bus service runs the main road between Port Ellen, Bowmore, Bruichladdich and Port Askaig - but the places most worth seeing are off that route. Distilleries, remote beaches, walks, wildlife - almost all of it needs a car or a taxi budget. If you're flying and not hiring a car, think that through before you book. In our experience it works well for whisky groups who are distillery-hopping by taxi, or guests who are happy to base themselves in the village. For anyone wanting to see the whole island, the ferry with your own car is the better option."),

  h3('Cost Considerations'),
  para('Flying costs considerably more than the ferry - around £100+ per person each way, more in peak season. For a family of four that\'s a significant sum in each direction. For a couple travelling light where time matters more than money, or a whisky group splitting taxi costs between several people, the calculation changes.'),
  para("Flying saves roughly 4 hours of travel time each way and removes the risk of ferry disruption entirely. Some guests fly one way and take the ferry the other - a good way to do both, and to see the island arriving across the water at least once. If you're only taking one direction by air, we'd suggest flying out and ferrying home - the ferry crossing is part of arriving on Islay, and worth having as your first experience of the place."),

  h3('Weather Considerations'),
  para("The ferries are disrupted by high winds; the flights are grounded by low cloud. Islay Airport doesn't have radar for blind landings - the pilots need to see the runway clearly to bring the plane in. So weather planning here is quite different from the ferry."),
  para("The rule of thumb we always use: if you can see the other side of Loch Indaal, the plane can land. If you can't, it won't. Low cloud and poor visibility: check the ferry times. High winds and good visibility: the flight's the safer call. It's worth tracking the forecast in the days before you travel - and if you're not sure how to read it, get in touch. We know these patterns well and are happy to help you think it through."),

  // CTA paragraph
  para('Check Loganair flight times and book at loganair.co.uk - Glasgow to Islay (GLA–ILY). Fares vary significantly by date; book early for the best prices.'),
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' import-flights-2026-03-02.ts');
  console.log('═══════════════════════════════════════════════════════════════');

  let ok = 0;
  let failed = 0;

  // 1. Set guide-flights-to-islay.introduction
  console.log('\n── 1 — guide-flights-to-islay · introduction ──');
  try {
    await client
      .patch('guide-flights-to-islay')
      .set({ introduction: FLIGHTS_INTRODUCTION })
      .commit();
    console.log('  ✓ guide-flights-to-islay.introduction set (25 min, audience framing)');
    ok++;
  } catch (err: any) {
    console.error(`  ✗ introduction failed — ${err.message}`);
    failed++;
  }

  // 2. Replace canonical-block-flights-basics.fullContent
  console.log('\n── 2 — canonical-block-flights-basics · fullContent (full rebuild) ──');
  try {
    await client
      .patch('canonical-block-flights-basics')
      .set({ fullContent: FLIGHTS_FULL_CONTENT })
      .commit();
    console.log('  ✓ canonical-block-flights-basics.fullContent rebuilt (25 min, 5 sections + CTA)');
    ok++;
  } catch (err: any) {
    console.error(`  ✗ fullContent rebuild failed — ${err.message}`);
    failed++;
  }

  console.log(`\n══ Summary: ${ok} ✓ | ${failed} ✗ ══════════════════════════════`);
  console.log('Done. Run import-sanity-2026-03-03.ts next if not already run.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
