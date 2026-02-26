/**
 * create-walking-guide-page.ts
 *
 * Creates the /explore-islay/walking guide page in Sanity.
 *
 * 1. Creates canonical-block-walking-islay-overview (Block 23 canonicalBlock)
 * 2. Creates 6 faqCanonicalBlock documents for walking FAQs (Block 24)
 * 3. Creates the guide-walking guidePage document:
 *    - contentBlocks: Block 23 (walking-islay-overview) full
 *    - faqBlocks: 6 × faqCanonicalBlock (walking)
 *    - extendedEditorial: kit, seasonal advice, dogs, Jura section
 *
 * Source: cw/pbi/content/guides/GUIDE-BLOCKS-WALKING.md (Blocks 23, 24)
 *         cw/pbi/content/guides/GUIDE-WALKING.md (Sections 4, 5, 7)
 *
 * Run AFTER populate-entities.ts (entity docs must exist for wire step).
 * Wire entities separately via wire-entity-guide-pages.ts (guide-walking entry added).
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/create-walking-guide-page.ts
 */

import { createClient } from 'next-sanity';
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

// ─── PortableText simple helpers (for extendedEditorial) ──────────────────────

const h3 = (key: string, text: string) => ({
  _type: 'block' as const,
  _key: key,
  style: 'h3',
  markDefs: [] as any[],
  children: [{ _type: 'span', _key: `${key}c0`, text, marks: [] }],
});

const p = (key: string, text: string) => ({
  _type: 'block' as const,
  _key: key,
  style: 'normal',
  markDefs: [] as any[],
  children: [{ _type: 'span', _key: `${key}c0`, text, marks: [] }],
});

const pLink = (key: string, before: string, linkText: string, href: string, after: string) => {
  const linkKey = `${key}lnk`;
  return {
    _type: 'block' as const,
    _key: key,
    style: 'normal',
    markDefs: [{ _key: linkKey, _type: 'link', href }],
    children: [
      { _type: 'span', _key: `${key}c0`, text: before, marks: [] },
      { _type: 'span', _key: `${key}c1`, text: linkText, marks: [linkKey] },
      { _type: 'span', _key: `${key}c2`, text: after, marks: [] },
    ],
  };
};

const textBlock = (text: string) => ({
  _type: 'block' as const,
  _key: generateKey(),
  style: 'normal' as const,
  markDefs: [] as any[],
  children: [{ _type: 'span', _key: generateKey(), text, marks: [] as string[] }],
});

// ─── markdownToPortableText (with inline link support) ────────────────────────

function parseInlineMarks(text: string, markDefs: any[]): any[] {
  const children: any[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  for (const part of parts) {
    if (!part) continue;
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['strong'], text: part.slice(2, -2) });
    } else if (/^\*[^*]+\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['em'], text: part.slice(1, -1) });
    } else if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const linkKey = generateKey();
        markDefs.push({ _key: linkKey, _type: 'link', href: m[2] });
        children.push({ _key: generateKey(), _type: 'span', marks: [linkKey], text: m[1] });
      }
    } else {
      children.push({ _key: generateKey(), _type: 'span', marks: [], text: part });
    }
  }
  return children.length > 0 ? children : [{ _key: generateKey(), _type: 'span', marks: [], text }];
}

function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.trim().split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return;
    const text = currentParagraph.join(' ').trim();
    if (!text) { currentParagraph = []; return; }
    const markDefs: any[] = [];
    const children = parseInlineMarks(text, markDefs);
    blocks.push({
      _key: generateKey(), _type: 'block', style: 'normal', markDefs,
      children,
    });
    currentParagraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') { flushParagraph(); continue; }

    // **Standalone bold line** → h3
    if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
      flushParagraph();
      const text = trimmed.replace(/^\*\*|\*\*$/g, '');
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
      });
      continue;
    }

    // ### or ## → h3
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      flushParagraph();
      const text = trimmed.replace(/^#{2,3}\s+/, '');
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
      });
      continue;
    }

    flushParagraph();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

// ─── Block 23: walking-islay-overview (canonicalBlock) ────────────────────────

