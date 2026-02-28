/**
 * import-travel-entities-2026-02-28.ts
 *
 * Creates 31 new siteEntity documents for:
 * - /islay-travel/ spokes (ferry, without-a-car, arriving, getting-around, dog-travel)
 * - /explore-islay/dog-friendly-islay
 *
 * Uses createIfNotExists — safe to re-run without overwriting existing data.
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/import-travel-entities-2026-02-28.ts
 */

import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

function entity(id: string, data: Record<string, any>) {
  return {
    _id: `siteEntity.${id}`,
    _type: 'siteEntity',
    entityId: { _type: 'slug', current: id },
    ecosystemSite: 'pbi',
    ...data,
  };
}

const ENTITIES = [

  // ─── Transport Operators ────────────────────────────────────────────────────

  entity('calmac', {
    name: 'CalMac',
    category: 'transport',
    schemaOrgType: 'Organization',
    island: 'other',
    status: 'active',
    shortDescription: 'CalMac (Caledonian MacBrayne) operates year-round passenger and vehicle ferry services from Kennacraig to Port Askaig (2 hours) and Port Ellen (2 hours 20 minutes) on the Isle of Islay.',
    contact: { website: 'https://www.calmac.co.uk' },
    tags: ['ferry', 'transport'],
  }),

  entity('citylink', {
    name: 'Citylink',
    category: 'transport',
    schemaOrgType: 'Organization',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Scottish Citylink operates a daily coach service from Glasgow Buchanan Street to Kennacraig Ferry Terminal, connecting with CalMac sailings to Islay. Journey time approximately 2.5 hours. Dogs are not permitted (assistance dogs only).',
    importantNote: 'Dogs not permitted — assistance dogs only.',
    contact: { website: 'https://www.citylink.co.uk' },
    tags: ['bus', 'transport', 'mainland'],
  }),

  entity('islay-coaches', {
    name: 'Islay Coaches',
    category: 'transport',
    schemaOrgType: 'Organization',
    island: 'islay',
    status: 'active',
    shortDescription: 'Islay Coaches operates Routes 450 and 451, connecting Portnahaven, Port Charlotte, Bruichladdich, Bowmore, Port Ellen, Ardbeg, and Port Askaig. Timetables published by Argyll and Bute Council. Dogs not permitted (assistance dogs only).',
    importantNote: 'Dogs not permitted — assistance dogs only.',
    contact: {
      website: 'https://www.argyll-bute.gov.uk/roads-and-travel/roads-and-travel/public-transport-timetables/bus-travel#islay-and-jura',
    },
    tags: ['bus', 'transport'],
  }),

  entity('islay-bike-hire', {
    name: 'Islay Bike Hire',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'islay',
    status: 'active',
    shortDescription: 'Islay Bike Hire offers standard bicycle rental on the Isle of Islay.',
    contact: { website: 'https://www.islay-bikehire.co.uk' },
    tags: ['bike', 'hire', 'cycling'],
  }),

  entity('islay-e-wheels', {
    name: 'Islay E-Wheels',
    category: 'transport',
    schemaOrgType: 'LocalBusiness',
    island: 'islay',
    status: 'active',
    shortDescription: 'Islay E-Wheels provides electric bicycle hire on the Isle of Islay, with Bosch drive systems. Well-suited for longer-distance cycling and distillery days.',
    contact: { website: 'https://islayewheels.co.uk' },
    tags: ['bike', 'hire', 'e-bike', 'cycling'],
  }),

  // ─── Mainland Locations ─────────────────────────────────────────────────────

  entity('glasgow-buchanan-street', {
    name: 'Glasgow Buchanan Street Bus Station',
    category: 'transport',
    schemaOrgType: 'BusStation',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Glasgow Buchanan Street Bus Station is the main intercity coach terminal in Glasgow, serving as the departure point for Citylink services to Kennacraig and the Kintyre peninsula.',
    location: {
      address: 'Killermont Street',
      village: 'Glasgow',
      postcode: 'G2 3NW',
    },
    tags: ['bus', 'transport', 'mainland', 'glasgow'],
  }),

  entity('ardrossan-ferry-terminal', {
    name: 'Ardrossan Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'Place',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Ardrossan Ferry Terminal on the Ayrshire coast is the CalMac departure point for the ferry to Brodick, Isle of Arran. Starting point for the cycling route to Islay via Arran and Kintyre.',
    location: {
      village: 'Ardrossan',
      postcode: 'KA22 8ED',
    },
    tags: ['ferry', 'transport', 'mainland', 'arran'],
  }),

  entity('brodick', {
    name: 'Brodick',
    category: 'transport',
    schemaOrgType: 'Place',
    island: 'other',
    status: 'active',
    shortDescription: 'Brodick is the main town and ferry port on the Isle of Arran, served by CalMac from Ardrossan. The cycling route to Islay passes through Brodick before crossing Arran to Lochranza.',
    location: { village: 'Brodick, Isle of Arran' },
    tags: ['ferry', 'arran', 'transport'],
  }),

  entity('lochranza', {
    name: 'Lochranza Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'Place',
    island: 'other',
    status: 'seasonal',
    shortDescription: 'Lochranza is a village on the north coast of Arran with a seasonal CalMac ferry to Claonaig on the Kintyre peninsula. Operates approximately April to late October — not available in winter.',
    importantNote: 'Seasonal — operates April to late October only. Not available in winter.',
    location: { village: 'Lochranza, Isle of Arran' },
    tags: ['ferry', 'arran', 'transport', 'seasonal'],
  }),

  entity('claonaig', {
    name: 'Claonaig Ferry Terminal',
    category: 'transport',
    schemaOrgType: 'Place',
    island: 'mainland',
    status: 'seasonal',
    shortDescription: 'Claonaig is a small settlement on the Kintyre peninsula with a seasonal CalMac ferry to Lochranza, Isle of Arran. Part of the cycling route to Islay via Arran.',
    importantNote: 'Seasonal — operates April to late October only.',
    location: { village: 'Claonaig, Kintyre' },
    tags: ['ferry', 'kintyre', 'transport', 'seasonal'],
  }),

  entity('tarbert', {
    name: 'Tarbert',
    category: 'village',
    schemaOrgType: 'Place',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Tarbert is a harbour town on the Kintyre peninsula, approximately 5 minutes from Kennacraig Ferry Terminal. Convenient as a base for ferry delays or overnight stays.',
    editorialNote: 'If your ferry is cancelled and you need to stay near Kennacraig, Tarbert is the obvious base — a proper harbour village with cafés and accommodation, 5 minutes from the terminal.',
    location: { village: 'Tarbert, Kintyre' },
    tags: ['mainland', 'kintyre', 'harbour'],
  }),

  // ─── Cycle Routes ───────────────────────────────────────────────────────────

  entity('ncn-route-753', {
    name: 'NCN Route 753',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'mainland',
    status: 'active',
    shortDescription: 'National Cycle Network Route 753 runs from Glasgow to Ardrossan on the Ayrshire coast — approximately 35 miles, largely traffic-free. First leg of the cycle route to Islay via Arran and Kintyre.',
    contact: { website: 'https://www.sustrans.org.uk' },
    attributes: { distanceMiles: 35, difficulty: 'moderate' },
    tags: ['cycling', 'ncn', 'mainland'],
  }),

  entity('ncn-route-75', {
    name: 'NCN Route 75',
    category: 'route',
    schemaOrgType: 'TouristAttraction',
    island: 'mainland',
    status: 'active',
    shortDescription: 'National Cycle Network Route 75 runs from Glasgow through Greenock and Gourock, with ferry connections to Cowal, then Portavadie, then Tarbert — ending at Kennacraig for the Islay crossing. Year-round alternative to the Arran route.',
    contact: { website: 'https://www.sustrans.org.uk' },
    tags: ['cycling', 'ncn', 'mainland'],
  }),

  // ─── A83 Stops (mainland route to Kennacraig) ───────────────────────────────

  entity('loch-fyne-oysters', {
    name: 'Loch Fyne Oysters',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Loch Fyne Oysters is a seafood deli, restaurant, and shop at Cairndow on the A83, at the head of Loch Fyne. Known for oysters, smoked fish, cheese, and local produce.',
    editorialNote: 'The best stop on the A83. The deli is genuinely exceptional — stock up on oysters, smoked salmon, and cheese for the ferry. The Tree Shop next door has good coffee and a dog walk worth 20 minutes.',
    location: {
      address: 'Clachan Farm, Cairndow',
      village: 'Cairndow',
      postcode: 'PA26 8BL',
    },
    contact: { website: 'https://www.lochfyne.com' },
    tags: ['restaurant', 'deli', 'a83', 'seafood', 'mainland'],
  }),

  entity('tree-shop-garden-centre', {
    name: 'The Tree Shop Garden Centre & Café',
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'mainland',
    status: 'active',
    shortDescription: 'The Tree Shop is a garden centre and café adjacent to Loch Fyne Oysters on the A83 at Cairndow. Coffee, cakes, gift shop, and a walk behind the centre suitable for dogs and children.',
    editorialNote: "Next door to Loch Fyne Oysters and worth doing together. The walk behind the garden centre is excellent if you've got dogs or children who need a stretch.",
    location: {
      address: 'Clachan Farm, Cairndow',
      village: 'Cairndow',
      postcode: 'PA26 8BL',
    },
    tags: ['cafe', 'garden-centre', 'a83', 'mainland', 'dog-friendly'],
  }),

  entity('inveraray-prison', {
    name: 'Inveraray Jail',
    category: 'attraction',
    schemaOrgType: 'TouristAttraction',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Inveraray Jail is a living history museum in Inveraray, Argyll, housed in the original 1820 county courthouse and prison. Approximately 1 hour visit.',
    location: {
      address: 'Church Square, Inveraray',
      village: 'Inveraray',
      postcode: 'PA32 8TX',
    },
    contact: { website: 'https://www.inverarayjail.co.uk' },
    tags: ['history', 'attraction', 'a83', 'mainland', 'family-friendly'],
  }),

  entity('inveraray-castle', {
    name: 'Inveraray Castle',
    category: 'heritage',
    schemaOrgType: 'TouristAttraction',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Inveraray Castle is the ancestral seat of the Dukes of Argyll on the shore of Loch Fyne, with extensive gardens open to visitors. A83 stop on the route to Kennacraig.',
    location: {
      village: 'Inveraray',
      postcode: 'PA32 8XE',
    },
    contact: { website: 'https://www.inveraray-castle.com' },
    tags: ['castle', 'gardens', 'heritage', 'a83', 'mainland'],
  }),

  entity('lochgilphead-coop', {
    name: 'Lochgilphead Co-op',
    category: 'cafe',
    schemaOrgType: 'GroceryStore',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Co-op supermarket in Lochgilphead, approximately 30 minutes from Kennacraig Ferry Terminal. The last major food shopping and fuel stop on the A83 before the Islay crossing.',
    editorialNote: 'The practical stop — stock up on food and fill up on fuel here before Kennacraig.',
    location: { village: 'Lochgilphead' },
    tags: ['supermarket', 'food', 'a83', 'mainland'],
  }),

  entity('inveraray-coop', {
    name: 'Inveraray Co-op',
    category: 'cafe',
    schemaOrgType: 'GroceryStore',
    island: 'mainland',
    status: 'active',
    shortDescription: 'Co-op supermarket in Inveraray on the A83. Secondary food stop on the route to Kennacraig, approximately 1 hour from the ferry terminal.',
    location: { village: 'Inveraray' },
    tags: ['supermarket', 'food', 'a83', 'mainland'],
  }),

  // ─── Islay: Ports and Service Entities ─────────────────────────────────────

  entity('port-askaig-hotel', {
    name: 'Port Askaig Hotel',
    category: 'accommodation',
    schemaOrgType: 'Hotel',
    island: 'islay',
    status: 'active',
    shortDescription: 'Port Askaig Hotel is a small hotel and bar steps from the CalMac ferry terminal at Port Askaig, overlooking the Sound of Islay towards Jura. Convenient for late arrivals or early departures via Port Askaig.',
    editorialNote: 'Steps from the ferry and looking straight across the Sound to Jura. An ideal stop to decompress before the drive to Bruichladdich.',
    importantNote: 'Confirm current trading status before including in itinerary.',
    location: {
      village: 'Port Askaig',
      postcode: 'PA46 7RD',
    },
    tags: ['hotel', 'bar', 'port-askaig', 'arrival'],
  }),

  entity('port-ellen-coop', {
    name: 'Port Ellen Co-op',
    category: 'cafe',
    schemaOrgType: 'GroceryStore',
    island: 'islay',
    status: 'active',
    shortDescription: 'Co-op supermarket in Port Ellen village. The most convenient food shopping stop for guests arriving at Port Ellen ferry terminal.',
    location: { village: 'Port Ellen' },
    tags: ['supermarket', 'food', 'port-ellen'],
  }),

  // ─── Islay: Pubs and Bars ────────────────────────────────────────────────────

  entity('bridgend-hotel', {
    name: 'Bridgend Hotel',
    category: 'restaurant',
    schemaOrgType: 'BarOrPub',
    island: 'islay',
    status: 'active',
    shortDescription: "Bridgend Hotel is a pub and hotel in Bridgend village at the head of Loch Indaal. Katie's Bar welcomes dogs. Located at the road junction for Port Askaig, Bowmore, and Bruichladdich.",
    location: {
      village: 'Bridgend',
      distanceFromBruichladdich: '15-minute drive',
    },
    tags: ['pub', 'bar', 'dog-friendly', 'bridgend'],
  }),

  entity('bowmore-hotel', {
    name: 'Bowmore Hotel',
    category: 'restaurant',
    schemaOrgType: 'BarOrPub',
    island: 'islay',
    status: 'active',
    shortDescription: "Bowmore Hotel in Bowmore town centre includes Luccis Whisky Bar, which welcomes dogs.",
    location: {
      village: 'Bowmore',
      distanceFromBruichladdich: '15-minute drive',
    },
    tags: ['pub', 'bar', 'whisky', 'dog-friendly', 'bowmore'],
  }),

  // ─── Islay: Cafés ────────────────────────────────────────────────────────────

  entity('debbies-coffee-shop', {
    name: "Debbie's Coffee Shop",
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'islay',
    status: 'active',
    shortDescription: "Debbie's Coffee Shop is a dog-friendly café in Bruichladdich village, the closest café to Portbahn House and Shorefield Eco House.",
    location: {
      village: 'Bruichladdich',
      distanceFromBruichladdich: '5-minute walk',
    },
    tags: ['cafe', 'dog-friendly', 'bruichladdich'],
  }),

  entity('craigard-kitchen', {
    name: 'Craigard Kitchen',
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'islay',
    status: 'active',
    shortDescription: 'Craigard Kitchen is a dog-friendly café in Ballygrant on the east side of Islay.',
    location: { village: 'Ballygrant' },
    tags: ['cafe', 'dog-friendly', 'ballygrant'],
  }),

  entity('labels-bowmore', {
    name: 'Labels',
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'islay',
    status: 'active',
    shortDescription: 'Labels is a dog-friendly café on Shore Street in Bowmore, Isle of Islay.',
    location: {
      address: 'Shore Street, Bowmore',
      village: 'Bowmore',
    },
    tags: ['cafe', 'dog-friendly', 'bowmore'],
  }),

  entity('little-charlottes-cafe', {
    name: "Little Charlotte's Café",
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'islay',
    status: 'active',
    shortDescription: "Little Charlotte's Café is a dog-friendly café in Port Ellen, Isle of Islay.",
    location: { village: 'Port Ellen' },
    tags: ['cafe', 'dog-friendly', 'port-ellen'],
  }),

  entity('cafaidh-blasta', {
    name: 'Cafaidh Blasta',
    category: 'cafe',
    schemaOrgType: 'CafeOrCoffeeShop',
    island: 'islay',
    status: 'active',
    shortDescription: 'Cafaidh Blasta is a dog-friendly café at the Islay Gaelic Centre in Bowmore, Isle of Islay.',
    location: { village: 'Bowmore' },
    tags: ['cafe', 'dog-friendly', 'bowmore', 'gaelic'],
  }),

  // ─── Islay: Food Venues ──────────────────────────────────────────────────────

  entity('islay-oysters', {
    name: 'Islay Oysters',
    category: 'restaurant',
    schemaOrgType: 'Restaurant',
    island: 'islay',
    status: 'active',
    shortDescription: 'Islay Oysters is a seafood restaurant and oyster producer at Killinallan on the north shore of Loch Gruinart. Dog-friendly dining.',
    location: {
      village: 'Killinallan',
      distanceFromBruichladdich: '25-minute drive',
    },
    tags: ['restaurant', 'seafood', 'oysters', 'dog-friendly', 'loch-gruinart'],
  }),

  // ─── Islay: Services ─────────────────────────────────────────────────────────

  entity('woof-wash-islay', {
    name: 'Woof Wash Islay',
    category: 'other',
    schemaOrgType: 'LocalBusiness',
    island: 'islay',
    status: 'active',
    shortDescription: 'Woof Wash Islay offers dog grooming and a dog spa on the Isle of Islay.',
    contact: { phone: '07954 085630' },
    tags: ['dog', 'grooming', 'service'],
  }),

  entity('beth-newman-islay-vet', {
    name: 'Beth Newman, Islay Vet',
    category: 'other',
    schemaOrgType: 'VeterinaryCare',
    island: 'islay',
    status: 'active',
    shortDescription: "Beth Newman is Islay's only veterinary practice, located at 20 Shore Street, Bowmore, Isle of Islay PA43 7LB.",
    location: {
      address: '20 Shore Street, Bowmore',
      village: 'Bowmore',
      postcode: 'PA43 7LB',
    },
    contact: { phone: '01496 810205' },
    tags: ['vet', 'dog', 'service'],
  }),

];

async function run() {
  console.log('=== import-travel-entities-2026-02-28.ts ===\n');
  console.log(`Creating ${ENTITIES.length} siteEntity documents (createIfNotExists)...\n`);

  let count = 0;
  for (const e of ENTITIES) {
    await client.createIfNotExists(e);
    console.log(`  ✓ ${e._id}`);
    count++;
  }

  console.log(`\n=== Done ===`);
  console.log(`  ${count} entities processed`);
  console.log('\nVerify in Studio: https://portbahnislay.sanity.studio/structure/siteEntity');
}

run().catch(console.error);
