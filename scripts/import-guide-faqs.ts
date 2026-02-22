/**
 * Import Guide FAQs — from Blocks 18–22 (v4.0)
 *
 * Decomposes the 5 canonical FAQ blocks into individual faqCanonicalBlock
 * documents (5 Q&As each = 25 total). These are then wired into guidePage
 * faqBlocks as direct references.
 *
 * Also removes the 5 canonicalBlock FAQ documents (18-22) from Sanity —
 * their content lives in faqCanonicalBlock documents now.
 *
 * Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/import-guide-faqs.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const generateKey = () => Math.random().toString(36).substring(2, 11);

function textBlock(text: string) {
  return {
    _key: generateKey(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
  };
}

function boldSpan(text: string) {
  return { _key: generateKey(), _type: 'span', marks: ['strong'], text };
}

function span(text: string) {
  return { _key: generateKey(), _type: 'span', marks: [], text };
}

function mixedBlock(...parts: ReturnType<typeof span>[]) {
  return {
    _key: generateKey(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: parts,
  };
}

function bulletBlock(text: string) {
  return {
    _key: generateKey(),
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
  };
}

function bulletBoldBlock(boldPart: string, rest: string) {
  return {
    _key: generateKey(),
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [boldSpan(boldPart), span(rest)],
  };
}

// ---------------------------------------------------------------------------
// 25 FAQ documents — 5 per guide page
// ---------------------------------------------------------------------------

const faqs: Array<{
  _id: string;
  question: string;
  answer: unknown[];
  category: string;
  priority: number;
}> = [

  // ── Block 18: food-drink-islay-faqs ──────────────────────────────────────

  {
    _id: 'faq-guide-food-book-restaurants',
    question: 'Do I need to book restaurants on Islay in advance?',
    category: 'food-drink',
    priority: 10,
    answer: [
      textBlock("Yes — emphatically. Islay's restaurants are small and popular, and there is no overflow option on an island. The Lochindaal Seafood Kitchen in Port Charlotte requires 24 hours' notice for the full seafood platter. The Port Charlotte Hotel fills on music nights (Wednesday and Sunday evenings). An Tigh Seinnse in Portnahaven is tiny and gets busy regardless of season. Our strong advice: book your restaurant evenings before you arrive, particularly in July and August or during Fèis Ìle whisky festival in late May."),
    ],
  },
  {
    _id: 'faq-guide-food-best-restaurant',
    question: 'What is the best restaurant on Islay?',
    category: 'food-drink',
    priority: 20,
    answer: [
      textBlock("The Lochindaal Seafood Kitchen in Port Charlotte is our top recommendation — and consistently our guests' too. Run by Jack and his father Iain, the seafood platter features langoustines, crab, oysters and mussels direct from local fishermen. Order the full platter 24 hours ahead. For atmosphere, whisky, and live music, the Port Charlotte Hotel is exceptional — Wednesday and Sunday evenings by the log fire with a dram in hand are genuinely memorable. Both are a 5-minute drive from our properties in Bruichladdich."),
    ],
  },
  {
    _id: 'faq-guide-food-fresh-oysters',
    question: 'Where can I get fresh oysters on Islay?',
    category: 'food-drink',
    priority: 30,
    answer: [
      textBlock("Loch Gruinart produces some of the finest oysters in the UK, farmed in the cold, clean tidal waters of the loch on the northern Rhinns. The Loch Gruinart Oyster Shack sells freshly shucked oysters direct to visitors on site [CONFIRM: seasonal opening details]. The Lochindaal Seafood Kitchen in Port Charlotte also features local oysters as part of their seafood platter. Loch Gruinart is also the RSPB's principal reserve for barnacle geese — combining an early morning wildlife visit with oysters at the shack is one of the best days out on the island."),
    ],
  },
  {
    _id: 'faq-guide-food-groceries',
    question: 'Where can I buy groceries on Islay?',
    category: 'food-drink',
    priority: 40,
    answer: [
      textBlock("The Co-op in Bowmore (15 minutes' drive from our properties) is the island's main supermarket — small but sufficient for stocking a self-catering kitchen with fresh produce, meat, and household supplies. Port Charlotte Stores (5 minutes' drive) covers daily essentials. Aileen's Mini Market in Bruichladdich (5-minute walk) is ideal for morning coffee, bacon rolls, and newspapers. For fresh fish, Jean's Fresh Fish Van visits villages weekly — ask us for the current schedule when you arrive."),
    ],
  },
  {
    _id: 'faq-guide-food-distillery-cafe',
    question: 'Which distillery café is best for lunch on Islay?',
    category: 'food-drink',
    priority: 50,
    answer: [
      textBlock("Ardbeg's café on the south coast is our top recommendation for a distillery lunch — excellent food in a dramatic setting right on the shoreline, worth combining with Lagavulin and Laphroaig next door. Kilchoman's farm café is ideal for a quieter rural lunch surrounded by barley fields. Ardnahoe on the north coast has good food and an extraordinary view across the Sound of Islay to the Paps of Jura. All three operate during distillery visiting hours; check ahead in winter when hours may be reduced."),
    ],
  },

  // ── Block 19: families-islay-faqs ────────────────────────────────────────

  {
    _id: 'faq-guide-family-good-for-families',
    question: 'Is Islay good for families with young children?',
    category: 'family',
    priority: 10,
    answer: [
      textBlock("Yes — it's one of Scotland's best family holiday destinations for the right kind of family. Islay rewards families who want space, fresh air, and genuine nature rather than organised entertainment. There are no theme parks, no arcades — but there are miles of safe sandy beaches, 30,000+ barnacle geese in winter, seals on the shoreline, rock pools at low tide, and an indoor swimming pool in Bowmore for rainy days. Pi and Lynton have raised their own two children on Islay and Jura; they know the beaches, the rainy day escapes, and the wildlife moments that stick. Their three properties in Bruichladdich are all set up for families with children of all ages."),
    ],
  },
  {
    _id: 'faq-guide-family-safe-beaches',
    question: 'Which beaches on Islay are safe for children to swim?',
    category: 'family',
    priority: 20,
    answer: [
      textBlock("The sheltered beaches of Loch Indaal are the safe options: Portbahn Beach (5 minutes' walk from our properties — three small coves, calm water, rock pools), Port Charlotte Beach (5 minutes' drive, shallow and sandy, playground in the village after), and on the southeast coast, Laggan Bay and Kilnaughton Bay near Port Ellen. These beaches have limited tidal flow and are appropriate for paddling and supervised swimming. The Atlantic beaches — Machir Bay, Saligo Bay, and Sanaigmore — have strong currents and undertows. They are not safe for swimming at any state of tide. Take children there for walks and dune adventures, but keep them out of the water."),
    ],
  },
  {
    _id: 'faq-guide-family-machir-bay',
    question: 'Is Machir Bay safe for swimming?',
    category: 'family',
    priority: 30,
    answer: [
      textBlock("No. Machir Bay is one of Islay's most spectacular beaches — two miles of golden sand, dramatic Atlantic surf, exceptional sunsets — but it is not safe for swimming. Strong currents and undertows make it dangerous at all states of tide. The same applies to Saligo Bay immediately to the north. Locals refer to them as \"drowning beaches,\" and there have been serious incidents over the years. Walk them, photograph them, let the children run the dunes — but keep everyone well clear of the water. For swimming, head to Portbahn Beach or Port Charlotte Beach on the sheltered Loch Indaal side."),
    ],
  },
  {
    _id: 'faq-guide-family-rainy-day',
    question: 'What are the best rainy day activities for families on Islay?',
    category: 'family',
    priority: 40,
    answer: [
      textBlock("The Mactaggart Leisure Centre in Bowmore has an indoor swimming pool — a genuine holiday saver on wet days, and worth checking their Facebook page before you go as they often install giant inflatables during school holidays. Persabus Pottery near Finlaggan is run by Rosemary and offers pottery painting for all ages — we've been going with our own children for years. The Islay Woollen Mill in Bridgend is worth an hour for older children interested in how things are made — working looms, island tweed, and a story of producing fabric for some of the world's top design houses. And honestly: a fire, board games, and watching the weather roll across Loch Indaal from the window is part of the Islay experience."),
    ],
  },
  {
    _id: 'faq-guide-family-best-age',
    question: 'What age is an Islay family holiday best suited to?',
    category: 'family',
    priority: 50,
    answer: [
      textBlock("All ages, but differently. Under-5s thrive at Portbahn Beach (safe, compact, always fascinating at low tide) and the seals at Portnahaven harbour. Children aged 5–12 get the most from the wildlife — the barnacle geese at Loch Gruinart are unforgettable — and from the freedom of wide beaches and running full pelt across Ardnave Point's dunes. Teenagers can engage with the island more independently: coastal walks, distillery cafés, the Singing Sands, and harder hill walks on the Oa for fit older teens. Portbahn House (sunken trampoline, secure garden, sleeps 8) suits families with young children particularly well; Shorefield's woods and bird hides appeal more to older children; Curlew Cottage's enclosed walled garden is especially good for toddlers who need safe outdoor space."),
    ],
  },

  // ── Block 20: beaches-islay-faqs ─────────────────────────────────────────

  {
    _id: 'faq-guide-beaches-best-beach',
    question: 'What is the best beach on Islay?',
    category: 'beaches',
    priority: 10,
    answer: [
      textBlock("Depends what you're after. For a quiet, safe cove where you can rock pool, swim, and usually have the place entirely to yourselves, Portbahn Beach (5-minute walk from our properties via the war memorial path) is our favourite — three small sheltered bays on Loch Indaal with calm water and excellent rock pools at low tide. For drama and scale, Machir Bay is Islay's showpiece — two miles of golden sand backed by dunes and full Atlantic surf — though you cannot swim there. Ardnave Point has rolling dunes and big skies that are hard to beat on a clear day. Singing Sands on the east coast is worth a specific trip for the squeaking sand alone."),
    ],
  },
  {
    _id: 'faq-guide-beaches-safe-swimming',
    question: 'Which Islay beaches are safe for swimming?',
    category: 'beaches',
    priority: 20,
    answer: [
      textBlock("The sheltered beaches on Loch Indaal are safe: Portbahn Beach (5 minutes' walk from our properties, calm water, rock pools), Port Charlotte Beach (5-minute drive, shallow and sandy), and on the south-east coast, Laggan Bay and Kilnaughton Bay near Port Ellen. These have limited tidal flow and are appropriate for paddling and supervised swimming. The Atlantic-facing beaches — Machir Bay, Saligo Bay, and Sanaigmore in particular — should not be entered at any state of tide. Strong currents and undertows make them genuinely dangerous. They are spectacular for walks. They are not safe for swimming."),
    ],
  },
  {
    _id: 'faq-guide-beaches-machir-safe',
    question: 'Is Machir Bay safe for swimming?',
    category: 'beaches',
    priority: 30,
    answer: [
      textBlock("No. Machir Bay is the most photographed beach on Islay — two miles of golden sand, dramatic dunes, and some of the finest Atlantic light in Scotland. But the currents and undertows make it dangerous to enter at any state of tide. The same applies to Saligo Bay directly to its north. Locals call these \"drowning beaches\" and mean it. There are no lifeguards. Walk Machir Bay, photograph it, watch the sunset — but stay out of the water. For swimming, head to Portbahn Beach or Port Charlotte Beach on the sheltered Loch Indaal shore."),
    ],
  },
  {
    _id: 'faq-guide-beaches-rock-pools',
    question: 'Where are the best rock pools on Islay?',
    category: 'beaches',
    priority: 40,
    answer: [
      textBlock("Portbahn Beach at low tide is exceptional for rock pooling — small, sheltered coves with accessible rock platforms at the tide line, crabs, sea anemones, whelks, and small fish in every pool. It's a 5-minute walk from our properties. Portnahaven at the southern tip of the Rhinns has well-stocked rock pools along the harbour wall — and seals are often right there too. On the east coast, the small beaches around Claggain Bay and the approach to Singing Sands have good rock pool terrain. Bring a bucket and a net, and time your visit to arrive around low tide — the window is roughly two hours either side."),
    ],
  },
  {
    _id: 'faq-guide-beaches-surfing',
    question: 'Can you surf at Machir Bay or other Islay beaches?',
    category: 'beaches',
    priority: 50,
    answer: [
      textBlock("The surf at Machir Bay and Saligo Bay can be significant — consistent Atlantic swell, sometimes powerful. However, both beaches have strong undertows and unpredictable currents that make them dangerous for surfing without expert local knowledge. There is no organised surf school on Islay and no lifeguard provision at any beach. Experienced surfers do occasionally use Machir Bay, but anyone visiting without detailed knowledge of that break's conditions should exercise extreme caution."),
    ],
  },

  // ── Block 21: wildlife-islay-faqs ─────────────────────────────────────────

  {
    _id: 'faq-guide-wildlife-what-wildlife',
    question: 'What wildlife can I see on Islay?',
    category: 'wildlife',
    priority: 10,
    answer: [
      textBlock("Islay supports an exceptional range of wildlife year-round. The most celebrated is the winter arrival of over 30,000 barnacle geese from Greenland (October to April), concentrated at RSPB Loch Gruinart — one of Britain's great wildlife spectacles. Both golden eagles and white-tailed sea eagles are present year-round; sea eagles have wingspans up to 8 feet and are hard to mistake once you've seen one. Common and grey seals frequent Loch Indaal — guests often spot them from the window at Portbahn House. Otters are present along sheltered shorelines. Basking sharks and Minke whales appear offshore in summer. Choughs, one of the UK's rarest corvids, nest at The Oa. Islay's two RSPB reserves — Loch Gruinart and The Oa — provide hides, trails, and free access."),
    ],
  },
  {
    _id: 'faq-guide-wildlife-best-time',
    question: 'When is the best time to visit Islay for wildlife?',
    category: 'wildlife',
    priority: 20,
    answer: [
      textBlock("It depends on your priority. For barnacle geese — one of Europe's great wildlife spectacles — visit October to April, ideally November to January for peak numbers. For basking sharks and Minke whales, late May to August is the window. For choughs and breeding seabirds at The Oa, May to July is best. Eagles, seals, and most other wildlife are accessible year-round. Winter visits (October to March) are quieter, often cheaper, and extraordinary for birdwatching. Summer (June to August) has longer days, better weather, and more marine wildlife. Both seasons are exceptional — choose based on what you most want to see."),
    ],
  },
  {
    _id: 'faq-guide-wildlife-barnacle-geese',
    question: 'Where can I see barnacle geese on Islay?',
    category: 'wildlife',
    priority: 30,
    answer: [
      textBlock("RSPB Loch Gruinart reserve is the primary location — it holds the majority of Islay's 30,000+ winter geese population. The reserve is 20 minutes' drive from our Bruichladdich properties, accessed via the B8018 through Kilchoman. Arrive before dawn, go to the hides, and wait for the morning flight when the geese lift from the loch. The sound and scale of the lift-off is one of the most extraordinary wildlife moments in Scotland. Outside the reserve, geese feed on farmland across the Rhinns through the day — it's common to see large groups in fields along almost any road between October and April."),
    ],
  },
  {
    _id: 'faq-guide-wildlife-otters',
    question: 'Where is the best place to see otters on Islay?',
    category: 'wildlife',
    priority: 40,
    answer: [
      textBlock("Otters are present but elusive — patience and slow, quiet movement are the key. The Bruichladdich to Port Charlotte coastal path runs along good otter terrain: rocky shoreline, seaweed beds, shallow water. Walk slowly in the early morning or around dusk, scanning ahead rather than looking down. The quieter sections of the Rhinns coastline around Portnahaven are also productive, as is the Loch Gruinart margin. We keep binoculars in all our properties; bring the best pair you own, as a scan across a quiet shoreline at 100 metres is often how they're first spotted."),
    ],
  },
  {
    _id: 'faq-guide-wildlife-eagles',
    question: 'Can I see eagles on Islay?',
    category: 'wildlife',
    priority: 50,
    answer: [
      textBlock("Yes — Islay has both golden eagles and white-tailed sea eagles, and sightings from roads and coastal paths are relatively common compared to most of Scotland. Sea eagles are enormous — wingspan up to 8 feet, giving a \"flying barn door\" profile distinctive from any distance. Scan open hillsides, coastal cliffs, and inland moors, particularly in the morning when they're actively soaring. Golden eagles favour the higher moorland; sea eagles are more likely along the coast and over water. Keep looking up on any walk. Guests regularly spot eagles from Shorefield's windows and garden."),
    ],
  },

  // ── Block 22: distilleries-islay-faqs ────────────────────────────────────

  {
    _id: 'faq-guide-distilleries-visit-first',
    question: 'Which Islay distillery should I visit first?',
    category: 'distilleries',
    priority: 10,
    answer: [
      textBlock("Start at Bruichladdich — it's a 5-minute walk from our properties along the coastal cycle path, so you can tour without any driving. That alone makes it distinctive. Bruichladdich also covers the widest range of whisky styles on the island: unpeated Laddie Classic, moderately peated Port Charlotte, and the world's most heavily peated Octomore, as well as The Botanist gin. After Bruichladdich, plan your remaining distillery days based on taste preference: the south coast cluster (Ardbeg, Lagavulin, Laphroaig, Port Ellen) for heavily peated intensity; Kilchoman for farm distillery atmosphere and a great café lunch; Bunnahabhain or the north coast cluster for lighter, unpeated styles and dramatic Sound of Islay views."),
    ],
  },
  {
    _id: 'faq-guide-distilleries-book-tours',
    question: 'Do I need to book distillery tours on Islay in advance?',
    category: 'distilleries',
    priority: 20,
    answer: [
      textBlock("Yes — for summer visits and any visit near Fèis Ìle (late May), booking ahead is essential. Most Islay distilleries cap tour sizes and fill up weeks in advance from June to August. Tours typically run 10am–4pm with limited afternoon slots. Bruichladdich, Ardbeg, and Kilchoman are consistently the most popular — book directly on their websites as soon as your accommodation is confirmed. Standard tours run 45–60 minutes (£10–15); premium warehouse and rare-dram experiences (£40–80+) are worth booking if you're serious about whisky. For Fèis Ìle, festival open-day tickets sell out months in advance — check individual distillery websites from December onwards for the following May."),
    ],
  },
  {
    _id: 'faq-guide-distilleries-how-many-per-day',
    question: 'How many Islay distilleries can I visit in a day?',
    category: 'distilleries',
    priority: 30,
    answer: [
      textBlock("Two per day is comfortable and usually more rewarding than three. Tastings accumulate and the driving distances between clusters add up. Plan distillery days around geographic groupings: the south coast cluster (Ardbeg, Lagavulin, Laphroaig, Port Ellen) near Port Ellen is a natural full-day focus; the north coast cluster (Caol Ila, Bunnahabhain, Ardnahoe) is another. Bruichladdich is its own half or full day, and pairs easily with Kilchoman or Bowmore. Our whisky groups typically visit 5–6 distilleries over 3–4 full days — that rhythm gives time to properly enjoy each stop rather than ticking boxes."),
    ],
  },
  {
    _id: 'faq-guide-distilleries-feis-ile',
    question: 'What is Fèis Ìle — the Islay Whisky Festival?',
    category: 'distilleries',
    priority: 40,
    answer: [
      textBlock("Fèis Ìle (pronounced \"Fesh Ee-la\") is Islay's annual whisky festival, held each May — typically the last week of the month over approximately ten days. Each of the island's distilleries hosts its own open day: exclusive festival bottlings, live music, tastings, and tours at capacity. It's one of the world's most celebrated whisky events. If you're planning to attend, book ferry vehicle spaces 12 weeks ahead as an absolute minimum, arrange accommodation before January, and secure distillery open-day tickets as soon as they're released — individual distillery days sell out within hours. The atmosphere is exceptional, but the logistics require planning that is not compatible with a last-minute approach."),
    ],
  },
  {
    _id: 'faq-guide-distilleries-drink-driving',
    question: 'How do I handle drink-driving when visiting distilleries on Islay?',
    category: 'distilleries',
    priority: 50,
    answer: [
      textBlock("Scotland's drink-drive limit is effectively zero — take this seriously on distillery days. The practical options: designate a driver who doesn't drink (most distilleries provide a \"driver's dram\" — a miniature to enjoy at your accommodation later), hire a local taxi or private driver for the day, or for the one distillery where you can avoid the problem entirely, walk to Bruichladdich — it's 5 minutes from our properties along the coastal cycle path. For group trips, a hired local minibus with a driver makes south or north coast cluster days significantly more relaxed. Ask us when you book — we know local drivers who specialise in distillery days."),
    ],
  },
];

async function importGuideFaqs() {
  console.log('\n======================================================');
  console.log('  Import Guide FAQs — 25 faqCanonicalBlock documents');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // 1. Create/replace the 25 FAQ documents
  console.log('Creating FAQ documents...\n');
  let created = 0;
  let failed = 0;

  for (const faq of faqs) {
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
      console.log(`  ✓ ${faq._id}`);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${faq._id} — ${msg}`);
      failed++;
    }
  }

  // 2. Delete the 5 canonical FAQ blocks (18–22) — content now lives in faqCanonicalBlock
  const faqCanonicalBlockIds = [
    'canonical-block-food-drink-islay-faqs',
    'canonical-block-families-islay-faqs',
    'canonical-block-beaches-islay-faqs',
    'canonical-block-wildlife-islay-faqs',
    'canonical-block-distilleries-islay-faqs',
  ];

  console.log('\nRemoving canonical FAQ blocks (content migrated to faqCanonicalBlock)...\n');
  let deleted = 0;

  for (const id of faqCanonicalBlockIds) {
    try {
      await client.delete(id);
      console.log(`  ✓ Deleted: ${id}`);
      deleted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Not found is fine — may already be gone
      console.log(`  — ${id}: ${msg}`);
    }
  }

  console.log('\n======================================================');
  console.log(`  FAQs: ${created} created, ${failed} failed`);
  console.log(`  Canonical blocks removed: ${deleted}`);
  console.log('======================================================\n');
}

importGuideFaqs().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