const WALKING_OVERVIEW_MD = `Islay rewards walkers at every level - from the flat coastal path that runs directly from our Bruichladdich properties to full-day circuits on the Oa peninsula and the exposed north coast. The island's walking is genuinely varied: shoreline paths, RSPB reserves, moorland, ancient island ruins, and Atlantic dune beaches you'll often have to yourselves. Most of the walks guests ask us about require no specialist equipment - sturdy footwear, layers, and waterproofs are the essentials on Islay whatever the weather.

What follows are the walks we actually recommend, roughly in order of how far you'll need to drive from our properties to reach them.

**1. Bruichladdich Coastal Path to Port Charlotte**

The coastal path to Port Charlotte starts outside the front door and runs 3 miles south along the Loch Indaal shoreline. The full walk takes 40 minutes each way, the path is tarmac and flat the whole way, and it is suitable for all abilities including pushchairs. From our properties, head south along the shared-use coastal cycle path past Bruichladdich Pier - a good spot for crabbing at low tide - and continue through the village past the war memorial and ferry slip. Port Charlotte comes into view after about 40 minutes, with the Museum of Islay Life, the Lochindaal Seafood Kitchen, and the Port Charlotte Hotel all a short walk from the path. Return the same way or take the B8018 road for variety. Portbahn Beach is a 5-minute detour off the coastal path via the war memorial path - a set of three sheltered coves that are one of Islay's quietest spots. See our [beaches guide](/explore-islay/islay-beaches) for more on Portbahn Beach.

**2. The Oa (RSPB Reserve)**

The Oa peninsula forms Islay's dramatic south-western tip, about 35-40 minutes' drive from our properties - drive south through Bridgend and Port Ellen, then take the Oa road, following signs to the RSPB reserve car park at PA42 7AU. From the car park, the American Monument is a 20-minute walk along a well-marked path with boardwalk sections across the wetter ground. The full Mull of Oa circular route covers 2.2 miles and takes 1-1.5 hours - allow a full morning or afternoon including travel time. The American Monument is a memorial erected after World War One to the hundreds of US soldiers drowned when the troop ships Tuscania and Otranto were lost off the Oa in 1918 - it stands on the clifftop above the very spot where the Tuscania sank. On a clear day views extend to Ireland, the Kintyre Peninsula, and across Islay's south coast. Look out for choughs (red-billed crows - Islay has one of the UK's strongest populations), fulmars on the cliff ledges, and the chance of eagles hunting the moorland above the car park. The Oa is one of Islay's most exposed locations - conditions on the clifftops change quickly. Go well layered up with waterproofs even if the car park looks fine.

**3. RSPB Loch Gruinart Reserve**

RSPB Loch Gruinart is about 20 minutes' drive from our properties, heading north on the B8017. The reserve's visitor centre at Aoradh Farm has a car park, toilets, and hot drinks, and the Woodland Trail (1 mile/1.5km) runs from there to the viewing platform and hides overlooking the flooded fields and the tidal inlet of Loch Gruinart. The route to the viewing platform is suitable for most abilities, and visitors with mobility difficulties can call ahead to arrange closer vehicle access to the first hide. From October to April, the morning flights of barnacle and white-fronted geese are one of Islay's most extraordinary wildlife spectacles - as many as 24,000 geese have been counted on the reserve at once. Year-round, the hides give excellent views of waders, wildfowl, and raptors. For the full wildlife picture, see our [wildlife guide](/explore-islay/islay-wildlife).

**4. Finlaggan (Loch Finlaggan)**

Loch Finlaggan is about 25 minutes' drive from our properties - take the B8016 east from Bruichladdich towards Bridgend, then follow signs from the A846 at Ballygrant. The walk from the visitor centre car park to the island ruins is 15-20 minutes return across a flat path and causeway to Eilean Mòr in the loch, and is accessible for most abilities. The visitor centre (open April to October, Monday to Saturday, 11:00-16:30; the historic site is accessible 24/7) has an excellent introduction to the history. Finlaggan was the administrative and ceremonial seat of the Lordship of the Isles from the 12th to 16th centuries - the most powerful Gaelic dynasty in Scotland, controlling much of the Western Isles and western mainland from this island on Islay. The ruins are atmospheric and undervisited compared to Islay's south coast, and the loch setting is genuinely beautiful. Worth combining with the drive to Ardnahoe or Bunnahabhain distilleries for a full north Islay day.

**5. Singing Sands (Tràigh Bhan)**

Singing Sands - Tràigh Bhan in Gaelic - is a secluded beach near Port Ellen where the dry sand emits a quiet squeaking sound underfoot when disturbed, caused by the particular size and roundness of the grains. Access is from the Oa road south of Port Ellen: free parking by the cemetery at grid reference NR343455. From the car park, the path follows the coast around the headland to reach the beach - allow 45-60 minutes return. The beach is family-friendly and rarely crowded. The drive from our properties is approximately 30-35 minutes.

**6. Machir Bay and Kilchoman**

Machir Bay on Islay's Atlantic west coast is one of the island's most spectacular beaches - 2 miles of golden sand backed by dunes - and can be reached in about 20-25 minutes' drive from our properties via Bruichladdich and Kilchoman village. Park near Kilchoman Distillery at the end of the road. Kilchoman Distillery is immediately beside the car park and is Scotland's only barley-to-bottle farm distillery - the café does excellent lunches and the distillery is worth a visit in its own right. The beach walk south from the car park through the dunes to the bay and back is easy going and the scale of the beach is remarkable - on a clear day, it feels like the end of the world in the best possible sense. One essential safety point: Machir Bay and Saligo Bay to the north are not safe for swimming. Both beaches carry extremely strong rip currents at all states of tide. Walk them, photograph them, but do not enter the water. For swimming, our [beaches guide](/explore-islay/islay-beaches) covers the safe options - Portbahn Beach and Port Charlotte Beach are both within 5-40 minutes of our properties.

**7. Ardnave Point**

Ardnave Point on Islay's north coast is about 25-30 minutes' drive from our properties - head north on the B8017 towards Loch Gruinart, pass the RSPB visitor centre at Aoradh Farm, and continue 360 metres on the minor road north of the visitor centre to the grass car park at the south end of Ardnave Loch. The walk north along the Ardnave peninsula to the beach at the point is approximately 1.5km one way along a sandy track - relatively flat and straightforward. Ardnave Loch borders the track on the left as you head out and is worth scanning for ducks, waders, and the possible remains of an ancient crannog on the far shore. The peninsula narrows to a beach at Ardnave Point with big Atlantic views west to Colonsay and Oronsay. One of Islay's less-visited walking areas, Ardnave is excellent in winter for barnacle geese and choughs, and good for waders year-round. Combine with an early morning at RSPB Loch Gruinart for a full north Islay wildlife day.

**Walking on Jura**

Walking on Jura - the Paps of Jura, the Barnhill route, and Jura's wild Atlantic west coast - is a separate world. Jura is 5 minutes by ferry from Port Askaig, and our three Bruichladdich properties are about 30 minutes' drive from Port Askaig. See our [Visit Jura guide](/explore-islay/visit-jura) for everything you need to plan a Jura walking day or longer stay. If you're considering climbing one of the Paps, plan for a full day and let someone know your route - they are serious hill walks, not a casual afternoon.`;

