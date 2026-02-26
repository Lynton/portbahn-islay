# GUIDE-EDITORIAL-WIRE
Extended Editorial — PortableText Import Data, All 5 Guide Pages
**Date:** 2026-02-22
**Status:** Ready for /dev import
**Content source:** GUIDE-*.md Section 5 (all 5 pages, unchanged from spec)

---

## Dev Instructions

### 1. Schema addition — `guidePage`

Add to the `guidePage` schema fields:

```typescript
defineField({
  name: 'extendedEditorial',
  title: 'Extended Editorial',
  description: 'Guide-level editorial voice. Renders between contentBlocks and faqBlocks. Page-specific — not a reusable block.',
  type: 'array',
  of: [{ type: 'block' }],
})
```

### 2. Template slot — guide page template

Between the `<BlockRenderer contentBlocks={...}>` render and the FAQ section:

```tsx
{document.extendedEditorial && document.extendedEditorial.length > 0 && (
  <div className="guide-extended-editorial">
    <PortableText value={document.extendedEditorial} components={portableTextComponents} />
  </div>
)}
```

Note: `portableTextComponents` must handle `h3` style, `normal` style, `strong` mark, and `link` mark. Confirm `thematicBreak` handler also exists — see C10 scorecard note.

### 3. Wire import

Import the named exports below and add to each `guidePage` document in `wire-guide-pages.ts`.

**Note on links:** Internal links use `{ _type: 'link', href: '/path' }`. If the schema uses `internalLink` with `_ref` references instead, convert the `href` values accordingly.

---

## PortableText Data

Copy the TypeScript block below into the wire script (or a separate import file).

```typescript
// ─── Types ───────────────────────────────────────────────────────────────────

type Span = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

type MarkDef = {
  _key: string
  _type: string
  href?: string
}

type Block = {
  _type: 'block'
  _key: string
  style: string
  markDefs: MarkDef[]
  children: Span[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const h3 = (key: string, text: string): Block => ({
  _type: 'block',
  _key: key,
  style: 'h3',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}c0`, text, marks: [] }],
})

