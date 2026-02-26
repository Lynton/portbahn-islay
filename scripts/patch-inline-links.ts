/**
 * patch-inline-links.ts
 *
 * Patches fullContent of existing canonicalBlock documents to add inline links.
 * Only updates the fullContent PortableText field — all other fields untouched.
 *
 * Blocks patched:
 *   Block 4  — canonical-block-bruichladdich-proximity
 *   Block 7  — canonical-block-port-charlotte-village
 *   Block 8  — canonical-block-distilleries-overview
 *   Block 9  — canonical-block-wildlife-geese
 *   Block 10 — canonical-block-food-drink-islay
 *   Block 11 — canonical-block-beaches-overview
 *   Block 12 — canonical-block-families-children
 *   Block 13 — canonical-block-jura-day-trip
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/patch-inline-links.ts
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Block 4: bruichladdich-proximity ─────────────────────────────────────────

const BLOCK_4_MD = `
The village of Bruichladdich, dominated by its progressive [Bruichladdich Distillery](https://www.bruichladdich.com), sits on the western shore of Loch Indaal on the Rhinns of Islay, a fifteen-minute drive from Islay's main centre of Bowmore.

The Rhinns has a character all of its own and is geologically completely different to the rest of Islay — part of the land mass connected to South America, comprised primarily of incredibly ancient gneiss rock, with a fault line running the centre of Loch Indaal through Loch Gruinart. Earthquakes are frequent, though rarely felt!

We love this part of Islay, from Bridgend Woods, down through the pretty harbour villages of Port Charlotte and Portnahaven at the tip, to the dramatic west coast beaches and rock formations at Machir Bay, Saligo and Sanaigmore.

The village is a great base to explore everything the island offers. You're a scenic 5-minute walk to Bruichladdich Distillery along the coastal cycle path — tour the distillery, sample world-renowned, record-breaking single malts and, of course, The Botanist gin, then walk home.

The coastal location of our houses gives immediate access to [Portbahn Beach](/explore-islay/islay-beaches) just down from the war memorial — one of Islay's hidden gems with three sheltered bays perfect for wild swimming, rock pooling, and coastal ambling.

It's also just a 5-minute drive or 40-minute walk from Port Charlotte village, perhaps Islay's prettiest, with two outstanding pubs/hotels with excellent local food and extensive whisky selections — The Port Charlotte Hotel and [Lochindaal Seafood Kitchen](/explore-islay/food-and-drink). There's also the fascinating [Museum of Islay Life](https://www.islaymuseum.org) about the history of the island, a local shop, post office and petrol station, and the children's playground at Port Mor.

**From Here, Everything's Reachable**

From Bruichladdich, all ten of Islay's whisky distilleries are within easy reach. The island's renowned [beaches](/explore-islay/islay-beaches) — Machir Bay to Saligo Bay to the dunes at Ardnave Point — offer miles of golden sand and dramatic Atlantic surf. [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) provides exceptional birdwatching, with over 30,000 barnacle geese arriving each winter from Greenland. The countryside is perfect for hiking and [wildlife spotting](/explore-islay/islay-wildlife), from golden eagles to seals.

Bruichladdich's central west coast location on the Rhinns makes it an ideal base for experiencing the very best of island life on Islay — but from a different angle than the ferry ports.
`;

// ─── Block 7: port-charlotte-village ──────────────────────────────────────────

const BLOCK_7_MD = `
Port Charlotte is perhaps Islay's prettiest village, just a 5-minute drive or 40-minute walk along the coastal path from our properties. It's the social hub of the Rhinns, with regular live music at the Port Charlotte Hotel and immense local seafood platters at the Lochindaal — it has everything you'll need for a self-catering break.

**Where to Eat & Drink**

**Port Charlotte Hotel** — Owned and run by Grahame and Isabelle, with Scottish fare and an outstanding whisky bar with 300+ bottles on their single malt menu. The restaurant takes bookings (advised), but the bar is walk-in. Good Sunday roasts. Traditional Scottish live music on Wednesdays and Sundays is popular and a lovely way to spend an evening by a roaring log fire, dram in hand.

**Lochindaal Seafood Kitchen** — Truly exceptional, run with huge heart by Jack and his father Iain. An absolute highlight (we'd say a MUST), the seafood platters from the local fishermen's catch feature oysters, langoustines, crab, lobster and mussels. You need to order the full platter 24 hours ahead and it may vary depending on catch — but it is absolutely worth planning around. Also a great whisky selection if you just want to drop in for a pint or a dram. Our guests consistently rave about this place and it's one of our favourite spots on the Rhinns. [See the full food & drink guide →](/explore-islay/food-and-drink)

**What Else You'll Find**

The [Museum of Islay Life](https://www.islaymuseum.org) tells the history of the island. There's a local shop, post office and petrol station for essentials. For families, the children's playground at Port Mor has sea views and is a favourite with our kids and our guests' children. There's also a good café serving great comfort food.
`;

// ─── Block 8: distilleries-overview ───────────────────────────────────────────

const BLOCK_8_MD = `
Having lived and worked on Islay for a number of years, we know the island well and want to share our take on the whisky scene. Islay currently has ten working whisky distilleries, and you're just a 5-minute walk from one of the world's best and certainly most innovative — and the reason we came to the islands — [Bruichladdich](https://www.bruichladdich.com).

Islay produces some of the world's most celebrated single malts and people come here from all over the world, almost as a pilgrimage, particularly for the intensely peated, smoky whiskies that are synonymous with Islay's maritime character. Many visitors plan entire trips around distillery tours and tastings — we've hosted whisky groups dozens of times, and we're always happy to help you plan your distillery days.

**The Ten Islay Distilleries**

- [Ardbeg](https://www.ardbeg.com) — Intensely peated, cult following, stunning coastal location, wonderful café
- [Lagavulin](https://www.malts.com/en-gb/distilleries/lagavulin) — Classic Islay style, 16-year flagship, accessible from Port Ellen
- [Laphroaig](https://www.laphroaig.com) — Medicinal, iodine notes, right on the shore — love it or hate it!
- [Bowmore](https://www.bowmore.com) — Claims to be Islay's oldest (1779), balanced peat, town centre location
- [Bruichladdich](https://www.bruichladdich.com) — Innovative and radical; world's most heavily peated as well as unpeated expressions + The Botanist gin, 5-minute walk from our properties
- [Kilchoman](https://kilchomandistillery.com) — Farm distillery, barley to bottle on-site, very visitor-friendly, great café for lunch
- [Bunnahabhain](https://bunnahabhain.com) — Gentle, mostly unpeated, remote northern location with stunning views of the Paps of Jura
- [Caol Ila](https://www.malts.com/en-gb/distilleries/caol-ila) — Largest Islay producer, used in Johnnie Walker, Port Askaig, dramatic setting
- [Ardnahoe](https://ardnahoedistillery.com) — Opened 2018, Port Askaig, lightly-peated, core expressions now available, great café with views across the Sound of Islay
- [Port Ellen](https://www.malts.com/en-gb/distilleries/port-ellen) — Closed 1983, fully reopened 2024, south coast, heavily-peated, by appointment only via malts.com

**Our Recommendation: Start at Bruichladdich**

Tour Bruichladdich first — it's our nearest distillery, an easy 5-minute walk along the coastal path and it really is genuinely unique.

Self-styled Progressive Hebridean Distillers, Bruichladdich are one of the most creative whisky distillers in Scotland, driving the importance of terroir and provenance throughout all their single malts. They release very limited editions of single farm, single vintage and single barley varieties each year in their Islay Barley and Bere Barley ranges. They're also quite special in that their malts range from the unpeated Laddie Classic, through the more traditionally Islay heavily-peated Port Charlotte, to the world's peatiest whisky, the highly exclusive Octomore range.

For gin lovers, the distillery is also home to the world-class, award-winning Botanist Gin. There's genuinely something for everybody at Bruichladdich, which is why it makes such a good first visit.

The distillery tours and whisky tastings, particularly the warehouse experience, are truly excellent — personal and a fascinating insight into the pedigree of whisky in quite a different way.

As a bonus, you can walk home afterward without worrying about driving. We recommend this to every guest, and the feedback is always very positive. It really is the one place we'd urge you to go if you're only visiting one distillery.

From there, plan your distillery days based on your whisky preferences. Heavily peated? Focus on the short stretch of southern coast that contains Ardbeg, Lagavulin, and Laphroaig (the south coast "killers"). A bit softer with more balance? Bowmore. Small and traditional? Head for Kilchoman and have lunch at the café. For something gentler, Bunnahabhain produces beautiful unpeated malts. And if you want to see whisky production at scale and with technology, head for Caol Ila or Ardnahoe.

**How Many Distilleries Per Day?**

Two per day is comfortable. Three can become rushed and overwhelming. It also depends where you're heading.

It makes sense to visit Ardbeg, Laphroaig and Lagavulin as a trio since they're so close — a natural south coast cluster. Port Ellen is also on this stretch and is now open for pre-booked tours (appointment only via malts.com). Ardbeg has a great café so you can break the day with lunch there.

On the north coast, Caol Ila, Bunnahabhain and Ardnahoe sit along the Sound of Islay facing the Paps of Jura and make another good cluster, with good food and drinks at the Ardnahoe visitor centre.

Something to remember: factor in travel time between distilleries (some are 45+ minutes apart), and remember that tastings accumulate quickly. Pace yourself and actually enjoy the experience rather than ticking boxes.

Our whisky groups typically tour 5-6 distilleries over 3-4 full days, with beach walks and meals in between. That rhythm seems to work really well. See our [food and drink guide](/explore-islay/food-and-drink) for the best distillery café lunch stops.

And make sure you leave time for Islay's other attractions — most importantly, the pace of life!

**Booking Distillery Tours**

Book tours in advance — essential for summer dates and absolutely critical for [Fèis Ìle](https://www.feisile.co.uk) (the whisky festival in late May). Most distilleries limit tour sizes and fill up weeks ahead. Tours typically run 10am-4pm with limited afternoon slots. Check individual distillery websites for availability and prices.

Most distilleries offer standard tours (45-60 minutes, £10-15) plus premium experiences with warehouse tastings or rare drams (£40-80+). If you're serious about whisky, the premium tours are worth it.

**Drinking and Driving**

Scotland's drink-drive limit is effectively zero — take this seriously. Distilleries provide "driver's drams" — takeaway miniatures for designated drivers to enjoy later at your accommodation. This system works well. Let them know who's driving when you arrive for a tasting and they'll usually help you out.

Alternatively, hire a guide or taxi for distillery days. We can recommend local drivers who specialise in distillery tours if you'd prefer not to worry about limits.
`;

// ─── Block 9: wildlife-geese ───────────────────────────────────────────────────

const BLOCK_9_MD = `
Islay is exceptional for wildlife and particularly known for its birdwatching. Although you can spot a huge array of bird life all year round, timing can be everything!

**Barnacle Geese**

Over 30,000 barnacle geese arrive from Greenland each October, spending winter on Islay before returning north in April. [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) reserve is the best viewing location — the morning flights as thousands of geese lift from the loch are spectacular. The sound is unforgettable.

If you're visiting between October and April, witnessing the geese is a highlight. Arrive at Loch Gruinart at dawn for the best show. Guests who've experienced this consistently describe it as one of their trip highlights. The local farmers, however, are a bit less enthusiastic — they can decimate crops!

**Eagles**

Islay has both golden eagles and white-tailed sea eagles — two of Scotland's most magnificent raptors. Keep an eye out for them over moorland, coastal cliffs, and inland hills. Sea eagles are enormous with wingspans up to 8 feet. If you see something huge gliding overhead, it's likely a sea eagle. A good check is "does it look like a barn door?" — their square-ended wing profile is quite distinctive.

We keep binoculars in all our properties, and guests regularly spot eagles from the houses or during coastal walks.

**Seals, Otters & Marine Life**

Common seals and grey seals frequent Loch Indaal and coastal areas. Guests spot seals from our property windows regularly — sometimes they're visible from the breakfast table at [Portbahn House](/accommodation/portbahn-house). Otters are shyer but present along quiet shorelines. Your best chance is early morning or dusk along the coast. Meandering along the stretch of coast that runs alongside the Bruichladdich–Port Charlotte cycle path is a lovely way to wildlife spot.

Dolphins and porpoises also occasionally visit Loch Indaal. We've had guests see them from Portbahn House and [Shorefield's](/accommodation/shorefield-eco-house) windows — it's rare but magical when it happens. Minke whales and basking sharks can sometimes be seen offshore in summer months.

**RSPB Reserves**

- [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) — Flagship reserve for geese, waders, raptors. Also has a nature trail and woods to explore.
- [RSPB The Oa](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa) — Cliffs, choughs, seabirds, dramatic coastal scenery.

Both reserves are free to visit with hides, trails, and visitor information. Bring binoculars (essential for birding), a camera with zoom lens, and warm layers for dawn/dusk watching.
`;

// ─── Block 10: food-drink-islay ────────────────────────────────────────────────

const BLOCK_10_MD = `
Islay's food scene emphasises local seafood, lamb, venison and whisky. Dining out generally isn't cheap, but quality is high. Most guests cook meals in our well-equipped kitchens as well and eat out selectively. Here's where we recommend:

**Our Top Recommendations**

**Lochindaal Seafood Kitchen, Port Charlotte**
Lochindaal Seafood Kitchen is truly exceptional, run with huge heart by Jack and his father Iain — seafood platters from the local fishermen's catch, featuring local oysters, langoustines, crab, and mussels among others. You do need to order the full platter 24 hours ahead, but it's really worth planning around. Small, cosy venue in Port Charlotte with two bars. Book ahead — it fills fast. Our guests consistently rave about this place. Also a great whisky selection if you just want to drop in for a pint or a dram.

**Port Charlotte Hotel**
Scottish fare and an outstanding whisky bar with 300+ bottles on their single malt menu. The restaurant takes bookings (advised), but the bar is walk-in. Good Sunday roasts. Traditional Scottish live music on Wednesdays and Sundays is popular and a lovely way to spend an evening by a roaring log fire, dram in hand. We send guests here regularly, and they're never disappointed.

**An Tigh Seinnse, Portnahaven**
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

// ─── Block 11: beaches-overview ───────────────────────────────────────────────

const BLOCK_11_MD = `
Islay's coastline is peppered with dozens of beaches, some sheltered, some ferocious — and you'll often have miles of sand entirely to yourselves. These are some of our favourites and the ones guests ask about most:

**Safe Swimming Beaches**

- Portbahn Beach — Our hidden gem, 5-minute walk, 3 tiny sheltered coves, safe swimming, rock pools at low tide
- Port Charlotte Beach — 5-minute drive, family-friendly, shallow, sandy, ice cream in the village after
- Laggan Bay / Airport Beach — Long, shallow, sandy, safe for swimming
- Kilnaughton Bay — Near Port Ellen, family-friendly, shallow, safe

**Dramatic Atlantic Beaches (NOT safe for swimming)**

- Machir Bay — Islay's most famous, 2 miles of golden sand backed by dunes, dramatic Atlantic surf and stunning sunsets. Head northwards up the coast towards Opera House Rocks for expansive skies, crashing waves and eagles for company. Or head south and walk over the top to the old ruined chapel at Kilchiaran. Spectacular for walks — but DANGEROUS currents.
- Saligo Bay — Dramatic Atlantic, stunning but NOT safe for swimming
- Sanaigmore — Dramatic stretch of northern coast with great rock formations for playing hide and seek. There's also a lovely small art gallery nearby serving coffee and cakes.
- Ardnave Point — Rolling dunes perfect for kids running full pelt, big skies and empty beaches. Combine with a roam through the nature trail and woods at nearby [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart).

**Hidden Beaches on Islay**

- Singing Sands — Beautiful remote beach worth the walk. The sand squeaks underfoot — kids love it.
- Claggain Bay — Secluded, with a lovely coastal walk to reach it. Rarely visited.
- Port Ellen town beach — Convenient if you're arriving by the southern ferry or combining with a south coast distillery day.

**CRITICAL SAFETY WARNING:** Machir Bay, Saligo Bay, and Sanaigmore are **not safe for swimming**. Strong currents, undertows, and cold Atlantic conditions make these "drowning beaches" as locals call them. There have been a number of close calls over the years. Admire them, walk them, photograph them — but don't enter the water. And remember, the RNLI and coastguard who'll come to rescue you are volunteers!

For actual swimming, stick to Loch Indaal beaches (Portbahn, Port Charlotte) or the southeast coast (Laggan Bay, Kilnaughton). Either embrace the cold water (it really is good for you — we love it!), or bring a wetsuit if you're planning any proper open water swimming. The water is cold year-round (10-14°C), and wetsuits make wild swimming more comfortable for longer splashing about. For coastal walks to reach the best beaches, see the [walking guide](/explore-islay/walking).
`;

// ─── Block 12: families-children ──────────────────────────────────────────────

const BLOCK_12_MD = `
Islay is a wonderful holiday for families. Like winding the clock back fifty years if you want to. Safe beaches for rock pooling, wildlife on your doorstep, playgrounds in most of the villages, and just enough activities to fill the days without overscheduling. Children thrive here because they have space to roam, explore, and get properly muddy. And happy children equals happy families!

We've hosted dozens of families in our houses over the years, and we've raised our two children here on both islands — so we know what a special place this is for kids. We know the beaches they love, the rainy day escapes, and the wildlife moments that stick with them. These are the things we do with our own children, rain or sun.

**Safe Beaches for Kids**

Portbahn Beach is our hidden gem — a 5-minute walk from our properties via the war memorial path. Three sheltered bays with rock pools at low tide, safe for paddling, and you'll usually have it entirely to yourselves. Our kids have spent countless hours here collecting shells, watching crabs, and building dams in the rock pools. It's our go-to spot.

Port Charlotte Beach is a 5-minute drive — shallow, sandy, with easy parking and the village right there for ice cream after.

On the southeast coast, Laggan Bay and Kilnaughton Bay (near Port Ellen) offer miles of shallow, sandy shoreline perfect for building sandcastles and safe wading.

Sanaigmore is a dramatic stretch of northern coast with great rock formations for playing hide and seek — our two love it here. There's also a lovely small art gallery nearby serving coffee and cakes for the grown-ups!

Ardnave Point is another favourite — rolling dunes perfect for kids running full pelt, with big skies and empty beaches. Combine it with a roam through the nature trail and woods at nearby [RSPB Loch Gruinart](https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart) for a proper adventure day.

**IMPORTANT:** The big Atlantic beaches (Machir Bay, Saligo Bay) are stunning for walks but **not safe for swimming** — strong currents and undertows. We take our children there for dramatic coastal walks, but stick to the sheltered and shallow Loch Indaal beaches for actual paddling.

**Rainy Day Activities**

When the weather turns (and it will, hourly! — this is Scotland!), we'll often head for the [Mactaggart Leisure Centre](https://www.mactaggartleisurecentre.co.uk/) in Bowmore. The indoor swimming pool is a great place to hang out on wet days and has saved many a holiday. Check their Facebook page — they often have giant inflatables in the school holidays.

[Persabus Pottery](https://www.persabuspottery.com) is run with love by the wonderful Rosemary, and it's another of our family favourites — for kids and grown-ups alike. Our house has plenty of treasured mugs and bowls painted by our children over the years, as do their grandparents' homes! It's a creative activity that keeps everyone engaged for a couple of hours while the rain lashes down outside.

Older children find the [Islay Woollen Mill](https://islaywoollenmillco.com) interesting, with its working looms and the story of island tweed. They produce tweeds for some of the top design houses in the world — do ask them about it!

Honestly, some of our best family days have been wet ones — board games by the fire, hot chocolate, and watching the weather roll across Loch Indaal from the window. Island kids learn to embrace it. There's no such thing as bad weather!

**Wildlife Adventures**

This is where Islay really makes memories for families. Rock pooling at Portbahn Beach at low tide reveals crabs, sea anemones, whelks and tiny fish — our kids always got excited about this while we were living at Portbahn House. Walk the coastal paths and you'll spot seals bobbing in the water — Portnahaven harbour is almost guaranteed. Between October and April, the barnacle geese at Loch Gruinart are unforgettable — 30,000+ birds lifting off at dawn, honking. We take our children every autumn and it never gets old. Eagles circle overhead year-round if you keep looking up.

**Family-Friendly Eating**

The distillery cafés are surprisingly family-friendly — Ardbeg has excellent food and welcomes children, as do Kilchoman and Ardnahoe. Peatzeria in Bowmore does creative wood-fired pizzas in a casual setting that works well with kids — who doesn't love a pizza?! In Bowmore you'll also find The Cottage for burgers, fries, jacket potatoes, and Islay's Plaice for fresh fish and chips that kids and adults alike will devour.

And if you just want to stay in and cook your old home favourites, all our houses have well-equipped kitchens — it's more relaxed, cheaper, and kids eat what they actually want. Hopefully!

**Our Properties for Families**

- [Portbahn House](/accommodation/portbahn-house) has a sunken trampoline and swings in a secure garden — kids can play while you watch from the kitchen. It sleeps 8, so there's space for everyone.
- [Curlew Cottage](/accommodation/curlew-cottage) is set back from the road surrounded by farmland and has a fully enclosed walled patio garden — ideal for younger children who want to run around safely. Cosy inside, peaceful outside.
- [Shorefield Eco House](/accommodation/shorefield-eco-house) appeals to older children who'll appreciate the bird hides and wildlife watching from the windows — grab the binoculars and see what you can spot. Even if bird watching isn't their thing, kids can get lost in the woods behind the house, playing hide and seek or making dens and creating adventures.

One guest told us, *"The kids didn't want screens all week — they were too busy with the beach, the trampoline, and counting seals."* That's exactly the kind of holiday Islay offers — and it's the childhood our own kids have had here.
`;

// ─── Block 13: jura-day-trip ───────────────────────────────────────────────────

const BLOCK_13_MD = `
A short 5-minute ferry from Port Askaig connects Islay to the neighbouring Isle of Jura, although it genuinely feels like a world away. Alongside its whisky, the island is perhaps most notable as the place Orwell wrote *1984* and the K Foundation burned a million pounds. While Islay has a gentle borders/lowland feel, Jura is all Highland. It makes a perfect day trip to see the dramatic Paps of Jura mountains, visit [Jura Distillery](https://www.jurawhisky.com), have lunch at the Antlers or Jura Hotel, hire bikes and walk or cycle around Small Isles Bay to Corran Sands. Or for a real treat, drive up to Ardlussa, sample some [Lussa Gin](https://www.lussagin.com) and admire the stunning coastal scenery.

**Getting There**

The small car ferry runs roughly every hour from Port Askaig. No booking needed for foot passengers — just turn up at least 10 minutes before scheduled departure. Short queue for cars, but check the timetable for last ferry times and travel alerts — the weather and tides affect sailings. For getting to Islay itself, see the [travel to Islay guide](/travel-to-islay).

**A Perfect Day Trip**

- Morning ferry from Port Askaig (5 minutes)
- Jura Distillery tour — Book ahead for tours, or drop in for a dram
- Lunch at the Antlers (homebaked deli food, friendly atmosphere) or Jura Hotel (restaurant dining and pub grub)
- Afternoon — Hire bikes and cycle to Small Isles Bay / Corran Sands, or walk the coastal path; pop into the church and photographs of old Jura life round the back
- Wildlife — Red deer everywhere, often on the roadside; eagles and sea otters are frequently seen
- Views — The Paps of Jura dominate every vista
- Return ferry — Check timetable for last sailing. Book the late 2130 ferry 24 hours in advance if you really want a full day and evening meal.

Or, drive straight to Ardlussa in the north, visit the wonderful girls at award-winning locally made [Lussa Gin](https://www.lussagin.com) and slowly meander back, taking in Jura's dramatic coastline and bays.
`;

// ─── Run patches ──────────────────────────────────────────────────────────────

const patches = [
  { id: 'canonical-block-bruichladdich-proximity', md: BLOCK_4_MD },
  { id: 'canonical-block-port-charlotte-village',  md: BLOCK_7_MD },
  { id: 'canonical-block-distilleries-overview',   md: BLOCK_8_MD },
  { id: 'canonical-block-wildlife-geese',          md: BLOCK_9_MD },
  { id: 'canonical-block-food-drink-islay',        md: BLOCK_10_MD },
  { id: 'canonical-block-beaches-overview',        md: BLOCK_11_MD },
  { id: 'canonical-block-families-children',       md: BLOCK_12_MD },
  { id: 'canonical-block-jura-day-trip',           md: BLOCK_13_MD },
];

async function run() {
  console.log(`Patching ${patches.length} canonical blocks with inline links...`);
  let ok = 0;
  for (const { id, md } of patches) {
    try {
      const fullContent = markdownToPortableText(md);
      await client.patch(id).set({ fullContent }).commit();
      console.log(`✅  ${id}`);
      ok++;
    } catch (err) {
      console.error(`❌  ${id}`, err);
    }
  }
  console.log(`\nDone — ${ok}/${patches.length} blocks patched.`);
}

run().catch(err => { console.error(err); process.exit(1); });