const WALKING_KEY_FACTS = [
  { _key: generateKey(), fact: 'Coastal path to Port Charlotte', value: '40 minutes, flat, all abilities, from properties' },
  { _key: generateKey(), fact: 'Portbahn Beach detour', value: '5 minutes via war memorial path' },
  { _key: generateKey(), fact: 'The Oa car park', value: 'PA42 7AU, end of Oa road south of Port Ellen' },
  { _key: generateKey(), fact: 'The Oa circular walk', value: '2.2 miles, 1–1.5 hours from car park' },
  { _key: generateKey(), fact: 'Drive to The Oa car park', value: '35–40 minutes from properties' },
  { _key: generateKey(), fact: 'American Monument', value: 'WW1 memorial to Tuscania & Otranto disasters, 1918' },
  { _key: generateKey(), fact: 'Loch Gruinart drive', value: '20 minutes from properties' },
  { _key: generateKey(), fact: 'Loch Gruinart Woodland Trail', value: '1 mile / 1.5km, accessible' },
  { _key: generateKey(), fact: 'Finlaggan drive', value: '25 minutes from properties' },
  { _key: generateKey(), fact: 'Finlaggan visitor centre season', value: 'April–October, Mon–Sat 11:00–16:30' },
  { _key: generateKey(), fact: 'Finlaggan historic site access', value: '24/7' },
  { _key: generateKey(), fact: 'Singing Sands car park', value: 'By cemetery, NR343455, off Oa road near Port Ellen' },
  { _key: generateKey(), fact: 'Singing Sands walk', value: '45–60 min return from car park' },
  { _key: generateKey(), fact: 'Drive to Singing Sands', value: '30–35 minutes from properties' },
  { _key: generateKey(), fact: 'Ardnave car park', value: '360m north of RSPB Loch Gruinart visitor centre, off B8017' },
  { _key: generateKey(), fact: 'Ardnave Point walk', value: '1.5km one way, flat, sandy track' },
  { _key: generateKey(), fact: 'Drive to Ardnave', value: '25–30 minutes from properties' },
  { _key: generateKey(), fact: 'Machir Bay safety', value: 'Not safe for swimming — strong rip currents at all times' },
];