const p = (key: string, text: string): Block => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}c0`, text, marks: [] }],
})

// ─── Distilleries ─────────────────────────────────────────────────────────────
// Slug: /guides/islay-distilleries

export const distilleriesExtendedEditorial: Block[] = [

  h3('d01', 'Starting at Bruichladdich'),

  p('d02', "Every guest who stays with us gets the same first piece of advice: tour Bruichladdich before anything else. It's a 5-minute walk along the coastal cycle path — you can walk there, spend two to three hours exploring the distillery and taking a tour, and walk home. No driving, no designated driver logistics, no taxis to arrange. That alone makes it different from every other distillery on the island."),

  p('d03', "Beyond the logistics, Bruichladdich is genuinely unlike any other Islay distillery. Self-styled Progressive Hebridean Distillers, they produce single malts across the full peat spectrum: the unpeated Laddie Classic at one end, the traditionally Islay Port Charlotte range in the middle, and Octomore — the world's most heavily peated whisky — at the other. For gin, The Botanist is made here too, one of the UK's most awarded gins. There is something for every palate."),

  // External link: bruichladdich.com
  {
    _type: 'block',
    _key: 'd04',
    style: 'normal',
    markDefs: [{ _key: 'd04lnk1', _type: 'link', href: 'https://www.bruichladdich.com' }],
    children: [
      { _type: 'span', _key: 'd04c0', text: "The distillery tours — particularly the warehouse experience — are personal, unhurried, and excellent. Book ahead; they fill fast in summer and during Fèis Ìle. ", marks: [] },
      { _type: 'span', _key: 'd04c1', text: 'Bruichladdich Distillery', marks: ['d04lnk1'] },
      { _type: 'span', _key: 'd04c2', text: ' — book directly on their website.', marks: [] },
    ],
  },

  h3('d05', 'Planning Your Distillery Days'),

  p('d06', "Two distilleries per day is comfortable; three can feel rushed. This matters because tastings accumulate and the drives between distilleries — especially if you're covering both north and south coasts — add up. Build in time to actually enjoy each experience rather than ticking boxes."),

  // Bold: "The south coast cluster"
  {
    _type: 'block',
    _key: 'd07',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'd07c0', text: 'The south coast cluster', marks: ['strong'] },
      { _type: 'span', _key: 'd07c1', text: " — Ardbeg, Lagavulin, Laphroaig, and the recently reopened Port Ellen — sits within three miles of each other near Port Ellen. This cluster is the obvious full-day focus for heavily peated whisky enthusiasts. Ardbeg has one of the best café kitchens of any distillery on the island — an excellent lunch stop and a reason to pace your arrival. All four can theoretically be visited in a day, but two or three with proper time at each will be more rewarding than a rushed four.", marks: [] },
    ],
  },

  // Bold: "The north coast cluster"
  {
    _type: 'block',
    _key: 'd08',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'd08c0', text: 'The north coast cluster', marks: ['strong'] },
      { _type: 'span', _key: 'd08c1', text: " — Caol Ila, Bunnahabhain, and Ardnahoe — faces the Sound of Islay across to the Paps of Jura. Ardnahoe, the most recent distillery on the island (opened 2018), has a visitor centre with outstanding views and good food. Bunnahabhain produces mostly unpeated malts — a contrast to the south coast style. This cluster is another natural full day, with the drive north via Port Askaig a pleasure in itself.", marks: [] },
    ],
  },

  // Bold: "Bowmore and Kilchoman"
  {
    _type: 'block',
    _key: 'd09',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'd09c0', text: 'Bowmore and Kilchoman', marks: ['strong'] },
      { _type: 'span', _key: 'd09c1', text: " each warrant individual visits. Bowmore, Islay's largest village, is an easy stop as part of any day on the island — the distillery claims to be Islay's oldest (1779). Kilchoman is different in character: a working farm distillery, the only one in Scotland producing barley to bottle entirely on site. The atmosphere is unpretentious and agricultural; the café for lunch is a favourite with our guests.", marks: [] },
    ],
  },

  h3('d10', 'Fèis Ìle — the Islay Whisky Festival'),

  p('d11', 'Fèis Ìle (pronounced "Fesh Ee-la") takes place in late May each year — typically the last week, running for approximately ten days. It is one of the world\'s most celebrated whisky festivals and transforms the island: each distillery hosts its own open day with exclusive bottlings, live music, tastings, and distillery tours at prices that sell out months in advance.'),

  p('d12', "If you're visiting during Fèis Ìle, book everything as early as possible. Distillery open days sell out; ferry vehicle spaces are extremely limited (book 12 weeks ahead as a minimum); accommodation on the island is fully booked by January. The atmosphere is exceptional — the best of Islay's community and whisky culture combined — but it requires planning that is not compatible with a last-minute booking mindset."),

  p('d13', "If Fèis Ìle dates conflict with your preferred travel window but you want to experience the festival atmosphere, some distilleries extend their festival programmes. Check individual distillery websites from December onwards."),

  h3('d14', 'Tasting Notes — The Islay Style Spectrum'),

  p('d15', "Understanding the peat spectrum helps visitors plan itineraries around their palate:"),

  // Bold: "Heavily peated"
  {
    _type: 'block',
    _key: 'd16',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'd16c0', text: 'Heavily peated', marks: ['strong'] },
      { _type: 'span', _key: 'd16c1', text: ' (smoky, medicinal, maritime): Ardbeg, Laphroaig, and Octomore from Bruichladdich. These are the expressions that define "Islay whisky" in the popular imagination.', marks: [] },
    ],
  },

  // Bold: "Medium-peated"
  {
    _type: 'block',
    _key: 'd17',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'd17c0', text: 'Medium-peated', marks: ['strong'] },
      { _type: 'span', _key: 'd17c1', text: ' (balanced, accessible): Lagavulin, Bowmore, and Port Charlotte from Bruichladdich. Classic Islay character without the extreme intensity.', marks: [] },
    ],
  },

  // Bold: "Lightly peated or unpeated"
  {
    _type: 'block',
    _key: 'd18',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'd18c0', text: 'Lightly peated or unpeated', marks: ['strong'] },
      { _type: 'span', _key: 'd18c1', text: " (fruity, floral, complex without smoke): Bunnahabhain (mostly unpeated), Kilchoman single cask releases, The Laddie Classic from Bruichladdich, and Caol Ila's lighter expressions.", marks: [] },
    ],
  },

  p('d19', "If peat is not your thing, Islay has excellent options beyond the smoky stereotype — Bunnahabhain and Bruichladdich's unpeated range specifically. Don't rule out visiting because you prefer lighter styles."),

]

// ─── Beaches ──────────────────────────────────────────────────────────────────
// Slug: /guides/islay-beaches

export const beachesExtendedEditorial: Block[] = [

  h3('b01', 'How to Plan a Beach Day on Islay'),

  p('b02', "Islay's beaches reward a little planning. For rock pooling — one of the best activities at Portbahn Beach, Portnahaven, and the east coast beaches — the window is roughly two hours either side of low tide. Download tide times before you arrive; the BBC Weather app covers Islay and is reliable. Low tide at any Loch Indaal beach gives you more rock pool area and calmer paddling; at Atlantic beaches it reveals wider stretches of sand."),

  p('b03', "For beach access, most of the main beaches have small car parks or roadside parking — none are far from the road. Machir Bay and Saligo Bay have car parks at the end of minor single-track roads from Kilchoman and Saligo respectively; check these are passable before heading out in anything low-slung. Ardnave Point is accessed from the B8017 road toward Loch Gruinart — park at the end of the road and walk the last few minutes across the machair to the beach."),

  h3('b04', 'Singing Sands'),

  // Internal link: wildlife guide
  {
    _type: 'block',
    _key: 'b05',
    style: 'normal',
    markDefs: [{ _key: 'b05lnk1', _type: 'link', href: '/guides/islay-wildlife' }],
    children: [
      { _type: 'span', _key: 'b05c0', text: "Singing Sands (Traigh Bhàn) is on Islay's east coast, accessed from a small car park near Ballygrant off the A846. The walk to the beach takes around 20 minutes through pasture and machair — not difficult, suitable for most ages, but not a buggy-friendly route. The beach is beautiful in its own right, quiet and rarely visited — but the remarkable thing is the sand itself. When it's dry, it squeaks distinctly underfoot. Children are instantly obsessed with it; adults aren't far behind. Time it for the end of a sunny afternoon when the sand has had time to dry out. It's one of Islay's more unexpected pleasures. See also the ", marks: [] },
      { _type: 'span', _key: 'b05c1', text: 'wildlife guide', marks: ['b05lnk1'] },
      { _type: 'span', _key: 'b05c2', text: " if you're combining with an east coast birding day.", marks: [] },
    ],
  },

  h3('b06', 'Wild Swimming on Islay'),

  p('b07', "Wild swimming on Islay is wonderful — genuinely. But the water is cold year-round (10–14°C is typical, even in August), and choosing your location matters enormously."),

  p('b08', "The sheltered Loch Indaal beaches are where you want to swim. Portbahn Beach has three small coves with calm water and almost no tidal flow — it's our go-to spot and you'll usually have it entirely to yourselves. Port Charlotte Beach is shallower and suits those less confident in the water. Both sites allow a quick exit if the cold hits. The east coast, particularly around Claggain Bay and Singing Sands, has calmer water than the west coast and offers excellent wild swimming in more remote settings."),

  p('b09', "Never swim at Machir Bay, Saligo Bay, or Sanaigmore. The currents at these beaches have caused serious incidents, including fatalities. They look inviting — the water can appear relatively calm on the surface — but the undertow is powerful and unpredictable. If you see a lifeguard flag system anywhere on Islay, it exists specifically because of how dangerous those beaches are."),

  p('b10', "For cold water comfort, a 3mm shorty wetsuit makes wild swimming significantly more enjoyable. A dry robe or changing poncho is practical for getting changed on a beach with Atlantic wind."),

  h3('b11', 'Beach Walks Worth Planning For'),

  p('b12', "Islay's beaches connect to some of the island's best coastal walking. Two worth specific mention:"),

  // Bold: "Machir Bay north to Opera House Rocks"
  {
    _type: 'block',
    _key: 'b13',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'b13c0', text: 'Machir Bay north to Opera House Rocks', marks: ['strong'] },
      { _type: 'span', _key: 'b13c1', text: " — Park at Machir Bay and walk north along the cliff tops (not the beach — the currents make the tide line risky even at the water's edge). The coastal scenery becomes increasingly dramatic. Eagles are frequently spotted on this stretch. A return walk of 4–5 km from the car park.", marks: [] },
    ],
  },

  // Bold: "Ardnave Point and Loch Gruinart" + internal link: wildlife guide
  {
    _type: 'block',
    _key: 'b14',
    style: 'normal',
    markDefs: [{ _key: 'b14lnk1', _type: 'link', href: '/guides/islay-wildlife' }],
    children: [
      { _type: 'span', _key: 'b14c0', text: 'Ardnave Point and Loch Gruinart', marks: ['strong'] },
      { _type: 'span', _key: 'b14c1', text: " — Ardnave Point's dunes and beach connect directly to the RSPB Loch Gruinart nature reserve just inland. A morning or afternoon combining both gives you beach, dunes, and birdwatching in one circuit — particularly rewarding between October and April when the barnacle geese are on the loch. See the ", marks: [] },
      { _type: 'span', _key: 'b14c2', text: 'wildlife guide', marks: ['b14lnk1'] },
      { _type: 'span', _key: 'b14c3', text: ' for the geese detail.', marks: [] },
    ],
  },

]

// ─── Wildlife ─────────────────────────────────────────────────────────────────
// Slug: /guides/islay-wildlife

export const wildlifeExtendedEditorial: Block[] = [

  h3('w01', 'When to Visit for Wildlife'),

  p('w02', "Islay's wildlife calendar has distinct seasons, and timing your trip around one or two target species transforms the experience."),

  // Bold: "October to April (winter)"
  {
    _type: 'block',
    _key: 'w03',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'w03c0', text: 'October to April (winter)', marks: ['strong'] },
      { _type: 'span', _key: 'w03c1', text: ' is the standout season for birdwatchers. The barnacle geese arrive from Greenland in October, and at their peak there are over 30,000 at Loch Gruinart — the morning flight at dawn, when thousands lift off the loch simultaneously, is one of the most extraordinary wildlife spectacles in Britain. The sound carries for miles. This is also the best time for waders, wildfowl, and raptors on the reserve. Winter light on the Rhinns is often extraordinary — low, long, and golden even on clear days.', marks: [] },
    ],
  },

  // Bold: "May to September (summer)"
  {
    _type: 'block',
    _key: 'w04',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'w04c0', text: 'May to September (summer)', marks: ['strong'] },
      { _type: 'span', _key: 'w04c1', text: " offers different wildlife but equally rich. Basking sharks patrol the waters around the Mull of Oa and Rinns Point — Islay is one of the better spots in Scotland for seeing them from headlands in calm conditions. Minke whales occasionally appear in the Sound of Islay between June and August. Seabirds nest on the coastal cliffs at The Oa through summer; this is the best time to see choughs, one of the UK's rarest corvids, on the clifftop walks there. Sea eagles breed on Islay and can be seen year-round, but are more actively hunting over coastal areas in summer.", marks: [] },
    ],
  },

  // Bold: "Year-round"
  {
    _type: 'block',
    _key: 'w05',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'w05c0', text: 'Year-round', marks: ['strong'] },
      { _type: 'span', _key: 'w05c1', text: ': both eagle species, grey and common seals, occasional otters, and year-round birdwatching at Loch Gruinart and the coastal paths.', marks: [] },
    ],
  },

  h3('w06', 'Watching the Barnacle Geese at Loch Gruinart'),

  p('w07', "RSPB Loch Gruinart reserve is 20 minutes' drive from our Bruichladdich properties, accessed via the B8018 road through Kilchoman. The reserve has two hides and an information centre. The best viewing is at dawn, when the geese lift from their overnight roost on the loch — arrive before first light and wait in the hide. The experience is as much about sound as sight: the noise of 30,000 birds building to take flight, and then the overwhelming rush of wings, is unlike anything else."),

  p('w08', "Peak numbers are typically November and December. By March the geese are preparing to leave; by April they're gone. The reserve is free to visit; parking and hides are at the end of the reserve road. If you're coming in winter, dress for cold and damp — binoculars with good low-light performance make a significant difference at dawn."),

  // Internal link: food and drink guide
  {
    _type: 'block',
    _key: 'w09',
    style: 'normal',
    markDefs: [{ _key: 'w09lnk1', _type: 'link', href: '/guides/food-and-drink' }],
    children: [
      { _type: 'span', _key: 'w09c0', text: "RSPB Loch Gruinart is also, separately, an oyster farm — one of the finest in Scotland, farming in the cold, clean tidal waters of the loch. Combining a dawn geese watch with fresh oysters later in the morning is one of the best day-out combinations on the island. See the ", marks: [] },
      { _type: 'span', _key: 'w09c1', text: 'food and drink guide', marks: ['w09lnk1'] },
      { _type: 'span', _key: 'w09c2', text: ' for the Loch Gruinart Oyster Shack details.', marks: [] },
    ],
  },

  h3('w10', 'Watching for Otters'),

  p('w11', "Islay's otters are shy and elusive, but they are there. The best chance is along sheltered shorelines — the Bruichladdich to Port Charlotte coastal path runs along exactly the right kind of terrain, with rocky outcrops, seaweed beds, and shallow water where otters feed. Early morning and dusk are the productive times: an otter moving along the shore, turning rocks or diving briefly, can be spotted by a careful eye if you walk slowly and scan ahead rather than just watching your feet."),

  p('w12', "Loch Gruinart's shoreline and the quieter stretches of the Rhinns coastline around Portnahaven are also good. The Corryvreckan channel between Jura and Scarba (accessible on a day trip to Jura) holds otters, though the primary attraction there is the whirlpool itself."),

  p('w13', "Patience is the essential kit. Binoculars help. If you're actively looking for otters, plan a slow two-hour coastal walk rather than a brisk one."),

  h3('w14', 'The RSPB Oa and the Choughs'),

  p('w15', "The Mull of Oa is Islay's dramatic southern headland — cliff-lined, exposed, and atmospheric in any weather. The RSPB The Oa reserve here protects cliffs, coastal heath, and the best chough population on Islay. Choughs are red-billed, red-legged members of the crow family — acrobatic fliers, particularly visible in pairs or small groups along the cliff edges. Islay is one of the most reliable places in Scotland to see them."),

  p('w16', "The Oa also has a striking landmark: the American Monument on the headland cliff, commemorating the loss of American troops aboard the troopships HMS Tuscania and HMS Otranto, both sunk off the Oa in 1918. The monument, the coastal walk to reach it, and the dramatic views to the Antrim coast of Ireland on clear days make this one of Islay's most rewarding half-day excursions — the wildlife is a bonus to the landscape."),

  h3('w17', 'Staying at Shorefield for Wildlife'),

  // Internal link: Shorefield Eco House
  {
    _type: 'block',
    _key: 'w18',
    style: 'normal',
    markDefs: [{ _key: 'w18lnk1', _type: 'link', href: '/accommodation/shorefield-eco-house' }],
    children: [
      { _type: 'span', _key: 'w18c0', text: "Shorefield Eco House is our wildlife property — the Jacksons built it specifically around a love of birds and nature. They created wetland ponds, planted the woodland that now surrounds the house, and installed bird hides in the garden. The binoculars and bird books in the house are from their personal collection. Guests who prioritise wildlife consistently gravitate toward Shorefield: it offers passive wildlife watching from the windows — waterfowl, seabirds, and garden birds without leaving the property — alongside the active wildlife experiences available across the island. ", marks: [] },
      { _type: 'span', _key: 'w18c1', text: 'View Shorefield Eco House', marks: ['w18lnk1'] },
      { _type: 'span', _key: 'w18c2', text: '.', marks: [] },
    ],
  },

]

// ─── Food & Drink ─────────────────────────────────────────────────────────────
// Slug: /guides/food-and-drink

export const foodDrinkExtendedEditorial: Block[] = [

  h3('f01', 'Booking Ahead on Islay'),

  p('f02', "Islay's restaurants are small, popular, and on an island — there is no overflow option if your first choice is full. Our firm advice: plan your restaurant evenings before you leave home. The Lochindaal Seafood Kitchen requires 24 hours' notice for the full platter and is worth planning your whole day around — don't just turn up. The Port Charlotte Hotel restaurant fills on music nights (Wednesday and Sunday); book ahead if you want a table rather than eating at the bar. An Tigh Seinnse in Portnahaven is tiny and gets busy regardless of season. Even the distillery cafés can fill at peak lunchtimes in summer."),

  p('f03', "Most venues can be booked by phone or a direct message. Online booking exists at some but not all. When in doubt, call. And if you struggle to get through to anyone, ask us — we know these venues well and can often help."),

  h3('f04', 'Opening Hours: A Reality Check'),

  p('f05', "Many Islay venues operate reduced or seasonal hours, particularly November to March. Opening days and times can change, and smaller venues occasionally close without much notice if the chef is unavailable or supplies don't arrive on the ferry. Our practical advice: check before you drive anywhere. The Port Charlotte Hotel is the most reliably open year-round. Distillery cafés operate during distillery visiting hours — check ahead in winter, when those hours may be reduced or paused entirely."),

  p('f06', "If you're planning a specific meal on a specific night, particularly for a celebration or a special occasion, tell us when you book and we'll help you get it right."),

]

// ─── Family Holidays ──────────────────────────────────────────────────────────
// Slug: /guides/family-holidays

export const familyHolidaysExtendedEditorial: Block[] = [

  h3('k01', 'Planning Your Family Week'),

  p('k02', "Seven nights is our minimum recommendation for Islay with children — it gives you five full days without feeling rushed. The island rewards a slower pace than most holiday destinations, and that suits children enormously. A rhythm that works well: alternate a beach day with a village or rainy day activity; save at least one day for a wildlife focus; plan one longer excursion across to the south coast distilleries or north to Loch Gruinart and Ardnave Point."),

  p('k03', "Don't try to do everything. The children who leave Islay happiest are the ones who had time to get genuinely absorbed in one beach, one rock pool, one morning watching the geese. One of our guests captured it well — \"the kids didn't want screens all week — they were too busy with the beach, the trampoline, and counting seals.\""),

  p('k04', "The Port Mor playground in Port Charlotte (5-minute drive) is a reliable backup for any afternoon that's going sideways — it has sea views and is right next to the village for an ice cream."),

  h3('k05', 'What to Pack'),

  p('k06', "Wellies and waterproofs are non-negotiable. The weather changes hourly; that's not an exaggeration. A basic rock-pooling kit (bucket, small net) transforms Portbahn Beach at low tide — there are crabs, sea anemones, whelks, and small fish in every pool. We keep binoculars in all three properties, but if you're serious about wildlife bring your own with a higher magnification for the geese and eagles. Download tide times before you arrive — the rock-pooling window is roughly two hours either side of low tide, and planning around it pays off."),

  p('k07', "Wetsuits aren't essential but make a genuine difference if the children want to swim. The water around Islay runs cold year-round (10–14°C). A shorty wetsuit extends paddling sessions from two minutes to forty and can transform a beach day entirely."),

  h3('k08', 'Singing Sands — Worth the Walk'),

  // Internal link: beaches guide
  {
    _type: 'block',
    _key: 'k09',
    style: 'normal',
    markDefs: [{ _key: 'k09lnk1', _type: 'link', href: '/guides/islay-beaches' }],
    children: [
      { _type: 'span', _key: 'k09c0', text: "Singing Sands (also known as Traigh Bhàn) is on the east coast of Islay near Ballygrant, a short walk from a small car park through low-lying pasture and machair. The beach is beautiful in its own right — quiet, rarely visited, tucked away from the main tourist circuit — but what makes it worth the expedition with children is the sand itself: it squeaks underfoot when dry. Genuinely. Kids find this extraordinary. Bring it at the end of a sunny day when the sand has had time to dry out, let them run up and down, and watch their faces. It's one of those small Islay moments that lodges in the memory. See our ", marks: [] },
      { _type: 'span', _key: 'k09c1', text: 'beaches guide', marks: ['k09lnk1'] },
      { _type: 'span', _key: 'k09c2', text: ' for directions and timing.', marks: [] },
    ],
  },

  h3('k10', 'Wildlife by Age'),

  p('k11', "Islay's wildlife is accessible at every age, but some experiences work better than others depending on how old your children are."),

  p('k12', "For under-5s, rock pools are the headline act — Portbahn Beach at low tide is small, safe, and endlessly interesting. The seals at Portnahaven harbour are almost always there and visible without any walking. Both experiences require no planning or specialist kit and can be done in an hour if attention spans are short."),

  p('k13', "For children aged 5–10, the barnacle geese at RSPB Loch Gruinart (October to April, dawn) are a level up — the sound of 30,000 birds lifting off the loch is unforgettable in a way that photographs don't capture. Pair it with the nature trail at Loch Gruinart and you have a proper morning out. Golden eagles and sea eagles can be spotted year-round by scanning the hillsides and coastal cliffs from the car — a good travel game on any drive."),

  p('k14', "For teenagers, the Kilchoman farm distillery makes a surprisingly engaging half-day — seeing the full whisky-making process from barley grown on the farm to bottle, with a café lunch, is genuinely interesting for curious minds regardless of interest in whisky itself. The coastal walk from Machir Bay north to Opera House Rocks (staying well back from the water) offers dramatic Atlantic scenery and a real sense of remoteness. Fit older teenagers can tackle the walk to the top of the Oa for views to Ireland."),

]
```

