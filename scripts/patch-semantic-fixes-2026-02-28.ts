/**
 * patch-semantic-fixes-2026-02-28.ts
 *
 * Three semantic retrieval fixes from SF Audit 3 + browser review.
 * Source: _work/cw/pbi/handoffs/CW-HANDOFF-SEMANTIC-FIXES-2-2026-02-28.md
 *
 * Fix 1 — islay-archaeology-overview: remove duplicate opening paragraph
 *   Block's fullContent[0] duplicates the guidePage's Page Opening field.
 *   Block should begin at "The Oldest Layer: Bunnahabhain Stromatolites".
 *
 * Fix 2 — Portbahn House + Shorefield: insert Bruichladdich accommodation signal
 *   New paragraph before the "Bruichladdich Distillery" paragraph in each
 *   property description. Adds explicit accommodation vocabulary co-located
 *   with Bruichladdich entity name for "stay in Bruichladdich" retrieval.
 *
 * Fix 3 — Create dog-friendly-properties canonical block + wire to pages
 *   New block covering dog policy, property-specific dog features, and Islay
 *   as a dog destination. Full → accommodation hub. Teaser → PB + SHF only.
 *   (Curlew Cottage does not accept dogs.)
 */

import { createClient } from 'next-sanity';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const DRY_RUN = process.argv.includes('--dry-run');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

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

function blockRef(refId: string, version: 'full' | 'teaser', showKeyFacts = false) {
  return {
    _type: 'blockReference',
    _key: key(),
    block: { _type: 'reference', _ref: refId },
    version,
    showKeyFacts,
  };
}

// ─── Fix 1: Remove duplicate opening paragraph from archaeology block ─────────

async function fix1_archaeologyDuplicate() {
  console.log('\n=== Fix 1: islay-archaeology-overview duplicate para ===');

  const block = await client.fetch(
    `*[_type == "canonicalBlock" && blockId.current == "islay-archaeology-overview" && !(_id in path("drafts.**"))][0]{
      _id, "first": fullContent[0]
    }`
  );

  if (!block) { console.log('  ✗ Block not found'); return; }

  const firstText = block.first?.children?.[0]?.text || '';
  if (!firstText.startsWith('Islay has been continuously inhabited')) {
    console.log(`  ✗ First para doesn't match expected duplicate — skipping. Text: "${firstText.slice(0, 80)}"`);
    return;
  }

  console.log(`  Removing: "${firstText.slice(0, 80)}..."`);
  if (DRY_RUN) { console.log('  [DRY RUN]'); return; }

  await client.patch(block._id).unset(['fullContent[0]']).commit();
  console.log('  ✓ Duplicate paragraph removed');
}

// ─── Fix 2: Portbahn House + Shorefield — Bruichladdich accommodation signal ──

const PB_ACCOMMODATION_SIGNAL =
  'Portbahn House is the largest self-catering property in Bruichladdich village — ' +
  'the only detached 8-guest holiday house in the village, with a private mature garden ' +
  'and uninterrupted sea views across Loch Indaal. For visitors looking for holiday ' +
  'accommodation in Bruichladdich, it offers immediate access to everything the village ' +
  'provides: Bruichladdich Distillery on foot, Portbahn Beach five minutes the other way, ' +
  'and Port Charlotte\'s restaurants and services five minutes by car.';

const SHF_ACCOMMODATION_SIGNAL =
  'Shorefield Eco House is a self-catering holiday property in Bruichladdich, Islay — ' +
  'sleeping six guests in three bedrooms, with private woodland, ponds, and bird reserves ' +
  'on the lochside. For visitors seeking holiday accommodation in Bruichladdich with genuine ' +
  'character and seclusion, Shorefield sits on the shore of Loch Indaal with Bruichladdich ' +
  'Distillery five minutes\' walk along the coastal path.';

async function fix2_bruichladdichSignal() {
  console.log('\n=== Fix 2: Bruichladdich accommodation signal ===');

  const props = await client.fetch(
    `*[_type == "property" && slug.current in ["portbahn-house", "shorefield-eco-house"] && !(_id in path("drafts.**"))]{
      _id, name, slug, description
    }`
  );

  for (const prop of props) {
    const isPB = prop.slug.current === 'portbahn-house';
    const signalText = isPB ? PB_ACCOMMODATION_SIGNAL : SHF_ACCOMMODATION_SIGNAL;
    const desc: any[] = prop.description || [];

    // Find "Bruichladdich Distillery" paragraph index
    const distilleryIdx = desc.findIndex((b: any) =>
      b?.children?.[0]?.text?.startsWith('Bruichladdich Distillery')
    );

    if (distilleryIdx === -1) {
      console.log(`  ✗ ${prop.name} — "Bruichladdich Distillery" paragraph not found`);
      continue;
    }

    // Guard: check signal not already present
    const alreadyPresent = desc.some((b: any) =>
      b?.children?.[0]?.text?.includes('holiday accommodation in Bruichladdich')
    );
    if (alreadyPresent) {
      console.log(`  ${prop.name} — signal already present, skipping`);
      continue;
    }

    console.log(`  ${prop.name}: inserting before description[${distilleryIdx}]`);
    console.log(`  Text: "${signalText.slice(0, 80)}..."`);

    if (DRY_RUN) { console.log('  [DRY RUN]'); continue; }

    await client
      .patch(prop._id)
      .insert('before', `description[${distilleryIdx}]`, [para(signalText)])
      .commit();
    console.log(`  ✓ ${prop.name} — accommodation signal inserted`);
  }
}

// ─── Fix 3: Create dog-friendly-properties block + wire ──────────────────────