// ─── Walking FAQs (Block 24 content as faqCanonicalBlock documents) ───────────

const walkingFaqs = [
  {
    _id: 'faq-guide-walking-easy-family-walks',
    _type: 'faqCanonicalBlock',
    question: 'Are there any easy walks on Islay suitable for families with young children?',
    answer: [textBlock("Islay has excellent family walking starting right outside our properties. The coastal cycle path from Bruichladdich to Port Charlotte is flat, tarmac, and suitable for all abilities including pushchairs and bikes — it runs for 3 miles along the Loch Indaal shoreline and takes about 40 minutes each way. Portbahn Beach is a 5-minute walk from our properties via the war memorial path and has sheltered coves with rock pools at low tide — safe for paddling and almost always empty. For something further afield, Ardnave Point on the north coast has rolling dunes well-suited to younger children, and RSPB Loch Gruinart's Woodland Trail is 1 mile and straightforward for families with older children. Machir Bay and Saligo Bay on the west coast are spectacular — but not safe for swimming. Keep to the shoreline path and dunes at those beaches rather than letting children near the water.")],
    category: 'travel-planning',
    priority: 1,
  },
  {
    _id: 'faq-guide-walking-oa-walk',
    _type: 'faqCanonicalBlock',
    question: 'What is the Oa walk like — how long is it and how difficult?',
    answer: [textBlock("The Oa walk on Islay's south-west peninsula is a moderate circular route of 2.2 miles from the RSPB car park at PA42 7AU, taking 1–1.5 hours. The path is well-marked with boardwalk sections across wetter ground, and the main destination — the American Monument on the clifftop — is a 20-minute walk from the car park. The monument is a World War One memorial to the hundreds of US soldiers drowned when the troop ships Tuscania and Otranto sank off the Oa in 1918, and the views from the clifftop on a clear day extend to Ireland. The Oa is not technically difficult, but it is genuinely exposed — wind and weather conditions matter here in a way they don't on the coastal path. Sturdy footwear, waterproofs, and layers are essential regardless of how the sky looks from Port Ellen. Allow a full morning or afternoon including the 35–40 minute drive from our Bruichladdich properties.")],
    category: 'travel-planning',
    priority: 2,
  },
  {
    _id: 'faq-guide-walking-coastal-path',
    _type: 'faqCanonicalBlock',
    question: 'Is the coastal path from Bruichladdich to Port Charlotte suitable for all abilities?',
    answer: [textBlock("The coastal path from Bruichladdich to Port Charlotte is flat, tarmac, and suitable for all abilities including wheelchairs, mobility aids, and pushchairs. The path runs for 3 miles along the Loch Indaal shoreline and is a shared-use cycle path and walking route — well maintained and signposted. The walk takes approximately 40 minutes each way at a comfortable pace. The path starts immediately outside our three properties on the Loch Indaal shoreline near Bruichladdich, so no driving is required. Port Charlotte at the far end has a village shop, the Museum of Islay Life, and the Port Charlotte Hotel and Lochindaal Seafood Kitchen for food and drink.")],
    category: 'travel-planning',
    priority: 3,
  },
  {
    _id: 'faq-guide-walking-best-wildlife-walk',
    _type: 'faqCanonicalBlock',
    question: 'What is the best walk on Islay for seeing wildlife?',
    answer: [textBlock("For wildlife, the choice depends on the season. In winter (October to April), RSPB Loch Gruinart is the outstanding option — the reserve hosts tens of thousands of barnacle geese from Greenland, and morning flights as the geese lift from the fields are spectacular. The Woodland Trail from the visitor centre to the hides is 1 mile and suitable for most abilities. Year-round, the Ardnave Point walk on Islay's north coast is excellent for choughs (rare red-billed crows), waders, and in winter for geese — Ardnave is less visited than Loch Gruinart and often quieter. The Oa clifftops are consistently good for breeding choughs and fulmars, with golden eagles soaring above the moorland on the approach walk. The coastal path between Bruichladdich and Port Charlotte is reliable for seals in Loch Indaal year-round, and dolphins are seen occasionally — we keep binoculars in all three properties for guests.")],
    category: 'travel-planning',
    priority: 4,
  },
  {
    _id: 'faq-guide-walking-guided-walks',
    _type: 'faqCanonicalBlock',
    question: 'Are there any guided walks on Islay?',
    answer: [textBlock("Islay has a number of local walking guides and ranger-led walks through RSPB Scotland. RSPB Loch Gruinart runs guided wildlife walks, particularly during the geese season (October to April), and the reserve's staff are excellent sources of real-time information on where to look and what to expect. The Islay Natural History Trust also organises guided events. For hill walking or more serious routes, a local guide is worthwhile for anything on the Oa cliffs, Beinn Bheigier (Islay's highest point at 491m), or any route in genuinely poor weather. Get in touch with us when you book and we can point you to current options — the local guide picture changes seasonally.")],
    category: 'travel-planning',
    priority: 5,
  },
  {
    _id: 'faq-guide-walking-distillery-walk',
    _type: 'faqCanonicalBlock',
    question: 'Can I walk from one distillery to another on Islay?',
    answer: [textBlock("The only distillery walk most guests can manage from our properties without a car is Bruichladdich Distillery — a 5-minute walk along the coastal cycle path. Every other distillery on Islay requires driving, and with Scotland's effectively zero drink-drive limit, that matters. Bruichladdich and Bowmore are both on Loch Indaal and theoretically connected by walking via Port Charlotte (a full day's walk of 8+ miles each way), but in practice, most distillery-to-distillery routes require a car or a local driver. The exception worth knowing about: if you're at Ardbeg, Lagavulin, and Laphroaig on the south coast, those three are within easy walking distance of each other on the Port Ellen to Kildalton shoreline path. That stretch of coast, with the distilleries at one end and the Kildalton Cross at the other, makes for a genuinely excellent walking day.")],
    category: 'travel-planning',
    priority: 6,
  },
];

