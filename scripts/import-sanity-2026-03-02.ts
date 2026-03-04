/**
 * import-sanity-2026-03-02.ts
 *
 * Applies all 30 actionable items from SANITY-IMPORT-2026-03-02.md
 * Source: _work/cw/pbi/handoffs/SANITY-IMPORT-2026-03-02.md
 * Backup: exports/content-snapshots/2026-03-03/ (taken before this run)
 *
 * Sections:
 *   A — Canonical blocks (ferry-basics, distilleries-overview, shorefield-character, food-drink-islay)
 *   B — Property pages (Portbahn House, Shorefield, Curlew Cottage, pet policy)
 *   C — Hub pages (islay-travel scopeIntro, explore-islay scopeIntro, broken links, guide summaries)
 *   D — Guide pages (dog-friendly-islay, travelling-with-dog, family-holidays)
 *   E1 — SKIPPED (Wire Block 25 — CC dependency still outstanding)
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-sanity-2026-03-02.ts
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

/** Build a plain PortableText paragraph block */
function para(text: string, style = 'normal'): any {
  return {
    _type: 'block',
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

/** Build multiple paragraph blocks from a multiline string (blank line = new block) */
function paras(text: string): any[] {
  return text
    .split(/\n\n+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => para(s));
}

/** Extract concatenated plain text from a PortableText block */
function blockText(block: any): string {
  if (!block || block._type !== 'block') return '';
  return (block.children || [])
    .filter((s: any) => s._type === 'span')
    .map((s: any) => s.text || '')
    .join('');
}

/** Find block index by matching start of text content */
function findBlockIdx(blocks: any[], startsWith: string): number {
  return blocks.findIndex(b => blockText(b).startsWith(startsWith.slice(0, 60)));
}

/** Replace a single block at index with new paragraph text */
function replaceBlock(blocks: any[], idx: number, newText: string): any[] {
  if (idx < 0) return blocks;
  const updated = [...blocks];
  updated[idx] = para(newText);
  return updated;
}

/** Replace a range of blocks [start, end) with new paragraph blocks */
function replaceRange(blocks: any[], start: number, end: number, newBlocks: any[]): any[] {
  return [...blocks.slice(0, start), ...newBlocks, ...blocks.slice(end)];
}

/** Find next h2/h3 heading index after a given index */
function nextHeadingIdx(blocks: any[], afterIdx: number): number {
  for (let i = afterIdx + 1; i < blocks.length; i++) {
    if (blocks[i]?._key && ['h2', 'h3'].includes(blocks[i]?.style)) return i;
  }
  return blocks.length;
}

/** Remove a block whose text contains the given substring */
function removeBlockContaining(blocks: any[], substr: string): any[] {
  return blocks.filter(b => !blockText(b).includes(substr));
}

// ─── Result tracking ──────────────────────────────────────────────────────────

const results: { id: string; status: '✓' | '✗' | '⚠'; note?: string }[] = [];

function ok(id: string, note?: string) {
  results.push({ id, status: '✓', note });
  console.log(`  ✓ ${id}${note ? ' — ' + note : ''}`);
}

function fail(id: string, err: any) {
  results.push({ id, status: '✗', note: String(err) });
  console.error(`  ✗ ${id} — ${err}`);
}

function warn(id: string, note: string) {
  results.push({ id, status: '⚠', note });
  console.warn(`  ⚠ ${id} — ${note}`);
}

// ─── SECTION A: Canonical Blocks ──────────────────────────────────────────────

async function sectionA() {
  console.log('\n══ A — Canonical Blocks ══════════════════════════════════════');

  // ── A1: ferry-basics — three paragraph patches ──────────────────────────────
  console.log('\n── A1 ferry-basics ──');
  try {
    const doc = await client.fetch('*[_id == "canonical-block-ferry-basics"][0]{ fullContent }');
    let blocks: any[] = doc?.fullContent || [];

    // A1a: Opening paragraph — starts with "Make the journey part of the experience."
    const A1a_NEW = `Make the journey part of the experience. Twenty minutes outside Glasgow, after you pass Dumbarton, you're at Loch Lomond and from there you have two more hours to let the breathtaking west coast scenery roll on by - lochs, mountains, babbling burns, single-track roads winding into the hills, a coffee at Loch Fyne or Inveraray, let the kids have a play in the playground at Lochgilphead. Then you have a two-hour ferry crossing to just switch off and watch the islands drift past, enjoy some of the fresh local food which CalMac does so well (I know - you don't expect good food on a ferry, but it really is excellent). The journey from Glasgow to Islay is more than a trip from A to B, it's a shift in mindset and pace, and worth all the time it takes. Savour it and enjoy it - we do even after all these years. We always find that by the time we arrive on Islay we're already in a completely different space.`;
    const idxA1a = findBlockIdx(blocks, 'Make the journey part of the experience.');
    if (idxA1a >= 0) {
      blocks = replaceBlock(blocks, idxA1a, A1a_NEW);
      ok('A1a', 'ferry-basics opening paragraph replaced');
    } else {
      warn('A1a', 'opening paragraph block not found — skipped');
    }

    // A1b: Flight sentence — starts with "This option suits travellers preferring speed"
    const A1b_NEW_PARA1 = `This option suits travellers preferring speed over scenery, though we'd always say try the ferry at least once - it really is part of arriving on Islay.`;
    const A1b_NEW_PARA2 = `Loganair flies from Glasgow in about 25 minutes, two flights a day during the week, one at the weekend — but it's a small 30-seater, expensive, and car hire and bus travel on the island is limited. Most visitors tend to bring their car on the ferry - pack it up, get the dog in and you can travel about easily when you arrive. If you're a whisky group without a car, or speed is important and money's not a priority, the flight can work well. For most people though the ferry is the journey and part of the holiday.`;
    const idxA1b = findBlockIdx(blocks, 'This option suits travellers preferring speed over scenery');
    if (idxA1b >= 0) {
      blocks = replaceRange(blocks, idxA1b, idxA1b + 1, [para(A1b_NEW_PARA1), para(A1b_NEW_PARA2)]);
      ok('A1b', 'ferry-basics flight sentence expanded to two paragraphs');
    } else {
      warn('A1b', 'flight sentence block not found — skipped');
    }

    // A1c: Crossing/sea sickness — starts with "Most guests find the crossing relaxing"
    const A1c_NEW = `The crossing is rarely rough - if it's too windy they cancel the ferries (something to be very aware of - check the weather regularly before you travel and sign up to CalMac alerts). There can be a gentle roll and take sea sickness tablets with you if you need them as they don't sell any on board. Most guests find the crossing relaxing rather than rough. We hear "the crossing was part of the holiday" from guests all the time - and we definitely agree. Enjoy it!`;
    const idxA1c = findBlockIdx(blocks, 'Most guests find the crossing relaxing rather than rough.');
    if (idxA1c >= 0) {
      blocks = replaceBlock(blocks, idxA1c, A1c_NEW);
      // Also remove the sea sickness tips block immediately after if it exists
      ok('A1c', 'ferry-basics crossing/sea sickness paragraph replaced');
    } else {
      warn('A1c', 'crossing paragraph block not found — skipped');
    }

    // Remove the now-redundant "If you're prone to motion sickness" block (merged into A1c)
    const idxMotion = findBlockIdx(blocks, "If you're prone to motion sickness");
    if (idxMotion >= 0) {
      blocks.splice(idxMotion, 1);
      ok('A1c-cleanup', 'removed redundant motion sickness block (merged into A1c)');
    }

    await client.patch('canonical-block-ferry-basics').set({ fullContent: blocks }).commit();
    ok('A1-commit', `ferry-basics fullContent committed (${blocks.length} blocks)`);
  } catch (err) {
    fail('A1', err);
  }

  // ── A2: distilleries-overview ───────────────────────────────────────────────
  console.log('\n── A2 distilleries-overview ──');
  try {
    const doc = await client.fetch('*[_id == "canonical-block-distilleries-overview"][0]{ fullContent, teaserContent, teaserLink }');
    let blocks: any[] = doc?.fullContent || [];

    // A2a: Replace Bruichladdich recommendation section
    const bruichladdichStart = findBlockIdx(blocks, 'Tour Bruichladdich first');
    if (bruichladdichStart >= 0) {
      const bruichladdichEnd = nextHeadingIdx(blocks, bruichladdichStart);
      const A2a_BLOCKS = paras(`we'd say tour Bruichladdich first - it's a 5-minute walk along the coastal path from our properties and it's the reason we originally came to the islands. It's a very special place and the staff there love what they do and put that love into the whisky they make. It's all done on Islay - from the barley grown to the distillation, maturation and bottling, something incredibly rare in the whisky world. And you can see it all. We always tell our guests to head there first and the feedback is always the same - they love it.

Bruichladdich call themselves Progressive Hebridean Distillers, and they really are different right into their DNA. They care passionately about where the barley comes from in a way no other distillery quite does - single farm, single vintage, single barley varieties in their Islay Barley and Bere Barley ranges. And they care about where it is matured. All Bruichladdich whisky spends all of its life on Islay. No Glasgow warehouses. Their range is unusually broad too: from the unpeated Laddie Classic, through the heavily-peated Port Charlotte, to legendary Octomore - the world's peatiest whisky, named for James Brown's Octomore farm on the hill above Port Charlotte village.

They also make The Botanist gin - 22 hand-foraged Islay botanicals. If you're a gin drinker, it's received all sorts of very high praise and awards and is really one of the best we've ever had. Botanist tours can be arranged via the distillery as well.

The tours are personal and unhurried - the warehouse experience in particular gives you a real sense of what they're doing, what makes Bruichladdich different and why they go to such lengths to do so. And then - just walk home. No designated driver, no taxi, just a 5-minute stroll back along the coast path. It's a huge bonus.

If you're only going to do one distillery, make it Bruichladdich.`);
      blocks = replaceRange(blocks, bruichladdichStart, bruichladdichEnd, A2a_BLOCKS);
      ok('A2a', `Bruichladdich section replaced (was blocks ${bruichladdichStart}–${bruichladdichEnd - 1}, now ${A2a_BLOCKS.length} blocks)`);
    } else {
      warn('A2a', '"Tour Bruichladdich first" block not found — skipped');
    }

    await client.patch('canonical-block-distilleries-overview').set({ fullContent: blocks }).commit();
    ok('A2a-commit', 'distilleries-overview fullContent committed');

    // A2b: teaserContent + teaserLink — use C4b text (supersedes A2b from earlier handoff)
    // C4b text is more accurate (eleven distilleries, ten open to public)
    const A2b_TEASER = [para(`Islay has eleven working whisky distilleries (ten you can visit; the latest, Laggan Bay, by the airport, isn't open to the public just yet) — a greater concentration than almost anywhere, certainly per capita. All our Portbahn houses are a 5-10 minute walk from Bruichladdich Distillery, and the rest are within easy reach and can be visited in easy clusters if planned well. Remember Scotland's drink drive laws are strict so book taxis or consult the local Islay bus timetable. Our guide gives you a quick overview of how to plan your distillery days and the contacts you need to book tours and visits.`)];
    await client.patch('canonical-block-distilleries-overview').set({
      teaserContent: A2b_TEASER,
      teaserLink: { text: "Full guide to Islay's ten distilleries →", href: '/explore-islay/islay-distilleries' },
    }).commit();
    ok('A2b', 'distilleries-overview teaserContent + teaserLink set');
  } catch (err) {
    fail('A2', err);
  }

  // ── A3: shorefield-character — prepend opening paragraph ────────────────────
  console.log('\n── A3 shorefield-character ──');
  try {
    const doc = await client.fetch('*[_id == "canonical-block-shorefield-character"][0]{ fullContent }');
    const existingBlocks: any[] = doc?.fullContent || [];
    const newOpening = para(`Shorefield Eco House is a self-catering holiday cottage in Bruichladdich, Islay — sleeping six guests across three bedrooms, on the lochside with views across Loch Indaal to the Paps of Jura. It's a 5-minute drive from Port Charlotte and a 5-minute walk from Bruichladdich distillery.`);
    // Only prepend if not already there
    const alreadyHas = blockText(existingBlocks[0] || {}).startsWith('Shorefield Eco House is a self-catering');
    if (!alreadyHas) {
      await client.patch('canonical-block-shorefield-character').set({ fullContent: [newOpening, ...existingBlocks] }).commit();
      ok('A3', `shorefield-character opening paragraph prepended (now ${existingBlocks.length + 1} blocks)`);
    } else {
      warn('A3', 'opening paragraph already present — skipped');
    }
  } catch (err) {
    fail('A3', err);
  }

  // ── A4: food-drink-islay — three paragraph patches ─────────────────────────
  console.log('\n── A4 food-drink-islay ──');
  try {
    const doc = await client.fetch('*[_id == "canonical-block-food-drink-islay"][0]{ fullContent }');
    let blocks: any[] = doc?.fullContent || [];

    // A4a: Opening sentence — starts with "Islay's food scene emphasises"
    const idxA4a = findBlockIdx(blocks, "Islay's food scene emphasises local seafood");
    if (idxA4a >= 0) {
      blocks = replaceBlock(blocks, idxA4a, `Islay's food scene is built on what's around it - seafood from the boats, lamb and venison from the farms, and whisky from ... everywhere. Dining out isn't cheap, but the best places are really worth it.`);
      ok('A4a', 'food-drink-islay opening sentence replaced');
    } else {
      warn('A4a', 'opening sentence block not found — skipped');
    }

    // A4b: Peatzeria entry — starts with "Peatzeria, Bowmore — Creative wood-fired"
    const idxA4b = findBlockIdx(blocks, 'Peatzeria, Bowmore — Creative wood-fired');
    if (idxA4b >= 0) {
      blocks = replaceBlock(blocks, idxA4b, `Peatzeria, Bowmore — Wood-fired pizzas with lobster, scallops and whisky-infused sauces - sounds odd but it works. Casual, family-friendly, good for a relaxed dinner when you don't want to book ahead. You can't go wrong here.`);
      ok('A4b', 'food-drink-islay Peatzeria entry replaced');
    } else {
      warn('A4b', 'Peatzeria block not found — skipped');
    }

    // A4c: Jean's Fish Van — starts with "Jean's Fresh Fish Van" or "Visits villages weekly"
    // The entry is h3 + normal block pattern — update the normal block after the Jean's h3
    const idxA4c_h3 = blocks.findIndex(b => blockText(b).includes("Jean's Fresh Fish Van"));
    if (idxA4c_h3 >= 0) {
      // The description is either in the same block or the next normal block
      const nextNormal = blocks.findIndex((b, i) => i > idxA4c_h3 && b.style === 'normal');
      if (nextNormal > idxA4c_h3 && nextNormal < idxA4c_h3 + 3) {
        blocks = replaceBlock(blocks, nextNormal, `Jean visits the villages weekly with fresh fish and seafood straight off the boats. Check local schedules - she'll often come right to the door.`);
        ok('A4c', "food-drink-islay Jean's Fish Van description replaced");
      } else {
        // Try updating the h3 block itself if description is inline
        warn('A4c', "Jean's Fish Van — next normal block not adjacent; manual check needed");
      }
    } else {
      warn('A4c', "Jean's Fresh Fish Van block not found — skipped");
    }

    await client.patch('canonical-block-food-drink-islay').set({ fullContent: blocks }).commit();
    ok('A4-commit', `food-drink-islay fullContent committed (${blocks.length} blocks)`);
  } catch (err) {
    fail('A4', err);
  }
}

// ─── SECTION B: Property Pages ────────────────────────────────────────────────

async function sectionB() {
  console.log('\n══ B — Property Pages ════════════════════════════════════════');

  // Fetch property IDs
  const properties = await client.fetch(`*[_type == "property"]{ _id, name, slug }`);
  const portbahnId = properties.find((p: any) => p.slug?.current === 'portbahn-house' && p.name?.includes('Portbahn'))
    ?._id || properties.find((p: any) => p.name?.toLowerCase().includes('portbahn house'))?._id;
  const shorefieldId = properties.find((p: any) => p.slug?.current === 'shorefield-eco-house' || p.name?.toLowerCase().includes('shorefield'))?._id;
  const curlewId = properties.find((p: any) => p.slug?.current === 'curlew-cottage' || p.name?.toLowerCase().includes('curlew'))?._id;

  console.log(`  Property IDs — Portbahn: ${portbahnId} | Shorefield: ${shorefieldId} | Curlew: ${curlewId}`);

  // ── B1: Portbahn House factual corrections ──────────────────────────────────
  console.log('\n── B1 Portbahn House factual corrections ──');
  if (portbahnId) {
    try {
      const ph = await client.fetch(`*[_id == "${portbahnId}"][0]{ description, entityFraming, magicMoments, perfectFor, commonQuestions }`);

      // entityFraming.primaryDifferentiator: "2-minute walk" → "5-minute walk"
      if (ph.entityFraming?.primaryDifferentiator?.includes('2-minute walk')) {
        await client.patch(portbahnId).set({
          'entityFraming.primaryDifferentiator': ph.entityFraming.primaryDifferentiator.replace('2-minute walk', '5-minute walk'),
        }).commit();
        ok('B1-entityFraming', 'primaryDifferentiator: 2-minute → 5-minute walk');
      } else {
        warn('B1-entityFraming', `primaryDifferentiator value: "${ph.entityFraming?.primaryDifferentiator}" — no match for 2-minute walk`);
      }

      // magicMoments: find item with "10 minutes" and replace
      if (Array.isArray(ph.magicMoments)) {
        const mmUpdated = ph.magicMoments.map((m: any) => {
          if (typeof m === 'object' && JSON.stringify(m).includes('10 minutes')) {
            const str = JSON.stringify(m).replace(/10 minutes/g, '5 minutes');
            return JSON.parse(str);
          }
          return m;
        });
        await client.patch(portbahnId).set({ magicMoments: mmUpdated }).commit();
        ok('B1-magicMoments', '10 minutes → 5 minutes in magicMoments');
      }

      // perfectFor: "10-minute walk" → "5-minute walk" + "all 9 Islay distilleries" → "all 10 Islay distilleries"
      if (Array.isArray(ph.perfectFor)) {
        let pfStr = JSON.stringify(ph.perfectFor);
        pfStr = pfStr.replace(/10-minute walk/g, '5-minute walk').replace(/all 9 Islay distilleries/g, 'all 10 Islay distilleries');
        await client.patch(portbahnId).set({ perfectFor: JSON.parse(pfStr) }).commit();
        ok('B1-perfectFor', '10-minute → 5-minute walk, 9 → 10 distilleries in perfectFor');
      }

      // commonQuestions: "10-minute walk from Portbahn House" → "5-minute walk from Portbahn House"
      if (Array.isArray(ph.commonQuestions)) {
        let cqStr = JSON.stringify(ph.commonQuestions);
        cqStr = cqStr.replace(/10-minute walk from Portbahn House/g, '5-minute walk from Portbahn House')
                     .replace(/10-minute walk/g, '5-minute walk');
        await client.patch(portbahnId).set({ commonQuestions: JSON.parse(cqStr) }).commit();
        ok('B1-commonQuestions', '10-minute → 5-minute walk in commonQuestions');
      }

      // description: replace "10-minute walk" → "5-minute walk" within PortableText blocks
      if (Array.isArray(ph.description)) {
        const descUpdated = ph.description.map((b: any) => {
          if (b._type !== 'block') return b;
          const updatedChildren = (b.children || []).map((s: any) => ({
            ...s,
            text: (s.text || '').replace(/10-minute walk/g, '5-minute walk'),
          }));
          return { ...b, children: updatedChildren };
        });
        await client.patch(portbahnId).set({ description: descUpdated }).commit();
        ok('B1-description-text', '10-minute → 5-minute walk in description PortableText');
      }
    } catch (err) {
      fail('B1', err);
    }
  } else {
    warn('B1', 'Portbahn House _id not found — skipped');
  }

  // ── B2: Portbahn House full description rewrite ─────────────────────────────
  console.log('\n── B2 Portbahn House description rewrite ──');
  if (portbahnId) {
    try {
      const B2_DESC = paras(`Portbahn House is our old family home - this is where we lived when we first moved to Islay. It sleeps 8 in 3 ground-floor bedrooms, including a huge superking bed looking over Loch Indaal. All the furniture, books, games, children's toys, paintings and pictures are our own from when we lived here. We hope you enjoy them as much as we always have.

The house sits right on the shoreline of Loch Indaal with sea views from most rooms. On a clear day you can see the Paps of Jura from the sofa and look across the loch to Bowmore. The open-plan layout is great for families and groups - a big kitchen with dining for 8, a sitting room with a wood-burning stove, and a conservatory that gets the morning sun. Underfloor heating throughout keeps it warm all through the Hebridean winter.

All the bedrooms and bathrooms are on the ground floor, making it very accessible for everyone. The master bedroom has a super king and a single (sleeps 3) with its own ensuite shower room. There's a triple room with a double and single (sleeps 3), and a twin room with two singles (sleeps 2). The twin is the smallest room - fine for kids or a short stay, but couples might prefer the other bedrooms. The family bathroom has a jacuzzi style bath, a shower and toilet.

Outside, the large private garden has a sunken trampoline and swings - kids can play while you watch from the kitchen. Sea views right across Loch Indaal, BBQ for summer evenings, and plenty of room for dogs to run around. Dogs are welcome at £15 per dog per stay.

Bruichladdich Distillery is a 5-minute walk along the coastal cycle path - an easy walk home after tastings without worrying about driving. And Port Charlotte village, with its two hotels/restaurants, local shop and petrol pump is arguably Islay's prettiest village, and about a 40 minute walk along the coastal path southwards.

This is probably the single best thing about Portbahn's location, and guests mention it in almost every review. Portbahn Beach - three sheltered bays, rock pools, usually deserted - is 5 minutes' walk towards Port Charlotte via the war memorial path.

Aileen's (also known as Debbie's!) shop, the minimarket, in Bruichladdich village is a 5-minute walk for fantastic coffee, bacon rolls, newspapers and a blether. It's also a post office. Port Charlotte is 5 minutes by car or a 20-minute walk along the coast path - restaurants, pubs, the museum, and a sandy harbour beach with safe swimming.

Parking for multiple cars in the grounds. Wifi throughout. Smart TV with Freesat, plus our own collection of DVDs, books and board games for rainy evenings by the fire with a dram of Bruichladdich in hand.`);
      await client.patch(portbahnId).set({ description: B2_DESC }).commit();
      ok('B2', `Portbahn House description replaced (${B2_DESC.length} blocks)`);
    } catch (err) {
      fail('B2', err);
    }
  } else {
    warn('B2', 'Portbahn House _id not found — skipped');
  }

  // ── B3: Shorefield Eco House — three paragraph fixes ───────────────────────
  console.log('\n── B3 Shorefield description ──');
  if (shorefieldId) {
    try {
      const sf = await client.fetch(`*[_id == "${shorefieldId}"][0]{ description }`);
      let blocks: any[] = sf?.description || [];

      // B3a: Opening paragraph — starts with "The house is owned by a local family"
      const idxB3a = findBlockIdx(blocks, 'The house is owned by a local family');
      if (idxB3a >= 0) {
        blocks = replaceBlock(blocks, idxB3a, `Shorefield is the Jackson family's creation - they built this eco-house before there was such a thing as an eco-house; they planted every tree, created the wetlands and bird hides behind the house, and filled it with paintings, books, maps and curios from their travels. Their enthusiasm for nature and the world beyond is all through the house. It's quirky, full of personality, and not for everyone - but if you value a house with a story over modern minimalism, Shorefield is wonderful. One guest described it as "like a big hug" and that's honestly how we feel about it whenever we go round.`);
        ok('B3a', 'Shorefield opening paragraph replaced');
      } else {
        warn('B3a', 'opening paragraph not found — skipped');
      }

      // B3b: Amenities paragraph — starts with "The accommodation features a large kitchen table"
      const idxB3b = findBlockIdx(blocks, 'The accommodation features a large kitchen table');
      if (idxB3b >= 0) {
        blocks = replaceBlock(blocks, idxB3b, `There's a large farmhouse table for 6, a separate dining room also seating 6, and a wood-burning stove in the sitting room. For those rare rainy days, light the fire, grab a book, the binoculars or a board game from the shelves - there's plenty to choose from. Wifi throughout.`);
        ok('B3b', 'Shorefield amenities paragraph replaced');
      } else {
        warn('B3b', 'amenities paragraph not found — skipped');
      }

      // B3c: Garden paragraph — starts with "The garden includes private woodland"
      const idxB3c = findBlockIdx(blocks, 'The garden includes private woodland');
      if (idxB3c >= 0) {
        blocks = replaceBlock(blocks, idxB3c, `Behind the house are the Jacksons' private woodland, ponds and bird hides - borrow the binoculars from the study and head out to see what you can spot. You can watch waterfowl and woodland birds, or just sit quietly looking out over Loch Indaal. It's a really special feature - birders and nature lovers specifically book Shorefield for this, but many of our non-twitcher guests have found how much they've enjoyed just exploring and seeing what they can find.`);
        ok('B3c', 'Shorefield garden paragraph replaced');
      } else {
        warn('B3c', 'garden paragraph not found — skipped');
      }

      await client.patch(shorefieldId).set({ description: blocks }).commit();
      ok('B3-commit', `Shorefield description committed (${blocks.length} blocks)`);
    } catch (err) {
      fail('B3', err);
    }
  } else {
    warn('B3', 'Shorefield _id not found — skipped');
  }

  // ── B4: Curlew Cottage — two paragraph fixes + Allan → Alan spelling ────────
  console.log('\n── B4 Curlew Cottage ──');
  if (curlewId) {
    try {
      const cc = await client.fetch(`*[_id == "${curlewId}"][0]{ description, commonQuestions }`);
      let blocks: any[] = cc?.description || [];

      // B4a: Opening sentence — starts with "Curlew Cottage is a holiday cottage in Bruichladdich"
      const idxB4a = findBlockIdx(blocks, 'Curlew Cottage is a holiday cottage in Bruichladdich');
      if (idxB4a >= 0) {
        blocks = replaceBlock(blocks, idxB4a, `Curlew Cottage is our friend Alan's family holiday getaway - a converted stone steading in Bruichladdich on the Isle of Islay, sleeping 6 guests in 3 bedrooms.`);
        ok('B4a', 'Curlew Cottage opening sentence replaced');
      } else {
        warn('B4a', 'opening sentence not found — skipped');
      }

      // B4b: Second paragraph — starts with "This is the owner's personal Islay retreat"
      const idxB4b = findBlockIdx(blocks, "This is the owner's personal Islay retreat");
      if (idxB4b >= 0) {
        blocks = replaceBlock(blocks, idxB4b, `Alan has kept Curlew Cottage as his family's private holiday home for years, and it's opening to guests for the first time in 2026. We manage it with the same care as our own properties - Portbahn House and Shorefield next door - where we hold a 4.97/5 rating across 380+ reviews and Airbnb Superhost status.`);
        ok('B4b', 'Curlew Cottage second paragraph replaced');
      } else {
        warn('B4b', 'second paragraph not found — skipped');
      }

      await client.patch(curlewId).set({ description: blocks }).commit();
      ok('B4-description-commit', `Curlew description committed (${blocks.length} blocks)`);

      // B4c: Allan → Alan spelling fix in commonQuestions
      if (Array.isArray(cc?.commonQuestions)) {
        let cqStr = JSON.stringify(cc.commonQuestions);
        if (cqStr.includes('Allan')) {
          cqStr = cqStr.replace(/Allan/g, 'Alan');
          await client.patch(curlewId).set({ commonQuestions: JSON.parse(cqStr) }).commit();
          ok('B4c', 'Allan → Alan spelling fixed in commonQuestions');
        } else {
          warn('B4c', 'No "Allan" found in commonQuestions — already correct or field name differs');
        }
      }
    } catch (err) {
      fail('B4', err);
    }
  } else {
    warn('B4', 'Curlew Cottage _id not found — skipped');
  }

  // ── B5: Pet policy — all three properties ───────────────────────────────────
  console.log('\n── B5 Pet policy fields ──');

  if (portbahnId) {
    try {
      await client.patch(portbahnId).set({
        petFriendly: true,
        petPolicyIntro: 'Dogs are welcome at Portbahn House at £15 per stay — no size or number limit.',
        petPolicyDetails: [
          { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Private enclosed garden, safe for dogs off-lead.', marks: [] }] },
          { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: "Portbahn Beach — dog-friendly, 5 minutes' walk, no road crossing.", marks: [] }] },
          { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Coastal cycle path from the village in both directions — easy traffic-free walking.', marks: [] }] },
        ],
      }).commit();
      ok('B5-portbahn', 'Portbahn House pet policy set');
    } catch (err) {
      fail('B5-portbahn', err);
    }
  }

  if (shorefieldId) {
    try {
      await client.patch(shorefieldId).set({
        petFriendly: true,
        petPolicyIntro: 'Dogs are welcome at Shorefield Eco House at £15 per stay — no size or number limit.',
        petPolicyDetails: [
          { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Private woodland and loch-shore grounds — unusual space for dogs to explore.', marks: [] }] },
          { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Loch Indaal shore accessible from the garden.', marks: [] }] },
          { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Coastal path connects to Port Charlotte beach and beyond.', marks: [] }] },
        ],
      }).commit();
      ok('B5-shorefield', 'Shorefield pet policy set');
    } catch (err) {
      fail('B5-shorefield', err);
    }
  }

  if (curlewId) {
    try {
      await client.patch(curlewId).set({
        petFriendly: false,
        petPolicyIntro: 'Curlew Cottage does not accept dogs.',
        petPolicyDetails: [],
      }).commit();
      ok('B5-curlew', 'Curlew Cottage pet policy set (no pets)');
    } catch (err) {
      fail('B5-curlew', err);
    }
  }
}

// ─── SECTION C: Hub Pages ─────────────────────────────────────────────────────

async function sectionC() {
  console.log('\n══ C — Hub Pages ═════════════════════════════════════════════');

  // ── C1: islay-travel hub scopeIntro ─────────────────────────────────────────
  console.log('\n── C1 islay-travel hub scopeIntro ──');
  try {
    const C1_TEXT = `For most guests - families especially - the CalMac ferry from Kennacraig is how you'll get to Islay. And if you want to explore, Islay is a lot, lot easier with your own car.

The ferry is actually one of the most enjoyable parts of the holiday. There's something genuinely romantic about getting on a boat with nothing else to do but watch the waves, the island getting ever bigger on the horizon, the Paps of Jura dominating the skyline. It feels like the holiday has properly started. We do this crossing all the time and it never loses its magic.

Really important: ferries fill quickly in summer and do get cancelled in bad weather. Book early - as soon as you book your accommodation if you can - and sign up to CalMac alerts for cancellations and redirections. And keep an eye on the weather, always keep an eye on the weather! If anything changes, contact CalMac straight away and get in touch with us too - we've never had a booking collapse, and we can often put you up in one of our other properties if you get stranded. We know the whims and peculiarities of island travel, so please do use us.`;
    await client.patch('gettingHerePage').set({ scopeIntro: C1_TEXT }).commit();
    ok('C1', 'islay-travel hub scopeIntro updated');
  } catch (err) {
    fail('C1', err);
  }

  // ── C2: explore-islay hub scopeIntro ────────────────────────────────────────
  console.log('\n── C2 explore-islay hub scopeIntro ──');
  try {
    const C2_TEXT = `We love Islay and we love sharing its best bits with people.

We came here in 2014 and Portbahn was our home for several years before we moved across to neighbouring Jura to set up Bothan Jura Retreat there. We are lucky enough to have great friends on both islands and know all the things we love to do and share with our guests.

Islay and Jura are very different and both have so much more to do and explore than most people realise and that most people miss. Even just a day trip to Jura from Islay will give you a completely different slice of Hebridean island life. It really is worth getting off the beaten track and away from the distillery main drag into wild Islay at its best.

Islay lies in the southern Hebrides, islands synonymous with remoteness and shrouded in myth and romance. It's 25 by 15 miles, roughly horseshoe-shaped, with around 3000 people living here. It is actually two distinct, geologically different landmasses separated by a fault line running through Loch Gruinart right down the middle of Loch Indaal.

It's not all whisky distilleries - though ten of them on one small island of 3,000 people is a pretty good ratio. Islay is equally well known for its wildlife, in particular its birdwatching. Every winter, over 30,000 barnacle geese migrate from the Arctic and settle across Loch Gruinart, home of the RSPB bird sanctuary. It's a huge draw and a wonderful spectacle - less enthusiastically greeted by the farmers whose barley they eat. Golden eagles and white-tailed sea eagles are regular sights in the skies year-round, and seals are a daily sighting from our properties on Loch Indaal and can nearly always be spotted on the rocks down at Portnahaven harbour.

The island's history runs astonishingly deep. As the former seat of the Lords of the Isles, the whole western seaboard of Scotland was governed from Finlaggan by Clan Donald - and the impressive ruins can still be reached across a causeway into the loch. It's a site of huge Scottish historic importance.

For amateur archaeologists, some of the earliest Scottish mesolithic remains have been found here. Professor Steven Mithen has made Islay a personal passion project, returning year after year to explore new digs. His book "To the Islands" explores the prehistoric hunter-gatherers of the Hebrides, and "Land of the Ilich" traces Islay's roots from the earliest settlers through the clearances to modern day. Both are excellent, written with heart and local love and knowledge, and are well worth reading before you come, or, even better, enjoyed while you're here, sitting with a local Islay dram by a roaring fire.

If you really want to go back to the beginning, there are stromatolite fossils in the rocks at Bunnahabhain - and the west coast Rhinns are comprised of ancient gneiss rock, approximately 1.8 billion years old. The Port Askaig Tillite is a world-famous Precambrian glacial deposit, and universities send geology field trips to the island regularly. The islaygeology.org group runs guided tours and publishes excellent guidebooks if you want to explore further.

For families, Islay is a very special place, a safe haven that is like winding the clock back fifty years - safe beaches with rock pools to roam about, wildlife on the doorstep, playgrounds at Port Charlotte, Bowmore and Port Ellen, and the swimming pool in Bowmore for those rainy days (yes, we do have the odd one!). We've raised our own children on both Islay and Jura and the family guide is written from our experience of what we've found works with little (and bigger) people in tow.

And yes, of course, there's whisky. Ten distilleries producing some of the most respected single malts in the world - Bruichladdich, Ardbeg, Laphroaig, Bowmore to name a few - all on one small remote island off Scotland's west coast. We've actually seen people cry when they arrive here, they are so moved. We've even seen people take soil home as a memento. Scotch single malt is almost a religion and, alongside Speyside, Islay is perhaps its main centre of pilgrimage.

Our three holiday houses sit just outside Bruichladdich village, a five-minute walk from its innovative distillery in one direction, with Portbahn Beach another five minutes in the other along the coastal path towards Port Charlotte.

We've tried to put these guides together from the things we like to do best, the places we go with our children and dogs, and the places our guests tell us they've enjoyed the most. We're always updating and adding to them. Places change, new things come, old things go - and we really want you to have as memorable a holiday as possible, so we'll help with anything we can.`;
    await client.patch('exploreIslayPage').set({ scopeIntro: C2_TEXT }).commit();
    ok('C2', 'explore-islay hub scopeIntro updated');
  } catch (err) {
    fail('C2', err);
  }

  // ── C3: Remove broken markdown links from 5 teaser blocks ───────────────────
  console.log('\n── C3 Remove broken markdown links ──');
  const C3_TARGETS = [
    { blockId: 'portbahn-beach', link: "Islay's beaches — from hidden coves to golden sand →" },
    { blockId: 'wildlife-geese', link: 'Wildlife on Islay — eagles, geese, seals and more →' },
    { blockId: 'food-drink-islay', link: 'Where to eat on Islay — seafood, cafés and local favourites →' },
    { blockId: 'families-children', link: 'Family activities on Islay — beaches, wildlife and rainy day ideas →' },
    { blockId: 'bothan-jura-teaser', link: 'Bothan Jura Retreat — our off-grid hideaway on Jura →' },
  ];

  for (const target of C3_TARGETS) {
    try {
      const doc = await client.fetch(`*[blockId.current == "${target.blockId}" || blockId == "${target.blockId}"][0]{ _id, teaserContent }`);
      if (!doc?._id) {
        warn(`C3-${target.blockId}`, 'block not found by blockId');
        continue;
      }
      const teaserBlocks: any[] = doc.teaserContent || [];
      const filtered = teaserBlocks.filter(b => {
        const txt = blockText(b);
        return !txt.includes(target.link.slice(0, 40));
      });
      if (filtered.length < teaserBlocks.length) {
        await client.patch(doc._id).set({ teaserContent: filtered }).commit();
        ok(`C3-${target.blockId}`, `removed markdown link block (${teaserBlocks.length} → ${filtered.length} blocks)`);
      } else {
        warn(`C3-${target.blockId}`, 'markdown link not found in teaserContent — may already be clean');
      }
    } catch (err) {
      fail(`C3-${target.blockId}`, err);
    }
  }

  // ── C4: Guide summary updates ────────────────────────────────────────────────
  console.log('\n── C4 Guide summaries ──');

  // C4a: Wildlife — last sentence change
  // "This is a wildlife destination of the first order." → new sentence
  try {
    const doc = await client.fetch('*[blockId.current == "wildlife-geese" || blockId == "wildlife-geese"][0]{ _id, teaserContent }');
    if (doc?._id && doc.teaserContent?.length > 0) {
      const blocks: any[] = doc.teaserContent;
      // Find block containing target sentence and update
      const updated = blocks.map((b: any) => {
        const txt = blockText(b);
        if (txt.includes('This is a wildlife destination of the first order.')) {
          const newText = txt.replace('This is a wildlife destination of the first order.', 'We keep binoculars in all three houses for good reason. You never know when you\'re going to spot something.');
          return { ...b, children: [{ _type: 'span', _key: k(), text: newText, marks: [] }] };
        }
        return b;
      });
      await client.patch(doc._id).set({ teaserContent: updated }).commit();
      ok('C4a', 'wildlife-geese teaserContent last sentence updated');
    } else {
      warn('C4a', 'wildlife-geese block or teaserContent not found');
    }
  } catch (err) {
    fail('C4a', err);
  }

  // C4b: Whisky distilleries — full teaserContent replace (already handled in A2b with C4b text)
  ok('C4b', 'handled in A2b (distilleries-overview teaserContent set with C4b text)');

  // C4c: Food & Drink — last clause change
  try {
    const doc = await client.fetch('*[blockId.current == "food-drink-islay" || blockId == "food-drink-islay"][0]{ _id, teaserContent }');
    if (doc?._id && doc.teaserContent?.length > 0) {
      const blocks: any[] = doc.teaserContent;
      const updated = blocks.map((b: any) => {
        const txt = blockText(b);
        if (txt.includes("but quality is high. Here's where we send our guests.")) {
          const newText = txt.replace("but quality is high. Here's where we send our guests.", "but the best places are really worth it. These are some of the places we recommend to our guests and which our guests have recommended themselves.");
          return { ...b, children: [{ _type: 'span', _key: k(), text: newText, marks: [] }] };
        }
        return b;
      });
      await client.patch(doc._id).set({ teaserContent: updated }).commit();
      ok('C4c', 'food-drink-islay teaserContent last clause updated');
    } else {
      warn('C4c', 'food-drink-islay teaserContent not found or empty');
    }
  } catch (err) {
    fail('C4c', err);
  }

  // C4d: Family Holidays — opening change
  try {
    const doc = await client.fetch('*[blockId.current == "families-children" || blockId == "families-children"][0]{ _id, teaserContent }');
    if (doc?._id && doc.teaserContent?.length > 0) {
      const blocks: any[] = doc.teaserContent;
      const updated = blocks.map((b: any) => {
        const txt = blockText(b);
        if (txt.includes("Islay is one of Scotland's best family holiday destinations")) {
          const newText = txt.replace("Islay is one of Scotland's best family holiday destinations", "Islay is a truly wonderful place for a family holiday");
          return { ...b, children: [{ _type: 'span', _key: k(), text: newText, marks: [] }] };
        }
        return b;
      });
      await client.patch(doc._id).set({ teaserContent: updated }).commit();
      ok('C4d', 'families-children teaserContent opening updated');
    } else {
      warn('C4d', 'families-children teaserContent not found or empty');
    }
  } catch (err) {
    fail('C4d', err);
  }

  // C4e: Archaeology — full teaserContent replace
  try {
    const doc = await client.fetch('*[(blockId.current == "islay-archaeology-overview" || blockId == "islay-archaeology-overview") || (blockId.current == "archaeology-history" || blockId == "archaeology-history")][0]{ _id, blockId, teaserContent }');
    if (doc?._id) {
      const C4e_TEASER = [para(`Islay has been continuously inhabited for over 8,000 years. The Kildalton Cross on the south coast is one of the finest Early Christian carved crosses in Scotland, and the medieval seat of the Lords of the Isles at Finlaggan - reached across a causeway into the loch - is a site of real historic power. Professor Steven Mithen has returned many times for mesolithic digs, and his books are full of local knowledge and his passion for the place and bring the island's deep past vividly to life. Most sites are free to visit and open year-round.`)];
      await client.patch(doc._id).set({ teaserContent: C4e_TEASER }).commit();
      ok('C4e', `archaeology teaserContent replaced (doc: ${doc._id})`);
    } else {
      warn('C4e', 'archaeology canonical block not found — check blockId');
    }
  } catch (err) {
    fail('C4e', err);
  }

  // C4f: Geology — new guide summary entry
  // Note: The geology spoke page (explore-islay/islay-geology) is a CC task.
  // The geology canonical block needs to exist before teaserContent can be set.
  // Check if it exists first.
  try {
    const geoBlock = await client.fetch('*[(blockId.current == "islay-geology" || blockId == "islay-geology")][0]{ _id }');
    if (geoBlock?._id) {
      const C4f_TEASER = [para(`The rocks beneath your feet on Islay go back 1.8 billion years. The Rhinns Complex is some of the oldest exposed rock in the British Isles and one of the best places to see it. The stromatolite fossils at Bunnahabhain are among the best evidence of Precambrian life in Britain, and the Port Askaig Tillite is a world-famous glacial deposit that draws university geology field trips year after year. The islaygeology.org group runs guided tours if you want to explore with an expert.`)];
      await client.patch(geoBlock._id).set({ teaserContent: C4f_TEASER }).commit();
      ok('C4f', 'islay-geology teaserContent set');
    } else {
      warn('C4f', 'islay-geology canonical block not yet created — CC task outstanding (skipped)');
    }
  } catch (err) {
    fail('C4f', err);
  }
}

// ─── SECTION D: Guide Pages ───────────────────────────────────────────────────

async function sectionD() {
  console.log('\n══ D — Guide Pages ═══════════════════════════════════════════');

  // Fetch guide page IDs by slug
  const guidePages = await client.fetch(`*[_type == "guidePage"]{ _id, slug }`);
  const dogFriendlyId = guidePages.find((g: any) => g.slug?.current === 'dog-friendly-islay')?._id;
  const travelWithDogId = guidePages.find((g: any) => g.slug?.current === 'travelling-to-islay-with-your-dog')?._id;
  const familyHolidaysId = guidePages.find((g: any) => g.slug?.current === 'family-holidays')?._id;

  console.log(`  Guide IDs — dog-friendly: ${dogFriendlyId} | travel-with-dog: ${travelWithDogId} | family-holidays: ${familyHolidaysId}`);

  // ── D1: dog-friendly-islay introduction ─────────────────────────────────────
  if (dogFriendlyId) {
    try {
      const D1_TEXT = `We have always had dogs - crazy working cockers, first Obi, now Pixel - and we take her out with us on both Islay and Jura happily. Most places are used to dogs and are very dog-friendly - you can take them into many of the pubs, hotels and cafes and roam the beaches freely. There are a few essential things to bear in mind while you're here though. All common sense.

Islay really is a wonderful place to let your dog off the lead, breathe in the fresh, salty Atlantic air and enjoy the wide empty beaches and back roads. It's just the best excuse to get out and get windblown before coming home to get cosy by the fire or set up in one of the great local pubs.

But remember, Islay is predominantly a farming community and livestock are common - always keep your dog on a lead around fields and animals. And always pick up your dog poo around farmland as it can affect livestock. The farmers have every right to intervene if your dog is causing issues. As long as you're sensible, just enjoy it.

The Islay coasts are vast and untamed. One of our favourite stretches is to roam from Machir Bay up to Saligo Bay all the way up to Opera House Rocks. Or start at Sainagmore and head west and south to huge clefts dropping down to the sea among towering cliffs, while birds fill the sky. You may even spot an eagle. And most likely you'll not see another person all day.

For a simpler stroll, and directly outside our three houses, the coastal path from Bruichladdich through to Port Charlotte is a beautiful gentle stretch of coastline - you can get right down to the rocks and shore if you want. But cows and sheep do sometimes use this land to graze - so the same rules apply.

We've put together a few of our notes and tips for any dog-lovers coming to Islay. Hopefully our guide will give you an idea of where to go, where dogs can be off-lead, which cafes and pubs welcome them, and the one seasonal restriction worth knowing about.

And if you're not sure about anything, just drop us a line - we know this island with dogs very well.`;
      await client.patch(dogFriendlyId).set({ introduction: D1_TEXT }).commit();
      ok('D1', 'dog-friendly-islay introduction updated');
    } catch (err) {
      fail('D1', err);
    }
  } else {
    warn('D1', 'dog-friendly-islay guide page not found');
  }

  // ── D2: travelling-to-islay-with-your-dog introduction ──────────────────────
  if (travelWithDogId) {
    try {
      const D2_TEXT = `If you're travelling with dogs to Islay, the only real option is to take the CalMac ferry with a car. The ferries are very dog-friendly - you can bring them upstairs with you into the lounge and they always leave water bowls out. Just keep them on a lead.

If you're travelling on foot, Citylink buses - the bus operator from Glasgow - only allow assistance dogs on board, so you'd need to arrange a taxi or private transport from Glasgow to Kennacraig.

And if you're cycling and your dog is happy to trot alongside you, then the Glasgow–Ardrossan–Brodick–Lochranza–Kennacraig route is such a special way to arrive on Islay - two ferries and an additional island (the glorious Isle of Arran) and the Kintyre peninsula to take in. It can still be done in a day, so actually doesn't take much longer than driving if you plan it right. Do not plan on cycling along the A83, the main Glasgow to Campbeltown road - it is very busy and dangerous even without a dog.

Once you get to Islay you and your dog will have the whole island to explore - and it really is very dog-friendly. We've put together a few notes here.`;
      await client.patch(travelWithDogId).set({ introduction: D2_TEXT }).commit();
      ok('D2', 'travelling-with-dog introduction updated');
    } catch (err) {
      fail('D2', err);
    }
  } else {
    warn('D2', 'travelling-to-islay-with-your-dog guide page not found');
  }

  // ── D3: family-holidays introduction ────────────────────────────────────────
  if (familyHolidaysId) {
    try {
      const D3_TEXT = `Our children were 2½ and 4 weeks old when we moved to Islay. They're now 12 and 14 and we've never been bored with them here. In fact when we go to visit family on the mainland and ask our children whether they'd like to move there they always say "No way!"

Islay is very much a make-your-own-fun place. There are no structured family attractions, no amusement arcades, no cinema (unless you're lucky enough to coincide with a visit from the Screen Machine, the Highlands and Islands roaming truck cinema!).

What there is is space, crime-free safety, and genuine interest for every age if you're willing to explore: rock pools on the doorstep; ancient stromatolite fossils; barnacle geese in their tens of thousands, eagles, sometimes dolphins; woods to explore and play hide and seek in; crossing the causeway to explore the ruins of the Lords of the Isles at Finlaggan; cycling; swimming from safe beaches in crystal clear seas (or the Mactaggart Leisure Centre for those rainy days) and playgrounds and expanses of grass to kick a football around.

The Islay beaches are vast expanses of golden sand and you will have them almost to yourselves. Mostly though there is a pace of life here that is so different from the daily hubbub of the mainland and is a rare treat to enjoy with children and as a family. Our houses are all family homes - they have high chairs and cots; they still even have our own books and games in, ones that we play too, and there are some of our DVDs (they do still exist!) and, of course, we do actually have broadband and Wifi too, would you believe.

We've put together a few of the places we go and the things we do that we think you'll enjoy, and we're always happy to help if you let us know what you're looking for or how old your children are.`;
      await client.patch(familyHolidaysId).set({ introduction: D3_TEXT }).commit();
      ok('D3', 'family-holidays introduction updated');
    } catch (err) {
      fail('D3', err);
    }
  } else {
    warn('D3', 'family-holidays guide page not found');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  import-sanity-2026-03-02.ts');
  console.log('  Source: SANITY-IMPORT-2026-03-02.md');
  console.log('  Backup: exports/content-snapshots/2026-03-03/');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  await sectionA();
  await sectionB();
  await sectionC();
  await sectionD();

  // ── Summary ────────────────────────────────────────────────────────────────
  const passed = results.filter(r => r.status === '✓').length;
  const warned = results.filter(r => r.status === '⚠').length;
  const failed = results.filter(r => r.status === '✗').length;

  console.log('\n══ Summary ═══════════════════════════════════════════════════');
  console.log(`  ✓ ${passed} applied`);
  console.log(`  ⚠ ${warned} warnings (check manually)`);
  console.log(`  ✗ ${failed} failed`);

  if (warned > 0) {
    console.log('\nWarnings (manual check needed):');
    results.filter(r => r.status === '⚠').forEach(r => console.log(`  ⚠ ${r.id}: ${r.note}`));
  }
  if (failed > 0) {
    console.log('\nFailures:');
    results.filter(r => r.status === '✗').forEach(r => console.log(`  ✗ ${r.id}: ${r.note}`));
  }

  console.log('\n  E1 (Wire Block 25 to property pages) — SKIPPED (CC dependency)');
  console.log('\n  Next: re-run semantic audit --no-cache to verify scores');
  console.log('  cd ~/dev/ecosystem/analytics && export GEMINI_API_KEY=... && python3 embedding/semantic-audit.py --no-cache\n');
}

main().catch(console.error);
