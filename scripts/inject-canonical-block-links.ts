import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface PhraseLink {
  phrase: string;
  href: string;
  firstOccurrenceOnly?: boolean; // default true for place/keyword phrases
  excludeBlockTitles?: string[]; // skip this phrase in these blocks
  includeBlockTitles?: string[]; // ONLY inject in these blocks (mutual exclusive with exclude)
}

const phraseMap: PhraseLink[] = [
  // === BUSINESSES WITH WEBSITES — all occurrences ===
  { phrase: 'Lochindaal Seafood Kitchen', href: 'https://www.lochindaalseafoodkitchen.co.uk/', firstOccurrenceOnly: false },
  { phrase: 'Port Charlotte Hotel', href: 'https://www.portcharlottehotel.co.uk/', firstOccurrenceOnly: false },
  { phrase: 'Jura Boat Tours', href: 'https://www.juraboattours.co.uk', firstOccurrenceOnly: false },
  { phrase: 'The Oyster Shed, Islay', href: 'https://www.facebook.com/p/Islay-Oysters-100063634821212/', firstOccurrenceOnly: false },
  { phrase: 'The Copper Still', href: 'https://www.facebook.com/CopperStillCoffeeIslay/?locale=en_GB', firstOccurrenceOnly: false },
  { phrase: 'Peatzeria', href: 'https://peatzeria.com/', firstOccurrenceOnly: false },
  { phrase: 'SeaSalt Bistro', href: 'https://www.seasalt-bistro.co.uk/', firstOccurrenceOnly: false },
  { phrase: "Islay's Plaice", href: 'https://www.facebook.com/p/Islays-Plaice-61568208287189/', firstOccurrenceOnly: false },
  { phrase: 'The Cottage', href: 'https://www.facebook.com/p/The-Cottage-CAFE-FISH-BAR-100050292438351/', firstOccurrenceOnly: false, excludeBlockTitles: ['Bothan Jura Retreat'] },
  { phrase: 'Jura Hotel', href: 'https://www.jurahotel.co.uk/', firstOccurrenceOnly: false },
  { phrase: 'The Antlers', href: 'https://www.facebook.com/antlers.jura/', firstOccurrenceOnly: false },
  { phrase: 'Jura Distillery', href: 'https://www.isleofjura.com', firstOccurrenceOnly: false },

  // === RSPB RESERVES — high authority external links ===
  { phrase: 'RSPB Loch Gruinart', href: 'https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart/', firstOccurrenceOnly: false },
  { phrase: 'RSPB The Oa', href: 'https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa/', firstOccurrenceOnly: false },

  // === DISTILLERIES — all occurrences (outbound authority) ===
  // Long phrases first
  { phrase: 'Bruichladdich Distillery', href: 'https://www.bruichladdich.com', firstOccurrenceOnly: false },
  { phrase: 'Port Ellen Distillery', href: 'https://www.malts.com/en-gb/distilleries/port-ellen', firstOccurrenceOnly: false },
  { phrase: 'Bunnahabhain Distillery', href: 'https://www.bunnahabhain.com', firstOccurrenceOnly: false },
  { phrase: 'Kilchoman Distillery', href: 'https://www.kilchomandistillery.com', firstOccurrenceOnly: false },
  { phrase: 'Bowmore Distillery', href: 'https://www.bowmore.com', firstOccurrenceOnly: false },
  { phrase: 'Laggan Bay Distillery', href: 'https://www.ianmacleod.com/brands/laggan-bay-distillery', firstOccurrenceOnly: false },
  // Then individual distillery names (avoid matching inside longer phrases)
  { phrase: 'Ardnahoe', href: 'https://www.ardnahoedistillery.com', firstOccurrenceOnly: false, excludeBlockTitles: ['Islay Villages Overview'] },
  { phrase: 'Ardbeg', href: 'https://www.ardbeg.com', firstOccurrenceOnly: false },
  { phrase: 'Lagavulin', href: 'https://www.malts.com/en-gb/distilleries/lagavulin', firstOccurrenceOnly: false },
  { phrase: 'Laphroaig', href: 'https://www.laphroaig.com', firstOccurrenceOnly: false },
  { phrase: 'Bunnahabhain', href: 'https://www.bunnahabhain.com', firstOccurrenceOnly: false },
  { phrase: 'Caol Ila', href: 'https://www.malts.com/en-gb/distilleries/caol-ila', firstOccurrenceOnly: false },
  // Kilchoman alone → distillery site (it's always the distillery in context, not the village)
  { phrase: 'Kilchoman', href: 'https://www.kilchomandistillery.com', firstOccurrenceOnly: false, excludeBlockTitles: ['Islay Archaeology Overview'] },
  // Bowmore alone — distillery in distillery block, village elsewhere
  { phrase: 'Bowmore', href: 'https://www.bowmore.com', firstOccurrenceOnly: true, includeBlockTitles: ["Islay's Ten Whisky Distilleries"] },

  // === FÈIS ÌLE ===
  { phrase: 'Fèis Ìle', href: 'https://feisile.co.uk/', firstOccurrenceOnly: false },

  // === LOGANAIR ===
  { phrase: 'Loganair', href: 'https://www.loganair.co.uk/', firstOccurrenceOnly: true },

  // === BEACHES — first occurrence per block ===
  // Long phrases first
  { phrase: 'Port Charlotte Beach', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Portbahn Beach', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true, excludeBlockTitles: ['Portbahn Beach'] },
  { phrase: 'Bunnahabhain Stromatolites', href: '/explore-islay/archaeology-history', firstOccurrenceOnly: true },
  { phrase: 'Kilchoman Military Cemetery', href: '/explore-islay/archaeology-history', firstOccurrenceOnly: true },
  { phrase: 'Singing Sands', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Ardnave Point', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Claggain Bay', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Kilnaughton Bay', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Machir Bay', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Saligo Bay', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Sanaigmore', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Laggan Bay', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'Loch Indaal', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true, excludeBlockTitles: ['Flights to Islay', 'Ferry Basics', 'Bruichladdich Proximity'] },

  // === ARCHAEOLOGY ===
  { phrase: 'Kildalton Cross', href: '/explore-islay/archaeology-history', firstOccurrenceOnly: true },
  { phrase: 'Kilnave Chapel', href: '/explore-islay/archaeology-history', firstOccurrenceOnly: true },
  { phrase: 'Dunyvaig Castle', href: '/explore-islay/archaeology-history', firstOccurrenceOnly: true },

  // === VILLAGES — first occurrence per block ===
  { phrase: 'Portnahaven and Port Wemyss', href: '/explore-islay/islay-villages', firstOccurrenceOnly: true },
  { phrase: 'Port Charlotte', href: '/explore-islay/islay-villages', firstOccurrenceOnly: true, excludeBlockTitles: ['Port Charlotte Village', "Islay's Ten Whisky Distilleries"] },
  { phrase: 'Port Askaig', href: '/explore-islay/islay-villages', firstOccurrenceOnly: true },
  { phrase: 'Port Ellen', href: '/explore-islay/islay-villages', firstOccurrenceOnly: true, excludeBlockTitles: ['Islay Villages Overview'] },
  { phrase: 'Bridgend', href: '/explore-islay/islay-villages', firstOccurrenceOnly: true },
  { phrase: 'Bowmore', href: '/explore-islay/islay-villages', firstOccurrenceOnly: true, excludeBlockTitles: ["Islay's Ten Whisky Distilleries"] },

  // === JURA PLACES — first occurrence per block ===
  { phrase: 'Corryvreckan Whirlpool', href: '/explore-islay/visit-jura', firstOccurrenceOnly: true },
  { phrase: 'Paps of Jura', href: '/explore-islay/visit-jura', firstOccurrenceOnly: true },
  { phrase: 'Small Isles Bay', href: '/explore-islay/visit-jura', firstOccurrenceOnly: true },
  { phrase: 'Corran Sands', href: '/explore-islay/visit-jura', firstOccurrenceOnly: true },
  { phrase: 'Barnhill', href: '/explore-islay/visit-jura', firstOccurrenceOnly: true },

  // === KEY PHRASES / CROSS-LINKS ===
  { phrase: 'wildlife guide', href: '/explore-islay/islay-wildlife', firstOccurrenceOnly: true },
  { phrase: 'beaches guide', href: '/explore-islay/islay-beaches', firstOccurrenceOnly: true },
  { phrase: 'food and drink guide', href: '/explore-islay/food-and-drink', firstOccurrenceOnly: true },
  { phrase: 'food & drink guide', href: '/explore-islay/food-and-drink', firstOccurrenceOnly: true },
  { phrase: 'walking guide', href: '/explore-islay/walking', firstOccurrenceOnly: true },
  { phrase: 'Visit Jura guide', href: '/explore-islay/visit-jura', firstOccurrenceOnly: true },
  { phrase: 'birdwatching', href: '/explore-islay/islay-wildlife', firstOccurrenceOnly: true },
  { phrase: 'barnacle geese', href: '/explore-islay/islay-wildlife', firstOccurrenceOnly: true },
  { phrase: 'whisky distilleries', href: '/explore-islay/islay-distilleries', firstOccurrenceOnly: true, excludeBlockTitles: ["Islay's Ten Whisky Distilleries"] },
  { phrase: 'distillery tours', href: '/explore-islay/islay-distilleries', firstOccurrenceOnly: true, excludeBlockTitles: ["Islay's Ten Whisky Distilleries", 'Trust Signals'] },
  { phrase: 'distillery tour', href: '/explore-islay/islay-distilleries', firstOccurrenceOnly: true, excludeBlockTitles: ["Islay's Ten Whisky Distilleries", 'Trust Signals'] },
];

function isAlreadyLinked(block: any, phrase: string): boolean {
  if (!block.children || !block.markDefs) return false;
  const linkKeys = (block.markDefs || [])
    .filter((md: any) => md._type === 'link')
    .map((md: any) => md._key);
  for (const child of block.children) {
    if (child.text?.includes(phrase) && (child.marks || []).some((m: string) => linkKeys.includes(m))) {
      return true;
    }
  }
  return false;
}

// Returns updated blocks array (or null if no changes made)
function injectLinks(
  blocks: any[],
  phraseLinks: PhraseLink[],
  blockTitle: string
): { blocks: any[]; injections: string[] } | null {
  let changed = false;
  const injections: string[] = [];
  // Deep clone
  const updated = JSON.parse(JSON.stringify(blocks));

  // Sort phrase map: longest phrases first
  const sorted = [...phraseLinks].sort((a, b) => b.phrase.length - a.phrase.length);

  const usedPhrases = new Set<string>(); // track first-occurrence-only phrases already used

  for (const {
    phrase,
    href,
    firstOccurrenceOnly = true,
    excludeBlockTitles = [],
    includeBlockTitles,
  } of sorted) {
    // Skip if this phrase is excluded for this block
    if (excludeBlockTitles.includes(blockTitle)) continue;
    // Skip if this phrase only applies to specific blocks and this isn't one
    if (includeBlockTitles && !includeBlockTitles.includes(blockTitle)) continue;

    for (const block of updated) {
      if (block._type !== 'block') continue;

      // Check if already linked in this block
      if (isAlreadyLinked(block, phrase)) continue;

      // For first-occurrence-only, track across all blocks in the document
      const phraseKey = `${phrase}`;
      if (firstOccurrenceOnly && usedPhrases.has(phraseKey)) continue;

      // Find child span containing the phrase
      let injected = false;
      for (let i = 0; i < block.children.length; i++) {
        const child = block.children[i];
        if (!child.text || !child.text.includes(phrase)) continue;
        // Don't inject into already-marked spans (unless the mark is strong/em, not a link)
        const existingMarks = child.marks || [];
        const blockLinks = (block.markDefs || [])
          .filter((md: any) => md._type === 'link')
          .map((md: any) => md._key);
        if (existingMarks.some((m: string) => blockLinks.includes(m))) continue;

        const text: string = child.text;
        const idx = text.indexOf(phrase);
        if (idx === -1) continue;

        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + phrase.length);
        const after = text.slice(idx + phrase.length);

        const linkKey = uuidv4().replace(/-/g, '').slice(0, 12);

        // Build replacement spans
        const replacements: any[] = [];
        if (before)
          replacements.push({
            ...child,
            _key: uuidv4().replace(/-/g, '').slice(0, 12),
            text: before,
          });
        replacements.push({
          ...child,
          _key: uuidv4().replace(/-/g, '').slice(0, 12),
          text: match,
          marks: [...existingMarks, linkKey],
        });
        if (after)
          replacements.push({
            ...child,
            _key: uuidv4().replace(/-/g, '').slice(0, 12),
            text: after,
          });

        // Add markDef
        if (!block.markDefs) block.markDefs = [];
        block.markDefs.push({ _key: linkKey, _type: 'link', href });

        // Replace the child
        block.children.splice(i, 1, ...replacements);

        injected = true;
        changed = true;
        injections.push(`  "${phrase}" → ${href}`);
        break; // move to next phrase after first injection
      }

      if (injected) {
        if (firstOccurrenceOnly) usedPhrases.add(phraseKey);
        break; // first occurrence in document
      }
    }
  }

  if (!changed) return null;
  return { blocks: updated, injections };
}

async function run() {
  const isLive = process.argv.includes('--live');
  console.log(isLive ? 'LIVE MODE — writing to Sanity' : 'DRY RUN — no writes');

  const blocks = await client.fetch(
    `*[_type=="canonicalBlock"]{_id, title, fullContent} | order(title asc)`
  );

  let totalInjections = 0;
  let blocksModified = 0;

  for (const block of blocks) {
    if (!block.fullContent) continue;

    const result = injectLinks(block.fullContent, phraseMap, block.title);
    if (!result) continue;

    console.log(`\n--- ${block.title} (${result.injections.length} injections):`);
    result.injections.forEach((s) => console.log(s));

    totalInjections += result.injections.length;
    blocksModified++;

    if (isLive) {
      await client.patch(block._id).set({ fullContent: result.blocks }).commit();
      console.log(`  Written to Sanity`);
    }
  }

  console.log(`\n=============================`);
  console.log(
    `${isLive ? 'LIVE' : 'DRY RUN'} complete: ${totalInjections} links across ${blocksModified} blocks`
  );
  if (!isLive) console.log('Run with --live to write to Sanity');
}

run().catch(console.error);