// ─── Extended editorial (Section 5) ──────────────────────────────────────────

const extendedEditorial = [
  h3('we01', 'What to Wear and Carry'),
  p('we02', 'Walking on Islay requires the same basic kit regardless of the route: waterproof jacket, waterproof trousers or overtrousers, and footwear with some grip underfoot. The Oa and Ardnave are particularly exposed — on those routes the wind can be significant even on a day that looks calm in Bruichladdich. The Loch Gruinart Woodland Trail and the coastal path are forgiving in almost all conditions, but the Oa and Ardnave clifftops are not.'),
  p('we03', 'For most walks in this guide, walking shoes or light boots with grip are sufficient — you do not need full hiking boots for the coastal path or Finlaggan. For the Oa circular and Ardnave, walking boots with ankle support and proper waterproofs are sensible choices. Midges are present on Islay from late May to September, particularly in calm weather near woodland and still water. A midge head net and repellent (Smidge is the most effective) are worth carrying in summer. We keep a stock of midge net and repellent at all our properties.'),
  h3('we04', 'When to Come for Walking'),
  p('we05', "Islay walks work in all seasons, but each has its character. Summer (June to August) gives the longest days — light until 11pm in June, which means evening walks and late coastal sunsets. The trade-off is midges and the occasional tourist pressure at the most famous spots. Autumn and winter give the geese (October to April at Loch Gruinart and Ardnave), dramatic skies, and the island largely to yourselves. Spring (March to May) is when the island flowers and the birdlife is at its most active. We have a slight preference for shoulder seasons — late September, October, and April — when the weather can be outstanding and the island is at its quietest."),
  h3('we06', 'Combining Walks with Other Activities'),
  p('we07', "Islay's compact size makes it easy to combine walking with distillery visits, beaches, and food stops on the same day. The most natural combinations: start at Kilchoman Distillery for coffee or lunch, then walk down to Machir Bay and back along the dunes (allow 1.5 hours for the walk, 1–2 hours at the distillery). Alternatively, walk the coastal path to Port Charlotte in the morning, have lunch at the Lochindaal Seafood Kitchen, and return in the afternoon."),
  p('we08', "For north Islay days, RSPB Loch Gruinart and Ardnave Point share the same access road and work well together — combine both with a stop at Ardnahoe Distillery on the way back for a full day that covers wildlife, walking, and whisky. Finlaggan is a natural addition to any day that includes the north coast distilleries (Bunnahabhain, Caol Ila, Ardnahoe) — it sits roughly on the route and the island ruins take 30–40 minutes including a proper look around."),
  h3('we09', 'Walking with Dogs'),
  p('we10', "Islay is excellent for dogs. All seven routes in this guide are dog-friendly. At RSPB Loch Gruinart and The Oa, dogs must be kept on leads at all times to protect ground-nesting birds and the geese population — please respect this. All three of our properties are dog-friendly (£15 per dog per stay). The coastal path to Port Charlotte is one of the best daily dog walks on the island — flat, interesting, and different at every tide."),
  h3('we11', 'A Note on Jura'),
  pLink(
    'we12',
    "Jura's walking — the Paps, the Barnhill route, and the Atlantic west coast — is in a different category from anything on Islay. It requires planning, commitment, and in some cases a full multi-day trip to experience properly. Our ",
    'Visit Jura guide',
    '/explore-islay/visit-jura',
    " covers everything you need to know, including how easy the 5-minute ferry crossing from Port Askaig makes a Jura day trip. All three Portbahn Islay properties are about 30 minutes' drive from Port Askaig, making them a practical base for a Jura walking day."
  ),
];

