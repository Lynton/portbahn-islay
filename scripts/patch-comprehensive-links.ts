/**
 * patch-comprehensive-links.ts
 *
 * Comprehensive inline-link patch for:
 *   - 12 canonical blocks with 0 or insufficient links
 *   - 1 canonical block fix (bothan-jura-teaser broken markdown link)
 *   - 1 canonical block update (food-drink-islay — add An Tigh Seinnse link)
 *   - 6 guide page extendedEditorial fields
 *   - 3 property locationIntro fields
 *   - 3 property description fields
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/patch-comprehensive-links.ts
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

// ─── Helpers (copied from patch-inline-links.ts) ──────────────────────────────

const generateKey = () => Math.random().toString(36).substring(2, 11);

function parseInlineMarks(text: string): { children: any[]; markDefs: any[] } {
  const children: any[] = [];
  const markDefs: any[] = [];
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
    blocks.push({ _key: generateKey(), _type: 'block', style: 'normal', markDefs, children });
    currentParagraph = [];
  };

  const flushList = () => {
    if (currentList.length === 0) return;
    currentList.forEach(item => {
      const { children, markDefs } = parseInlineMarks(item.text);
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'normal',
        listItem: item.style, level: 1, markDefs, children,
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

    if (trimmed.startsWith('## ') || trimmed.startsWith('#### ')) {
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

// ─── Canonical Blocks ─────────────────────────────────────────────────────────

const ARCHAEOLOGY_OVERVIEW_MD = `
Islay has been continuously inhabited for more than 8,000 years. Its surviving heritage spans from Precambrian geology through Bronze Age cairns, Iron Age duns, the finest Early Christian carved cross in Scotland, the medieval seat of a Gaelic dynasty that rivalled the Scottish crown, contested coastal castles, and two World War One memorials that mark one of the war's strangest maritime disasters. Most of these sites are free, open year-round, and remarkably unvisited. The concentration of significant history within 50 minutes' drive of our Bruichladdich properties is, by any measure, unusual.

### The Oldest Layer: Bunnahabhain Stromatolites

The oldest thing on Islay is also the most improbable. The rock outcrops near [Bunnahabhain Distillery](https://bunnahabhain.com) on the north coast contain fossilised stromatolites — layered structures formed by microbial mats in ancient shallow seas — dating to approximately 1.2 billion years ago. They are among the oldest macroscopic fossils in Britain, preserved in Dalradian quartzite on a working coastline. Park at Bunnahabhain Distillery, walk through the distillery yard to the southern end past the cottages, and take the gate onto the rough coastal path toward Rubha a'Mhill; the first fossilised exposures appear approximately 50 metres after the gate, in boulders of Bonahaven Dolomite along the shore. Best viewed at low tide. Combine with a visit to [Bunnahabhain](https://bunnahabhain.com), [Caol Ila](https://www.malts.com/en-gb/distilleries/caol-ila), or [Ardnahoe](https://ardnahoedistillery.com) for a north coast day that covers 1.2 billion years and a dram in the same afternoon.

### Standing Stones, Cairns, and Hillforts: Islay's Prehistoric Landscape

Before the Lordship, the Lords, and the Early Christian missionaries came something older still. Rubha Port an t-Seilich on Islay's east coast is one of the best-preserved Mesolithic sites in Britain — 12,000-year-old flint tools from the period immediately following the last Ice Age, still visible in the soil for the researchers and archaeologists who return here regularly. Bolsay Farm on the Rhinns adds another chapter: a Mesolithic hunting camp from which over 300,000 flint artefacts have been recovered, now largely held at the [Museum of Islay Life](https://www.islaymuseum.org) in Port Charlotte.

The Bronze Age monuments are harder to miss. The Ballinaby Standing Stones on the northern Rhinns include one stone over four metres tall — difficult to overlook against the Islay skyline. Cultoon Stone Circle near Portnahaven is uniquely strange: fifteen massive stones were laid out in a circle but only two or three were ever raised upright. The project was abandoned mid-construction, leaving a monument to an intention that was never completed. It is one of the more thought-provoking sites on the island. At Dun Nosebridge, an Iron Age hillfort near Mulindry between Bridgend and Ballygrant, the scale of the island's pre-medieval occupation becomes clear. The fort covers 375 square metres and commands 360-degree views of Islay's interior — a short walk from the road, ten minutes from Bowmore. None of these sites charge admission or require booking.

### The Lordship of the Isles: Finlaggan

[Finlaggan](https://finlaggan.com), on the shores of Loch Finlaggan in central Islay, is where the Lordship of the Isles administered its domain from approximately 1150 to 1493. The Lordship was the most powerful Gaelic polity in medieval Scotland — a maritime empire that at its height controlled the Hebrides, much of the western mainland, and the Isle of Man, operating under Gaelic law and a political structure independent of and often in conflict with the Scottish crown. The Lords of the Isles met on Eilean na Comhairle (Council Island), the smaller of Finlaggan's two islands; Eilean Mòr (the great island) held the great hall, chapel, and residence buildings. The Lordship was forfeited to the Scottish crown in 1493 and never re-established. Finlaggan was abandoned and has stood largely undisturbed since. The visitor centre is open from Saturday 5 April, Monday to Saturday 1100–1630, closed Sunday; entry is by donation. The islands are accessible year-round via a short path and causeway. It is 25 minutes' drive from our properties.

### The Kildalton Cross: 8th Century, Still Standing

The Kildalton Cross stands in the graveyard of Kildalton Church on the south-east coast of Islay and has stood there since it was carved, approximately 800 AD. It is a ringed high cross carved from a single block of blue-grey epidiorite, 2.65 metres high, and it is — by the consensus of scholars and the assessment of [Historic Environment Scotland](https://www.historicenvironment.scot/visit-a-place/places/kildalton-cross/) — the finest surviving example of early Christian carved stonework in Scotland, and one of the finest in Europe. The carving includes Old Testament scenes, a Virgin and Child in the central roundel, and interlaced knotwork of exceptional quality. The condition of the carving after 1,200 years in the open Scottish air is remarkable. There is no admission fee, no enclosure, and rarely a crowd. The site is 50 minutes' drive from our properties; the most scenic approach is the [Kildalton Shoreline Walk](/explore-islay/walking) from Port Ellen, which passes [Laphroaig](https://www.laphroaig.com), [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin), and [Ardbeg](https://www.ardbeg.com) on the way.

### Clan Battles and Contested Castles: Kilnave and Dunyvaig

Kilnave Chapel, on the shore of Loch Gruinart, was built in the late 14th or early 15th century and was the site of one of the darkest episodes in Islay's clan history. On 5 August 1598, the Battle of Traigh Gruinart — the last major clan battle on Islay — was fought on the flats below, between the MacDonalds of Islay and the MacLeans of Mull. Thirty MacLean survivors retreated to the chapel; the MacDonalds fired the thatched roof. All died except one man — a Mac Mhuirich — who escaped through a hole in the burning thatch as it collapsed. The ruins remain open to the sky. Standing immediately to the west is a carved stone cross that predates the chapel by roughly 600 years — an unringed 8th-century cross, 3.35 metres tall, comparable in age to the Kildalton Cross but ringless and far more weathered. Dunyvaig Castle, on the south coast near Lagavulin, was a major MacDonald stronghold from the 12th to the 17th century — the naval base of the Lords of the Isles and later the scene of repeated sieges as control of the island passed between MacDonalds, MacLeans, and ultimately the crown. The castle is ruinous and accessible from the Kildalton Shoreline Walk path; do not enter the structure.

### The Round Church and the Cleared Townships

Kilarrow Parish Church in Bowmore — locally called the Round Church — was built in 1767, the only circular church on Islay. The tradition that it was built round to deny the Devil a corner to hide in is almost certainly apocryphal, but the building is genuinely distinctive and still in use as a parish church. Islay's landscape also carries the more painful evidence of its 18th and 19th century history. The island's population fell from approximately 15,000 to 6,000 in the first half of the 19th century through clearances, famine, and emigration. The cleared and abandoned townships are visible across the island, particularly on the Oa peninsula: Tockmal near Soldier's Rock, Grasdale, Frachdale, Lurabus, and Lower Killeyan are among the named settlements the [RSPB The Oa](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa) reserve now covers. Near Ardbeg, the hills hold Solam — the plague village — abandoned after a local tradition holds that an 18th-century epidemic followed a shipwrecked sailor's gift; a plaque on site recounts the story. Near Keills, Kilslevan preserves the outline of eight longhouses and a chapel. The [Museum of Islay Life](https://www.islaymuseum.org) in Port Charlotte holds census records and estate papers documenting the island's depopulated areas.

### The World War One Chapter: The Oa and Kilchoman

On 5 February 1918, the troopship USS Tuscania was torpedoed by a German submarine off the Oa peninsula — the first American troopship sunk in the war — with the loss of around 200 US soldiers. On 6 October 1918, the HMT Otranto collided with another vessel in a storm off the same coast and sank with the loss of over 400, including hundreds of American troops bound for France. Their bodies came ashore on Islay's beaches. The American Monument on the clifftop of the Oa was erected by the American Red Cross in 1920 and is maintained by the Commonwealth War Graves Commission. Kilchoman Military Cemetery, 20 minutes' drive from our properties near Kilchoman Church and [Kilchoman Distillery](https://kilchomandistillery.com), contains the graves of British and American servicemen recovered from both disasters. The two sites together tell the same story from two vantage points: the clifftop monument where the ships went down, and the quiet churchyard where the men were buried.
`;

const VILLAGES_OVERVIEW_MD = `
Islay has six villages of genuinely distinct character, all within 45 minutes' drive of each other. Our three properties — Portbahn House, Shorefield Eco House, and Curlew Cottage — sit on the Loch Indaal shoreline near Bruichladdich, which puts Port Charlotte, Bowmore, and Portnahaven within easy reach on a single morning. The rest of the island opens from there: Port Askaig on the north coast for the Jura ferry, Port Ellen in the south as the gateway to the whisky coast.

### Port Charlotte

Port Charlotte is the village we recommend first to guests and the one most come back to. It was built as a planned village in the early 19th century — a neat grid of whitewashed houses running down to the Loch Indaal shore — and the planning shows: it has a shape and a purpose that most Hebridean villages lack. The [Museum of Islay Life](https://www.islaymuseum.org) is here, one of the better small local museums in Scotland and well worth an hour. The Port Charlotte Hotel has a log fire, over 300 single malts, and live music on Wednesday and Sunday evenings. [Lochindaal Seafood Kitchen](/explore-islay/food-and-drink) — our top restaurant on the island — is on the waterfront. Port Charlotte is a 5-minute drive from our properties, or 40 minutes on foot along the coastal cycle path that passes our front door.

### Bowmore

Bowmore is Islay's main town, set at the head of Loch Indaal where the island's main roads converge. It is functional rather than picturesque — but it is honest, well-stocked, and important to know. The Co-op is the only proper supermarket on the island; the pharmacy and bank are here; Islay's Plaice does reliable fish and chips; Peatzeria does wood-fired pizza in an old church. [Bowmore Distillery](https://www.bowmore.com) sits at the foot of the main street, claimed as Islay's oldest at 1779. At the top of the street, Kilarrow Parish Church (the Round Church, 1767) is one of only a handful of round churches in Scotland — a five-minute stop that repays the curiosity. The [Mactaggart Leisure Centre](https://www.mactaggartleisurecentre.co.uk) has an indoor swimming pool, useful for families on wet days. Bowmore is 15 minutes' drive from our Bruichladdich properties.

### Portnahaven and Port Wemyss

Portnahaven and Port Wemyss are two connected villages at the southern tip of the Rhinns peninsula — a 20-minute drive from our properties along a single-track road that gets quieter and emptier the further south you travel. The harbour at Portnahaven almost always has common seals hauled out on the rocks, often within a few feet of the wall. [An Tigh Seinnse](https://maps.app.goo.gl/Ec4m6CxY1YW1DJJ28) is a small, genuinely local pub with home-cooked food and perhaps 20 seats — the best lunch on the Rhinns outside Port Charlotte. Open year-round; winter hours apply from November. Reservations are required (01496 860725); regular season hours: Thursday to Sunday from noon, Wednesday from 4:30pm, closed Monday and Tuesday. Confirm hours for winter visits. The sense of being at the very end of the road is real. Both villages together are smaller than a single Bowmore street.

### Port Ellen

Port Ellen on the south coast is where the [CalMac](https://www.calmac.co.uk) ferry from Kennacraig arrives for the longer crossing (2 hours 20 minutes), and it marks the start of Islay's most celebrated distillery cluster. [Laphroaig](https://www.laphroaig.com), [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin), and [Ardbeg](https://www.ardbeg.com) are all within a 10-minute drive east along the coast road, and [Port Ellen Distillery](https://www.malts.com/en-gb/distilleries/port-ellen) — one of whisky's most storied lost distilleries — reopened in 2024 after four decades closed. The [Copper Still](/explore-islay/food-and-drink) café by the ferry terminal is our favourite café on the island. SeaSalt Bistro on the waterfront is a good dinner option for south coast evenings. Port Ellen is 45 minutes from our Bruichladdich properties — a south coast day from there is one of the best on the island.

### Bridgend and Port Askaig

Bridgend sits at the head of Loch Indaal where the main island roads meet — not a destination village but a useful crossroads. The petrol pump at Bridgend Village Stores is one of the island's most important landmarks when your tank is running low. The Lochside Hotel has a bar and food. Port Askaig on the north coast is the other ferry terminal — faster crossing from Kennacraig (2 hours), closer to the north coast distilleries, and the departure point for the 5-minute Jura ferry. The Port Askaig Hotel bar is worth knowing; there is little else at Port Askaig. Both are practical stops on an island where practicality is part of the plan.
`;

const JURA_LONGER_STAY_MD = `
For those wanting to explore Jura properly (and we really do recommend it!), a longer stay gives you so much more, with experiences you simply can't fit into a day:

### Barnhill & George Orwell

At the remote northern tip of Jura, Barnhill is where George Orwell wrote 1984 in 1946-48. The house still stands (a private house still owned by the Fletcher family — please do respect their privacy), and the journey to reach it — 25 miles of single-track road, the last 4 miles a rough track that must be walked — is an adventure in itself. For literary pilgrims it's a great excuse to head north.

### Corryvreckan Whirlpool

The third largest whirlpool in the world churns between Jura and Scarba. Visible from the northern tip of Jura, it's most dramatic at certain tides. Orwell nearly drowned here in 1947 — nearly losing the manuscript of 1984 in the process. Boat trips from Robert at Jura Boat Tours will take you right up close and are a dramatic way to experience the island and regularly spot eagles and dolphins.

### Climb a Pap

The three Paps of Jura (Beinn an Oir is the highest at 785m) are serious hill walks — not technical climbing, but hard going with no paths and often a scramble over bog and rock. They are steep and remote. But a clear day rewards you with views to Ireland, Mull, and the mainland. Not for novices, but achievable for fit hikers. Leave a full day and let someone know the route you are taking.

### Jura's West Coast

Jura's Atlantic west coast is one of Britain's wildest landscapes — raised beaches, caves, no roads, no people. Walking it requires planning and fitness, but it's genuinely remote in a way few places in Britain can match. It takes about a week to do tip to tip. If you want a taste of the west coast, it can be accessed at Tarbert in the middle of Jura, down a track leading from the main road to the head of Loch Tarbert, the huge bite out of Jura's west coast. There is also a track that heads north from Feolin past Inver Estate lodge that gives easy access to the west coast in about an hour or so's walking.

### K Foundation Burn A Million Pounds

For pop culture pilgrims: the boathouse where the KLF's Bill Drummond and Jimmy Cauty burned £1 million in 1994 is on Jura's Ardfin Estate, now a private golf course (the irony!). Scotland's Right to Roam laws do allow access, but be sensitive.

### Wildlife

Red deer are everywhere — you'll see dozens daily. Eagles soar over the Paps. Seals and otters inhabit the coastline and are regularly seen around Small Isles Bay.

### The Pace

Even slower than Islay. One shop, one hotel, one pub, two distilleries. If you want true escape, this is it.

Consider combining a few days on Jura with your Islay stay — we have accommodation with hot tubs and saunas at [Bothan Jura Retreat](https://www.bothanjuraretreat.co.uk) and can help you plan a multi-island trip.
`;

const BOTHAN_JURA_TEASER_MD = `
We also own and manage [Bothan Jura Retreat](https://www.bothanjuraretreat.co.uk) on Jura — a passion project we built from scratch from an acre of bog and an old ruined cottage. We created it as the kind of place we'd want to escape to ourselves.

### The Accommodation

Mrs Leonard's Cottage — Old stone renovated cotters' cottage, sleeps 2. The original cottage that has sat here for over a century, braced against the Hebridean squalls and winters, now restored to snug comfort.

The Rusty Hut Lodge — Cosy corten steel and timber, sleeps 2. Clad in beautiful rusted Corten steel like the old farm buildings around Knockrome; the old boards from Southport Pier line one wall, with oak floorboards on the floor.

The Black Hut Cabin — Contemporary minimalist space, sleeps 2. Birch plywood simplicity with a handmade kitchen by our Welsh joiner Shaun.

The Shepherd's Hut — Off-grid glamping, sleeps 2.

Each unit is designed for couples or solo travellers seeking genuine remoteness and has its own wood-fired hot tub. Mrs Leonard's Cottage also has a sauna.

### The Experience

- Hot tub under the stars at the foot of the Paps
- Sauna to warm up after wild swimming or hill walking
- Fire pit for evening relaxation
- Location — Dramatic landscape, red deer wandering past, the Paps towering above, Corran Sands at the bottom of the drive

### Character

We've built Bothan Jura Retreat over eight years with a lot of love and time and passion. We live here too. These are places we'd want to stay.

If you want wilderness and enjoy attention to detail — cosy but wild — you'll probably love it here. We've tried to make this place a part of ourselves: simple, beautiful, contemporary accommodation in one of Scotland's most remote landscapes.

### Getting There

To get to Jura takes two ferries from the mainland (first to Islay, then to Jura), or fly to Islay then ferry. The journey is absolutely part of the experience and that final 5-minute leg on the wee ferry always feels special.

From March to the end of September the Jura Passenger Ferry also runs twice daily directly between Tayvallich on the mainland and Craighouse on Jura.

If Islay fills up or you're looking for even more remoteness, or an experience of two very different islands, consider splitting your trip between both islands. Get in touch and we'll help you create an Islay-Jura multi-island trip.

[Visit Bothan Jura Retreat →](https://www.bothanjuraretreat.co.uk)
`;

const WALKING_OVERVIEW_MD = `
Islay rewards walkers at every level - from the flat coastal path that runs directly from our Bruichladdich properties to full-day circuits on the Oa peninsula and the exposed north coast. The island's walking is genuinely varied: shoreline paths, RSPB reserves, moorland, ancient island ruins, and Atlantic dune beaches you'll often have to yourselves. Most of the walks guests ask us about require no specialist equipment - sturdy footwear, layers, and waterproofs are the essentials on Islay whatever the weather.

What follows are the walks we actually recommend, roughly in order of how far you'll need to drive from our properties to reach them.

### 1. Bruichladdich Coastal Path to Port Charlotte

The coastal path to Port Charlotte starts outside the front door and runs 3 miles south along the Loch Indaal shoreline. The full walk takes 40 minutes each way, the path is tarmac and flat the whole way, and it is suitable for all abilities including pushchairs. From our properties, head south along the shared-use coastal cycle path past Bruichladdich Pier - a good spot for crabbing at low tide - and continue through the village past the war memorial and ferry slip. Port Charlotte comes into view after about 40 minutes, with the [Museum of Islay Life](https://www.islaymuseum.org), the [Lochindaal Seafood Kitchen](/explore-islay/food-and-drink), and the Port Charlotte Hotel all a short walk from the path. Return the same way or take the B8018 road for variety. Portbahn Beach is a 5-minute detour off the coastal path via the war memorial path - a set of three sheltered coves that are one of Islay's quietest spots. See our [beaches guide](/explore-islay/islay-beaches) for more on Portbahn Beach.

### 2. The Oa (RSPB Reserve)

The Oa peninsula forms Islay's dramatic south-western tip, about 35-40 minutes' drive from our properties - drive south through Bridgend and Port Ellen, then take the Oa road, following signs to the [RSPB The Oa](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa) reserve car park at PA42 7AU. From the car park, the American Monument is a 20-minute walk along a well-marked path with boardwalk sections across the wetter ground. The full Mull of Oa circular route covers 2.2 miles and takes 1-1.5 hours - allow a full morning or afternoon including travel time. The American Monument is a memorial erected after World War One to the hundreds of US soldiers drowned when the troop ships Tuscania and Otranto were lost off the Oa in 1918 - it stands on the clifftop above the very spot where the Tuscania sank. On a clear day views extend to Ireland, the Kintyre Peninsula, and across Islay's south coast. Look out for choughs (red-billed crows - Islay has one of the UK's strongest populations), fulmars on the cliff ledges, and the chance of eagles hunting the moorland above the car park. The Oa is one of Islay's most exposed locations - conditions on the clifftops change quickly. Go well layered up with waterproofs even if the car park looks fine.

### 3. RSPB Loch Gruinart Reserve

[RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) is about 20 minutes' drive from our properties, heading north on the B8017. The reserve's visitor centre at Aoradh Farm has a car park, toilets, and hot drinks, and the Woodland Trail (1 mile/1.5km) runs from there to the viewing platform and hides overlooking the flooded fields and the tidal inlet of Loch Gruinart. The route to the viewing platform is suitable for most abilities, and visitors with mobility difficulties can call ahead to arrange closer vehicle access to the first hide. From October to April, the morning flights of barnacle and white-fronted geese are one of Islay's most extraordinary wildlife spectacles - as many as 24,000 geese have been counted on the reserve at once. Year-round, the hides give excellent views of waders, wildfowl, and raptors. For the full wildlife picture, see our [wildlife guide](/explore-islay/islay-wildlife).

### 4. Finlaggan (Loch Finlaggan)

Loch Finlaggan is about 25 minutes' drive from our properties - take the B8016 east from Bruichladdich towards Bridgend, then follow signs from the A846 at Ballygrant. The walk from the visitor centre car park to the island ruins is 15-20 minutes return across a flat path and causeway to Eilean Mòr in the loch, and is accessible for most abilities. The visitor centre (open April to October, Monday to Saturday, 11:00-16:30; the historic site is accessible 24/7) has an excellent introduction to the history. [Finlaggan](https://finlaggan.com) was the administrative and ceremonial seat of the Lordship of the Isles from the 12th to 16th centuries - the most powerful Gaelic dynasty in Scotland, controlling much of the Western Isles and western mainland from this island on Islay. The ruins are atmospheric and undervisited compared to Islay's south coast, and the loch setting is genuinely beautiful. Worth combining with the drive to [Ardnahoe](https://ardnahoedistillery.com) or [Bunnahabhain](https://bunnahabhain.com) distilleries for a full north Islay day.

### 5. Singing Sands (Tràigh Bhan)

Singing Sands - Tràigh Bhan in Gaelic - is a secluded beach near Port Ellen where the dry sand emits a quiet squeaking sound underfoot when disturbed, caused by the particular size and roundness of the grains. Access is from the Oa road south of Port Ellen: free parking by the cemetery at grid reference NR343455. From the car park, the path follows the coast around the headland to reach the beach - allow 45-60 minutes return. The beach is family-friendly and rarely crowded. The drive from our properties is approximately 30-35 minutes.

### 6. Machir Bay and Kilchoman

Machir Bay on Islay's Atlantic west coast is one of the island's most spectacular beaches - 2 miles of golden sand backed by dunes - and can be reached in about 20-25 minutes' drive from our properties via Bruichladdich and Kilchoman village. Park near [Kilchoman Distillery](https://kilchomandistillery.com) at the end of the road. Kilchoman Distillery is immediately beside the car park and is Scotland's only barley-to-bottle farm distillery - the café does excellent lunches and the distillery is worth a visit in its own right. The beach walk south from the car park through the dunes to the bay and back is easy going and the scale of the beach is remarkable - on a clear day, it feels like the end of the world in the best possible sense. One essential safety point: Machir Bay and Saligo Bay to the north are not safe for swimming. Both beaches carry extremely strong rip currents at all states of tide. Walk them, photograph them, but do not enter the water. For swimming, our [beaches guide](/explore-islay/islay-beaches) covers the safe options - Portbahn Beach and Port Charlotte Beach are both within 5-40 minutes of our properties.

### 7. Ardnave Point

Ardnave Point on Islay's north coast is about 25-30 minutes' drive from our properties - head north on the B8017 towards Loch Gruinart, pass the RSPB visitor centre at Aoradh Farm, and continue 360 metres on the minor road north of the visitor centre to the grass car park at the south end of Ardnave Loch. The walk north along the Ardnave peninsula to the beach at the point is approximately 1.5km one way along a sandy track - relatively flat and straightforward. Ardnave Loch borders the track on the left as you head out and is worth scanning for ducks, waders, and the possible remains of an ancient crannog on the far shore. The peninsula narrows to a beach at Ardnave Point with big Atlantic views west to Colonsay and Oronsay. One of Islay's less-visited walking areas, Ardnave is excellent in winter for barnacle geese and choughs, and good for waders year-round. Combine with an early morning at [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) for a full north Islay wildlife day.

### Walking on Jura

Walking on Jura - the Paps of Jura, the Barnhill route, and Jura's wild Atlantic west coast - is a separate world. Jura is 5 minutes by ferry from Port Askaig, and our three Bruichladdich properties are about 30 minutes' drive from Port Askaig. See our [Visit Jura guide](/explore-islay/visit-jura) for everything you need to plan a Jura walking day or longer stay. If you're considering climbing one of the Paps, plan for a full day and let someone know your route - they are serious hill walks, not a casual afternoon.
`;

const ABOUT_US_MD = `
We're Pi and Lynton, and we've been welcoming guests to Islay since 2017. We started by letting out our own family home, Portbahn House, and now manage three properties in Bruichladdich — each one with its own story and character.

[Portbahn House](/accommodation/portbahn-house) was our family home for years. Our books are still on the shelves, our children's games still in the cupboards. [Shorefield](/accommodation/shorefield-eco-house) is the Jacksons' creation — they built it with love, planted every tree, created the bird hides, and filled it with their art, books and curios from their travels. [Curlew Cottage](/accommodation/curlew-cottage) is our friend Alan's family holiday getaway, now opening to guests for the first time.

These aren't purpose-built holiday lets — they're real family homes with personality. We manage them the way we'd want our own homes looked after: with care, attention, and a genuine interest in making your stay really memorable.

We now live on Jura (one more ferry away!), where we built [Bothan Jura Retreat](https://www.bothanjuraretreat.co.uk) from scratch — the kind of place we'd want to escape to ourselves. A hot tub in each space at the foot of the Paps, under the stars.

We've raised our two children here on the islands, so we know what a special place this is for families. We know the beaches, the walks, the rainy day escapes, the wildlife moments that stick with you. We love to share all of it.

We try to create the sort of places we like to stay when we go away — a genuine home from home. That's always been our philosophy, and guests tell us it comes through in the way we manage our properties and communicate throughout the booking process and help with any problems.

If you have any questions about Islay, Jura, our properties, or anything else — just get in touch. We love helping guests plan their trips.

Pi, Lynton and Amba
`;

const TRUST_SIGNALS_MD = `
### Our Numbers

- 600+ guests since 2017
- 4.97/5 average rating across platforms
- Airbnb Superhost status
- 5.0/5 communication rating
- 30+ reviews specifically mention our ferry crisis support

We've never had a booking collapse due to CalMac disruptions. Guests say we're legendary at helping them navigate Islay travel challenges, and we're genuinely proud of that track record.

### What Guests Say

"Home from home — we felt welcomed from the minute we stepped in." — Sarah & Family, [Portbahn House](/accommodation/portbahn-house)

"Better than the pictures. The house has a story, and Pi looked after us like family during the ferry chaos." — James & Emma, [Shorefield](/accommodation/shorefield-eco-house)

"Like a big hug — exactly what we needed after a stressful journey. Pi's support was incredible." — Louise, [Shorefield](/accommodation/shorefield-eco-house)

Some guests return year after year. They recommend us to friends. They describe our homes as "exactly what you'd want from Islay." That's what we hope for every time of course. We really do want you to enjoy our homes as much as we have and experience the best these two islands have to offer.

### What Makes Us Different

Real family homes, not rentals

These aren't purpose-built AirBnBs. They're homes with history, personality, and owners who care about them. We manage them with that same care.

Legendary ferry & travel support

[CalMac](https://www.calmac.co.uk) disruptions happen. When they do, we've got your back. Guests consistently say our communication and crisis support are outstanding — 30+ reviews mention it specifically.

Local knowledge & recommendations

We know Islay and Jura inside out and have lived on both islands with two children growing up. Our favourite beaches, distillery tours, restaurants, walks — we love to share all of it. You're not just renting a property; we hope you're getting a bit of our local expertise too. And if we don't know something, we can certainly tell you who does!
`;

const FERRY_SUPPORT_MD = `
Don't panic — here's the reality: Because we live here, we know the ropes. We've helped dozens of guests navigate [CalMac](https://www.calmac.co.uk) disruptions over the years. We hold a 5.0/5 communication rating on Airbnb, and 30+ reviews specifically mention our ferry crisis support! One guest wrote: "Pi looked after us like family during the ferry chaos." We've got you!

If your crossing is disrupted, you're not alone. But plan well ahead, watch the weather, get ferry alerts and stay in touch!

### Why Cancellations Occur

Weather is the main culprit — wind gusts above 40-45mph can prevent safe boarding or crossing. CalMac also occasionally suspends sailings due to mechanical issues (the fleet is ageing) or industrial action. Winter months see more disruptions than summer, but cancellations can happen any time of year.

Be prepared: call ahead, keep an eye on the weather, and sign up for [CalMac travel alerts](https://www.calmac.co.uk/travel-information/disruptions).

### What to Do If Your Ferry is Cancelled

- CalMac will contact you via text or email if they cancel your sailing
- Call CalMac immediately on 0800 066 5000 to rebook onto the next available sailing
- Contact me — I can offer advice or flexible check-in arrangements and possibly additional accommodation if needed
- Sign up for live updates by texting "calmac subscribe 09" to 60030 for ferry status alerts

### Flexible Tickets

If you book "flexi" tickets (slightly more expensive than standard), you can change your sailing without penalty. This provides peace of mind if you're worried about disruption, particularly for winter bookings.

### Travel Insurance

We very strongly recommend travel insurance that covers ferry cancellations. Weather disruptions are a part of island life. Check what your insurance protects regarding this and your accommodation costs if you cannot reach Islay on your planned dates. Most travel policies include "delayed departure" cover.

We cannot refund your accommodation costs if your ferry is disrupted or you miss it, unfortunately, so make sure you're properly covered!

### Our Commitment

If ferry disruption affects your arrival or departure, contact me immediately. We can usually accommodate late arrivals or adjust check-out times, or even put you up at one of our other properties for an extra night. In 8+ years of hosting hundreds of guests, we've never had a booking completely collapse due to CalMac — there's always a solution, even if it means thinking outside the box!
`;

const FERRY_BASICS_MD = `
Travel to Islay is not straightforward. You don't come to the Scottish islands if you want easy! You come because of the adventure and for an experience you can't get on the mainland.

Make the journey part of the experience. Twenty minutes outside Glasgow, after you pass Dumbarton, you're at Loch Lomond and from there you have two hours of some of the most beautiful scenery on earth, followed by a two-hour ferry journey to unwind.

We now live on Jura (a second ferry journey away!), but lived on Islay for a few years before that. We're very familiar with all the ins and outs of getting on and off the islands and dodging winter storms or summer rushes. We've been helping hundreds of guests make their trip successfully since we first let out our own home, Portbahn House, in 2017 — so if you have any questions or fears, do just get in touch.

### By Ferry from Kennacraig

The Isle of Islay is accessible by [CalMac](https://www.calmac.co.uk) ferry from Kennacraig on the Kintyre Peninsula to two ports — Port Ellen (2 hours 20 minutes) and Port Askaig (2 hours). Both ports are approximately 30-40 minutes' drive from our Bruichladdich properties. You have to book a ferry to a specific port rather than just to "Islay" — which port will depend on what time you're travelling. The crossing offers beautiful views across the Sound of Jura.

Vehicle reservations are absolutely essential and should be booked up to 12 weeks in advance, especially during peak season and [Fèis Ìle](https://www.feisile.co.uk) (the whisky festival) in late May. We can't emphasise this enough. Book your ferry as soon as you book your accommodation if you can.

A really important note: if there isn't the exact crossing you want, book the closest you can — ferry bookings change daily and if you have enough time before you travel you'll almost certainly be able to change it. But get a reservation in the system!

### Which Port to Choose?

Port Askaig is marginally closer to Bruichladdich (25 minutes vs 40 minutes from Port Ellen), but both routes work equally well and the choice of port will be dictated by the sailing times, so don't worry overly. Check which sailing times suit your schedule — Port Ellen and Port Askaig ferries operate on different timetables throughout the day.

### By Air from Glasgow

[Loganair](https://www.loganair.co.uk) operates daily flights from Glasgow to Islay Airport, with the flight taking approximately 25 minutes. Two flights typically operate daily (one on weekends), first thing in the morning and at around 5pm. Islay Airport is 30 minutes' drive from our properties. This option suits travellers preferring speed over scenery, though the ferry crossing itself is such a special part of the island experience.

While the ferries are disrupted by wind, it's low cloud that disrupts the flights. Islay Airport doesn't have the radar required to allow landing in poor visibility — the pilots must be able to see the runway clearly. A general rule of thumb: if you can see the other side of Loch Indaal, the plane can land. If you can't, it won't! This can mean some strategic planning — low cloud, get the ferry; high winds, take the plane. If you're not sure, get in touch and we'll help.

### What to Expect on the Crossing

Arrive at Kennacraig ferry terminal at least 30-45 minutes before departure or you risk being placed in the standby queue — they are strict! Once you drive onto the ferry, leave your car and head upstairs to the passenger lounges — you cannot remain in your vehicle during the crossing. Pets are allowed aboard on the passenger deck.

Foot passengers, head to the main CalMac office or see one of the stewards who will point you towards the ramp onto the ferry.

The ferry has an excellent restaurant serving really good quality hot food, locally sourced wherever possible (including Jura's own Kirsty's pies!), along with basic snacks and drinks (including Islay whisky and gin of course). We always plan to have our main meal on the ferry home!

Most guests find the crossing relaxing rather than rough. If it's very rough they don't sail. On clear days, views of the Paps of Jura and the Kintyre coastline are spectacular — you pass by Gigha, and it's not uncommon to spot seals, occasionally dolphins, and you regularly see the giant Lion's Mane jellyfish from the deck. One guest recently said, "The crossing was part of the holiday" — something we hear quite often!

If you're prone to motion sickness, head out onto the deck and stare straight at the horizon — seems to work best! Or if you're inside, sit near the centre of the vessel on the lower passenger deck where movement and roll is minimised. Try to avoid reading or looking at screens — focus on the horizon instead, or close your eyes. The café sells basic remedies, but bring your own travel sickness pills (Stugeron, Kwells or Dramamine) if you want something stronger.

### Planning Your Journey

Your journey to Islay typically represents a full travel day, so plan on that and enjoy it. From Glasgow, expect minimum 5-6 hours door-to-door via ferry (3 hours driving to Kennacraig + 2½-hour crossing + onward travel). Stop at Loch Lomond for a picnic, at Loch Fyne for seafood lunch (with an amazing garden centre and café next door!), or at historic Inveraray with its jail and castle.

We recommend treating your first and last days as travel days rather than packing in activities. A week-long stay gives you 5 genuine activity days. Our guests who book for 7+ nights consistently tell us they wish they'd had longer.

Book your [CalMac](https://www.calmac.co.uk) ferry crossing at calmac.co.uk — vehicle reservations open up to 12 weeks ahead. Book as soon as your accommodation is confirmed.
`;

const PORTBAHN_BEACH_MD = `
Portbahn Beach is our hidden gem — literally 5 minutes from our door via the war memorial path. It's three small, sheltered bays tucked into the coastline with stunning views across Loch Indaal. Safe for swimming, perfect for rock pooling with kids, and you'll almost always have it entirely to yourselves.

There's rarely any tidal flow in Loch Indaal, making it very safe, but still plenty of rock pools and places to go crabbing. The water around Islay is cold (10-14°C typical), but it's sheltered enough for a quick dip if you're brave. One guest wrote: "Better than the pictures — we had breakfast on Portbahn Beach every morning and saw seals."

This is genuinely one of Islay's best kept secrets, and it's our local spot — so pretty much yours to explore at will from the moment you arrive! For all our recommended beaches on Islay, see the [beaches guide](/explore-islay/islay-beaches).
`;

const SHOREFIELD_CHARACTER_MD = `
Shorefield is the Jackson family's old family home — their personality is everywhere, and we're privileged to look after it for them. They built this eco-house to include wind and solar power well before it was popular, planted every tree on the property, created the wetlands and bird hides, and filled the house over the years with paintings, books, and curios from their travels around the world.

It's quirky, full of personality, well worn and well loved over years of family use. This isn't a styled rental; it's a real family home. If you prefer bright, modern open-plan simplicity, [Portbahn House](/accommodation/portbahn-house) would probably suit you better. But if you value character, cosiness, and a house that feels like "a big hug" (as one guest said!), Shorefield really does make a wonderful stay. We love spending time here ourselves in the winter gardening and looking after the place.

The house is stocked with binoculars, bird books, and wildlife guides from the Jacksons' collection, along with their own sketches and watercolours. The garden, woods behind the house and wetland ponds attract plentiful birds, and the loch views offer opportunities to watch waterfowl and sea birds without leaving the property.

Over 90% of guests have told us they genuinely love the quirky charm and personal touches — it's what makes Shorefield special!

### Woodlands, Wetlands and Bird Hides

Shorefield has something unique: woodlands, wetland ponds and bird hides created by the Jackson family, who were passionate birders. They planted the trees, created the wetlands, and built the hides specifically for wildlife watching. Even if bird watching isn't your thing, kids love getting lost in the woods behind the house, playing hide and seek, making dens and creating adventures.

If you're a birder or nature lover, Shorefield offers something you won't find at a typical holiday rental — it's a family home built around a love of wildlife and nature. See our [wildlife guide](/explore-islay/islay-wildlife) for what to look out for on Islay.
`;

const LOCH_GRUINART_OYSTERS_MD = `
Loch Gruinart is one of Islay's most remarkable places — a tidal loch on the northern Rhinns that functions simultaneously as an [RSPB nature reserve](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) for migratory barnacle geese and the source of some of the finest oysters in the UK. The [Oyster Shed, Islay](https://maps.app.goo.gl/AxkjF3pTQdVvwRhG7) sits at the loch's edge and sells freshly shucked oysters direct to visitors, with a small restaurant serving lunch Thursday to Saturday.

The cold, clean, nutrient-rich tidal waters of Loch Gruinart give the oysters a distinctly briny, clean flavour. Atlantic water, filtered through Islay's peat landscape and driven by strong tidal flow, creates near-ideal growing conditions. We'd back Loch Gruinart oysters against any in Britain — Whitstable included. The Times agreed.

The Oyster Shed opens Thursday, Friday and Saturday, 10am–3pm. Lunch is served 11:30am–2:30pm (last orders). Table booking is advisable — call 07376 781214 for all enquiries and reservations.

Loch Gruinart is 20 minutes' drive from our properties in Bruichladdich. The combination of the RSPB reserve and the Oyster Shed makes it one of the best half-days on the island. In winter, arrive at dawn to watch 30,000+ barnacle geese lift from the loch. Come back Thursday to Saturday for oysters at the shed. If you time it right, you can do both on the same day.

Contact: 07376 781214 — call to book and to check opening before travelling. @oystershed_islay on Instagram for current updates.
`;

// Updated food-drink with An Tigh Seinnse Google Maps link
const FOOD_DRINK_ISLAY_MD = `
Islay's food scene emphasises local seafood, lamb, venison and whisky. Dining out generally isn't cheap, but quality is high. Most guests cook meals in our well-equipped kitchens as well and eat out selectively. Here's where we recommend:

**Our Top Recommendations**

**Lochindaal Seafood Kitchen, Port Charlotte**
Lochindaal Seafood Kitchen is truly exceptional, run with huge heart by Jack and his father Iain — seafood platters from the local fishermen's catch, featuring local oysters, langoustines, crab, and mussels among others. You do need to order the full platter 24 hours ahead, but it's really worth planning around. Small, cosy venue in Port Charlotte with two bars. Book ahead — it fills fast. Our guests consistently rave about this place. Also a great whisky selection if you just want to drop in for a pint or a dram.

**Port Charlotte Hotel**
Scottish fare and an outstanding whisky bar with 300+ bottles on their single malt menu. The restaurant takes bookings (advised), but the bar is walk-in. Good Sunday roasts. Traditional Scottish live music on Wednesdays and Sundays is popular and a lovely way to spend an evening by a roaring log fire, dram in hand. We send guests here regularly, and they're never disappointed.

**[An Tigh Seinnse, Portnahaven](https://maps.app.goo.gl/Ec4m6CxY1YW1DJJ28)**
Traditional little village pub at the end of the Rhinns, with home-cooked food and local charm in possibly Islay's most remote coastal village. Small, authentic, popular with locals and visitors. Book ahead — it's worth the 20-minute drive from Bruichladdich. You can nearly always spot seals in Portnahaven harbour, just outside the pub.

**Food and Drink in Bowmore**

- Peatzeria, Bowmore — Creative wood-fired pizzas with Islay twists — toppings include local lobster, scallops, and whisky-infused sauces. Casual, family-friendly, good for a relaxed dinner.
- The Cottage, Bowmore — Burgers, fries, jacket potatoes, and good comfort grub.
- Islay's Plaice, Bowmore — Fresh fish and chips cooked perfectly by Andy and Islay!
- Bowmore town centre — Chinese and Indian takeaways, bakery, butcher. Useful for stocking up or grabbing quick meals when you don't want to cook or book ahead.

**Food and Drink in Port Ellen**

- The Copper Still, Port Ellen — Amazing home-roasted coffee, handmade deli sandwiches, cakes, soup and the best brownies on the planet; run with love by Mari and Joe; by the ferry terminal.
- SeaSalt Bistro, Port Ellen — Pizza, pasta, seafood and steaks on the Port Ellen waterfront.

**Distillery Cafés**

- [Ardbeg](https://www.ardbeg.com) — great café, excellent lunch stop on any south coast distillery day
- [Ardnahoe](https://ardnahoedistillery.com) — visitor centre with food & drinks, great views across the Sound of Islay
- [Kilchoman](https://kilchomandistillery.com) — café at the farm distillery, excellent for lunch

**Groceries & Self-Catering**

**Aileen's Mini-Market, Bruichladdich** (5-minute walk from our properties)
Coffee, bacon rolls, newspapers, basic groceries, post office. We love Aileen and our guests absolutely rave about this place — start your morning here with a coffee and bacon roll, particularly after a heavy day of distillery tours! Aileen's (known locally as Debbie's!) is a Bruichladdich institution.

**Co-op, Bowmore** (15-minute drive)
The biggest "supermarket" on Islay — small but sufficient, with fresh produce, meat, alcohol, household supplies. This is your main grocery stop for stocking the kitchen.

**Co-op, Port Ellen** (45-minute drive)
Another smaller Co-op supermarket on the seafront at Port Ellen stocking essentials.

**Port Charlotte Stores** (5-minute drive from our properties)
All-round basic shop, post office and petrol pump for essentials.

**Jean's Fresh Fish Van**
Visits villages weekly — check local schedules. Fresh local fish and seafood delivered to your door essentially.

**Dining In**
Most guests tend to cook several meals during their stay. Our kitchens are fully equipped with everything you need if that's your preference. Dining out every night adds up quickly on Islay — expect £40-60 per person for dinner with drinks.
`;

// ─── Guide Page Editorials ────────────────────────────────────────────────────

const ARCHAEOLOGY_EDITORIAL_MD = `
### Planning an Archaeology and History Day on Islay

Islay's heritage sites are spread across the island, which means the best approach is to pair them with other activities on the same route rather than making each a standalone trip. Three natural combinations work well:

The Lords of the Isles day (central Islay): [Finlaggan](https://finlaggan.com) in central Islay is 25 minutes from our properties — half a day including the walk to Eilean Mòr and time at the visitor centre. On the same road east, [Bunnahabhain Distillery](https://bunnahabhain.com) is 30–35 minutes north, and the stromatolite outcrops are walkable from the distillery car park. [Caol Ila](https://www.malts.com/en-gb/distilleries/caol-ila) and [Ardnahoe](https://ardnahoedistillery.com) distilleries are on the same north coast route. Combine Finlaggan with one or two north coast distilleries for a full day that covers medieval history, geology, and whisky.

The south coast cluster (Kildalton): The Kildalton Shoreline Walk connects Port Ellen with [Laphroaig](https://www.laphroaig.com), [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin), [Ardbeg](https://www.ardbeg.com), and the Kildalton Cross in a single linear route — distilleries and an 8th-century carved cross on the same coastal walk. The cross and the ruined Kildalton Chapel are at the eastern end; Dunyvaig Castle ruins are visible from the path near Lagavulin. A south coast day combining three distilleries and two heritage sites is genuinely excellent. See the [walking guide](/explore-islay/walking) for the route.

The WW1 day (west coast and Oa): [Kilchoman Military Cemetery](https://kilchomandistillery.com) is on the west coast of Islay, 20 minutes from our properties — 5 minutes from [Kilchoman Distillery](https://kilchomandistillery.com) and café. The American Monument on the Oa is 35–40 minutes further south. Both sites commemorate the same 1918 disasters — the Tuscania and Otranto troopships — and visiting both in a single day gives a more complete picture of the event than either alone. Start at Kilchoman (morning, distillery and cemetery), drive south, walk the Oa to the American Monument (1–1.5 hours), and return via Port Ellen for The Copper Still café.

### The Lords of the Isles: Why Finlaggan Matters

[Finlaggan](https://finlaggan.com) is not well known outside Scotland, and even within Scotland it is undervisited. That is partly its appeal. The Lordship of the Isles, which administered its domain from the islands of Loch Finlaggan between approximately 1150 and 1493, was the last major Gaelic polity in Scotland — a maritime empire that at its height controlled the Hebrides and much of the west coast under a system of Gaelic law and administration separate from the Scottish crown. The Council of the Isles met on Eilean na Comhairle (Council Island), the smaller of Finlaggan's two islands. The larger island, Eilean Mòr, held a chapel, a great hall, and the buildings of the Lordship. After the forfeiture of the Lordship in 1493, Finlaggan was abandoned and has remained undisturbed. The visitor centre is open from Saturday 5 April, Monday to Saturday 1100–1630, closed Sunday; entry is by donation. The islands are accessible year-round via a short path and causeway.

### The Kildalton Cross: Context for Visitors

The Kildalton Cross stands in the graveyard of Kildalton Church on the south-east coast of Islay, roughly 8 miles east of [Ardbeg](https://www.ardbeg.com), and has stood in that location since it was carved in approximately 800 AD. It is a ringed high cross carved from a single block of blue-grey epidiorite, standing 2.65 metres high. The quality and condition of the carving — Old Testament scenes on the west face, interlaced knotwork on the east, a Virgin and Child in the central roundel — is exceptional for its age and outdoor situation. It is one of only two surviving 8th-century ringed high crosses in Scotland and is listed by [Historic Environment Scotland](https://www.historicenvironment.scot/visit-a-place/places/kildalton-cross/) as a Scheduled Monument. The site is open year-round, free, and rarely crowded. The Kildalton Shoreline Walk from Port Ellen (see [walking guide](/explore-islay/walking)) provides the most scenic approach; driving directly from Port Ellen to Kildalton takes about 20 minutes on a single-track road.

### Islay Archaeology Week and Active Research

Islay Archaeology Week, usually held in August, is the best opportunity for visitors to access active excavations and meet the researchers. The event is organised by Islay Heritage — the local charity that also runs ongoing research excavations at Dunyvaig Castle and, until recently, at Rubha Port an t-Seilich on the east coast. Dig days typically include guided walks to current excavation sites, public talks, and volunteer taster sessions. The Council for British Archaeology Festival (2026: 18 July–2 August) may also include Islay-specific events. Check the [Museum of Islay Life](https://www.islaymuseum.org) and Islay Heritage websites for the current programme closer to the date.

### Access Practicalities

Most heritage sites on Islay are free to visit and require no booking. Finlaggan visitor centre is open from Saturday 5 April, Monday–Saturday 11:00–16:30, closed Sunday; entry is by donation (tel: +44(0)1496 840 644). The islands are accessible at any time. The American Monument is reached via a 20-minute walk from the [RSPB The Oa](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa) reserve car park at PA42 7AU — the car park has information boards and picnic tables. Kilchoman Military Cemetery is immediately adjacent to the public road at Kilchoman Church — no walking required. The Kildalton Cross and Kildalton Chapel graveyard are accessible year-round from the road end at Kildalton. Dunyvaig Castle is viewable from the Kildalton Shoreline Walk path — do not attempt to enter the ruined structure. Bunnahabhain Stromatolites are accessible from the distillery car park: walk through the distillery buildings toward the southern end, pass the gate beyond the distillery cottages, and follow the rough coastal path toward Rubha a'Mhill — the first exposures appear approximately 50–100 metres after the gate on the exposed shoreline. Grid reference NR 4294 7021 (approx. 55.883, -6.123). Best at low tide.
`;

const VILLAGES_EDITORIAL_MD = `
### Getting Oriented: The Rhinns and the Rest of the Island

Most guests staying in our Bruichladdich properties spend the first day or two on the Rhinns peninsula — the hammer-shaped landmass that forms the western side of Islay and is home to Bruichladdich, Port Charlotte, and Portnahaven. The Rhinns runs roughly north to south, with Bruichladdich and Port Charlotte on the eastern shore of Loch Indaal and Portnahaven at the foot. The peninsula has a different pace from the rest of the island — quieter roads, fewer visitors, and the particular feeling of being at the edge of things. Port Charlotte is the most visited village on the Rhinns; Portnahaven is the most remote.

For the rest of the island, Bowmore is the natural hub — most practical errands (Co-op, pharmacy, bank) happen there, and [Bowmore Distillery](https://www.bowmore.com) on the main street makes it a natural stop on any distillery day. Bridgend, at the head of Loch Indaal where the main island roads meet, is a useful refuelling and provisions point rather than a destination in itself — the petrol pump at Bridgend Village Stores is important to know about on an island with limited options. Port Askaig on the north coast is a functional stop: ferry terminal, Port Askaig Hotel bar, and the turning for Caol Ila and Bunnahabhain distilleries. Port Ellen on the south coast is the island's other major port and the anchor for any south coast day.

### Port Charlotte: The Rhinns' Best Village

Port Charlotte was built as a planned village in the early 19th century — neat white-painted terraces running back from the shore of Loch Indaal. It has more going on than its size suggests: the [Museum of Islay Life](https://www.islaymuseum.org) is one of the better small local museums in the Hebrides, the Port Charlotte Hotel has a log fire, 300+ malt whiskies, and live music on Wednesday and Sunday evenings, and [Lochindaal Seafood Kitchen](/explore-islay/food-and-drink) is our top restaurant recommendation on the island. The village beach is safe for swimming and usually empty. If you do only one other village from our properties, Port Charlotte should be it.

### Bowmore: Main Town, Main Services

Bowmore is Islay's main town — the largest concentration of shops and services on the island, and the most reliable year-round. The Co-op is the main supermarket; Peatzeria does good wood-fired pizza; Islay's Plaice does fish and chips. The [Mactaggart Leisure Centre](https://www.mactaggartleisurecentre.co.uk) has a swimming pool — useful for families or a rainy afternoon. [Bowmore Distillery](https://www.bowmore.com) sits at the foot of the main street and claims to be Islay's oldest distillery (1779). At the top of the street, the Round Church (Kilarrow Parish Church, 1767) is small, unusual, and worth five minutes — the local tradition holds it was built round so the Devil could find no corner to hide in. Bowmore is not a picturesque village in the way Port Charlotte is, but it is an honest and useful town.

### Portnahaven and Port Wemyss: The End of the Road

Portnahaven and Port Wemyss are two connected villages that together form a small settlement at the southern tip of the Rhinns — 20 minutes from our properties along a single-track road that gets emptier the further south you go. The harbour at Portnahaven almost always has common seals hauled out on the rocks, and [An Tigh Seinnse](https://maps.app.goo.gl/Ec4m6CxY1YW1DJJ28) pub serves honest home-cooked food in a genuinely tiny, genuinely local room. The combination of seals in the harbour, the pub for lunch, and the empty Atlantic coast on the way back makes this the best half-day on the Rhinns beyond Bruichladdich and Port Charlotte. Book ahead — An Tigh Seinnse seats perhaps 20 people.

### Port Askaig and Port Ellen: Functional Ports Worth Knowing

Port Askaig is where the [CalMac](https://www.calmac.co.uk) ferry from Kennacraig arrives in 2 hours (the faster of the two Islay crossings), and where the 5-minute crossing to Jura departs. The Port Askaig Hotel has a decent bar and is worth a stop if you're up on the north coast for distilleries. Port Ellen, on the south coast, is the longer ferry crossing (2 hours 20 minutes from Kennacraig) but puts you closer to the south coast distillery cluster — [Laphroaig](https://www.laphroaig.com), [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin), and [Ardbeg](https://www.ardbeg.com) are all within a 10-minute drive, and [Port Ellen Distillery](https://www.malts.com/en-gb/distilleries/port-ellen) reopened in 2024. The [Copper Still](/explore-islay/food-and-drink) café by the ferry terminal is the best café on the island.

### What's Open When

One important piece of island reality: hours change by season, and some smaller businesses close entirely in winter. The Port Charlotte Hotel, Co-op Bowmore, Lochindaal Seafood Kitchen, and Islay's Plaice are the most reliably open year-round. [An Tigh Seinnse](https://maps.app.goo.gl/Ec4m6CxY1YW1DJJ28) in Portnahaven is open year-round. Winter hours apply from November — always book ahead and confirm current hours for winter visits. The [Museum of Islay Life](https://www.islaymuseum.org) is typically open April to October. We update our house notes for each property with current opening hours for local businesses — if you're arriving in shoulder season or winter, ask us when you book and we'll tell you what's operating.
`;

const VISIT_JURA_EDITORIAL_MD = `
### Fitting Jura into an Islay Week

A Jura day trip is one of the most consistent highlights our guests report from their Islay stays - and it is genuinely easy to do. The logistics are simple: drive 30 minutes to Port Askaig, walk on to the ferry (no booking needed for foot passengers), cross in 5 minutes, and you're on Jura. For a comfortable day, leave by 9:30 in the morning and plan to be back at Port Askaig by 8pm or later if you book the 21:30 sailing. That gives you a full day on the island. We'd recommend it for at least one day of any stay of 5 nights or more.

For guests with a car, the question is not whether to go but how long to stay. A day covers [Jura Distillery](https://www.jurawhisky.com), lunch, Small Isles Bay, and if you push north, a view of Ardlussa. A two-night stay adds Barnhill, the Corryvreckan, a Pap climb if conditions are right, and the slower experience of Jura at its own pace. We're here either way and can help with planning when you book.

### The Character Difference

Block 13 describes Jura as "all Highland" compared to Islay's "gentle borders feel" - and that description holds. Jura's landscape is more dramatic, more vertical, and more remote-feeling than Islay's. The single road gives you no choice about the route. The hills are always in view. The deer are everywhere. The silence is more total. For guests who've spent a week on Islay and are ready for something sharper, Jura delivers that contrast immediately - you feel it on the ferry crossing.

Islay has villages, distilleries, a functioning community with shops and restaurants. Jura has Craighouse, a handful of scattered farms, and the long single-track north. Both are worth experiencing. If we had to advise a first-time Hebrides visitor, we'd say: base on Islay, day trip to Jura, consider returning to Jura for longer once you know what you're coming back to.

### Practical Notes for a Jura Stay

Getting around on Jura: The single-track road requires patience and courtesy - use the passing places correctly, pull fully off the road to let oncoming vehicles through, and never reverse from a passing place up to a car behind you. Deer on the road are a near-constant hazard, especially at dawn and dusk. Drive slowly in the early morning and evening, particularly north of Craighouse. The road deteriorates beyond Lealt - the last section to Barnhill is 4 miles of rough track that must be walked.

Shopping and supplies: The Jura Hotel has a small shop at Craighouse for basics. For anything more than that, Islay is better stocked - do your main shopping on Islay before you cross. The distillery and [Lussa Gin](https://www.lussagin.com) at Ardlussa both sell bottles if you want something to take home, but neither is a general provisions stop.

Mobile signal: EE and Vodafone are the most reliable networks on Jura; others are patchy north of Craighouse. This is not theoretical - guests who rely on Three or O2 have found themselves without signal. Download offline maps before you go.

The Tayvallich ferry: From March to September, the Jura Passenger Ferry runs twice daily between Tayvallich on the mainland and Craighouse. For mainland visitors arriving or departing via Jura, this is a genuine alternative to coming via Islay. It also makes a multi-island loop possible - arrive on Islay via [CalMac](https://www.calmac.co.uk) from Kennacraig, spend days on Islay, cross to Jura via Port Askaig, and return to the mainland on the Tayvallich ferry. Contact us when planning and we'll help make the logistics work.

### We Live Here

We moved to Jura in 2017 and absolutely love it. We're here through the winters, when the geese fill the skies and the deer rut echoes across the hills, and through the summers, when the light goes on until almost midnight and Corran Sands at the bottom of the [Bothan Jura Retreat](https://www.bothanjuraretreat.co.uk) drive feels like the end of the world in the best possible way. If you want to understand what Jura is actually like - not the tourist brochure version - come and see for yourself. We're here, and we're happy to talk about it.
`;

const FOOD_DRINK_EDITORIAL_MD = `
### Booking Ahead on Islay

Islay's restaurants are small, popular, and on an island — there is no overflow option if your first choice is full. Our firm advice: plan your restaurant evenings before you leave home. The Lochindaal Seafood Kitchen requires 24 hours' notice for the full platter and is worth planning your whole day around — don't just turn up. The Port Charlotte Hotel restaurant fills on music nights (Wednesday and Sunday); book ahead if you want a table rather than eating at the bar. [An Tigh Seinnse](https://maps.app.goo.gl/Ec4m6CxY1YW1DJJ28) in Portnahaven is tiny and gets busy regardless of season. Even the distillery cafés can fill at peak lunchtimes in summer.

Most venues can be booked by phone or a direct message. Online booking exists at some but not all. When in doubt, call. And if you struggle to get through to anyone, ask us — we know these venues well and can often help.

### Opening Hours: A Reality Check

Many Islay venues operate reduced or seasonal hours, particularly November to March. Opening days and times can change, and smaller venues occasionally close without much notice if the chef is unavailable or supplies don't arrive on the ferry. Our practical advice: check before you drive anywhere. The Port Charlotte Hotel is the most reliably open year-round. Distillery cafés operate during distillery visiting hours — check ahead in winter, when those hours may be reduced or paused entirely.

If you're planning a specific meal on a specific night, particularly for a celebration or a special occasion, tell us when you book and we'll help you get it right.

[RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) combines naturally with an early start — the dawn barnacle geese flight at the RSPB reserve is one of the most extraordinary wildlife experiences in Scotland, and the [Oyster Shed](https://maps.app.goo.gl/AxkjF3pTQdVvwRhG7) opens from 10am for the best oysters on the island. That combination makes one of the best half-days on Islay. See the [wildlife guide](/explore-islay/islay-wildlife) for geese timings and reserve access details.
`;

const DISTILLERIES_EDITORIAL_MD = `
### Starting at Bruichladdich

Every guest who stays with us gets the same first piece of advice: tour [Bruichladdich](https://www.bruichladdich.com) before anything else. It's a 5-minute walk along the coastal cycle path — you can walk there, spend two to three hours exploring the distillery and taking a tour, and walk home. No driving, no designated driver logistics, no taxis to arrange. That alone makes it different from every other distillery on the island.

Beyond the logistics, Bruichladdich is genuinely unlike any other Islay distillery. Self-styled Progressive Hebridean Distillers, they produce single malts across the full peat spectrum: the unpeated Laddie Classic at one end, the traditionally Islay Port Charlotte range in the middle, and Octomore — the world's most heavily peated whisky — at the other. For gin, The Botanist is made here too, one of the UK's most awarded gins. There is something for every palate.

The distillery tours — particularly the warehouse experience — are personal, unhurried, and excellent. Book ahead; they fill fast in summer and during [Fèis Ìle](https://www.feisile.co.uk). [Bruichladdich Distillery](https://www.bruichladdich.com) — book directly on their website.

### Planning Your Distillery Days

Two distilleries per day is comfortable; three can feel rushed. This matters because tastings accumulate and the drives between distilleries — especially if you're covering both north and south coasts — add up. Build in time to actually enjoy each experience rather than ticking boxes.

The south coast cluster — [Ardbeg](https://www.ardbeg.com), [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin), [Laphroaig](https://www.laphroaig.com), and the recently reopened [Port Ellen](https://www.malts.com/en-gb/distilleries/port-ellen) — sits within three miles of each other near Port Ellen. This cluster is the obvious full-day focus for heavily peated whisky enthusiasts. Ardbeg has one of the best café kitchens of any distillery on the island — an excellent lunch stop and a reason to pace your arrival. All four can theoretically be visited in a day, but two or three with proper time at each will be more rewarding than a rushed four.

The north coast cluster — [Caol Ila](https://www.malts.com/en-gb/distilleries/caol-ila), [Bunnahabhain](https://bunnahabhain.com), and [Ardnahoe](https://ardnahoedistillery.com) — faces the Sound of Islay across to the Paps of Jura. Ardnahoe, the most recent distillery on the island (opened 2018), has a visitor centre with outstanding views and good food. Bunnahabhain produces mostly unpeated malts — a contrast to the south coast style. This cluster is another natural full day, with the drive north via Port Askaig a pleasure in itself.

[Bowmore](https://www.bowmore.com) and [Kilchoman](https://kilchomandistillery.com) each warrant individual visits. Bowmore, Islay's largest village, is an easy stop as part of any day on the island — the distillery claims to be Islay's oldest (1779). Kilchoman is different in character: a working farm distillery, the only one in Scotland producing barley to bottle entirely on site. The atmosphere is unpretentious and agricultural; the café for lunch is a favourite with our guests.

### Fèis Ìle — the Islay Whisky Festival

[Fèis Ìle](https://www.feisile.co.uk) (pronounced "Fesh Ee-la") takes place in late May each year — typically the last week, running for approximately ten days. It is one of the world's most celebrated whisky festivals and transforms the island: each distillery hosts its own open day with exclusive bottlings, live music, tastings, and distillery tours at prices that sell out months in advance.

If you're visiting during Fèis Ìle, book everything as early as possible. Distillery open days sell out; ferry vehicle spaces are extremely limited (book 12 weeks ahead as a minimum); accommodation on the island is fully booked by January. The atmosphere is exceptional — the best of Islay's community and whisky culture combined — but it requires planning that is not compatible with a last-minute booking mindset.

If Fèis Ìle dates conflict with your preferred travel window but you want to experience the festival atmosphere, some distilleries extend their festival programmes. Check individual distillery websites from December onwards.

### Tasting Notes — The Islay Style Spectrum

Understanding the peat spectrum helps visitors plan itineraries around their palate:

Heavily peated (smoky, medicinal, maritime): [Ardbeg](https://www.ardbeg.com), [Laphroaig](https://www.laphroaig.com), and Octomore from [Bruichladdich](https://www.bruichladdich.com). These are the expressions that define "Islay whisky" in the popular imagination.

Medium-peated (balanced, accessible): [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin), [Bowmore](https://www.bowmore.com), and Port Charlotte from Bruichladdich. Classic Islay character without the extreme intensity.

Lightly peated or unpeated (fruity, floral, complex without smoke): [Bunnahabhain](https://bunnahabhain.com) (mostly unpeated), Kilchoman single cask releases, The Laddie Classic from Bruichladdich, and Caol Ila's lighter expressions.

If peat is not your thing, Islay has excellent options beyond the smoky stereotype — Bunnahabhain and Bruichladdich's unpeated range specifically. Don't rule out visiting because you prefer lighter styles.

Several distilleries have excellent cafés worth planning around — [Ardbeg](https://www.ardbeg.com), [Kilchoman](https://kilchomandistillery.com), and [Ardnahoe](https://ardnahoedistillery.com) in particular. Our [food and drink guide](/explore-islay/food-and-drink) covers distillery cafés alongside Islay's best restaurants.
`;

const WALKING_EDITORIAL_MD = `
### What to Wear and Carry

Walking on Islay requires the same basic kit regardless of the route: waterproof jacket, waterproof trousers or overtrousers, and footwear with some grip underfoot. The Oa and Ardnave are particularly exposed — on those routes the wind can be significant even on a day that looks calm in Bruichladdich. The Loch Gruinart Woodland Trail and the coastal path are forgiving in almost all conditions, but the [RSPB The Oa](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa) and Ardnave clifftops are not.

For most walks in this guide, walking shoes or light boots with grip are sufficient — you do not need full hiking boots for the coastal path or Finlaggan. For the Oa circular and Ardnave, walking boots with ankle support and proper waterproofs are sensible choices. Midges are present on Islay from late May to September, particularly in calm weather near woodland and still water. A midge head net and repellent (Smidge is the most effective) are worth carrying in summer. We keep a stock of midge net and repellent at all our properties.

### When to Come for Walking

Islay walks work in all seasons, but each has its character. Summer (June to August) gives the longest days — light until 11pm in June, which means evening walks and late coastal sunsets. The trade-off is midges and the occasional tourist pressure at the most famous spots. Autumn and winter give the geese (October to April at [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) and Ardnave), dramatic skies, and the island largely to yourselves. Spring (March to May) is when the island flowers and the birdlife is at its most active. We have a slight preference for shoulder seasons — late September, October, and April — when the weather can be outstanding and the island is at its quietest.

### Combining Walks with Other Activities

Islay's compact size makes it easy to combine walking with distillery visits, beaches, and food stops on the same day. The most natural combinations: start at [Kilchoman Distillery](https://kilchomandistillery.com) for coffee or lunch, then walk down to Machir Bay and back along the dunes (allow 1.5 hours for the walk, 1–2 hours at the distillery). Alternatively, walk the coastal path to Port Charlotte in the morning, have lunch at the [Lochindaal Seafood Kitchen](/explore-islay/food-and-drink), and return in the afternoon.

For north Islay days, [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) and Ardnave Point share the same access road and work well together — combine both with a stop at [Ardnahoe Distillery](https://ardnahoedistillery.com) on the way back for a full day that covers wildlife, walking, and whisky. [Finlaggan](https://finlaggan.com) is a natural addition to any day that includes the north coast distilleries ([Bunnahabhain](https://bunnahabhain.com), [Caol Ila](https://www.malts.com/en-gb/distilleries/caol-ila), Ardnahoe) — it sits roughly on the route and the island ruins take 30–40 minutes including a proper look around.

### Walking with Dogs

Islay is excellent for dogs. All seven routes in this guide are dog-friendly. At [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) and The Oa, dogs must be kept on leads at all times to protect ground-nesting birds and the geese population — please respect this. All three of our properties are dog-friendly (£15 per dog per stay). The coastal path to Port Charlotte is one of the best daily dog walks on the island — flat, interesting, and different at every tide.

### A Note on Jura

Jura's walking — the Paps, the Barnhill route, and the Atlantic west coast — is in a different category from anything on Islay. It requires planning, commitment, and in some cases a full multi-day trip to experience properly. Our [Visit Jura guide](/explore-islay/visit-jura) covers everything you need to know, including how easy the 5-minute ferry crossing from Port Askaig makes a Jura day trip. All three Portbahn Islay properties are about 30 minutes' drive from Port Askaig, making them a practical base for a Jura walking day. See the [beaches guide](/explore-islay/islay-beaches) for safe swimming locations near the walking routes.
`;

// ─── Property Descriptions ────────────────────────────────────────────────────

const PORTBAHN_HOUSE_DESC_MD = `
Portbahn House is a modern, spacious self-catering holiday home in Bruichladdich on the Isle of Islay, Scotland, sleeping 8 guests in 3 bedrooms. It's perfect for whisky enthusiasts visiting the world-famous single malt distilleries and families with children seeking adventure on the Scottish Islands, this well-insulated property sits along the shoreline of Loch Indaal with stunning sea views.

The contemporary open-plan design features a fully equipped kitchen, dining area for 8, lounge with wood-burning stove, and conservatory - ideal for groups enjoying Islay's renowned whisky tours or families gathering after days exploring beaches and coastal walks.

The ground floor accommodation sleeps 8 guests across three bedrooms: a master bedroom with super king and single bed (sleeps 3) plus ensuite bathroom, a triple bedroom with double and single bed (sleeps 3), and a twin bedroom with two single beds (sleeps 2). A family bathroom and additional upstairs toilet provide convenience for larger groups and families. The spacious kitchen comes fully equipped with dishwasher, microwave, oven, refrigerator, and dining table seating 8 comfortably. Entertainment includes TV with Freesat, DVD player, extensive selection of DVDs, books and games, plus WiFi throughout - perfect for relaxing evenings after distillery visits or beach adventures.

Outside, the large private mature garden offers uninterrupted sea views across Loch Indaal plus exceptional features for families: a sunken trampoline and swings that children love, alongside BBQ facilities for summer evenings. Underfloor heating throughout and a cosy wood-burning stove ensure year-round comfort whether you're visiting for winter whisky tours or summer beach holidays. Ample parking within the property grounds accommodates multiple vehicles - essential for whisky touring groups. Dogs are welcome at £15 per stay, making this the perfect base for families exploring Islay with their four-legged companions.

[Bruichladdich Distillery](https://www.bruichladdich.com), producing world-famous single malt whisky and The Botanist gin, is just a 10-minute walk along the coastal cycle path - ideal for whisky enthusiasts who can walk home after tastings. [Portbahn Beach](/explore-islay/islay-beaches), one of Islay's hidden treasures with three beautiful bays perfect for families, sits just 5 minutes' walk away for wild swimming, beachcombing, and coastal exploration.

The Bruichladdich Mini Market village shop, run by Aileen, serves excellent coffee, toasties, and sandwiches - open 9am-6pm and only 10 minutes' walk. [Port Charlotte](/explore-islay/islay-villages), featuring family-friendly restaurants, traditional pubs, [Islay Museum](https://www.islaymuseum.org), and sandy harbour beach, is 5 minutes by car or 20 minutes on foot via the scenic coastal path. With the largest capacity of our three properties and both whisky tourism and family activities literally on your doorstep, Portbahn House is the perfect Islay base for distillery tours, beach days, and Scottish Islands adventures.
`;

const PORTBAHN_HOUSE_LOC_MD = `
Shoreline location on the coastal path between [Bruichladdich Distillery](https://www.bruichladdich.com) and [Port Charlotte village](/explore-islay/islay-villages)
`;

const SHOREFIELD_DESC_MD = `
Shorefield is a characterful eco-house in Bruichladdich on the Isle of Islay in Scotland, sleeping 6 guests in 3 bedrooms. This well-insulated property runs on its own wind and solar power, making it a great base for eco-conscious travelers and nature enthusiasts visiting the Scottish Islands.

The house is owned by a local family whose parents, George and Megan, were great nature lovers and bird watchers. When they built it they planted all the trees and created the wetlands behind the house for birdlife, including putting in several hides. Their enthusiasm for nature and travel is reflected throughout the property. The property still has all its original quaint, quirky charm with the owners' paintings, maps, antiques, books, and stories throughout - perfect for those seeking character over modern minimalism.

The garden includes private woodland, ponds, and bird reserves created by the owners, offering exceptional opportunities for bird watching and nature observation out over the sea of Loch Indaal, or quietly inland.

The accommodation features a large kitchen table for 6, separate dining room also seating 6, a wood-burning stove in the living room, and selection of books and games. Wifi is available throughout.

The property has 3 bedrooms and 2 bathrooms - a superking and twin room upstairs with shower and bathroom, and a double room downstairs with separate shower room.

Please note there is no dishwasher, but a washing machine and dryer are available.

[Bruichladdich Distillery](https://www.bruichladdich.com) is a 5 minute walk along the coastal cycle path, while swimming beaches are easily accessible at Portbahn by the war memorial. [Port Charlotte's](/explore-islay/islay-villages) two pubs and shop/ post office/ petrol station are 5 minutes by car or 45 minutes coastal stroll along the scenic cycle path. Dogs welcome at £15 per stay. Ideal for nature lovers, bird watchers, and visitors seeking an authentic, eco-friendly Isle of Islay experience.
`;

const SHOREFIELD_LOC_MD = `
Situated above the shoreline on the coastal path between [Bruichladdich](https://www.bruichladdich.com) and [Port Charlotte](/explore-islay/islay-villages)
`;

const CURLEW_DESC_MD = `
Curlew Cottage is a holiday cottage in Bruichladdich on the Isle of Islay. A converted stone steading it sleeps 6 guests in 3 bedrooms.

This is the owner's personal Islay retreat—a family cottage kept for private use until now, and available for guest bookings for the first time in 2026. It is managed by Pi, an Airbnb Superhost with a 4.97/ 5 rating across 380+ reviews at the neighbouring Islay holiday properties in Bruichladdich (Portbahn House and Shorefield), with the same attention to homely, personal comforts.

The house is set in a secluded elevated position surrounded by farmland between Bruichladdich and Port Charlotte with sea views overlooking Loch Indaal. The cottage has a private access road shared only with two neighbouring homes, creating a very safe environment for families with children to enjoy the gardens.

The ground floor features a large dining/ family room, sitting room with wood-burning stove, fully equipped kitchen with dishwasher and microwave, and laundry room with washing machine, tumble dryer, and airing pulley. The main bathroom includes both a bath and shower. Upstairs, two bedrooms share the landing, while a third bedroom is accessed via a separate stair and has its own small ensuite bathroom.

The cottage has oil-fired central heating, double glazing throughout, and a cosy wood-burning stove making this an ideal year-round retreat for families visiting the Scottish Islands. Broadband wifi is available.

Outside, the walled rear garden includes an old greenhouse and stone outbuildings, created from the former farm buildings. Ample parking accommodates several cars.

[Bruichladdich Distillery](https://www.bruichladdich.com) is a 10-minute walk along the coastal cycle path, with [swimming beaches](/explore-islay/islay-beaches) equally accessible at Portbahn, by the war memorial.

[Port Charlotte](/explore-islay/islay-villages) is 5 minutes drive by car or 45 minutes walk along the scenic cycle path. Perhaps Islay's prettiest village, set on an old harbour, it has two pub/ hotels, The Port Charlotte and The [Lochindaal](/explore-islay/food-and-drink), both with excellent seafood and very extensive whisky selections and both family-friendly. There is also a shop with post office and petrol pump in the village.

Bruichladdich village shop is 10 minutes walk or 2 minutes drive in the other direction. The Mini Market serves excellent coffee and sandwiches and stocks basic supplies such as bread milk and firewood.

Curlew Cottage is a great base for families seeking a quiet, safe Isle of Islay home for exploring beaches, distilleries, and coastal walks.

Please note: Curlew Cottage is not pet-friendly.
`;

const CURLEW_LOC_MD = `
Peaceful secluded hideaway between [Bruichladdich](https://www.bruichladdich.com) and [Port Charlotte](/explore-islay/islay-villages), set back from the road with sweeping sea views
`;

// ─── Patch Definitions ────────────────────────────────────────────────────────

const canonicalBlockPatches = [
  { id: 'canonical-block-islay-archaeology-overview', field: 'fullContent', md: ARCHAEOLOGY_OVERVIEW_MD },
  { id: 'canonical-block-islay-villages-overview',    field: 'fullContent', md: VILLAGES_OVERVIEW_MD },
  { id: 'canonical-block-jura-longer-stay',           field: 'fullContent', md: JURA_LONGER_STAY_MD },
  { id: 'canonical-block-bothan-jura-teaser',         field: 'fullContent', md: BOTHAN_JURA_TEASER_MD },
  { id: 'canonical-block-walking-islay-overview',     field: 'fullContent', md: WALKING_OVERVIEW_MD },
  { id: 'canonical-block-about-us',                   field: 'fullContent', md: ABOUT_US_MD },
  { id: 'canonical-block-trust-signals',              field: 'fullContent', md: TRUST_SIGNALS_MD },
  { id: 'canonical-block-ferry-support',              field: 'fullContent', md: FERRY_SUPPORT_MD },
  { id: 'canonical-block-ferry-basics',               field: 'fullContent', md: FERRY_BASICS_MD },
  { id: 'canonical-block-portbahn-beach',             field: 'fullContent', md: PORTBAHN_BEACH_MD },
  { id: 'canonical-block-shorefield-character',       field: 'fullContent', md: SHOREFIELD_CHARACTER_MD },
  { id: 'canonical-block-loch-gruinart-oysters',      field: 'fullContent', md: LOCH_GRUINART_OYSTERS_MD },
  { id: 'canonical-block-food-drink-islay',           field: 'fullContent', md: FOOD_DRINK_ISLAY_MD },
];

const guidePagePatches = [
  { id: 'guide-archaeology-history', md: ARCHAEOLOGY_EDITORIAL_MD },
  { id: 'guide-islay-villages',      md: VILLAGES_EDITORIAL_MD },
  { id: 'guide-visit-jura',          md: VISIT_JURA_EDITORIAL_MD },
  { id: 'guide-food-and-drink',      md: FOOD_DRINK_EDITORIAL_MD },
  { id: 'guide-islay-distilleries',  md: DISTILLERIES_EDITORIAL_MD },
  { id: 'guide-walking',             md: WALKING_EDITORIAL_MD },
];

const propertyPatches = [
  {
    id: '7adb6498-a6dd-4ca9-a5a2-e38ee56cab84', // portbahn-house
    slug: 'portbahn-house',
    descMd: PORTBAHN_HOUSE_DESC_MD,
    locMd: PORTBAHN_HOUSE_LOC_MD,
  },
  {
    id: 'b3bb432f-1bde-479f-953e-2507c459f4f3', // shorefield-eco-house
    slug: 'shorefield-eco-house',
    descMd: SHOREFIELD_DESC_MD,
    locMd: SHOREFIELD_LOC_MD,
  },
  {
    id: '0d37a3b4-a777-4999-b1d3-916c1b74744b', // curlew-cottage
    slug: 'curlew-cottage',
    descMd: CURLEW_DESC_MD,
    locMd: CURLEW_LOC_MD,
  },
];

// ─── Run ──────────────────────────────────────────────────────────────────────

async function run() {
  let ok = 0;
  let fail = 0;

  console.log(`\n=== Canonical Blocks (${canonicalBlockPatches.length}) ===`);
  for (const { id, field, md } of canonicalBlockPatches) {
    try {
      await client.patch(id).set({ [field]: markdownToPortableText(md) }).commit();
      console.log(`✅  ${id}`);
      ok++;
    } catch (err) {
      console.error(`❌  ${id}`, err);
      fail++;
    }
  }

  console.log(`\n=== Guide Page Editorials (${guidePagePatches.length}) ===`);
  for (const { id, md } of guidePagePatches) {
    try {
      await client.patch(id).set({ extendedEditorial: markdownToPortableText(md) }).commit();
      console.log(`✅  ${id}`);
      ok++;
    } catch (err) {
      console.error(`❌  ${id}`, err);
      fail++;
    }
  }

  console.log(`\n=== Properties (${propertyPatches.length} × description + locationIntro) ===`);
  for (const { id, slug, descMd, locMd } of propertyPatches) {
    try {
      await client.patch(id).set({
        description:   markdownToPortableText(descMd),
        locationIntro: markdownToPortableText(locMd),
      }).commit();
      console.log(`✅  ${slug} (${id})`);
      ok++;
    } catch (err) {
      console.error(`❌  ${slug}`, err);
      fail++;
    }
  }

  console.log(`\nDone — ${ok} patched, ${fail} failed.`);
}

run().catch(err => { console.error(err); process.exit(1); });
