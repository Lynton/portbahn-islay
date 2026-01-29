/**
 * Import missing fullContent and teaserContent for content blocks
 * Source: CANONICAL-BLOCKS-FINAL-V2_LL2.md
 *
 * Blocks to update:
 * - content-bothan-jura-teaser
 * - content-jura-longer-stay
 * - content-port-charlotte-village
 * - content-shorefield-character
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Helper to create portable text block
function textBlock(text: string, style: string = 'normal'): any {
  return {
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text,
        marks: [],
      },
    ],
  };
}

function boldText(text: string): any {
  const markKey = Math.random().toString(36).substr(2, 9);
  return {
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text,
        marks: ['strong'],
      },
    ],
  };
}

function paragraphWithBold(beforeBold: string, boldPart: string, afterBold: string): any {
  return {
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: beforeBold,
        marks: [],
      },
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: boldPart,
        marks: ['strong'],
      },
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: afterBold,
        marks: [],
      },
    ],
  };
}

// Content from CANONICAL-BLOCKS-FINAL-V2_LL2.md
const contentUpdates = [
  {
    blockId: 'content-shorefield-character',
    fullContent: [
      textBlock("Shorefield is the Jackson family's old family home - their personality is everywhere, and we're privileged to look after it for them. They built this eco-house to include wind and solar power well before it was popular, planted every tree on the property, created the wetlands and bird hides, and filled the house over the years with paintings, books, and curios from their travels around the world."),
      textBlock("It's quirky, full of personality, well worn and well loved over years of family use. This isn't a styled rental; it's a real family home. If you prefer bright, modern open-plan simplicity, Portbahn House would probably suit you better. But if you value character, cosiness, and a house that feels like \"a big hug\" (as one guest said!), Shorefield really does make a wonderful stay. We love spending time here ourselves in the winter gardening and looking after the place."),
      textBlock("The house is stocked with binoculars, bird books, and wildlife guides from the Jacksons' collection, along with their own sketches and watercolours. The garden, woods behind the house and wetland ponds attract plentiful birds, and the loch views offer opportunities to watch waterfowl and sea birds without leaving the property."),
      textBlock("Over 90% of guests have told us they genuinely love the quirky charm and personal touches - it's what makes Shorefield special!"),
      textBlock("Woodlands, Wetlands and Bird Hides", 'h3'),
      textBlock("Shorefield has something unique: woodlands, wetland ponds and bird hides created by the Jackson family, who were passionate birders. They planted the trees, created the wetlands, and built the hides specifically for wildlife watching. Even if bird watching isn't your thing, kids love getting lost in the woods behind the house, playing hide and seek, making dens and creating adventures."),
      textBlock("If you're a birder or nature lover, muddy knees fan, Shorefield offers something you won't find at a typical holiday rental - it's a family home built around a love of wildlife and nature."),
    ],
    teaserContent: [
      textBlock("Shorefield is the Jacksons' creation - they built this eco-house, planted every tree, created the wetlands and bird hides, and filled it with their art and curios. Quirky, characterful, and well-worn and well-loved - guests who book here value charm over polish. One guest called it \"like a big hug.\""),
    ],
    keyFacts: [
      { _key: 'kf1', fact: 'Creators', value: 'Jackson family' },
      { _key: 'kf2', fact: 'Power', value: 'Wind and solar (eco-house)' },
      { _key: 'kf3', fact: 'Features', value: 'Bird hides, wetlands, planted trees, woods' },
      { _key: 'kf4', fact: 'Character', value: 'Quirky, well-loved, a bit tired' },
      { _key: 'kf5', fact: 'Sleeps', value: '6 guests' },
      { _key: 'kf6', fact: 'Quote', value: '"like a big hug"' },
    ],
  },
  {
    blockId: 'content-port-charlotte-village',
    fullContent: [
      textBlock("Port Charlotte is perhaps Islay's prettiest village, just a 5-minute drive or 40-minute walk along the coastal path from our properties. It's the social hub of the Rhinns, with regular live music at the Port Charlotte Hotel and immense local seafood platters at the Lochindaal, it has everything you'll need for a self-catering break."),
      textBlock("Where to Eat & Drink", 'h3'),
      paragraphWithBold("", "Port Charlotte Hotel", " - Owned and run by Grahame and Isabelle, with Scottish fare and an outstanding whisky bar with 300+ bottles on their single malt menu. The restaurant takes bookings (advised), but the bar is walk-in. Good Sunday roasts. Traditional Scottish live music on Wednesdays and Sundays is popular and a lovely way to spend an evening by a roaring log fire, dram in hand."),
      paragraphWithBold("", "Lochindaal Seafood Kitchen", " - Truly exceptional, run with huge heart by Jack and his father Iain. An absolute highlight (we'd say a MUST), are the seafood platters from the local fishermen's catch featuring oysters, langoustines, crab, lobster and mussels. You need to order the full platter 24 hours ahead and it may vary depending on catch - but it is absolutely worth planning around. Also a great whisky selection if you just want to drop in for a pint or a dram. Our guests consistently rave about this place and it's one of our favourite spots on the Rhinns."),
      textBlock("What Else You'll Find", 'h3'),
      textBlock("The fascinating Islay Museum tells the history of the island. There's a local shop, post office and petrol station for essentials. For families, the children's playground at Port Mor has sea views and is a favourite with our kids and our guests' children. There's also a good cafe serving great comfort food."),
    ],
    teaserContent: [
      textBlock("Port Charlotte village is a 5-minute drive - perhaps Islay's prettiest, with the Port Charlotte Hotel (300+ whiskies, live music Wed & Sun), Lochindaal Seafood Kitchen (order the platter 24h ahead), Islay Museum, local shop, and the Port Mor playground for families."),
    ],
    keyFacts: [
      { _key: 'kf1', fact: 'Drive time', value: '5 minutes' },
      { _key: 'kf2', fact: 'Walk time', value: '40 minutes' },
      { _key: 'kf3', fact: 'Restaurants', value: 'Port Charlotte Hotel, Lochindaal Seafood Kitchen' },
      { _key: 'kf4', fact: 'Port Charlotte Hotel whisky', value: '300+ bottles' },
      { _key: 'kf5', fact: 'Live music', value: 'Wednesday & Sunday' },
      { _key: 'kf6', fact: 'Other amenities', value: 'Islay Museum, shop, post office, petrol station' },
      { _key: 'kf7', fact: 'Family feature', value: 'Port Mor playground' },
    ],
  },
  {
    blockId: 'content-jura-longer-stay',
    fullContent: [
      textBlock("For those wanting to explore Jura properly (and we really do recommend it!), a longer stay gives you so much more, with experiences you simply can't fit into a day:"),
      textBlock("Barnhill & George Orwell", 'h3'),
      textBlock("At the remote northern tip of Jura, Barnhill is where George Orwell wrote 1984 in 1946-48. The house still stands (a private house still owned by the Fletcher family so please do respect their privacy), and the journey to reach it - 25 miles of single-track road, the last 4 miles a rough track that must be walked - is an adventure in itself. For literary pilgrims it's a great excuse to head north."),
      textBlock("Corryvreckan Whirlpool", 'h3'),
      textBlock("The third largest whirlpool in the world churns between Jura and Scarba. Visible from the northern tip of Jura, it's most dramatic at certain tides. Orwell nearly drowned here in 1947 and perhaps the manuscript of 1984 would never have been seen. Boat trips from Robert at Jura Boat Tours will take you right up and are a dramatic way to experience the island and regularly spot eagles and dolphins."),
      textBlock("Climb a Pap", 'h3'),
      textBlock("The three Paps of Jura (Beinn an Oir is the highest at 785m) are serious hill walks - not technical climbing, but hard going with no paths and often a scramble over bog and rock, they are steep and remote. But a clear day rewards you with views to Ireland, Mull, and the mainland. Not for novices, but achievable for fit hikers. Leave a full day and let someone know the route you are taking."),
      textBlock("Jura's West Coast", 'h3'),
      textBlock("Jura's Atlantic west coast is one of Britain's wildest landscapes - raised beaches, caves, no roads, no people. Walking it requires planning and fitness, but it's genuinely remote in a way few places in Britain can match. It takes about a week to do tip to tip. If you want a taste of the west coast, it can be accessed at Tarbert in the middle of Jura, down a track leading from the main road to the head of Loch Tarbert, the huge bite out of Jura's west coast. There is also a track that heads north from Feolin past Inver Estate lodge that gives easy access to the west coast in about an hour or so's walking."),
      textBlock("K Foundation Burn A Million Pounds", 'h3'),
      textBlock("For pop culture pilgrims: the boathouse where the KLF's Bill Drummond and Jimmy Cauty burned £1 million in 1994 is on Jura's Ardfin Estate, now a private golf course (I know, the irony). Scotland's Right To Roam laws do allow access, but be sensitive."),
      textBlock("Wildlife", 'h3'),
      textBlock("Red deer are everywhere - you'll see dozens daily. Eagles soar over the Paps. Seals and otters inhabit the coastline and regularly seen around Small Isles Bay."),
      textBlock("The Pace", 'h3'),
      textBlock("Even slower than Islay. One shop, one hotel, one pub, two distilleries. If you want true escape, this is it."),
      textBlock("Consider combining a few days on Jura with your Islay stay - we have accommodation with hot tubs and saunas at Bothan Jura Retreat and can help you plan a multi-island trip."),
    ],
    teaserContent: null, // No teaser for this block per canonical source
    keyFacts: [
      { _key: 'kf1', fact: 'Barnhill', value: 'Where Orwell wrote 1984' },
      { _key: 'kf2', fact: 'Corryvreckan', value: 'Third largest whirlpool in the world' },
      { _key: 'kf3', fact: 'Highest Pap', value: 'Beinn an Oir (785m)' },
      { _key: 'kf4', fact: 'K Foundation', value: '£1 million burned in 1994' },
    ],
  },
  {
    blockId: 'content-bothan-jura-teaser',
    fullContent: [
      textBlock("We also own and manage Bothan Jura Retreat on Jura - a passion project we built from scratch from an acre of bog and an old ruined cottage. We created it as the kind of place we'd want to escape to ourselves."),
      textBlock("The Accommodation", 'h3'),
      paragraphWithBold("", "Mrs Leonard's Cottage", " - Old stone renovated cotters' cottage, sleeps 2"),
      paragraphWithBold("", "The Rusty Hut Lodge", " - Cosy corten steel and timber, sleeps 2"),
      paragraphWithBold("", "The Black Hut Cabin", " - Contemporary minimalist space, sleeps 2"),
      paragraphWithBold("", "The Shepherd's Hut", " - Off-grid glamping, sleeps 2"),
      textBlock("Each unit is designed for couples or solo travellers seeking genuine remoteness and has its own wood-fired hot tub. Mrs Leonard's Cottage also has a sauna."),
      textBlock("The Experience", 'h3'),
      paragraphWithBold("", "Hot tub", " under the stars at the foot of the Paps"),
      paragraphWithBold("", "Sauna", " to warm up after wild swimming or hill walking"),
      paragraphWithBold("", "Fire pit", " for evening relaxation"),
      paragraphWithBold("", "Location", " - Dramatic landscape, red deer wandering past, the Paps towering above, Corran Sands at the bottom of the drive"),
      textBlock("Character", 'h3'),
      textBlock("We've built Bothan Jura Retreat over eight years with a lot of love and time and passion. We live here too. These are places we'd want to stay."),
      textBlock("The Rusty Hut is clad in beautiful rusted Corten steel like the old farm buildings around Knockrome; it has the old boards from Southport Pier lining a wall and oak floorboards on the floor; The Black Hut is birch plywood simplicity with a handmade kitchen by our Welsh joiner Shaun; Mrs Leonard's Cottage is the original old cotters' cottage that has sat here for over a century, braced against the Hebridean squalls and winters, now restored to snug comfort."),
      textBlock("If you want wilderness and enjoy consideration to detail, cosy, but wild, you'll probably love it here - we've tried to make this place a part of ourselves - simple, beautiful, contemporary accommodation in one of Scotland's most remote landscapes."),
      textBlock("Getting There", 'h3'),
      textBlock("To get to Jura takes two ferries from the mainland (first to Islay, then to Jura), or fly to Islay then ferry. The journey is absolutely part of the experience and that finally 5 minute leg on the wee ferry always feels special."),
      textBlock("From March to the end of September the Jura Passenger Ferry also runs twice daily directly between Tayvallich on the mainland and Craighouse on Jura."),
      textBlock("If Islay fills up or you're looking for even more remoteness, or an experience of two very different islands, consider splitting your trip between both islands. Get in touch and we'll help you create an Islay-Jura multi-island trip."),
    ],
    teaserContent: [
      textBlock("We also own Bothan Jura Retreat on Jura - a passion project with a cottage, lodge, cabin and shepherd's hut, each sleeping 2, with hot tub and sauna under the stars at the foot of the Paps. The kind of place we'd want to escape to ourselves."),
    ],
    keyFacts: [
      { _key: 'kf1', fact: 'Units', value: 'Cottage, Lodge, Cabin, Shepherd\'s Hut' },
      { _key: 'kf2', fact: 'Sleeps per unit', value: '2' },
      { _key: 'kf3', fact: 'Features', value: 'Hot tub, sauna, fire pit' },
      { _key: 'kf4', fact: 'Location', value: 'Foot of the Paps of Jura' },
      { _key: 'kf5', fact: 'Website', value: 'bothanjura.com' },
    ],
  },
];

async function importContent() {
  console.log('='.repeat(60));
  console.log('IMPORTING MISSING CONTENT');
  console.log('='.repeat(60));
  console.log('');

  for (const update of contentUpdates) {
    console.log(`Updating: ${update.blockId}`);

    // Find the document by blockId
    const doc = await client.fetch(
      `*[_type == "canonicalBlock" && blockId.current == $blockId][0]{_id}`,
      { blockId: update.blockId }
    );

    if (!doc) {
      console.log(`  ❌ Document not found for blockId: ${update.blockId}`);
      continue;
    }

    // Build the patch
    const patch: Record<string, any> = {};

    if (update.fullContent) {
      patch.fullContent = update.fullContent;
    }

    if (update.teaserContent) {
      patch.teaserContent = update.teaserContent;
    }

    if (update.keyFacts) {
      patch.keyFacts = update.keyFacts;
    }

    // Apply the patch
    await client.patch(doc._id).set(patch).commit();
    console.log(`  ✅ Updated: ${doc._id}`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('IMPORT COMPLETE');
  console.log('='.repeat(60));
}

importContent().catch(console.error);