// ─── Guide page ───────────────────────────────────────────────────────────────

const blockRef = (blockId: string, version: 'full' | 'teaser', customHeading?: string) => ({
  _type: 'blockReference' as const,
  _key: generateKey(),
  block: { _type: 'reference' as const, _ref: `canonical-block-${blockId}` },
  version,
  showKeyFacts: false,
  ...(customHeading ? { customHeading } : {}),
});

const faqRef = (faqId: string) => ({
  _type: 'reference' as const,
  _key: generateKey(),
  _ref: faqId,
});

const walkingGuidePage = {
  _id: 'guide-walking',
  _type: 'guidePage',
  title: 'Walking on Islay',
  slug: { _type: 'slug', current: 'walking' },
  introduction: "Islay is an island of genuine variety for walkers, from tarmac coastal paths suitable for all abilities to exposed clifftop circuits and moorland routes that require proper kit and preparation. The three Portbahn Islay properties sit on the Loch Indaal shoreline between Bruichladdich and Port Charlotte, and the coastal cycle path that connects those two villages runs directly past the front door. Beyond the coastal path, Islay's other best walks are all within 20–40 minutes' drive, and none require specialist experience or equipment.",
  extendedEditorial,
  contentBlocks: [
    blockRef('walking-islay-overview', 'full', 'Walking on Islay — Seven Routes We Recommend'),
  ],
  faqBlocks: walkingFaqs.map(f => faqRef(f._id)),
  seoTitle: 'Walking on Islay | Coastal Paths, Wildlife Walks & The Oa | Portbahn Islay',
  seoDescription: "Walking on Islay ranges from the flat coastal path outside our door to the dramatic Oa cliffs and Finlaggan's island ruins. Routes, drive times and safety notes from hosts who walk here every week.",
  schemaType: 'Article',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== create-walking-guide-page.ts ===\n');

  // 1. Create canonical-block-walking-islay-overview (Block 23)
  console.log('Creating canonical-block-walking-islay-overview (Block 23)...\n');
  try {
    await client.createOrReplace({
      _type: 'canonicalBlock',
      _id: 'canonical-block-walking-islay-overview',
      blockId: { _type: 'slug', current: 'walking-islay-overview' },
      title: 'Walking on Islay',
      entityType: 'Activity',
      canonicalHome: '/explore-islay/walking',
      fullContent: markdownToPortableText(WALKING_OVERVIEW_MD),
      keyFacts: WALKING_KEY_FACTS,
    });
    console.log('  ✓ canonical-block-walking-islay-overview');
  } catch (err: any) {
    console.error(`  ✗ canonical-block-walking-islay-overview: ${err.message}`);
  }

  // 2. Import 6 walking faqCanonicalBlock documents
  console.log('\nCreating walking faqCanonicalBlock documents...\n');
  for (const faq of walkingFaqs) {
    try {
      await client.createOrReplace(faq);
      console.log(`  ✓ ${faq._id}`);
    } catch (err: any) {
      console.error(`  ✗ ${faq._id}: ${err.message}`);
    }
  }

  // 3. Create guide-walking guidePage
  console.log('\nCreating guide-walking guidePage...\n');
  try {
    await client.createOrReplace(walkingGuidePage);
    console.log(`  ✓ guide-walking → slug: walking`);
  } catch (err: any) {
    console.error(`  ✗ guide-walking: ${err.message}`);
  }

  console.log('\n=== Done ===');
  console.log('Next: run wire-entity-guide-pages.ts to wire 7 route entities to guide-walking');
}

run().catch(console.error);