const DOG_FULL_CONTENT = [
  para(
    'Portbahn House and Shorefield Eco House both welcome dogs at £15 per stay — no size restriction and no limit on the number of dogs.'
  ),
  para(
    'Portbahn House has a private, mature enclosed garden with sea views across Loch Indaal — safe for dogs off the lead. Portbahn Beach, five minutes\' walk from the house, has three sheltered bays ideal for swimming and running, with no road crossing. The coastal cycle path in both directions from the village gives easy walking without traffic. Dogs have come to Portbahn Beach with generations of guests and are a regular part of the scene.'
  ),
  para(
    'Shorefield Eco House has private woodland and ponds on the lochside — unusual space for a dog to explore, with birdlife and water interest at every turn. The Loch Indaal shore is accessible from the garden. The coastal path connects the village to Port Charlotte beach and beyond.'
  ),
  para(
    'Curlew Cottage does not accept dogs.'
  ),
  para(
    'Islay as a whole is an outstanding destination for dogs. The RSPB Loch Gruinart nature reserve welcomes dogs on leads. The beaches at Machir Bay, Saligo Bay, and Ardnave Point are large, open, and rarely busy. The island has almost no livestock on the main roads and walking routes are quiet. Most of Islay\'s heritage sites — Finlaggan, the American Monument, the Kildalton Cross — are open farmland or coastal; dogs on leads are usual practice.'
  ),
  para(
    'One note: during the winter geese season (October to April), dogs must be kept on leads at RSPB Loch Gruinart and on the Gruinart Flats. Over 30,000 barnacle geese roost there; it\'s worth the lead for what you see.'
  ),
];

const DOG_TEASER_CONTENT = [
  para(
    'Portbahn House and Shorefield both welcome dogs at £15 per stay — no size or number limit. Portbahn Beach is 5 minutes\' walk from both. Islay is one of the best dog destinations in Scotland: empty beaches, quiet roads, and open countryside. (Curlew Cottage does not accept dogs.)'
  ),
];

const DOG_KEY_FACTS = [
  { _key: key(), fact: 'Dog charge', value: '£15 per stay' },
  { _key: key(), fact: 'Properties accepting dogs', value: 'Portbahn House, Shorefield Eco House' },
  { _key: key(), fact: 'Size/number restriction', value: 'None' },
  { _key: key(), fact: 'Portbahn House garden', value: 'Private, mature, enclosed' },
  { _key: key(), fact: 'Nearest beach — PB + SHF', value: 'Portbahn Beach, 5 min walk' },
  { _key: key(), fact: 'RSPB Loch Gruinart dog rule', value: 'Leads required Oct–Apr (geese season)' },
];

async function fix3_dogFriendlyBlock() {
  console.log('\n=== Fix 3: dog-friendly-properties block ===');

  // Check if block already exists
  const existing = await client.fetch(
    `*[_type == "canonicalBlock" && blockId.current == "dog-friendly-properties" && !(_id in path("drafts.**"))][0]{_id}`
  );

  let blockId: string;

  if (existing) {
    console.log(`  Block already exists (${existing._id}) — skipping creation`);
    blockId = existing._id;
  } else {
    console.log('  Creating dog-friendly-properties canonical block...');
    if (DRY_RUN) {
      console.log('  [DRY RUN] Would create block');
      blockId = 'DRY_RUN_ID';
    } else {
      const created = await client.create({
        _type: 'canonicalBlock',
        blockId: { _type: 'slug', current: 'dog-friendly-properties' },
        title: 'Dog-Friendly Properties',
        entityType: 'trust',
        canonicalHome: '/accommodation',
        fullContent: DOG_FULL_CONTENT,
        teaserContent: DOG_TEASER_CONTENT,
        keyFacts: DOG_KEY_FACTS,
        usedOn: [
          '/accommodation (full)',
          '/accommodation/portbahn-house (teaser)',
          '/accommodation/shorefield-eco-house (teaser)',
        ],
      });
      blockId = created._id;
      console.log(`  ✓ Block created: ${blockId}`);
    }
  }

  if (DRY_RUN) { console.log('  [DRY RUN] Would wire block to pages'); return; }

  // Wire full version to accommodation hub
  const accPage = await client.fetch(
    `*[_type == "accommodationPage" && !(_id in path("drafts.**"))][0]{_id, "hasBlock": contentBlocks[block._ref == $ref][0]._key}`,
    { ref: blockId }
  );
  if (!accPage) {
    console.log('  ✗ Accommodation page not found');
  } else if (accPage.hasBlock) {
    console.log('  Accommodation hub — block already wired, skipping');
  } else {
    await client.patch(accPage._id).append('contentBlocks', [blockRef(blockId, 'full', true)]).commit();
    console.log('  ✓ Accommodation hub — full version wired');
  }

  // Wire teaser to PB and SHF only (not Curlew)
  const dogProps = await client.fetch(
    `*[_type == "property" && slug.current in ["portbahn-house", "shorefield-eco-house"] && !(_id in path("drafts.**"))]{
      _id, name, "hasBlock": contentBlocks[block._ref == $ref][0]._key
    }`,
    { ref: blockId }
  );
  for (const prop of dogProps) {
    if (prop.hasBlock) {
      console.log(`  ${prop.name} — block already wired, skipping`);
      continue;
    }
    await client.patch(prop._id).append('contentBlocks', [blockRef(blockId, 'teaser', true)]).commit();
    console.log(`  ✓ ${prop.name} — teaser wired`);
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== patch-semantic-fixes-2026-02-28.ts ===');
  if (DRY_RUN) console.log('DRY RUN — no changes committed\n');

  await fix1_archaeologyDuplicate();
  await fix2_bruichladdichSignal();
  await fix3_dogFriendlyBlock();

  console.log('\n=== Done ===');
  console.log('\nNext: hit /api/revalidate?path=all then run fresh SF crawl.');
}

run().catch(console.error);
