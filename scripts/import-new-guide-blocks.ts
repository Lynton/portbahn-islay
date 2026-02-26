/**
 * import-new-guide-blocks.ts
 *
 * Imports Blocks 25–29 into Sanity:
 *   - Block 26: `islay-villages-overview`     → canonicalBlock
 *   - Block 28: `islay-archaeology-overview`  → canonicalBlock
 *   - Block 25: `visit-jura-faqs`             → 6 x faqCanonicalBlock
 *   - Block 27: `islay-villages-faqs`         → 6 x faqCanonicalBlock
 *   - Block 29: `islay-archaeology-faqs`      → 6 x faqCanonicalBlock
 *
 * Run AFTER populate-entities.ts has run.
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-new-guide-blocks.ts
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateKey = () => Math.random().toString(36).substring(2, 11);

function parseInlineMarks(text: string): { children: any[]; markDefs: any[] } {
  const children: any[] = [];
  const markDefs: any[] = [];
  // Matches: **bold**, *italic*, [link text](url)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  for (const part of parts) {
    if (!part) continue;
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['strong'], text: part.slice(2, -2) });
    } else if (/^\*[^*]+\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['em'], text: part.slice(1, -1) });
    } else if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, linkText, href] = match;
        const linkKey = generateKey();
        markDefs.push({ _key: linkKey, _type: 'link', href });
        children.push({ _key: generateKey(), _type: 'span', marks: [linkKey], text: linkText });
      }
    } else {
      children.push({ _key: generateKey(), _type: 'span', marks: [], text: part });
    }
  }
  return {
    children: children.length > 0 ? children : [{ _key: generateKey(), _type: 'span', marks: [], text }],
    markDefs,
  };
}

function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.trim().split('\n');
  let currentParagraph: string[] = [];
  let currentList: { text: string; style: 'bullet' | 'number' }[] = [];
  let listStyle: 'bullet' | 'number' = 'bullet';

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return;
    const text = currentParagraph.join(' ').trim();
    if (!text) { currentParagraph = []; return; }
    const { children, markDefs } = parseInlineMarks(text);
    blocks.push({
      _key: generateKey(), _type: 'block', style: 'normal', markDefs,
      children,
    });
    currentParagraph = [];
  };

  const flushList = () => {
    if (currentList.length === 0) return;
    currentList.forEach(item => {
      const { children, markDefs } = parseInlineMarks(item.text);
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'normal',
        listItem: item.style, level: 1, markDefs,
        children,
      });
    });
    currentList = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') { flushParagraph(); flushList(); continue; }

    if (trimmed.startsWith('### ')) {
      flushParagraph(); flushList();
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text: trimmed.slice(4) }],
      });
      continue;
    }

    if (trimmed.startsWith('#### ') || trimmed.startsWith('## ')) {
      flushParagraph(); flushList();
      const text = trimmed.replace(/^#{2,5}\s+/, '');
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
      });
      continue;
    }

    if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
      flushParagraph(); flushList();
      const text = trimmed.replace(/^\*\*|\*\*$/g, '');
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
      });
      continue;
    }

    if (/^[-*] /.test(trimmed)) {
      flushParagraph();
      if (currentList.length > 0 && listStyle !== 'bullet') flushList();
      listStyle = 'bullet';
      currentList.push({ text: trimmed.slice(2).trim(), style: 'bullet' });
      continue;
    }

    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function textBlock(text: string) {
  return {
    _key: generateKey(), _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
  };
}

// ─── Block 26: islay-villages-overview (canonicalBlock) ──────────────────────

const VILLAGES_OVERVIEW_MD = `
Islay has six villages of genuinely distinct character, all within 45 minutes' drive of each other. Our three properties — [Portbahn House](/accommodation/portbahn-house), [Shorefield Eco House](/accommodation/shorefield-eco-house), and [Curlew Cottage](/accommodation/curlew-cottage) — sit on the Loch Indaal shoreline near Bruichladdich, which puts Port Charlotte, Bowmore, and Portnahaven within easy reach on a single morning. The rest of the island opens from there: Port Askaig on the north coast for the [Jura ferry](/explore-islay/visit-jura), Port Ellen in the south as the gateway to the [whisky coast](/explore-islay/islay-distilleries).

**Port Charlotte**

Port Charlotte is the village we recommend first to guests and the one most come back to. It was built as a planned village in the early 19th century — a neat grid of whitewashed houses running down to the Loch Indaal shore — and the planning shows: it has a shape and a purpose that most Hebridean villages lack. The [Museum of Islay Life](https://www.islaymuseum.org) is here, one of the better small local museums in Scotland and well worth an hour. The Port Charlotte Hotel has a log fire, over 300 single malts, and live music on Wednesday and Sunday evenings. [Lochindaal Seafood Kitchen](/explore-islay/food-and-drink) — our top restaurant on the island — is on the waterfront. Port Charlotte is a 5-minute drive from our properties, or 40 minutes on foot along the coastal cycle path that passes our front door.

**Bowmore**

Bowmore is Islay's main town, set at the head of Loch Indaal where the island's main roads converge. It is functional rather than picturesque — but it is honest, well-stocked, and important to know. The Co-op is the only proper supermarket on the island; the pharmacy and bank are here; Islay's Plaice does reliable fish and chips; Peatzeria does wood-fired pizza in an old church. [Bowmore Distillery](https://www.bowmore.com) sits at the foot of the main street, claimed as Islay's oldest at 1779. At the top of the street, Kilarrow Parish Church (the Round Church, 1767) is one of only a handful of round churches in Scotland — a five-minute stop that repays the curiosity. Bowmore is 15 minutes' drive from our Bruichladdich properties.

**Portnahaven and Port Wemyss**

Portnahaven and Port Wemyss are two connected villages at the southern tip of the Rhinns peninsula — a 20-minute drive from our properties along a single-track road that gets quieter and emptier the further south you travel. The harbour at Portnahaven almost always has common seals hauled out on the rocks, often within a few feet of the wall. An Tigh Seinnse is a small, genuinely local pub with home-cooked food and perhaps 20 seats — the best lunch on the Rhinns outside Port Charlotte. Open year-round; winter hours apply from November. Reservations are required (01496 860725); regular season hours: Thursday to Sunday from noon, Wednesday from 4:30pm, closed Monday and Tuesday. Confirm hours for winter visits. The sense of being at the very end of the road is real. Both villages together are smaller than a single Bowmore street.

**Port Ellen**

Port Ellen on the south coast is where the [CalMac](https://www.calmac.co.uk) ferry from Kennacraig arrives for the longer crossing (2 hours 20 minutes), and it marks the start of Islay's most celebrated distillery cluster. [Laphroaig, Lagavulin, and Ardbeg](/explore-islay/islay-distilleries) are all within a 10-minute drive east along the coast road, and Port Ellen Distillery — one of whisky's most storied lost distilleries — reopened in 2024 after four decades closed. The Copper Still café by the ferry terminal is our favourite café on the island. SeaSalt Bistro on the waterfront is a good dinner option for south coast evenings. Port Ellen is 45 minutes from our Bruichladdich properties — a south coast day from there is one of the best on the island.

**Bridgend and Port Askaig**

Bridgend sits at the head of Loch Indaal where the main island roads meet — not a destination village but a useful crossroads. The petrol pump at Bridgend Village Stores is one of the island's most important landmarks when your tank is running low. The Lochside Hotel has a bar and food. Port Askaig on the north coast is the other ferry terminal — faster crossing from Kennacraig (2 hours), closer to the north coast distilleries, and the departure point for the [5-minute Jura ferry](/explore-islay/visit-jura). The Port Askaig Hotel bar is worth knowing; there is little else at Port Askaig. Both are practical stops on an island where practicality is part of the plan.
`;

const VILLAGES_OVERVIEW_TEASER_MD = `
Islay's six villages are all within 45 minutes' drive. Port Charlotte is 5 minutes from our door — whitewashed, pretty, and home to the Lochindaal Seafood Kitchen. Bowmore is the main town: Co-op, distillery, the Round Church. Portnahaven has harbour seals and the island's smallest local pub. Port Ellen is the start of the south coast whisky trail. [Islay villages guide →](/explore-islay/islay-villages)
`;

const VILLAGES_KEY_FACTS = [
  { _key: generateKey(), fact: 'Port Charlotte', value: '5-minute drive from Bruichladdich; Museum of Islay Life; Lochindaal Seafood Kitchen; Port Charlotte Hotel (live music Wed + Sun)' },
  { _key: generateKey(), fact: 'Bowmore', value: '15-minute drive; Co-op; Bowmore Distillery (est. 1779); Kilarrow Parish Church (Round Church, 1767)' },
  { _key: generateKey(), fact: 'Portnahaven & Port Wemyss', value: '20-minute drive; harbour seals; An Tigh Seinnse pub — book ahead (01496 860725); Thu–Sun from noon, Wed from 4:30pm' },
  { _key: generateKey(), fact: 'Port Ellen', value: '45-minute drive; Laphroaig/Lagavulin/Ardbeg within 10 minutes; Port Ellen Distillery reopened 2024; Copper Still café' },
  { _key: generateKey(), fact: 'Bridgend', value: '10-minute drive; petrol pump at Village Stores; Lochside Hotel' },
  { _key: generateKey(), fact: 'Port Askaig', value: '25-minute drive; ferry terminal (Kennacraig 2hrs; Jura 5 mins)' },
];

// ─── Block 28: islay-archaeology-overview (canonicalBlock) ───────────────────

const ARCHAEOLOGY_OVERVIEW_MD = `
Islay has been continuously inhabited for more than 8,000 years. Its surviving heritage spans from Precambrian geology through Bronze Age cairns, Iron Age duns, the finest Early Christian carved cross in Scotland, the medieval seat of a Gaelic dynasty that rivalled the Scottish crown, contested coastal castles, and two World War One memorials that mark one of the war's strangest maritime disasters. Most of these sites are free, open year-round, and remarkably unvisited. The concentration of significant history within 50 minutes' drive of our Bruichladdich properties is, by any measure, unusual.

**The Oldest Layer: Bunnahabhain Stromatolites**

The oldest thing on Islay is also the most improbable. The rock outcrops near [Bunnahabhain Distillery](https://bunnahabhain.com) on the north coast contain fossilised stromatolites — layered structures formed by microbial mats in ancient shallow seas — dating to approximately 1.2 billion years ago. They are among the oldest macroscopic fossils in Britain, preserved in Dalradian quartzite on a working coastline. Park at Bunnahabhain Distillery, walk through the distillery yard to the southern end past the cottages, and take the gate onto the rough coastal path toward Rubha a'Mhill; the first fossilised exposures appear approximately 50 metres after the gate, in boulders of Bonahaven Dolomite along the shore. Best viewed at low tide. Combine with a [visit to Bunnahabhain, Caol Ila, or Ardnahoe](/explore-islay/islay-distilleries) for a north coast day that covers 1.2 billion years and a dram in the same afternoon.

**Standing Stones, Cairns, and Hillforts: Islay's Prehistoric Landscape**

Before the Lordship, the Lords, and the Early Christian missionaries came something older still. Rubha Port an t-Seilich on Islay's east coast is one of the best-preserved Mesolithic sites in Britain — 12,000-year-old flint tools from the period immediately following the last Ice Age, still visible in the soil for the researchers and archaeologists who return here regularly. Bolsay Farm on the Rhinns adds another chapter: a Mesolithic hunting camp from which over 300,000 flint artefacts have been recovered, now largely held at the [Museum of Islay Life](https://www.islaymuseum.org) in Port Charlotte.

The Bronze Age monuments are harder to miss. The Ballinaby Standing Stones on the northern Rhinns include one stone over four metres tall — difficult to overlook against the Islay skyline. Cultoon Stone Circle near Portnahaven is uniquely strange: fifteen massive stones were laid out in a circle but only two or three were ever raised upright. The project was abandoned mid-construction, leaving a monument to an intention that was never completed. It is one of the more thought-provoking sites on the island. At Dun Nosebridge, an Iron Age hillfort near Mulindry between Bridgend and Ballygrant, the scale of the island's pre-medieval occupation becomes clear. The fort covers 375 square metres and commands 360-degree views of Islay's interior — a short walk from the road, ten minutes from Bowmore. None of these sites charge admission or require booking.

**The Lordship of the Isles: Finlaggan**

[Finlaggan](https://www.finlaggan.com), on the shores of Loch Finlaggan in central Islay, is where the Lordship of the Isles administered its domain from approximately 1150 to 1493. The Lordship was the most powerful Gaelic polity in medieval Scotland — a maritime empire that at its height controlled the Hebrides, much of the western mainland, and the Isle of Man, operating under Gaelic law and a political structure independent of and often in conflict with the Scottish crown. The Lords of the Isles met on Eilean na Comhairle (Council Island), the smaller of Finlaggan's two islands; Eilean Mòr (the great island) held the great hall, chapel, and residence buildings. The Lordship was forfeited to the Scottish crown in 1493 and never re-established. Finlaggan was abandoned and has stood largely undisturbed since. The visitor centre is open from Saturday 5 April, Monday to Saturday 1100–1630, closed Sunday; entry is by donation. The islands are accessible year-round via a short path and causeway. It is 25 minutes' drive from our properties.

**The Kildalton Cross: 8th Century, Still Standing**

The Kildalton Cross stands in the graveyard of Kildalton Church on the south-east coast of Islay and has stood there since it was carved, approximately 800 AD. It is a ringed high cross carved from a single block of blue-grey epidiorite, 2.65 metres high, and it is — by the consensus of scholars and the assessment of [Historic Environment Scotland](https://www.historicenvironment.scot/visit-a-place/places/kildalton-cross) — the finest surviving example of early Christian carved stonework in Scotland, and one of the finest in Europe. The carving includes Old Testament scenes, a Virgin and Child in the central roundel, and interlaced knotwork of exceptional quality. The condition of the carving after 1,200 years in the open Scottish air is remarkable. There is no admission fee, no enclosure, and rarely a crowd. The site is 50 minutes' drive from our properties; the most scenic approach is the [Kildalton Shoreline Walk](/explore-islay/walking) from Port Ellen, which passes Laphroaig, Lagavulin, and Ardbeg on the way.

**Clan Battles and Contested Castles: Kilnave and Dunyvaig**

Kilnave Chapel, on the shore of Loch Gruinart, was built in the late 14th or early 15th century and was the site of one of the darkest episodes in Islay's clan history. On 5 August 1598, the Battle of Traigh Gruinart — the last major clan battle on Islay — was fought on the flats below, between the MacDonalds of Islay and the MacLeans of Mull. Thirty MacLean survivors retreated to the chapel; the MacDonalds fired the thatched roof. All died except one man — a Mac Mhuirich — who escaped through a hole in the burning thatch as it collapsed. The ruins remain open to the sky. Standing immediately to the west is a carved stone cross that predates the chapel by roughly 600 years — an unringed 8th-century cross, 3.35 metres tall, comparable in age to the Kildalton Cross but ringless and far more weathered. Dunyvaig Castle, on the south coast near Lagavulin, was a major MacDonald stronghold from the 12th to the 17th century — the naval base of the Lords of the Isles and later the scene of repeated sieges as control of the island passed between MacDonalds, MacLeans, and ultimately the crown. The castle is ruinous and accessible from the [Kildalton Shoreline Walk](/explore-islay/walking) path; do not enter the structure.

**The Round Church and the Cleared Townships**

Kilarrow Parish Church in Bowmore — locally called the Round Church — was built in 1767, the only circular church on Islay. The tradition that it was built round to deny the Devil a corner to hide in is almost certainly apocryphal, but the building is genuinely distinctive and still in use as a parish church. Islay's landscape also carries the more painful evidence of its 18th and 19th century history. The island's population fell from approximately 15,000 to 6,000 in the first half of the 19th century through clearances, famine, and emigration. The cleared and abandoned townships are visible across the island, particularly on the Oa peninsula: Tockmal near Soldier's Rock, Grasdale, Frachdale, Lurabus, and Lower Killeyan are among the named settlements the [RSPB reserve](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa) now covers. Near Ardbeg, the hills hold Solam — the plague village — abandoned after a local tradition holds that an 18th-century epidemic followed a shipwrecked sailor's gift; a plaque on site recounts the story. Near Keills, Kilslevan preserves the outline of eight longhouses and a chapel. The [Museum of Islay Life](https://www.islaymuseum.org) in Port Charlotte holds census records and estate papers documenting the island's depopulated areas.

**The World War One Chapter: The Oa and Kilchoman**

On 5 February 1918, the troopship USS Tuscania was torpedoed by a German submarine off the Oa peninsula — the first American troopship sunk in the war — with the loss of around 200 US soldiers. On 6 October 1918, the HMT Otranto collided with another vessel in a storm off the same coast and sank with the loss of over 400, including hundreds of American troops bound for France. Their bodies came ashore on Islay's beaches. The American Monument on the clifftop of the Oa was erected by the American Red Cross in 1920 and is maintained by the Commonwealth War Graves Commission. Kilchoman Military Cemetery, 20 minutes' drive from our properties near Kilchoman Church and Distillery, contains the graves of British and American servicemen recovered from both disasters. The two sites together tell the same story from two vantage points: the clifftop monument where the ships went down, and the quiet churchyard where the men were buried.
`;

const ARCHAEOLOGY_OVERVIEW_TEASER_MD = `
Islay was the seat of the Lords of the Isles — the most powerful Gaelic dynasty in medieval Scotland — and Finlaggan is 25 minutes from our door. The Kildalton Cross has stood since 800 AD. The American Monument on the Oa marks one of WW1's strangest disasters. Most sites are free and open year-round. [Islay archaeology & history guide →](/explore-islay/archaeology-history)
`;

const ARCHAEOLOGY_KEY_FACTS = [
  { _key: generateKey(), fact: 'Finlaggan', value: 'Seat of the Lordship of the Isles, 12th–16th century; visitor centre from 5 April, Mon–Sat 1100–1630, closed Sunday, donations welcome; 25-minute drive' },
  { _key: generateKey(), fact: 'Kildalton Cross', value: 'c. 800 AD; finest early Christian ringed cross in Scotland; free, open year-round; 50-minute drive' },
  { _key: generateKey(), fact: 'Kilnave Chapel', value: 'Late 14th–early 15th century; 8th-century unringed cross; Battle of Traigh Gruinart 5 August 1598; 20-minute drive; free, open year-round' },
  { _key: generateKey(), fact: 'Dunyvaig Castle', value: '12th–17th century; MacDonald stronghold; viewable from Kildalton Shoreline Walk' },
  { _key: generateKey(), fact: 'Bowmore Round Church (Kilarrow Parish Church)', value: '1767; circular plan; 15-minute drive; working church, open daily' },
  { _key: generateKey(), fact: 'American Monument, The Oa', value: 'Erected 1920; WW1 Tuscania and Otranto memorial; 35–40 minute drive + 20-minute walk' },
  { _key: generateKey(), fact: 'Kilchoman Military Cemetery', value: 'WW1 graves including Tuscania and Otranto casualties; CWGC; 20-minute drive; free, open year-round' },
  { _key: generateKey(), fact: 'Bunnahabhain Stromatolites', value: '~1.2 billion years; park at distillery, gate beyond cottages, 50–100m to first exposures; NR 4294 7021; best at low tide' },
  { _key: generateKey(), fact: 'Cultoon Stone Circle', value: 'Bronze Age; 15 stones laid out, only 2–3 raised — abandoned mid-construction; near Portnahaven; free, open access' },
  { _key: generateKey(), fact: 'Dun Nosebridge', value: 'Iron Age hillfort; 375 sq m; 360-degree views; near Mulindry, ~10 min from Bowmore; free, open access' },
];

// ─── Block 25: visit-jura-faqs (faqCanonicalBlock × 6) ───────────────────────

const juraFaqs = [
  {
    _id: 'faq-guide-jura-how-to-get',
    question: 'How do I get from Islay to Jura?',
    category: 'jura',
    priority: 10,
    answer: [
      textBlock("The Islay to Jura crossing is a 5-minute ferry from Port Askaig on Islay to Feolin on Jura. Port Askaig is approximately 30 minutes' drive from our three Bruichladdich properties - head east on the B8016 through Bridgend and continue north-east to Port Askaig on the Sound of Islay. The ferry is operated by Argyll and Bute Council and runs roughly hourly throughout the day; the timetable varies by season, so check current sailing times before you go. The crossing itself takes 5 minutes, the ferry is small, and arriving to find Jura's hills rising up from the other side is one of the better moments of an Islay stay. On the crossing and immediately on arrival at Feolin, look for red deer on the hillsides above the road - they are almost always visible."),
    ],
  },
  {
    _id: 'faq-guide-jura-book-ferry',
    question: 'Do I need to book the Islay-Jura ferry?',
    category: 'jura',
    priority: 20,
    answer: [
      textBlock("Foot passengers on the Islay to Jura ferry do not need to book - just arrive at Port Askaig at least 10 minutes before the scheduled sailing. For cars, no advance booking is required, but the ferry is small and if you arrive at a busy time you may have to wait for the next sailing. The one exception worth knowing about: if you want to stay for a full evening on Jura and take the late 21:30 ferry back to Port Askaig, we recommend booking that specific sailing 24 hours ahead - it's the last ferry of the day and can fill up with day-trippers in summer. Timetables are published on the Argyll and Bute Council website and change seasonally. Always check the last sailing time before you leave for Jura - missing the final ferry is a real possibility if you lose track of time."),
    ],
  },
  {
    _id: 'faq-guide-jura-day-trip-duration',
    question: 'How long does a day trip to Jura take?',
    category: 'jura',
    priority: 30,
    answer: [
      textBlock("A day trip to Jura from our Bruichladdich properties takes a full day well-spent. Allow 30 minutes to drive from Bruichladdich to Port Askaig, 5 minutes on the ferry, and then the morning and afternoon on Jura. A well-paced day trip covers Jura Distillery (tours must be booked ahead), lunch at the Antlers or the Jura Hotel, a hire-bike ride or coastal walk to Small Isles Bay and Corran Sands, and a drive north to Ardlussa to visit Lussa Gin if time allows. Return on an afternoon ferry to be back at the properties by early evening. For those who want to see more of Jura - Barnhill, the Paps, or Corryvreckan - a longer stay is genuinely worthwhile. See our walking guide for context on what the Paps involve, and the full Jura extended-stay content on this page for what a multi-day visit looks like."),
    ],
  },
  {
    _id: 'faq-guide-jura-beyond-distillery',
    question: 'What is there to do on Jura beyond the distillery?',
    category: 'jura',
    priority: 40,
    answer: [
      textBlock("Jura offers far more than whisky once you get beyond Craighouse, and we'd encourage you to explore. The drive north from Craighouse to Ardlussa is one of the most beautiful single-track roads in the Inner Hebrides - dramatic coastal views, red deer on the verges, and the slow sense of getting properly remote. Lussa Gin at Ardlussa is worth the drive for the setting alone; the gin is excellent. For walkers, the Paps of Jura dominate every view - three quartzite peaks of up to 785m (Beinn an Oir, the highest), serious hill walking for fit hikers on a clear day. At Barnhill in the far north, the remote farmhouse where George Orwell wrote 1984 in 1946-48 still stands at the end of 25 miles of single-track and 4 miles of rough track on foot - the Fletcher family still owns it and it is a private home, but the pilgrimage is part of the point. The Corryvreckan whirlpool between Jura and Scarba is the third largest whirlpool in the world and can be seen from Jura's northern tip or experienced close-up on a boat trip. Red deer are visible daily; eagles, seals, and otters inhabit the coastline."),
    ],
  },
  {
    _id: 'faq-guide-jura-staying-on-jura',
    question: 'Is it possible to stay on Jura as well as Islay?',
    category: 'jura',
    priority: 50,
    answer: [
      textBlock("Staying on Jura is very possible, and we'd recommend it for anyone who wants more than a day on the island. We run Bothan Jura Retreat on Jura - our own passion project built from scratch on an acre of land at the foot of the Paps of Jura. Bothan Jura Retreat has four units sleeping 2 each: Mrs Leonard's Cottage (original stone cotters' cottage, restored), The Rusty Hut Lodge (Corten steel and timber), The Black Hut Cabin (contemporary birch plywood), and The Shepherd's Hut (off-grid glamping). Each has its own wood-fired hot tub; Mrs Leonard's Cottage also has a sauna. The retreat sits at Knockrome with Corran Sands at the foot of the drive and the Paps towering above. For an Islay and Jura multi-island trip, book our Islay properties for the main part of your stay and add two to three nights at Bothan Jura Retreat to end with something genuinely remote. Get in touch and we'll help plan the logistics. Details at bothanjuraretreat.co.uk."),
    ],
  },
  {
    _id: 'faq-guide-jura-best-time',
    question: 'When is the best time of year to visit Jura?',
    category: 'jura',
    priority: 60,
    answer: [
      textBlock("Jura is worth visiting year-round, and the best time depends on what you're after. Summer (June to August) gives the longest days, the warmest weather, and the Jura Hotel at its most sociable - but also midges. A midge head net is essential from late May to September, particularly in calm weather. Spring (April to May) is excellent - the island is quieter, the deer are out in numbers, and the light is spectacular. Autumn (September to October) is our personal favourite - the midges have gone, the deer rut fills the hillsides with sound, the light turns dramatic, and Jura is at its most atmospheric. Winter visits are possible but require flexibility: ferry timetables are reduced, weather is more likely to disrupt the crossing, and some Jura businesses operate reduced hours. We moved to Jura in 2017 and have loved it in every season - if you want our honest take on when to come, get in touch before you book."),
    ],
  },
];

// ─── Block 27: islay-villages-faqs (faqCanonicalBlock × 6) ───────────────────

const villagesFaqs = [
  {
    _id: 'faq-guide-villages-main-town',
    question: 'What is the main town on Islay?',
    category: 'travel-planning',
    priority: 10,
    answer: [
      textBlock("Bowmore is Islay's main town, located at the head of Loch Indaal roughly in the centre of the island. It has the largest concentration of shops and services — the Co-op supermarket, a pharmacy, a bank, Bowmore Distillery, and several restaurants including Peatzeria and Islay's Plaice fish and chip shop. Bowmore is 15 minutes' drive from our Bruichladdich properties along the B8016 road around Loch Indaal. For practical errands during a self-catering stay, Bowmore is where you go first."),
    ],
  },
  {
    _id: 'faq-guide-villages-port-charlotte',
    question: 'Is Port Charlotte worth visiting from Bruichladdich?',
    category: 'travel-planning',
    priority: 20,
    answer: [
      textBlock("Port Charlotte is 5 minutes' drive from our Bruichladdich properties and is the village we recommend most consistently. It has a safe beach, the Museum of Islay Life, Port Charlotte Stores (shop with a petrol pump), the Port Charlotte Hotel (log fire, 300+ single malts, live music on Wednesday and Sunday evenings), and Lochindaal Seafood Kitchen — our top restaurant recommendation on the island. The village is pretty, quiet, and well worth an afternoon or an evening meal. The coastal cycle path from Bruichladdich to Port Charlotte is flat tarmac and takes about 40 minutes each way — suitable for all abilities including pushchairs and bikes."),
    ],
  },
  {
    _id: 'faq-guide-villages-port-ellen',
    question: 'What is there to do in Port Ellen on Islay?',
    category: 'travel-planning',
    priority: 30,
    answer: [
      textBlock("Port Ellen is where the CalMac ferry arrives on the south coast of Islay — 45 minutes from our Bruichladdich properties. Beyond the ferry, it is the starting point for the south coast distillery cluster: Laphroaig, Lagavulin, and Ardbeg are all within 10 minutes' drive east, and Port Ellen Distillery reopened in 2024. The Copper Still café by the ferry terminal serves excellent coffee and food — our guests always stop there on a south coast day. SeaSalt Bistro on the waterfront is a good dinner option if you're spending the evening on the south coast. Kilnaughton Bay near Port Ellen has a safe sandy beach suitable for families. Port Ellen itself is a functional port town rather than a picturesque village, but its position as the gateway to the best whisky drive on the island makes it essential to know."),
    ],
  },
  {
    _id: 'faq-guide-villages-distances',
    question: 'How far apart are the main villages on Islay?',
    category: 'travel-planning',
    priority: 40,
    answer: [
      textBlock("Islay's villages are all within 45 minutes' drive of each other, and the roads are quiet. From our Bruichladdich properties: Port Charlotte is 5 minutes; Bowmore is 15 minutes around Loch Indaal; Portnahaven and Port Wemyss are 20 minutes south along the Rhinns; Bridgend is 10 minutes east at the head of the loch; Port Askaig on the north coast is 25 minutes; Port Ellen on the south coast is 45 minutes. The island is compact enough that two or three villages can be combined comfortably on a single day trip, and the single-track roads rarely cause delays outside July and August."),
    ],
  },
  {
    _id: 'faq-guide-villages-portnahaven',
    question: 'What is Portnahaven like — is it worth the drive?',
    category: 'travel-planning',
    priority: 50,
    answer: [
      textBlock("Portnahaven — and its neighbour Port Wemyss — at the southern tip of the Rhinns is one of the most rewarding short trips from our properties. It is a 20-minute drive along a quiet road that gets progressively emptier as you go south. The harbour almost always has common seals hauled out on the rocks and swimming in the water — often close enough to observe clearly. An Tigh Seinnse is a small, genuinely local pub serving home-cooked food. Open year-round; winter hours apply from November. Regular season hours: Thursday to Sunday from noon, Wednesday from 4:30pm, closed Monday and Tuesday. Reservations required — call 01496 860725 and confirm hours for winter visits. The combination of seals, good food, and the sense of being at the very end of the road makes Portnahaven the best half-day on the Rhinns after Port Charlotte."),
    ],
  },
  {
    _id: 'faq-guide-villages-shopping',
    question: 'What shops are there on Islay — where should I do my main food shopping?',
    category: 'travel-planning',
    priority: 60,
    answer: [
      textBlock("The Co-op in Bowmore is the main supermarket on Islay — the best-stocked and most reliably open year-round. It carries fresh produce, meat, alcohol, and household essentials. Aileen's Mini-Market in Bruichladdich village is 5 minutes' walk from our properties and covers daily basics, coffee, and bacon rolls. Port Charlotte Stores has a shop, post office, and petrol pump. There is no large supermarket on the island — the Co-op is as close as it gets. We recommend arriving with enough provisions for the first day and doing a proper shop at the Co-op on your first full morning."),
    ],
  },
];

// ─── Block 29: islay-archaeology-faqs (faqCanonicalBlock × 6) ────────────────

const archaeologyFaqs = [
  {
    _id: 'faq-guide-archaeology-finlaggan',
    question: 'What is Finlaggan on Islay — why is it historically significant?',
    category: 'travel-planning',
    priority: 10,
    answer: [
      textBlock("Finlaggan, on the shores of Loch Finlaggan in central Islay, was the seat of the Lordship of the Isles from the 12th to the 16th century — the administrative and ceremonial centre of the most powerful Gaelic dynasty in medieval Scotland. The Lords of the Isles controlled the Hebrides and much of the western mainland from Finlaggan's two islands: Eilean Mòr (the great island, with the great hall and chapel) and Eilean na Comhairle (Council Island, where the Council of the Isles convened). The Lordship was forfeited to the Scottish Crown in 1493 and never re-established; Finlaggan was abandoned and has remained largely undisturbed since. A small visitor centre with finds from excavations is open from Saturday 5 April, Monday to Saturday 1100–1630, closed Sunday; entry is by donation (tel: +44(0)1496 840 644; email: finlaggan@outlook.com). The islands are accessible year-round via a short causeway path. It is 25 minutes' drive from our Bruichladdich properties."),
    ],
  },
  {
    _id: 'faq-guide-archaeology-kildalton-cross',
    question: 'What is the Kildalton Cross and how do I visit it?',
    category: 'travel-planning',
    priority: 20,
    answer: [
      textBlock("The Kildalton Cross is an 8th-century ringed high cross at Kildalton Church on the south-east coast of Islay — widely considered the finest surviving example of Early Christian carved stonework in Scotland. It has stood in its original outdoor location since it was carved, approximately 800 AD, and the quality of the carving remains remarkable: Old Testament scenes, Virgin and Child, and intricate knotwork on a cross 2.65 metres high. There is no admission fee, no booking required, and the site is open year-round. To reach it by car, drive east from Port Ellen for approximately 8 miles on the A846 and the minor road beyond Ardbeg — about 50 minutes from our properties. The Kildalton Shoreline Walk from Port Ellen provides an alternative approach on foot, combining the cross with Ardbeg, Lagavulin, and Laphroaig distilleries and Dunyvaig Castle on a single south coast walk."),
    ],
  },
  {
    _id: 'faq-guide-archaeology-american-monument',
    question: 'Who are the American soldiers commemorated at the American Monument on the Oa?',
    category: 'travel-planning',
    priority: 30,
    answer: [
      textBlock("The American Monument on the clifftop of the Oa peninsula commemorates the hundreds of American servicemen who drowned when two troopships — the USS Tuscania and the HMT Otranto — sank off the Oa in 1918 during World War One. The Tuscania was torpedoed by a German U-boat on 5 February 1918 with the loss of around 200 lives. The Otranto collided with another vessel in a storm on 6 October 1918 and sank with the loss of over 400, including many American soldiers. Their bodies came ashore on the beaches of the Oa. The monument was erected by the American Red Cross in 1920 and is maintained by the War Graves Commission. It stands on a clifftop above the Atlantic, 35–40 minutes' drive from our properties plus a 20-minute walk from the RSPB car park at PA42 7AU. Views on a clear day reach to Ireland."),
    ],
  },
  {
    _id: 'faq-guide-archaeology-stromatolites',
    question: 'What are the Bunnahabhain Stromatolites — and how old are they?',
    category: 'travel-planning',
    priority: 40,
    answer: [
      textBlock("The Bunnahabhain Stromatolites are fossilised microbial structures visible in rock exposures near Bunnahabhain Distillery on the north coast of Islay, dating to approximately 1.2 billion years ago — among the oldest macroscopic fossils in Britain. Stromatolites are layered structures formed by microbial mats in shallow ancient seas; the Bunnahabhain examples are exceptionally well preserved in the Dalradian quartzite of the Islay coast. They are accessible from Bunnahabhain Distillery car park: walk through the distillery buildings to the southern end, pass the gate at the end of the distillery cottages, and follow the rough coastal path toward Rubha a'Mhill — the first fossilised exposures appear approximately 50 metres after the gate. Best at low tide; many of the best exposures are on the intertidal rocks. Combining the stromatolites with a visit to Bunnahabhain, Caol Ila, or Ardnahoe distillery makes a good north coast half-day."),
    ],
  },
  {
    _id: 'faq-guide-archaeology-kilnave',
    question: 'What is Kilnave Chapel and what happened there?',
    category: 'travel-planning',
    priority: 50,
    answer: [
      textBlock("Kilnave Chapel is a ruined medieval chapel on the shores of Loch Gruinart on the northern Rhinns of Islay, built in the late 14th or early 15th century. On 5 August 1598 it was the site of the final act of the Battle of Traigh Gruinart — the last major clan battle on Islay, between the MacDonalds and the MacLeans of Mull. Thirty MacLean survivors retreated to the chapel; the MacDonalds fired the thatched roof. All died except one — a Mac Mhuirich (Currie) who escaped through a hole as the burning thatch collapsed. The ruins remain open to the sky. Immediately to the west stands an 8th-century carved cross — ringless, 3.35 metres tall, and roughly 600 years older than the chapel beside it. The site is 20 minutes' drive from our properties on the road to the RSPB Loch Gruinart nature reserve — combine it with a visit to the reserve's wildlife hides and, if the timing works, The Oyster Shed for lunch."),
    ],
  },
  {
    _id: 'faq-guide-archaeology-bowmore-church',
    question: 'Is the Bowmore Round Church open to visitors?',
    category: 'travel-planning',
    priority: 60,
    answer: [
      textBlock("Bowmore Round Church (formally Kilarrow Parish Church) is a functioning Church of Scotland parish church, built in 1767, at the top of Bowmore's main street. It is open for regular services and to visitors outside service times — the door is usually unlocked during the day. The church is circular in plan, the only round church on Islay, and local tradition attributes the unusual design to a desire to prevent the Devil finding a corner to hide in. Whether or not that story is true, the building is genuinely distinctive and worth five minutes on any visit to Bowmore. It is 15 minutes' drive from our Bruichladdich properties."),
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n======================================================');
  console.log('  import-new-guide-blocks.ts');
  console.log('  Blocks 25–29: 2 canonicalBlocks + 18 faqCanonicalBlocks');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  let created = 0;
  let failed = 0;

  // 1. Import Block 26: islay-villages-overview (canonicalBlock)
  console.log('Block 26: islay-villages-overview (canonicalBlock)...');
  try {
    await client.createOrReplace({
      _type: 'canonicalBlock',
      _id: 'canonical-block-islay-villages-overview',
      blockId: { _type: 'slug', current: 'islay-villages-overview' },
      title: 'Islay Villages Overview',
      entityType: 'place',
      canonicalHome: '/explore-islay/islay-villages',
      fullContent: markdownToPortableText(VILLAGES_OVERVIEW_MD),
      teaserContent: markdownToPortableText(VILLAGES_OVERVIEW_TEASER_MD),
      keyFacts: VILLAGES_KEY_FACTS,
    });
    console.log(`  ✓ canonical-block-islay-villages-overview`);
    created++;
  } catch (err: any) {
    console.error(`  ✗ canonical-block-islay-villages-overview: ${err.message}`);
    failed++;
  }

  // 2. Import Block 28: islay-archaeology-overview (canonicalBlock)
  console.log('\nBlock 28: islay-archaeology-overview (canonicalBlock)...');
  try {
    await client.createOrReplace({
      _type: 'canonicalBlock',
      _id: 'canonical-block-islay-archaeology-overview',
      blockId: { _type: 'slug', current: 'islay-archaeology-overview' },
      title: 'Islay Archaeology Overview',
      entityType: 'heritage',
      canonicalHome: '/explore-islay/archaeology-history',
      fullContent: markdownToPortableText(ARCHAEOLOGY_OVERVIEW_MD),
      teaserContent: markdownToPortableText(ARCHAEOLOGY_OVERVIEW_TEASER_MD),
      keyFacts: ARCHAEOLOGY_KEY_FACTS,
    });
    console.log(`  ✓ canonical-block-islay-archaeology-overview`);
    created++;
  } catch (err: any) {
    console.error(`  ✗ canonical-block-islay-archaeology-overview: ${err.message}`);
    failed++;
  }

  // 3. Import Block 25: visit-jura-faqs (6 × faqCanonicalBlock)
  console.log('\nBlock 25: visit-jura-faqs (6 FAQs)...');
  for (const faq of juraFaqs) {
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
    } catch (err: any) {
      console.error(`  ✗ ${faq._id}: ${err.message}`);
      failed++;
    }
  }

  // 4. Import Block 27: islay-villages-faqs (6 × faqCanonicalBlock)
  console.log('\nBlock 27: islay-villages-faqs (6 FAQs)...');
  for (const faq of villagesFaqs) {
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
    } catch (err: any) {
      console.error(`  ✗ ${faq._id}: ${err.message}`);
      failed++;
    }
  }

  // 5. Import Block 29: islay-archaeology-faqs (6 × faqCanonicalBlock)
  console.log('\nBlock 29: islay-archaeology-faqs (6 FAQs)...');
  for (const faq of archaeologyFaqs) {
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
    } catch (err: any) {
      console.error(`  ✗ ${faq._id}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n======================================================');
  console.log(`  Created/replaced: ${created}`);
  console.log(`  Failed: ${failed}`);
  console.log('======================================================');
  console.log('\nNext: run create-new-guide-pages.ts and wire-entity-guide-pages.ts');
}

run().catch(console.error);
