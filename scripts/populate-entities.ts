/**
 * populate-entities.ts
 *
 * Creates all ~80 siteEntity documents in Sanity from ENTITY-AUDIT.md.
 * Runs in category-priority order (distilleries first — live on guide pages).
 *
 * Strategy: createOrReplace by _id = `siteEntity.${entityId}`
 * Fields marked [CONFIRM] in the audit are omitted — populate via Studio after confirmation.
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/populate-entities.ts
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

// ─── Entity builder helpers ────────────────────────────────────────────────────

function hours(label: string, opens: string, closes: string, notes?: string) {
  const entry: any = { label, opens, closes };
  if (notes) entry.notes = notes;
  return entry;
}

function entity(id: string, data: Record<string, any>) {
  return {
    _id: `siteEntity.${id}`,
    _type: 'siteEntity',
    entityId: { _type: 'slug', current: id },
    ...data,
  };
}

// ─── DISTILLERIES (11) ─────────────────────────────────────────────────────────

const distilleries = [
  entity('bruichladdich-distillery', {
    name: 'Bruichladdich Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bruichladdich Distillery is located on the shore of Loch Indaal in Bruichladdich village, Islay, producing unpeated (Laddie Classic), medium-peated (Port Charlotte), and heavily peated (Octomore — world\'s most peated whisky) single malts, plus The Botanist gin.',
    editorialNote: 'The only Islay distillery you can walk to from our properties — 5 minutes along the coastal cycle path. Walk there, take a tour, walk home. No driving logistics. We recommend this to every guest without exception.',
    location: {
      village: 'Bruichladdich',
      distanceFromBruichladdich: '5-minute walk (coastal cycle path)',
    },
    contact: {
      website: 'https://www.bruichladdich.com',
    },
    attributes: {
      peatLevel: 'mixed',
      requiresBooking: true,
    },
    tags: ['whisky', 'gin', 'walkable', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('ardbeg-distillery', {
    name: 'Ardbeg Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Ardbeg Distillery is located on the south coast of Islay near Port Ellen, producing heavily peated single malt Scotch whisky. It is part of the south coast distillery cluster alongside Lagavulin and Laphroaig.',
    editorialNote: 'Ardbeg has one of the best café kitchens of any distillery on the island — an excellent lunch stop if you\'re doing the south coast cluster. Pace your arrival to time it right.',
    location: {
      village: 'Port Ellen area (south coast)',
      distanceFromBruichladdich: '~45-minute drive (south coast)',
    },
    contact: {
      website: 'https://www.ardbeg.com',
    },
    attributes: {
      peatLevel: 'heavily-peated',
      hasCafe: true,
      requiresBooking: true,
    },
    tags: ['whisky', 'heavily-peated', 'south-coast', 'cafe', 'lunch'],
    ecosystemSite: 'pbi',
  }),

  entity('lagavulin-distillery', {
    name: 'Lagavulin Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Lagavulin Distillery is located on the south coast of Islay near Port Ellen, producing medium-to-heavily peated single malt Scotch whisky in the classic Islay maritime style.',
    location: {
      village: 'Port Ellen area (south coast)',
      distanceFromBruichladdich: '~45-minute drive',
    },
    contact: {
      website: 'https://www.malts.com/en-gb/distilleries/lagavulin',
    },
    attributes: {
      peatLevel: 'medium-peated',
      requiresBooking: true,
    },
    tags: ['whisky', 'medium-peated', 'south-coast'],
    ecosystemSite: 'pbi',
  }),

  entity('laphroaig-distillery', {
    name: 'Laphroaig Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Laphroaig Distillery is located on the south coast of Islay near Port Ellen, producing one of the most heavily peated and distinctively medicinal single malt Scotch whiskies in the world.',
    location: {
      village: 'Port Ellen area (south coast)',
      distanceFromBruichladdich: '~45-minute drive',
    },
    contact: {
      website: 'https://www.laphroaig.com',
    },
    attributes: {
      peatLevel: 'heavily-peated',
      requiresBooking: true,
    },
    tags: ['whisky', 'heavily-peated', 'south-coast'],
    ecosystemSite: 'pbi',
  }),

  entity('port-ellen-distillery', {
    name: 'Port Ellen Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Ellen Distillery is located near Port Ellen on the south coast of Islay. It reopened in 2024 after decades of closure, making it the newest operational distillery in the south coast cluster.',
    location: {
      village: 'Port Ellen',
      distanceFromBruichladdich: '~45-minute drive',
    },
    attributes: {
      peatLevel: 'heavily-peated',
      yearReopened: 2024,
    },
    tags: ['whisky', 'heavily-peated', 'south-coast', 'new-opening'],
    ecosystemSite: 'pbi',
  }),

  entity('bowmore-distillery', {
    name: 'Bowmore Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bowmore Distillery is located in Bowmore, Islay\'s main town, and claims to be Islay\'s oldest distillery, founded in 1779. It produces medium-peated single malt in the classic Islay maritime style.',
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    contact: {
      website: 'https://www.bowmore.com',
    },
    attributes: {
      peatLevel: 'medium-peated',
      yearFounded: 1779,
      requiresBooking: true,
    },
    tags: ['whisky', 'medium-peated', 'bowmore', 'oldest'],
    ecosystemSite: 'pbi',
  }),

  entity('kilchoman-distillery', {
    name: 'Kilchoman Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Kilchoman Distillery is a working farm distillery on the west coast of Islay — the only distillery in Scotland to produce barley-to-bottle entirely on site. It has an on-site café and farm shop.',
    editorialNote: 'Different in character from every other distillery on the island — agricultural, unpretentious, lovely café for lunch. Our guests who go there love it.',
    location: {
      village: 'Kilchoman (west Islay)',
      distanceFromBruichladdich: '~20-minute drive',
    },
    contact: {
      website: 'https://www.kilchomandistillery.com',
    },
    attributes: {
      peatLevel: 'mixed',
      hasCafe: true,
      requiresBooking: true,
    },
    tags: ['whisky', 'farm-distillery', 'cafe', 'lunch', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('bunnahabhain-distillery', {
    name: 'Bunnahabhain Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bunnahabhain Distillery is located on the north coast of Islay facing the Sound of Islay and the Paps of Jura. It produces mostly unpeated single malt, offering a contrast to the heavily peated south coast style.',
    location: {
      village: 'North Islay',
      distanceFromBruichladdich: '~35-minute drive',
    },
    contact: {
      website: 'https://www.bunnahabhain.com',
    },
    attributes: {
      peatLevel: 'unpeated',
      requiresBooking: true,
    },
    tags: ['whisky', 'unpeated', 'north-coast'],
    ecosystemSite: 'pbi',
  }),

  entity('caol-ila-distillery', {
    name: 'Caol Ila Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Caol Ila Distillery is located on the north coast of Islay at Port Askaig, overlooking the Sound of Islay. It is Islay\'s largest single producer and a key component in Johnnie Walker blended Scotch.',
    location: {
      village: 'Port Askaig (north coast)',
      distanceFromBruichladdich: '~30-minute drive',
    },
    contact: {
      website: 'https://www.malts.com/en-gb/distilleries/caol-ila',
    },
    attributes: {
      peatLevel: 'lightly-peated',
      requiresBooking: true,
    },
    tags: ['whisky', 'north-coast', 'large-scale'],
    ecosystemSite: 'pbi',
  }),

  entity('ardnahoe-distillery', {
    name: 'Ardnahoe Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Ardnahoe Distillery is the newest distillery on Islay, opened in 2018, located on the north coast with outstanding views across the Sound of Islay to the Paps of Jura. It has a visitor centre and restaurant.',
    location: {
      village: 'North Islay',
      distanceFromBruichladdich: '~35-minute drive',
    },
    contact: {
      website: 'https://www.ardnahoedistillery.com',
    },
    attributes: {
      yearFounded: 2018,
      hasCafe: true,
      requiresBooking: true,
    },
    tags: ['whisky', 'north-coast', 'new-distillery', 'cafe', 'views'],
    ecosystemSite: 'pbi',
  }),

  entity('laggan-bay-distillery', {
    name: 'Laggan Bay Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'islay',
    status: 'pre-production',
    shortDescription: 'Laggan Bay Distillery is a new Islay single malt distillery located at Glenegedale near Islay Airport, developed by Ian Macleod Distillers and The Islay Boys. The 11th Islay distillery, it produces traditional double-distillation Islay whisky, co-sited with Islay Ales brewery.',
    editorialNote: 'Not yet open to visitors as of Fèis Ìle 2026 — festival participation confirmed but no open day. Do not include in visitor itinerary content until confirmed open.',
    location: {
      village: 'Glenegedale (near Islay Airport)',
      distanceFromBruichladdich: '~20-minute drive',
    },
    contact: {
      website: 'https://www.ianmacleod.com/brands/laggan-bay-distillery',
    },
    attributes: {
      requiresBooking: false,
      visitorStatus: 'Not open to visitors as of February 2026. Monitor for opening date.',
    },
    tags: ['whisky', 'new-distillery', 'laggan-bay', 'glenegedale', 'pre-production'],
    ecosystemSite: 'pbi',
  }),
];

// ─── RESTAURANTS (9) ──────────────────────────────────────────────────────────

const restaurants = [
  entity('lochindaal-seafood-kitchen', {
    name: 'Lochindaal Seafood Kitchen',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'islay',
    status: 'active',
    shortDescription: 'Lochindaal Seafood Kitchen is a small seafood restaurant in Port Charlotte, Islay, run by Jack and his father Iain, serving local langoustines, crab, oysters, and mussels from the local fishermen\'s catch. Booking essential; full platter requires 24 hours\' notice.',
    editorialNote: 'Our top restaurant recommendation on the island — and consistently our guests\' too. The full platter is an event in itself. Book before you leave home.',
    location: {
      village: 'Port Charlotte',
      distanceFromBruichladdich: '5-minute drive',
    },
    attributes: {
      requiresBooking: true,
      bookingAdvice: 'Book ahead. Full seafood platter requires 24 hours\' notice.',
      priceRange: '£££',
    },
    tags: ['restaurant', 'seafood', 'top-recommendation', 'book-ahead'],
    ecosystemSite: 'pbi',
  }),

  entity('port-charlotte-hotel', {
    name: 'Port Charlotte Hotel',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Charlotte Hotel is a hotel and bar-restaurant in Port Charlotte, Islay, with a single malt whisky menu of over 300 bottles, a restaurant, and traditional Scottish live music on Wednesday and Sunday evenings.',
    editorialNote: 'Outstanding whisky bar and great atmosphere — especially on music nights. Log fire, 300+ malts, live music Wednesday and Sunday. We send guests here regularly; they\'re never disappointed.',
    location: {
      village: 'Port Charlotte',
      distanceFromBruichladdich: '5-minute drive',
    },
    attributes: {
      requiresBooking: true,
      bookingAdvice: 'Book restaurant ahead. Bar is walk-in. Music nights (Wed & Sun) fill fast.',
      priceRange: '££',
    },
    tags: ['restaurant', 'bar', 'whisky', 'live-music', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('an-tigh-seinnse-portnahaven', {
    name: 'An Tigh Seinnse',
    category: 'restaurant',
    schemaOrgType: 'BarOrPub',
    island: 'islay',
    status: 'active',
    shortDescription: 'An Tigh Seinnse is a small traditional pub in Portnahaven at the southern tip of the Rhinns peninsula, Islay, serving home-cooked food. It is the most remote village pub on the island.',
    editorialNote: 'Tiny, authentic, popular with locals. Worth the 20-minute drive. The harbour outside almost always has seals. Book ahead — it\'s small.',
    location: {
      village: 'Portnahaven',
      distanceFromBruichladdich: '20-minute drive',
    },
    attributes: {
      requiresBooking: true,
      priceRange: '££',
    },
    tags: ['pub', 'restaurant', 'local', 'remote', 'seals-nearby'],
    ecosystemSite: 'pbi',
  }),

  entity('peatzeria-bowmore', {
    name: 'Peatzeria',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'islay',
    status: 'active',
    shortDescription: 'Peatzeria is a wood-fired pizza restaurant in Bowmore, Islay, serving creative pizzas with local toppings including lobster, scallops, and whisky-infused sauces.',
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    attributes: {
      familyFriendly: true,
      priceRange: '££',
    },
    tags: ['restaurant', 'pizza', 'casual', 'family-friendly', 'bowmore'],
    ecosystemSite: 'pbi',
  }),

  entity('the-cottage-bowmore', {
    name: 'The Cottage',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Cottage is a casual restaurant in Bowmore, Islay, serving burgers, fries, jacket potatoes, and comfort food.',
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    attributes: {
      familyFriendly: true,
      priceRange: '£',
    },
    tags: ['restaurant', 'casual', 'comfort-food', 'bowmore', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('islays-plaice-bowmore', {
    name: "Islay's Plaice",
    category: 'restaurant',
    schemaOrgType: 'FastFoodRestaurant',
    island: 'islay',
    status: 'active',
    shortDescription: "Islay's Plaice is a fish and chip shop in Bowmore, Islay, run by Andy and Islay, serving fresh locally sourced fish and chips.",
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    attributes: {
      priceRange: '£',
    },
    tags: ['fish-and-chips', 'takeaway', 'bowmore', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('the-copper-still-port-ellen', {
    name: 'The Copper Still',
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Copper Still is a café and deli in Port Ellen, Islay, located by the CalMac ferry terminal, run by Mari and Joe, serving home-roasted coffee, deli sandwiches, cakes, and soup.',
    editorialNote: 'Best brownies on the island. Worth building into any south coast day or ferry arrival/departure.',
    location: {
      address: 'By the CalMac ferry terminal, Port Ellen',
      village: 'Port Ellen',
      distanceFromBruichladdich: '45-minute drive',
    },
    attributes: {
      priceRange: '£',
    },
    tags: ['cafe', 'coffee', 'deli', 'port-ellen', 'ferry-terminal'],
    ecosystemSite: 'pbi',
  }),

  entity('seasalt-bistro-port-ellen', {
    name: 'SeaSalt Bistro',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'islay',
    status: 'active',
    shortDescription: 'SeaSalt Bistro is a waterfront restaurant in Port Ellen, Islay, serving pizza, pasta, seafood, and steaks.',
    location: {
      address: 'Port Ellen waterfront',
      village: 'Port Ellen',
      distanceFromBruichladdich: '45-minute drive',
    },
    attributes: {
      priceRange: '££',
    },
    tags: ['restaurant', 'seafood', 'port-ellen', 'waterfront'],
    ecosystemSite: 'pbi',
  }),

  entity('the-oyster-shed-islay', {
    name: 'The Oyster Shed, Islay',
    category: 'restaurant',
    schemaOrgType: 'FoodEstablishment',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Oyster Shed, Islay is a shellfish restaurant at Loch Gruinart on the northern Rhinns of Islay, selling freshly shucked native oysters farmed in the cold tidal waters of Loch Gruinart. Open Thursday to Saturday; lunch served 11:30am–2:30pm.',
    editorialNote: "We'd back Loch Gruinart oysters against any in Britain — Whitstable included. The Times agreed. Combine with the RSPB barnacle geese reserve at dawn for one of the best half-days on the island.",
    location: {
      village: 'Loch Gruinart, northern Rhinns',
      googleMapsUrl: 'https://maps.app.goo.gl/AxkjF3pTQdVvwRhG7',
      distanceFromBruichladdich: '20-minute drive',
    },
    contact: {
      phone: '07376 781214',
      instagram: 'oystershed_islay',
      facebook: 'Islay Oysters',
    },
    openingHours: [
      hours('Thursday–Saturday', '10:00', '15:00', 'Lunch 11:30–14:30 last orders'),
    ],
    attributes: {
      requiresBooking: true,
      bookingAdvice: 'Table booking advisable — call 07376 781214.',
    },
    tags: ['seafood', 'oysters', 'loch-gruinart', 'book-ahead'],
    ecosystemSite: 'pbi',
  }),
];

// ─── CAFÉS / SHOPS (4) ────────────────────────────────────────────────────────

const cafesShops = [
  entity('aileens-mini-market-bruichladdich', {
    name: "Aileen's Mini-Market",
    category: 'cafe',
    schemaOrgType: 'GroceryStore',
    island: 'islay',
    status: 'active',
    shortDescription: "Aileen's Mini-Market (locally known as Debbie's) is a small convenience shop, café, and post office in Bruichladdich, Islay, serving coffee, bacon rolls, and daily essentials. It is a 5-minute walk from the Portbahn Islay properties.",
    editorialNote: 'A Bruichladdich institution. Start your morning here with a coffee and bacon roll, especially after a day of distillery tours. Aileen and Debbie are local legends.',
    location: {
      village: 'Bruichladdich',
      distanceFromBruichladdich: '5-minute walk',
    },
    tags: ['shop', 'cafe', 'groceries', 'walkable', 'post-office', 'bruichladdich'],
    ecosystemSite: 'pbi',
  }),

  entity('coop-bowmore', {
    name: 'Co-op Bowmore',
    category: 'cafe',
    schemaOrgType: 'GroceryStore',
    island: 'islay',
    status: 'active',
    shortDescription: "The Co-op in Bowmore is Islay's largest supermarket, stocking fresh produce, meat, alcohol, and household supplies. It is the primary self-catering grocery stop for guests staying in Bruichladdich.",
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    tags: ['supermarket', 'groceries', 'bowmore'],
    ecosystemSite: 'pbi',
  }),

  entity('port-charlotte-stores', {
    name: 'Port Charlotte Stores',
    category: 'cafe',
    schemaOrgType: 'GroceryStore',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Charlotte Stores is a village shop and post office in Port Charlotte, Islay, stocking daily essentials and operating a petrol pump.',
    location: {
      village: 'Port Charlotte',
      distanceFromBruichladdich: '5-minute drive',
    },
    tags: ['shop', 'groceries', 'petrol', 'post-office', 'port-charlotte'],
    ecosystemSite: 'pbi',
  }),

  entity('jeans-fresh-fish-van', {
    name: "Jean's Fresh Fish Van",
    category: 'other',
    schemaOrgType: 'FoodEstablishment',
    island: 'islay',
    status: 'active',
    shortDescription: "Jean's Fresh Fish Van is a mobile fresh fish and seafood vendor that visits villages across Islay on a weekly schedule.",
    importantNote: 'Schedule varies — ask hosts for current visit days when arriving.',
    location: {
      village: 'Mobile — multiple villages',
    },
    tags: ['seafood', 'fish', 'mobile', 'local'],
    ecosystemSite: 'pbi',
  }),
];

// ─── BEACHES (11) ─────────────────────────────────────────────────────────────

const beaches = [
  entity('portbahn-beach', {
    name: 'Portbahn Beach',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Portbahn Beach is a sheltered beach 5 minutes\' walk from the Portbahn Islay properties in Bruichladdich, comprising three small coves with rock pools at low tide. Safe for swimming.',
    location: {
      village: 'Bruichladdich',
      distanceFromBruichladdich: '5-minute walk via war memorial path',
    },
    attributes: {
      safeForSwimming: true,
      familyFriendly: true,
    },
    tags: ['beach', 'swimming', 'rock-pools', 'walkable', 'hidden', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('port-charlotte-beach', {
    name: 'Port Charlotte Beach',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Charlotte Beach is a sandy, shallow beach in Port Charlotte village, Islay, safe for swimming and paddling.',
    location: {
      village: 'Port Charlotte',
      distanceFromBruichladdich: '5-minute drive',
    },
    attributes: {
      safeForSwimming: true,
      familyFriendly: true,
    },
    tags: ['beach', 'swimming', 'family-friendly', 'village'],
    ecosystemSite: 'pbi',
  }),

  entity('laggan-bay', {
    name: 'Laggan Bay',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Laggan Bay (also called Airport Beach) is a long, shallow, sandy beach on the east coast of Islay near the airport. Safe for swimming and suitable for families.',
    location: {
      village: 'Near Islay Airport',
    },
    attributes: {
      safeForSwimming: true,
      familyFriendly: true,
    },
    tags: ['beach', 'swimming', 'family-friendly', 'long-beach'],
    ecosystemSite: 'pbi',
  }),

  entity('kilnaughton-bay', {
    name: 'Kilnaughton Bay',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Kilnaughton Bay is a shallow, sandy beach near Port Ellen on the south coast of Islay, suitable for families and safe for swimming.',
    location: {
      village: 'Port Ellen area',
      distanceFromBruichladdich: '~45-minute drive',
    },
    attributes: {
      safeForSwimming: true,
      familyFriendly: true,
    },
    tags: ['beach', 'swimming', 'family-friendly', 'south-coast'],
    ecosystemSite: 'pbi',
  }),

  entity('machir-bay', {
    name: 'Machir Bay',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Machir Bay is Islay\'s most famous beach — approximately 2 miles of golden sand backed by dunes on the west coast of the Rhinns. Dramatic Atlantic surf and outstanding sunsets. Not safe for swimming due to strong currents and undertow.',
    importantNote: 'NOT safe for swimming. Strong Atlantic currents and undertow. Locals call it a "drowning beach." Admire and walk — do not enter the water.',
    location: {
      village: 'Kilchoman area, Rhinns',
      distanceFromBruichladdich: '~25-minute drive',
    },
    attributes: {
      safeForSwimming: false,
      familyFriendly: true,
    },
    tags: ['beach', 'dramatic', 'atlantic', 'walk', 'dunes', 'not-for-swimming', 'sunsets'],
    ecosystemSite: 'pbi',
  }),

  entity('saligo-bay', {
    name: 'Saligo Bay',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Saligo Bay is a dramatic Atlantic beach on the west coast of Islay. Not safe for swimming.',
    importantNote: 'NOT safe for swimming. Strong Atlantic currents.',
    location: {
      village: 'Rhinns, west Islay',
    },
    attributes: {
      safeForSwimming: false,
    },
    tags: ['beach', 'dramatic', 'atlantic', 'not-for-swimming'],
    ecosystemSite: 'pbi',
  }),

  entity('sanaigmore-beach', {
    name: 'Sanaigmore',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Sanaigmore is a dramatic stretch of northern coastline on Islay with striking rock formations. Not safe for swimming. A small art gallery nearby serves coffee and cakes.',
    importantNote: 'NOT safe for swimming.',
    location: {
      village: 'North Islay',
    },
    attributes: {
      safeForSwimming: false,
      familyFriendly: true,
    },
    tags: ['beach', 'dramatic', 'rocks', 'north-coast', 'not-for-swimming', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('ardnave-point', {
    name: 'Ardnave Point',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Ardnave Point is a beach and dune system on the north coast of Islay with rolling dunes and empty sands, adjacent to the RSPB Loch Gruinart nature reserve.',
    location: {
      village: 'North Islay',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['beach', 'dunes', 'family-friendly', 'north-coast', 'wildlife'],
    ecosystemSite: 'pbi',
  }),

  entity('singing-sands-islay', {
    name: 'Singing Sands',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Singing Sands is a remote beach on Islay where the sand squeaks underfoot — a distinctive natural phenomenon caused by quartz grain resonance. Worth the walk to reach it.',
    location: {
      village: 'Near Port Ellen, south Islay',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['beach', 'hidden', 'remote', 'unique', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('claggain-bay', {
    name: 'Claggain Bay',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Claggain Bay is a secluded beach on Islay reached by a coastal walk. Rarely visited.',
    tags: ['beach', 'hidden', 'remote', 'walk'],
    ecosystemSite: 'pbi',
  }),

  entity('port-ellen-beach', {
    name: 'Port Ellen Town Beach',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Ellen town beach is a convenient sandy beach adjacent to the CalMac ferry terminal in Port Ellen, Islay.',
    location: {
      village: 'Port Ellen',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['beach', 'port-ellen', 'ferry', 'convenient'],
    ecosystemSite: 'pbi',
  }),
];

// ─── NATURE / WILDLIFE (4) ────────────────────────────────────────────────────

const nature = [
  entity('rspb-loch-gruinart', {
    name: 'RSPB Loch Gruinart',
    category: 'nature-reserve',
    schemaOrgType: 'Park',
    island: 'islay',
    status: 'active',
    shortDescription: 'RSPB Loch Gruinart is a tidal loch and nature reserve on the northern Rhinns of Islay, managed by the RSPB. It is Islay\'s flagship reserve for migratory barnacle geese (30,000+ birds arrive from Greenland each October), and also hosts eagles, waders, and other raptors. Free to visit with hides and nature trails.',
    editorialNote: 'Arrive at dawn between October and April to watch the barnacle geese lift from the loch. The sound is unforgettable. Combine with The Oyster Shed for the best half-day on the island.',
    location: {
      village: 'Northern Rhinns',
      distanceFromBruichladdich: '20-minute drive',
    },
    contact: {
      website: 'https://www.rspb.org.uk/reserves-and-events/reserves-a-z/loch-gruinart/',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['wildlife', 'birdwatching', 'geese', 'eagles', 'free', 'nature-reserve', 'loch-gruinart'],
    ecosystemSite: 'pbi',
  }),

  entity('rspb-the-oa', {
    name: 'RSPB The Oa',
    category: 'nature-reserve',
    schemaOrgType: 'Park',
    island: 'islay',
    status: 'active',
    shortDescription: 'RSPB The Oa is a nature reserve on the Oa peninsula on the south coast of Islay, featuring dramatic sea cliffs, choughs, seabirds, and coastal scenery. Free to visit.',
    location: {
      village: 'The Oa, south Islay',
      distanceFromBruichladdich: '~40-minute drive',
    },
    contact: {
      website: 'https://www.rspb.org.uk/reserves-and-events/reserves-a-z/the-oa/',
    },
    tags: ['wildlife', 'birdwatching', 'cliffs', 'coastal', 'free', 'nature-reserve'],
    ecosystemSite: 'pbi',
  }),

  entity('loch-indaal', {
    name: 'Loch Indaal',
    category: 'nature-reserve',
    schemaOrgType: 'BodyOfWater',
    island: 'islay',
    status: 'active',
    shortDescription: 'Loch Indaal is a large sea loch forming the western shore of central Islay. Common and grey seals are frequently visible along its shores, and the Portbahn Islay properties overlook it.',
    location: {
      village: 'Bruichladdich / Bowmore (both shores)',
    },
    tags: ['wildlife', 'seals', 'loch', 'water', 'walking'],
    ecosystemSite: 'pbi',
  }),

  entity('portnahaven-harbour', {
    name: 'Portnahaven Harbour',
    category: 'attraction',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'Portnahaven harbour is a small natural harbour at the southern tip of the Rhinns peninsula on Islay. Common seals are almost always present on the rocks and in the water, visible from the harbour wall and the adjacent An Tigh Seinnse pub.',
    location: {
      village: 'Portnahaven',
      distanceFromBruichladdich: '20-minute drive',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['wildlife', 'seals', 'harbour', 'scenic', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),
];

// ─── ATTRACTIONS (4) ──────────────────────────────────────────────────────────

const attractions = [
  entity('mactaggart-leisure-centre', {
    name: 'Mactaggart Leisure Centre',
    category: 'attraction',
    schemaOrgType: 'SportsActivityLocation',
    island: 'islay',
    status: 'active',
    shortDescription: 'Mactaggart Leisure Centre is an indoor leisure facility in Bowmore, Islay, with a swimming pool and sports facilities. Used by guests as a rainy day activity, particularly during school holidays when inflatables are available.',
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['indoor', 'swimming', 'rainy-day', 'family-friendly', 'bowmore'],
    ecosystemSite: 'pbi',
  }),

  entity('persabus-pottery', {
    name: 'Persabus Pottery',
    category: 'attraction',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'Persabus Pottery is a working pottery studio on Islay run by Rosemary, offering pottery painting for visitors of all ages. Popular with families as a rainy day activity.',
    editorialNote: 'One of our family favourites. Our kids have painted mugs there every summer — now in grandparents\' cupboards across Scotland. Rosemary is wonderful.',
    attributes: {
      familyFriendly: true,
    },
    tags: ['pottery', 'craft', 'rainy-day', 'family-friendly', 'kids'],
    ecosystemSite: 'pbi',
  }),

  entity('islay-woollen-mill', {
    name: 'Islay Woollen Mill',
    category: 'attraction',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'Islay Woollen Mill is a working tweed mill on Islay producing island tweeds for major design houses worldwide. Visitors can see the working looms and learn about the island\'s textile heritage.',
    tags: ['heritage', 'craft', 'textile', 'shopping'],
    ecosystemSite: 'pbi',
  }),

  entity('museum-of-islay-life', {
    name: 'Museum of Islay Life',
    category: 'attraction',
    schemaOrgType: 'Museum',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Museum of Islay Life is a heritage museum in Port Charlotte, Islay, documenting the island\'s history, culture, and natural heritage.',
    location: {
      village: 'Port Charlotte',
      distanceFromBruichladdich: '5-minute drive',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['museum', 'heritage', 'history', 'port-charlotte', 'rainy-day'],
    ecosystemSite: 'pbi',
  }),
];

// ─── EVENTS (1) ───────────────────────────────────────────────────────────────

const events = [
  entity('feis-ile', {
    name: 'Fèis Ìle',
    category: 'event',
    schemaOrgType: 'Event',
    island: 'islay',
    status: 'active',
    shortDescription: 'Fèis Ìle (pronounced "Fesh Ee-la") is Islay\'s annual whisky festival held each May — typically the last week of the month over approximately ten days. Each of the island\'s ten distilleries hosts its own open day with exclusive bottlings, tastings, and live music.',
    importantNote: 'Book ferry vehicle spaces 12 weeks ahead. Accommodation books up by January. Distillery open-day tickets sell out within hours of release.',
    attributes: {
      eventMonth: 'May',
      eventDuration: '~10 days',
    },
    tags: ['whisky', 'festival', 'events', 'annual', 'planning-required'],
    ecosystemSite: 'pbi',
  }),
];

// ─── VILLAGES (6) ─────────────────────────────────────────────────────────────

const villages = [
  entity('bruichladdich-village', {
    name: 'Bruichladdich',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bruichladdich is a small village on the eastern shore of the Rhinns peninsula, Islay, overlooking Loch Indaal. It is the location of Bruichladdich Distillery and the Portbahn Islay self-catering properties.',
    location: {
      village: 'Bruichladdich',
      distanceFromBruichladdich: '0',
    },
    tags: ['village', 'base', 'bruichladdich'],
    ecosystemSite: 'pbi',
  }),

  entity('port-charlotte-village', {
    name: 'Port Charlotte',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Charlotte is a planned village on the western shore of Loch Indaal, Islay, 5 minutes\' drive from Bruichladdich. It has a beach, the Museum of Islay Life, Lochindaal Seafood Kitchen, Port Charlotte Hotel, and Port Charlotte Stores.',
    location: {
      village: 'Port Charlotte',
      distanceFromBruichladdich: '5-minute drive',
    },
    tags: ['village', 'port-charlotte'],
    ecosystemSite: 'pbi',
  }),

  entity('bowmore-village', {
    name: 'Bowmore',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bowmore is Islay\'s main town, located at the head of Loch Indaal, 15 minutes\' drive from Bruichladdich. It has the largest concentration of shops, services, and restaurants on the island, as well as Bowmore Distillery.',
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    tags: ['village', 'town', 'bowmore', 'main-town'],
    ecosystemSite: 'pbi',
  }),

  entity('portnahaven-village', {
    name: 'Portnahaven and Port Wemyss',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Portnahaven and Port Wemyss are two connected villages at the southern tip of the Rhinns peninsula — 20 minutes from the Bruichladdich properties. The harbour almost always has common seals hauled out on the rocks. An Tigh Seinnse pub serves home-cooked food; book ahead (01496 860725). The sense of being at the very end of the road is real.',
    location: {
      village: 'Portnahaven / Port Wemyss',
      distanceFromBruichladdich: '20-minute drive',
    },
    tags: ['village', 'remote', 'seals', 'rhinns', 'portnahaven', 'port-wemyss'],
    ecosystemSite: 'pbi',
  }),

  entity('port-ellen-village', {
    name: 'Port Ellen',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Ellen is a village on the south coast of Islay, the arrival point for the CalMac ferry from Kennacraig (2 hours 20 minutes crossing). It has shops, cafés, restaurants, and access to the south coast distillery cluster.',
    location: {
      village: 'Port Ellen',
      distanceFromBruichladdich: '45-minute drive',
    },
    tags: ['village', 'ferry-port', 'south-coast', 'port-ellen'],
    ecosystemSite: 'pbi',
  }),

  entity('port-askaig-village', {
    name: 'Port Askaig',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Askaig is the northern ferry port on Islay, receiving CalMac ferries from Kennacraig (2-hour crossing). It is also the departure point for the short crossing to Jura (5 minutes to Feolin).',
    location: {
      village: 'Port Askaig',
      distanceFromBruichladdich: '25-minute drive',
    },
    tags: ['village', 'ferry-port', 'north-islay', 'jura-gateway'],
    ecosystemSite: 'pbi',
  }),

  entity('bridgend-village', {
    name: 'Bridgend',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bridgend is a small village at the head of Loch Indaal, Islay, at the junction of the main island roads. The Islay Woollen Mill is located here, and the petrol pump at Bridgend Village Stores is one of the island\'s essential practical stops.',
    location: {
      village: 'Bridgend',
      distanceFromBruichladdich: '10-minute drive',
    },
    tags: ['village', 'bridgend', 'central-islay'],
    ecosystemSite: 'pbi',
  }),
];

// ─── TRANSPORT (7) ────────────────────────────────────────────────────────────

const transport = [
  entity('kennacraig-ferry-terminal', {
    name: 'Kennacraig Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'BusStation',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Kennacraig Ferry Terminal is the CalMac departure point on the Kintyre Peninsula, mainland Scotland, for ferry services to Islay (Port Askaig: 2 hours; Port Ellen: 2 hours 20 minutes). Vehicle reservations essential, bookable up to 12 weeks in advance.',
    location: {
      village: 'Kennacraig, Kintyre Peninsula',
    },
    contact: {
      website: 'https://www.calmac.co.uk',
      phone: '0800 066 5000',
    },
    tags: ['ferry', 'transport', 'calmac', 'mainland', 'departure'],
    ecosystemSite: 'pbi',
  }),

  entity('port-askaig-ferry-terminal', {
    name: 'Port Askaig Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'BusStation',
    island: 'islay',
    status: 'active',
    shortDescription: "Port Askaig Ferry Terminal is the northern CalMac arrival/departure point on Islay, 25 minutes' drive from Bruichladdich. It receives ferries from Kennacraig (2 hours) and is the departure point for the Jura crossing to Feolin (5 minutes).",
    location: {
      village: 'Port Askaig',
      distanceFromBruichladdich: '25-minute drive',
    },
    contact: {
      website: 'https://www.calmac.co.uk',
      phone: '0800 066 5000',
    },
    tags: ['ferry', 'transport', 'calmac', 'port-askaig', 'jura-gateway'],
    ecosystemSite: 'pbi',
  }),

  entity('port-ellen-ferry-terminal', {
    name: 'Port Ellen Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'BusStation',
    island: 'islay',
    status: 'active',
    shortDescription: "Port Ellen Ferry Terminal is the southern CalMac arrival/departure point on Islay, 45 minutes' drive from Bruichladdich. It receives ferries from Kennacraig (2 hours 20 minutes).",
    location: {
      village: 'Port Ellen',
      distanceFromBruichladdich: '45-minute drive',
    },
    contact: {
      website: 'https://www.calmac.co.uk',
      phone: '0800 066 5000',
    },
    tags: ['ferry', 'transport', 'calmac', 'port-ellen'],
    ecosystemSite: 'pbi',
  }),

  entity('jura-ferry-service', {
    name: 'Jura Ferry (Port Askaig–Feolin)',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Jura Ferry is a small vehicle and passenger ferry operated by Argyll and Bute Council, running a 5-minute crossing between Port Askaig on Islay and Feolin on Jura approximately every hour. No advance booking required for foot passengers; vehicles may need to queue in summer.',
    importantNote: 'No booking system — turn up and queue. Vehicle queue can be long in summer. Foot passengers and cyclists always accommodated.',
    location: {
      village: 'Port Askaig (Islay side) / Feolin (Jura side)',
      distanceFromBruichladdich: '25-minute drive to departure',
    },
    tags: ['ferry', 'transport', 'jura', 'port-askaig', 'feolin'],
    ecosystemSite: 'pbi',
  }),

  entity('jura-passenger-ferry', {
    name: 'Jura Passenger Ferry (Craighouse–Tayvallich)',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'seasonal',
    shortDescription: 'The Jura Passenger Ferry operates a seasonal service between Craighouse on Jura and Tayvallich on the mainland, operated by Orion (Nicol). Used by mainland visitors travelling directly to Jura and for day trips. No vehicle capacity.',
    location: {
      village: 'Craighouse, Jura (and Tayvallich, mainland)',
    },
    contact: {
      phone: '07768 450 000',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['ferry', 'transport', 'jura', 'passenger', 'seasonal', 'mainland'],
  }),

  entity('bruichladdich-taxis', {
    name: 'Bruichladdich Taxis',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bruichladdich Taxis provides local taxi and private hire services on Islay, based in Bruichladdich. Recommended for distillery days — can collect from the properties.',
    editorialNote: 'Our go-to recommendation for guests doing distillery days. Two numbers — use mobile (07899 942673) if no answer on landline.',
    location: {
      village: 'Bruichladdich',
    },
    contact: {
      phone: '07899 942673',
      website: 'http://bruichladdichtaxis.weebly.com/',
    },
    tags: ['taxi', 'transport', 'distillery-days', 'bruichladdich'],
    ecosystemSite: 'pbi',
  }),

  entity('attic-cabs-islay', {
    name: 'Attic Cabs',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'islay',
    status: 'active',
    shortDescription: 'Attic Cabs is a local taxi service on Islay covering the whole island, including distillery days and airport/ferry transfers.',
    location: {
      village: 'Islay (island-wide)',
    },
    contact: {
      phone: '07944 873323',
      email: 'atticcabs@gmail.com',
      website: 'http://www.attic-cabs-islay.co.uk/',
    },
    tags: ['taxi', 'transport', 'distillery-days', 'airport-transfer'],
    ecosystemSite: 'pbi',
  }),
];

// ─── GAP ENTITIES (3) ─────────────────────────────────────────────────────────

const gapEntities = [
  entity('outback-gallery-sanaigmore', {
    name: 'Outback Gallery',
    category: 'attraction',
    schemaOrgType: 'ArtGallery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Outback Gallery is a small art gallery near Sanaigmore beach on the north coast of Islay, serving coffee and cakes. A combined visit with Sanaigmore beach is recommended.',
    location: {
      village: 'Sanaigmore, north Islay',
      googleMapsUrl: 'https://maps.app.goo.gl/jiuzX8EN1dx1FEv38',
    },
    tags: ['gallery', 'art', 'cafe', 'coffee', 'north-coast', 'sanaigmore'],
    ecosystemSite: 'pbi',
  }),

  entity('islay-sea-adventures', {
    name: 'Islay Sea Adventures',
    category: 'activity',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'Islay Sea Adventures offers boat tours and sea experiences around the Isle of Islay, including wildlife and coastal trips.',
    location: {
      googleMapsUrl: 'https://maps.app.goo.gl/vTrxWY7snbE827d86',
    },
    attributes: {
      requiresBooking: true,
    },
    tags: ['boat-tours', 'wildlife', 'sea', 'activity', 'family-friendly'],
    ecosystemSite: 'pbi',
  }),

  entity('jura-boat-tours', {
    name: 'Jura Boat Tours',
    category: 'activity',
    schemaOrgType: 'TouristAttraction',
    island: 'jura',
    status: 'active',
    shortDescription: 'Jura Boat Tours, operated by Robert Henry, offers bespoke RIB tours from Jura to the Corryvreckan whirlpool, the west coast of Jura, and surrounding waters, with opportunities to see dolphins, porpoises, seals, otters, minke whales, and sea eagles.',
    editorialNote: 'Robert Henry knows these waters inside out. The Corryvreckan in full spring tide is extraordinary — if you\'re staying at Bothan Jura properties, this is a must.',
    location: {
      googleMapsUrl: 'https://maps.app.goo.gl/fTk2wxt7qibEo31U6',
    },
    contact: {
      website: 'https://www.juraboattours.co.uk',
    },
    attributes: {
      requiresBooking: true,
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['boat-tours', 'wildlife', 'corryvreckan', 'jura', 'sea', 'activity'],
  }),
];

// ─── WALKING ROUTES (7) ───────────────────────────────────────────────────────

const routes = [
  entity('route-bruichladdich-port-charlotte', {
    name: 'Bruichladdich to Port Charlotte Coastal Path',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Bruichladdich to Port Charlotte coastal path is a flat 3-mile tarmac route along the Loch Indaal shoreline, starting directly from the Portbahn Islay properties. Suitable for all abilities including pushchairs and wheelchairs. Takes approximately 40 minutes each way.',
    editorialNote: 'Starts at the front door. Best walk on the island for people who want flat, accessible, and something at the end of it — Port Charlotte Hotel and Lochindaal Seafood Kitchen are both a short walk from where the path arrives in the village.',
    location: {
      village: 'Bruichladdich to Port Charlotte',
      distanceFromBruichladdich: '0 (starts at properties)',
    },
    attributes: {
      distanceMiles: 3,
      durationMinutes: 40,
      difficulty: 'easy',
      circular: false,
      accessibilityNotes: 'Flat tarmac shared-use cycle path. Suitable for all abilities, pushchairs, wheelchairs, and bikes.',
      startPointParking: 'No parking needed — starts at properties.',
      routeHighlights: 'Portbahn Beach detour (5 min via war memorial path), Bruichladdich Pier (crabbing at low tide), village of Port Charlotte, Museum of Islay Life, Lochindaal Seafood Kitchen, Port Charlotte Hotel.',
    },
    tags: ['walking', 'accessible', 'coastal', 'easy', 'all-abilities', 'family-friendly', 'pushchair'],
    ecosystemSite: 'pbi',
  }),

  entity('route-the-oa-circular', {
    name: 'The Oa — American Monument Circular',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Oa circular walk is a 2.2-mile moderate route from the RSPB car park at PA42 7AU to the American Monument on the clifftop of the Oa peninsula, Islay. The monument commemorates US soldiers lost when the troopships Tuscania and Otranto sank off the Oa in 1918.',
    importantNote: 'Exposed location — weather changes fast. Go well-layered regardless of conditions at the car park.',
    location: {
      village: 'The Oa, south-west Islay',
      distanceFromBruichladdich: '35–40 minute drive',
    },
    attributes: {
      distanceMiles: 2.2,
      durationMinutes: 75,
      difficulty: 'moderate',
      circular: true,
      startPointParking: 'PA42 7AU — free car park at end of Oa road. Information board and picnic tables.',
      routeHighlights: 'American Monument (WW1 memorial), clifftop views to Ireland and Kintyre, choughs, fulmars, eagles over moorland.',
      accessibilityNotes: 'Well-marked path with boardwalk sections across wetter ground. Exposed — conditions change quickly on the clifftops. Waterproofs and layers essential.',
    },
    tags: ['walking', 'moderate', 'wildlife', 'heritage', 'clifftop', 'RSPB', 'dramatic'],
    ecosystemSite: 'pbi',
  }),

  entity('route-loch-gruinart-woodland-trail', {
    name: 'RSPB Loch Gruinart Woodland Trail',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The RSPB Loch Gruinart Woodland Trail is a 1-mile accessible walk from the visitor centre at Aoradh Farm to the viewing platform and hides overlooking the tidal inlet and flooded fields of Loch Gruinart. The reserve hosts 30,000+ barnacle geese from October to April.',
    location: {
      village: 'Loch Gruinart, northern Rhinns',
      distanceFromBruichladdich: '20-minute drive',
    },
    attributes: {
      distanceMiles: 1,
      distanceKm: 1.5,
      durationMinutes: 45,
      difficulty: 'easy',
      circular: false,
      accessibilityNotes: 'Suitable for most abilities. Disabled visitors can call ahead to arrange vehicle access to first hide. Blue Badge parking at visitor centre.',
      startPointParking: 'RSPB Loch Gruinart visitor centre, Aoradh Farm. Free parking, toilets, hot drinks.',
      routeHighlights: 'Viewing platform, wildlife hides, barnacle geese (Oct–Apr), waders, raptors, woodland section.',
    },
    tags: ['walking', 'easy', 'wildlife', 'birdwatching', 'accessible', 'RSPB', 'geese'],
    ecosystemSite: 'pbi',
  }),

  entity('route-finlaggan', {
    name: 'Finlaggan Walk — Loch Finlaggan',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Finlaggan walk is a short 15–20 minute return path from the visitor centre car park across a flat causeway to Eilean Mòr island in Loch Finlaggan — the former seat of the Lords of the Isles, the most powerful Gaelic dynasty in medieval Scotland.',
    location: {
      village: 'Ballygrant, central Islay',
      distanceFromBruichladdich: '25-minute drive (via B8016 east toward Bridgend, then A846 to Ballygrant)',
    },
    attributes: {
      distanceMiles: 0.3,
      durationMinutes: 20,
      difficulty: 'easy',
      circular: false,
      accessibilityNotes: 'Flat path and causeway. Accessible for most abilities.',
      startPointParking: 'Visitor centre car park, off A846 near Ballygrant. Signed from A846.',
      accessRestrictions: 'Visitor centre open April–October, Monday–Saturday, 11:00–16:30. Historic site accessible 24/7.',
      routeHighlights: 'Eilean Mòr island ruins (12th–16th century Lordship of the Isles), Eilean na Comhairle (Council Island), atmospheric loch setting, undervisited.',
    },
    tags: ['walking', 'easy', 'heritage', 'history', 'accessible', 'undervisited'],
    ecosystemSite: 'pbi',
  }),

  entity('route-singing-sands', {
    name: 'Singing Sands Walk (Tràigh Bhan)',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Singing Sands walk is a 45–60 minute return coastal path to Tràigh Bhan (Singing Sands), a remote beach near Port Ellen where the dry sand emits a distinctive squeaking sound underfoot. Access via the Oa road south of Port Ellen; parking by cemetery at grid reference NR343455.',
    location: {
      village: 'Near Port Ellen, south Islay',
      distanceFromBruichladdich: '30–35 minute drive',
    },
    attributes: {
      distanceMiles: 1.5,
      durationMinutes: 55,
      difficulty: 'easy',
      circular: false,
      startPointParking: 'Free parking by cemetery, grid reference NR343455. Access via Oa road south of Port Ellen — not from A846/Keills area.',
      routeHighlights: 'Singing sand phenomenon (squeaking underfoot), remote beach, rarely crowded, coastal views.',
    },
    tags: ['walking', 'easy', 'beach', 'unique', 'family-friendly', 'remote'],
    ecosystemSite: 'pbi',
  }),

  entity('route-machir-bay-kilchoman', {
    name: 'Machir Bay Walk via Kilchoman',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Machir Bay walk starts at Kilchoman Distillery car park (20–25 minutes from Bruichladdich) and crosses the dunes to Machir Bay — 2 miles of golden Atlantic beach. Kilchoman Distillery and café are at the car park. Not safe for swimming — strong rip currents at all times.',
    importantNote: 'Machir Bay NOT safe for swimming — strong rip currents at all states of tide. Walk and photograph only.',
    location: {
      village: 'Kilchoman, west Islay',
      distanceFromBruichladdich: '20–25 minute drive',
    },
    attributes: {
      difficulty: 'easy',
      circular: false,
      startPointParking: 'Kilchoman Distillery car park. Distillery and café at start point.',
      routeHighlights: 'Kilchoman Distillery (Scotland\'s only barley-to-bottle farm distillery), 2 miles of golden sand, dune crossing, dramatic Atlantic views.',
    },
    tags: ['walking', 'easy', 'beach', 'dramatic', 'atlantic', 'dunes'],
    ecosystemSite: 'pbi',
  }),

  entity('route-ardnave-point', {
    name: 'Ardnave Point Walk',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Ardnave Point walk is a 1.5km (one way) flat sandy track along the Ardnave peninsula on Islay\'s north coast to a beach with Atlantic views west to Colonsay and Oronsay. Adjacent to RSPB Loch Gruinart reserve.',
    location: {
      village: 'North Islay, near Loch Gruinart',
      distanceFromBruichladdich: '25–30 minute drive',
    },
    attributes: {
      distanceKm: 1.5,
      durationMinutes: 40,
      difficulty: 'easy',
      circular: false,
      startPointParking: 'Grass car park, 360 metres north of RSPB Loch Gruinart visitor centre on minor road off B8017.',
      routeHighlights: 'Ardnave Loch (ducks, waders, possible crannog remains), beach at peninsula tip, Atlantic views to Colonsay/Oronsay, choughs and geese in winter.',
      accessibilityNotes: 'Flat and straightforward. Sandy track may be soft in wet conditions.',
    },
    tags: ['walking', 'easy', 'coastal', 'wildlife', 'north-coast', 'quiet'],
    ecosystemSite: 'pbi',
  }),
];

// ─── HERITAGE SITES (8) ───────────────────────────────────────────────────────

const heritage = [
  entity('finlaggan-heritage-site', {
    name: 'Finlaggan — Seat of the Lords of the Isles',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'islay',
    status: 'active',
    shortDescription: 'Finlaggan on Loch Finlaggan, Islay, was the administrative and ceremonial seat of the Lordship of the Isles from the 12th to 16th centuries — the most powerful Gaelic dynasty in medieval Scotland, controlling the Western Isles and western mainland. The island ruins of Eilean Mòr and Eilean na Comhairle (Council Island) are accessible via a short path and causeway.',
    location: {
      village: 'Ballygrant, central Islay',
      distanceFromBruichladdich: '25-minute drive',
    },
    attributes: {
      heritagePeriod: '12th–16th century (Lordship of the Isles)',
      accessRestrictions: 'Visitor centre open April–October, Mon–Sat 11:00–16:30. Historic site accessible 24/7.',
    },
    tags: ['heritage', 'history', 'lords-of-the-isles', 'gaelic', 'medieval', 'undervisited'],
    ecosystemSite: 'pbi',
  }),

  entity('kildalton-cross', {
    name: 'Kildalton Cross',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'islay',
    status: 'active',
    shortDescription: 'Kildalton Cross is an 8th-century carved ringed high cross at Kildalton Church on the south-east coast of Islay, widely considered one of the finest examples of Early Christian carved stonework in Scotland. It stands in its original outdoor location.',
    location: {
      village: 'Kildalton, south-east Islay (near Ardbeg)',
      distanceFromBruichladdich: '~50-minute drive',
    },
    attributes: {
      heritagePeriod: '8th century (Early Christian)',
      accessRestrictions: 'Open year-round. Free to visit. Outdoor location.',
    },
    tags: ['heritage', 'carved-stone', 'early-christian', 'iconic', 'historic-scotland'],
    ecosystemSite: 'pbi',
  }),

  entity('american-monument-oa', {
    name: 'American Monument, The Oa',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'islay',
    status: 'active',
    shortDescription: 'The American Monument stands on the clifftop of the Oa peninsula on Islay, commemorating the hundreds of US soldiers lost when the troopships Tuscania and Otranto sank off the Oa in 1918. Views extend to Ireland on clear days. A 20-minute walk from the RSPB car park.',
    location: {
      village: 'The Oa, south-west Islay',
      distanceFromBruichladdich: '35–40 minute drive + 20-minute walk',
    },
    attributes: {
      heritagePeriod: 'World War I (1918)',
    },
    tags: ['heritage', 'WW1', 'memorial', 'clifftop', 'dramatic', 'RSPB'],
    ecosystemSite: 'pbi',
  }),

  entity('dunyvaig-castle', {
    name: 'Dunyvaig Castle',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'islay',
    status: 'active',
    shortDescription: 'Dunyvaig Castle is a ruined medieval castle on the south coast of Islay near Lagavulin, overlooking Lagavulin Bay. It was a stronghold of the Lords of the Isles and later a contested fortification during the Scottish clan wars of the 16th–17th centuries.',
    location: {
      village: 'Lagavulin, south coast Islay',
      distanceFromBruichladdich: '~45-minute drive',
    },
    attributes: {
      heritagePeriod: '12th–17th century',
    },
    tags: ['heritage', 'castle', 'ruins', 'lords-of-the-isles', 'south-coast'],
    ecosystemSite: 'pbi',
  }),

  entity('kilnave-chapel', {
    name: 'Kilnave Chapel',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'islay',
    status: 'active',
    shortDescription: 'Kilnave Chapel is a ruined medieval chapel on the shores of Loch Gruinart, Islay, dating from the 15th century. It was the site of a massacre during the Battle of Traigh Gruinart in 1598. A carved Celtic cross stands in the chapel grounds.',
    location: {
      village: 'Loch Gruinart, northern Rhinns',
      distanceFromBruichladdich: '~20-minute drive',
    },
    attributes: {
      heritagePeriod: '15th century / 1598 (Battle of Traigh Gruinart)',
    },
    tags: ['heritage', 'chapel', 'ruins', 'celtic-cross', 'north-islay', 'loch-gruinart'],
    ecosystemSite: 'pbi',
  }),

  entity('bowmore-round-church', {
    name: 'Bowmore Round Church (Kilarrow Parish Church)',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'islay',
    status: 'active',
    shortDescription: 'Bowmore Round Church (Kilarrow Parish Church) is a distinctive circular church at the top of Bowmore\'s main street, built in 1767. Local tradition holds it was built round to prevent the Devil finding a corner to hide in. Still a functioning church.',
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    attributes: {
      heritagePeriod: '1767',
    },
    tags: ['heritage', 'church', 'bowmore', 'architecture', 'quirky', 'unique'],
    ecosystemSite: 'pbi',
  }),

  entity('bunnahabhain-stromatolites', {
    name: 'Bunnahabhain Stromatolites',
    category: 'heritage',
    schemaOrgType: 'TouristAttraction',
    island: 'islay',
    status: 'active',
    shortDescription: 'The Bunnahabhain stromatolites are ancient fossilised microbial structures visible in the rock exposures near Bunnahabhain Distillery on the north coast of Islay, dating to approximately 1.2 billion years ago — among the oldest macroscopic fossils in Britain.',
    location: {
      village: 'Bunnahabhain, north coast Islay',
      distanceFromBruichladdich: '~35-minute drive',
    },
    attributes: {
      heritagePeriod: '~1.2 billion years (Precambrian)',
    },
    tags: ['heritage', 'geology', 'fossils', 'unique', 'north-coast', 'specialist'],
    ecosystemSite: 'pbi',
  }),

  entity('kilchoman-military-cemetery', {
    name: 'Kilchoman Military Cemetery',
    category: 'heritage',
    schemaOrgType: 'Cemetery',
    island: 'islay',
    status: 'active',
    shortDescription: 'Kilchoman Military Cemetery is a Commonwealth War Graves Commission cemetery at Kilchoman Church on the west coast of Islay, containing the graves of British and American servicemen — including soldiers recovered from the troopships Tuscania and Otranto, lost off the Oa in 1918. Open year-round; free to visit.',
    editorialNote: 'Often paired with the American Monument walk on the Oa — both sites commemorate the same WW1 disaster. The churchyard at Kilchoman is small, quiet, and genuinely moving. Combine with Kilchoman Distillery (5-minute drive) for a half-day in the west of the island.',
    location: {
      village: 'Kilchoman, west Islay',
      distanceFromBruichladdich: '20-minute drive',
    },
    attributes: {
      heritagePeriod: 'World War I (1918)',
      accessRestrictions: 'Open year-round. Free to visit.',
    },
    tags: ['heritage', 'WW1', 'cemetery', 'war-graves', 'kilchoman', 'american', 'tuscania', 'otranto'],
    ecosystemSite: 'pbi',
  }),
];

// ─── WALKING ROUTE: Kildalton Shoreline ───────────────────────────────────────

const kildaltonRoute = entity('kildalton-shoreline-walk', {
  name: 'Kildalton Shoreline Walk (Port Ellen to Kildalton Cross)',
  category: 'route',
  schemaOrgType: 'TouristAttraction',
  island: 'islay',
  status: 'active',
  shortDescription: 'The Kildalton Shoreline Walk is a linear path on the south-east coast of Islay connecting Port Ellen, Laphroaig, Lagavulin, and Ardbeg distilleries with the 8th-century Kildalton Cross — combining three distilleries and significant heritage on one walk.',
  location: {
    village: 'Port Ellen to Kildalton',
    distanceFromBruichladdich: '45-minute drive to Port Ellen',
  },
  attributes: {
    difficulty: 'moderate',
    circular: false,
    routeHighlights: 'Laphroaig, Lagavulin, and Ardbeg distilleries; Kildalton Cross (8th century); Dunyvaig Castle ruins; coastal scenery.',
  },
  tags: ['walking', 'whisky', 'heritage', 'south-coast', 'distilleries'],
  ecosystemSite: 'pbi',
});

// ─── JURA ENTITIES (IoJ-canonical — 10 entities) ─────────────────────────────

const juraEntities = [
  entity('jura-distillery', {
    name: 'Jura Distillery',
    category: 'distillery',
    schemaOrgType: 'BreweryOrWinery',
    island: 'jura',
    status: 'active',
    shortDescription: 'Jura Distillery is located in Craighouse, the main village on the Isle of Jura, and is one of only two businesses on the island. It produces lightly peated and unpeated single malt Scotch whisky.',
    location: {
      village: 'Craighouse, Jura',
    },
    contact: {
      website: 'https://www.isleofjura.com',
    },
    attributes: {
      peatLevel: 'lightly-peated',
      requiresBooking: true,
    },
    tags: ['whisky', 'jura', 'distillery'],
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
  }),

  entity('the-antlers-jura', {
    name: 'The Antlers',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'jura',
    status: 'active',
    shortDescription: 'The Antlers is a restaurant in Craighouse, Jura, serving lunch and dinner. One of the few dining options on the island.',
    location: {
      village: 'Craighouse, Jura',
    },
    attributes: {
      requiresBooking: true,
    },
    tags: ['restaurant', 'jura', 'craighouse'],
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
  }),

  entity('jura-hotel', {
    name: 'Jura Hotel',
    category: 'restaurant',
    schemaOrgType: 'Hotel',
    island: 'jura',
    status: 'active',
    shortDescription: 'The Jura Hotel is the main hotel and bar on the Isle of Jura, located in Craighouse. It serves food and drink and is a social hub for the island.',
    location: {
      village: 'Craighouse, Jura',
    },
    tags: ['hotel', 'bar', 'restaurant', 'jura', 'craighouse'],
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
  }),

  // Note: lussa-gin-jura removed — lussa-gin-distillery is the canonical entity ID (see ENTITY-AUDIT.md entity issues)

  entity('paps-of-jura', {
    name: 'Paps of Jura',
    category: 'attraction',
    schemaOrgType: 'Mountain',
    island: 'jura',
    status: 'active',
    shortDescription: 'The Paps of Jura are three distinctive quartzite mountains on the Isle of Jura, rising to 785m (Beinn an Òir), forming the island\'s iconic skyline visible from Islay and across the Scottish coast. A challenging hill walk for experienced hillwalkers.',
    location: {
      village: 'Central Jura',
    },
    tags: ['mountains', 'jura', 'hillwalking', 'iconic', 'landscape'],
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
  }),

  entity('small-isles-bay-jura', {
    name: 'Small Isles Bay',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'jura',
    status: 'active',
    shortDescription: 'Small Isles Bay is a sheltered bay near Craighouse on the Isle of Jura, walkable from the village and suitable for swimming.',
    location: {
      village: 'Craighouse, Jura',
    },
    attributes: {
      familyFriendly: true,
    },
    tags: ['beach', 'jura', 'craighouse', 'swimming'],
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
  }),

  entity('corran-sands-jura', {
    name: 'Corran Sands',
    category: 'beach',
    schemaOrgType: 'Beach',
    island: 'jura',
    status: 'active',
    shortDescription: 'Corran Sands is a beach on the Isle of Jura accessible on foot or by cycle from Craighouse.',
    location: {
      village: 'Jura',
    },
    tags: ['beach', 'jura', 'walk', 'cycle'],
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
  }),

  entity('feolin-ferry-terminal', {
    name: 'Feolin Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'active',
    shortDescription: 'Feolin Ferry Terminal is the arrival point on Jura for the short 5-minute crossing from Port Askaig on Islay. Operated by Argyll and Bute Council. No vehicle booking required.',
    location: {
      village: 'Feolin, Jura',
    },
    tags: ['ferry', 'transport', 'jura', 'port-askaig'],
    ecosystemSite: 'pbi',
  }),

  entity('corryvreckan-whirlpool', {
    name: 'Corryvreckan Whirlpool',
    category: 'attraction',
    schemaOrgType: 'TouristAttraction',
    island: 'jura',
    status: 'active',
    shortDescription: 'The Corryvreckan Whirlpool is located in the strait between the Isle of Jura and Isle of Scarba, and is the third largest whirlpool in the world. Most dramatic during spring and autumn equinox tides. Viewable on foot from a clifftop path on Jura\'s north coast, or by boat with Jura Boat Tours.',
    location: {
      village: 'North Jura (between Jura and Scarba)',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['wildlife', 'dramatic', 'natural-wonder', 'jura', 'boat-tour'],
  }),

  entity('barnhill-jura', {
    name: 'Barnhill',
    category: 'heritage',
    schemaOrgType: 'LandmarksOrHistoricalBuildings',
    island: 'jura',
    status: 'active',
    shortDescription: 'Barnhill is a remote farmhouse in the north of Jura where George Orwell wrote Nineteen Eighty-Four (1948–49). The house is privately owned and visitors may not approach it, but it comes dramatically into view from the public track. Last parking at the quarry — walk from there.',
    attributes: {
      accessRestrictions: 'Private property. Viewable from public track only. Do not approach the house. Park at quarry and walk remainder.',
      heritagePeriod: '1946–1950 (Orwell\'s residence; 1984 written here)',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['heritage', 'literary', 'orwell', '1984', 'jura', 'remote'],
  }),

  entity('lussa-gin-distillery', {
    name: 'Lussa Gin Distillery',
    category: 'distillery',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'active',
    shortDescription: 'Lussa Gin is a small family-run gin distillery at Ardlussa Estate on the Isle of Jura, producing hand-crafted gins from locally sourced botanicals and island spring water. Juniper Garden on site. Tours and tastings available.',
    location: {
      village: 'Ardlussa, north Jura',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['gin', 'distillery', 'jura', 'ardlussa', 'tours', 'craft'],
  }),
];

// ─── Additional Jura activity entities ───────────────────────────────────────

const juraActivities = [
  entity('deer-island-rum-jura', {
    name: 'Deer Island Rum',
    category: 'distillery',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'active',
    shortDescription: 'Deer Island Rum is a small rum distillery located at The Pier Garage in Craighouse, Jura.',
    location: {
      village: 'Craighouse, Jura (The Pier Garage)',
    },
    contact: {
      website: 'https://www.deerisland.co.uk',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['rum', 'distillery', 'jura', 'craighouse', 'craft'],
  }),

  entity('jura-cycles', {
    name: 'Jura Cycles',
    category: 'activity',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'active',
    shortDescription: 'Jura Cycles offers bicycle hire on the Isle of Jura — 8 adult bikes and 2 children\'s bikes, helmets included. Day and weekly rates. Packed lunches can be arranged.',
    contact: {
      phone: '07562 762382',
      email: 'juracycles@icloud.com',
    },
    attributes: {
      priceRange: '£20/day, £100/week',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['cycling', 'hire', 'activity', 'jura', 'family-friendly'],
  }),

  entity('jura-guided', {
    name: 'Jura Guided',
    category: 'activity',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'active',
    shortDescription: 'Jura Guided, operated by Grant Rozga, offers bespoke guided walks and outdoor adventures on the Isle of Jura for all abilities, from beginners to experienced hikers.',
    contact: {
      website: 'https://www.juraguided.com',
    },
    attributes: {
      requiresBooking: true,
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['guided-walks', 'activity', 'jura', 'bespoke'],
  }),

  entity('island-tours-jura', {
    name: 'Island Tours Jura (Orion / Gordon)',
    category: 'activity',
    schemaOrgType: 'LocalBusiness',
    island: 'jura',
    status: 'active',
    shortDescription: 'Island Tours Jura offers boat trips and land tours of the Isle of Jura. Boat trips aboard Orion are operated by Nicol (07768 450 000); land tours in two 6-seater vehicles by Gordon (07803 198 320). Private charters available.',
    location: {
      village: 'Craighouse, Jura',
    },
    contact: {
      phone: '07768 450 000',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['tours', 'boat', 'land', 'jura', 'private-charter'],
  }),

  entity('jura-fell-race', {
    name: 'Jura Fell Race',
    category: 'event',
    schemaOrgType: 'Event',
    island: 'jura',
    status: 'active',
    shortDescription: 'The Jura Fell Race is an annual hill running race held each May on the Isle of Jura, covering a challenging route over the Paps of Jura. One of Scotland\'s most celebrated and gruelling fell races.',
    contact: {
      website: 'https://www.isleofjurafellrace.co.uk',
    },
    attributes: {
      eventMonth: 'May',
    },
    ecosystemSite: 'ioj',
    canonicalExternalUrl: 'https://isleofjura.scot/things-to-do/',
    tags: ['fell-race', 'running', 'event', 'jura', 'annual', 'paps'],
  }),
];

// ─── Full entity list in priority order ───────────────────────────────────────

const ALL_ENTITIES = [
  ...distilleries,       // 11 — live on distilleries guide page (incl. laggan-bay-distillery)
  ...restaurants,        // 9  — live on food-and-drink guide page
  ...cafesShops,         // 4  — food-and-drink
  ...beaches,            // 11 — beaches guide page
  ...nature,             // 4  — wildlife guide page
  ...attractions,        // 4  — family guide page
  ...events,             // 1
  ...villages,           // 7  — islay-villages guide page (incl. bridgend-village)
  ...transport,          // 7  — incl. bruichladdich-taxis + attic-cabs-islay
  ...gapEntities,        // 3
  ...routes,             // 7  — walking guide page
  kildaltonRoute,        // 1  — archaeology guide page
  ...heritage,           // 8  — archaeology guide page
  ...juraEntities,       // 10 — visit-jura guide page
  ...juraActivities,     // 5  — visit-jura guide page
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`=== populate-entities.ts ===`);
  console.log(`Total entities to import: ${ALL_ENTITIES.length}\n`);

  let created = 0;
  let failed = 0;

  for (const doc of ALL_ENTITIES) {
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${doc._id}`);
      created++;
    } catch (err: any) {
      console.error(`  ✗ ${doc._id}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Created/replaced: ${created}`);
  console.log(`  Failed: ${failed}`);
  console.log(`\nVerify in Studio: Site Entities collection`);
}

run().catch(console.error);