---

## Block Count by Page

| Page | Blocks | Sections | Internal links |
|---|---|---|---|
| Distilleries | 19 | 4 | 1 external (bruichladdich.com) |
| Beaches | 14 | 4 | 2 internal (wildlife ×2) |
| Wildlife | 18 | 5 | 2 internal (food-and-drink, shorefield) |
| Food & Drink | 6 | 2 | — |
| Family Holidays | 14 | 4 | 1 internal (beaches) |
| **Total** | **71** | | |

---

## C9 Query Fan-out Projection

Once `extendedEditorial` renders, each page gains the following additional answerable query types:

**Distilleries** (+4): "which distillery cluster to visit", "peat spectrum / what to drink", "Fèis Ìle logistics", "is Bruichladdich walkable from accommodation"

**Beaches** (+4): "rock pooling timing and where", "wild swimming Islay safety", "Singing Sands how to get there", "beach walks Islay"

**Wildlife** (+5): "when to visit Islay for wildlife", "Loch Gruinart barnacle geese practical guide", "otter watching Islay", "RSPB Oa choughs", "Shorefield wildlife accommodation"

**Food & Drink** (+2): "do I need to book restaurants Islay", "Islay restaurant opening hours winter"

**Family** (+4): "how long to stay Islay with children", "what to pack Islay family holiday", "Singing Sands children", "Islay wildlife by children's age"

All 5 pages project 13–15 answerable queries once C4 is live. C9 passes.
