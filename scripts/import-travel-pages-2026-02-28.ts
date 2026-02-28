/**
 * import-travel-pages-2026-02-28.ts
 *
 * 1. Patches gettingHerePage — sets scopeIntro
 * 2. Patches guide-ferry-to-islay — introduction + extendedEditorial + featuredEntities + SEO
 * 3. Patches guide-planning-your-trip — introduction + extendedEditorial + featuredEntities + SEO
 * 4. createOrReplace guide-travelling-without-a-car
 * 5. createOrReplace guide-travelling-to-islay-with-your-dog
 * 6. createOrReplace guide-arriving-on-islay
 * 7. createOrReplace guide-getting-around-islay
 * 8. createOrReplace guide-dog-friendly-islay
 *
 * NOTE: Bold inline marks are omitted for this initial import — content is
 * semantically complete. Add via Studio or subsequent script if needed.
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/import-travel-pages-2026-02-28.ts
 */

import { createClient } from 'next-sanity';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── PortableText helpers ──────────────────────────────────────────────────────

function key(): string {
  return randomBytes(5).toString('hex');
}

function para(text: string) {
  return {
    _type: 'block', _key: key(), style: 'normal', markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function h3(text: string) {
  return {
    _type: 'block', _key: key(), style: 'h3', markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function bullet(text: string) {
  return {
    _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1,
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function paraWithLink(before: string, linkText: string, href: string) {
  const linkKey = key();
  return {
    _type: 'block', _key: key(), style: 'normal',
    markDefs: [{ _type: 'link', _key: linkKey, href }],
    children: [
      ...(before ? [{ _type: 'span', _key: key(), text: before, marks: [] }] : []),
      { _type: 'span', _key: key(), text: linkText, marks: [linkKey] },
    ],
  };
}

function ref(id: string) {
  return { _key: key(), _type: 'reference' as const, _ref: id };
}

// ─── FERRY-TO-ISLAY extended editorial ────────────────────────────────────────

const ferryEditorial = [
  h3('The Two Routes from Kennacraig'),
  para('CalMac operates two year-round routes from Kennacraig Ferry Terminal on the Kintyre peninsula to Islay.'),
  para('Kennacraig to Port Askaig: 2 hours. Serves the north of the island. More sheltered in bad weather — often the last route to be cancelled when southwest gales arrive. For guests staying near Bruichladdich and the Rhinns: Port Askaig is the closer arrival point, around 30 minutes drive across the island.'),
  para('Kennacraig to Port Ellen: 2 hours 20 minutes. Serves the south — the whisky coast, Port Ellen village, and Islay Airport. More exposed in rough weather than the Port Askaig route.'),

  h3('Booking Your Crossing'),
  para('Book as early as possible — 12 weeks ahead for summer sailings and Fèis Ìle is not excessive. The island has limited capacity and ferries fill. Foot passengers can often walk on in shoulder and off-peak seasons, but in peak season pre-booking is strongly advised. Cars must always be pre-booked — do not turn up at Kennacraig without a reservation in summer.'),
  para("A practical note on Fèis Ìle: held in late May, this is Islay's busiest week by far. Sailings and standby queues fill weeks in advance. If you're attending, treat ferry booking as step one — before accommodation, before distillery events, before everything."),

  h3('What to Expect on the Crossing'),
  para("The approach to Kennacraig already feels like arrival. The A83 through Kintyre is one of Scotland's great coastal drives — the final stretch down from Tarbert is the warm-up act. On board, CalMac ferries have a café, comfortable seating areas, and deck access. In good weather, stand on deck — the crossing offers some of the best views in Argyll, and watching Islay appear on the horizon is one of those moments guests mention in reviews."),

  h3('Port Askaig or Port Ellen — Which Is Right for You?'),
  para('If your timetable gives you a choice, which port you arrive at depends on where you are staying.'),
  para('Staying near Bruichladdich and the Rhinns (Portbahn House, Shorefield Eco House): use Port Askaig. Around 30 minutes across the island — a scenic drive through moorland and across to the west coast.'),
  para("Staying near Port Ellen, Bowmore, or the south Islay whisky coast: use Port Ellen. You'll be closer to Laphroaig, Lagavulin, and Ardbeg on arrival. In practice, you don't always get to choose — it depends on which sailing fits your journey. If your booking is for Port Ellen but your sailing is diverted to Port Askaig in bad weather, contact us — we can help you reroute."),

  h3('CalMac Cancellations — What to Do'),
  para('Ferry cancellations happen. Southwest gales are the main cause, typically in winter and occasionally in autumn. Port Askaig is more sheltered than Port Ellen — when one route is cancelled, the other is often still running. CalMac\'s real-time updates come through their website and app.'),
  para("If your crossing is cancelled, contact me immediately. I've helped dozens of guests navigate this — we'll find the next available sailing, adjust your check-in, and if you need to stay near Kennacraig overnight, I can point you towards options in Tarbert, 5 minutes away. In 8+ years and over 600 guest stays, we've never had a booking collapse due to CalMac. There's always a solution."),

  h3('Getting to Kennacraig'),
  para('Kennacraig Ferry Terminal is on the west coast of Kintyre, around 2.5 hours from Glasgow by car. Use the A83 — not the A82. The A83 takes you west through Arrochar, south through Inveraray and down Loch Fyne, then along the Kintyre peninsula to Kennacraig.'),
  para("Don't be late. CalMac releases your booking to standby if you haven't checked in at least 30 minutes before departure — even with a confirmed reservation. The A83 carries heavy lorry traffic on single-carriageway sections through Kintyre. Build in a buffer."),
  para('Phone signal is strong from Glasgow through Loch Lomond. Once you leave the A82 at Arrochar and take the A83 west, it becomes patchy through much of Kintyre. Download your CalMac booking confirmation, directions, and offline maps before leaving Glasgow.'),
  para("Fuel and food: fill up and do any food shopping on the mainland. Lochgilphead has a large Co-op and is the last major stop before Kennacraig. Inveraray has a Co-op too. Fill up at Lochgilphead rather than arriving on Islay on fumes."),
  para("The A83 has some excellent stops if you're not in a rush — worth knowing if you're travelling with children, elderly passengers, or dogs:"),
  bullet("Loch Fyne Oysters (Cairndow) — exceptional deli with seafood, cheese, and local meats. The Tree Shop Garden Centre next door has good coffee and a walk good for dogs and children. It's where we always stop."),
  bullet('Inveraray — Inveraray Jail is worth an hour and Inveraray Castle has exceptional gardens. Both have facilities.'),
  bullet("Lochgilphead — the seafront playground is a good stretch for children and dogs. Public toilets on the seafront. Kennacraig is 30 minutes from here."),
  para("If you arrive at Kennacraig with time to spare, Tarbert (5 minutes back up the road) has a harbour, cafés, and a much calmer wait than the terminal car park."),

  h3('Continuing to Jura'),
  paraWithLink(
    'From Port Askaig, foot passengers and cyclists can take the Jura Passenger Ferry to Feolin on Jura — a 5-minute crossing, no booking needed for foot passengers. Jura is worth a day trip or an evening walk from Port Askaig. ',
    'Jura day trip from Islay →',
    '/explore-islay/visit-jura'
  ),
];

// ─── PLANNING-YOUR-TRIP extended editorial ────────────────────────────────────

const planningEditorial = [
  h3('When to Visit Islay'),
  para("There's no wrong season on Islay — but each is genuinely different."),
  bullet("Spring (April - May): Quiet roads, green hills, and dramatic shifting light. Lambing season. Good for walks, wildlife, and distillery visits without the summer rush. Late May means Fèis Ìle — see below if your dates overlap."),
  bullet("Summer (June - August): Peak season. The best chance of sustained sunshine and longest days. Summer weekdays are noticeably quieter than weekends."),
  bullet("Autumn (September - October): The barnacle geese arrive — around 30,000 of them on the Rhinns of Islay from late September. The light turns golden. Crowds thin after the school holidays. Many guests tell us autumn is their favourite season on Islay."),
  bullet("Winter (November - March): Raw, honest, and beautiful in a way that Islay's summer visitors rarely see. Some businesses close or reduce hours. Ferry disruptions are more likely in strong southwest winds. If you visit in winter, you get Islay to yourself."),

  h3('Fèis Ìle — The Islay Whisky Festival'),
  para("Fèis Ìle is Islay's annual whisky festival, held in late May. Each of the island's 10 distilleries runs its own open day, with exclusive releases, tastings, live music, and events. Bruichladdich's Fèis Ìle open day is consistently one of the most popular and sells out within hours of release."),
  para("If you're planning to attend: treat this like a major festival. Book your ferry 12+ weeks ahead. Book accommodation at the same time — the island fills completely. Pre-book distillery events as soon as they're announced. Not visiting for whisky? Fèis Ìle week is worth avoiding for a quieter trip — the island is at full capacity throughout."),

  h3('How Long to Stay'),
  para("Our honest advice: three nights is the minimum to feel the pace, a week is better, and it's never quite enough."),
  para("A week gives you real time to explore: the Rhinns and west coast, the south Islay whisky coast from Port Ellen to Ardbeg, Bowmore and the centre of the island, and a day trip to Jura. Three nights means you'll just be finding your rhythm when it's time to pack."),
  para("If a long weekend is all you have — go. Just start planning your return trip on the ferry home."),

  h3('What to Pack'),
  para("Pack for Scottish weather — which on Islay means: always waterproofs, always layers. Even in July, a warm mid-layer for evenings is not optional. Good waterproof footwear will earn its keep every day, even if you're not doing formal hill walks."),
  para("Midges: present from late June through August, particularly in still, damp weather. Smidge is the most effective repellent we've found — worth packing for summer visits. The Co-op in Bowmore and the Co-op in Port Ellen are both well-stocked for everyday supplies. For anything specific — particular dietary requirements, specialist items — bring it from the mainland."),

  h3('Booking Ahead'),
  para('Three things to book as early as possible:'),
  bullet('Ferry: 12 weeks ahead for summer and Fèis Ìle. Non-negotiable.'),
  bullet("Accommodation: Properties fill early for summer and Fèis Ìle. The same 12-week lead time applies."),
  bullet("Distillery tours: Book direct with each distillery. If you're staying in Bruichladdich, the distillery is a 5-minute walk — the visitor centre welcomes walk-ins without a booking. Tours need to be booked separately."),
  bullet("Restaurants: The Lochindaal Seafood Kitchen in Port Charlotte requires 24 hours' advance booking for the seafood platter — their most popular dish and worth planning around."),

  h3('Getting Around the Island'),
  para("Most visitors hire a car — Islay's distilleries, beaches, and viewpoints are spread across the island and a car opens everything up. Car hire is available at the airport and in Bowmore. Travelling without a car? Islay is more manageable on foot and by bike than most Scottish islands. Taxis, local buses, and bike hire are all available."),
  paraWithLink('', 'Getting around Islay — taxis, bikes and the distillery trail →', '/islay-travel/getting-around-islay'),
];

// ─── TRAVELLING-WITHOUT-A-CAR extended editorial ──────────────────────────────

const withoutCarEditorial = [
  h3("You Don't Need a Car to Get Here"),
  para("Foot passengers are welcome on every CalMac sailing to Islay. The island is walkable and cyclable from most accommodation, and once you're here, taxis and local buses cover the rest. This guide covers getting from Glasgow to Islay without a car — and arriving with everything you need."),

  h3('By Bus: Glasgow to Kennacraig'),
  para('Citylink runs a daily service from Glasgow Buchanan Street and Glasgow Airport to Kennacraig, connecting with CalMac sailings to Islay. The journey takes around 2.5 hours. Bus times are designed to connect with ferry departures — confirm your connection before booking, as timings can shift seasonally.'),
  para('Important — dogs: Citylink does not allow dogs on this service (assistance dogs only). If you\'re travelling to Islay with a dog, you\'ll need to travel by car or arrange private transport to Kennacraig.'),
  paraWithLink('', 'Full guide to travelling to Islay with your dog →', '/islay-travel/travelling-to-islay-with-your-dog'),

  h3('By Bike: Glasgow to Islay via Arran (The Adventure Route)'),
  para('This is one of the most memorable ways to arrive on Islay. The route uses three CalMac ferries and takes two days minimum.'),
  bullet('Glasgow to Ardrossan — National Cycle Network Route 753, a largely traffic-free coastal route. Approximately 35 miles.'),
  bullet('CalMac ferry: Ardrossan to Brodick, Isle of Arran.'),
  bullet('Cycle across Arran to Lochranza in the north. Around 14 miles. The Goat Fell ridge is to your right for most of the ride.'),
  bullet('CalMac ferry: Lochranza to Claonaig on the Kintyre peninsula. A short crossing.'),
  bullet('Cycle Claonaig to Kennacraig via the B8001. Around 10.5 miles on a quiet road.'),
  bullet('CalMac ferry: Kennacraig to Islay.'),
  para("Critical note: The Lochranza to Claonaig ferry operates from around April to late October only — confirm current dates with CalMac before planning. This route is not possible in winter. Do not cycle the main A83 Glasgow to Campbeltown road — it carries heavy lorry traffic and is not suitable for cyclists."),
  para('Plan 2 days minimum: Glasgow to Arran on day one, Arran to Islay on day two. The NCN 753 to Ardrossan is well-signposted and documented.'),

  h3('By Bike: Year-Round Alternative via NCN Route 75'),
  para('For a year-round cycling option, NCN Route 75 runs from Glasgow through Greenock and Gourock, with ferry connections to Cowal, then Portavadie, then Tarbert — finishing at Kennacraig for the Islay crossing. More complex than the Arran route, but available in all seasons.'),

  h3('Bikes on CalMac Ferries'),
  para('Bikes travel free on all CalMac ferries. Secure your bike on the vehicle deck for the crossing. The Kennacraig to Islay crossing is long enough to head up to the café — bikes on the vehicle deck are safe.'),

  h3('Arriving as a Foot Passenger'),
  para('Port Askaig and Port Ellen both receive foot passengers. If you\'re arriving without a car and with luggage, taxi services operate at both ports.'),
  paraWithLink('For getting around the island once you\'ve arrived — taxis, local buses, and bike hire — see our ', 'on-island transport guide →', '/islay-travel/getting-around-islay'),

  h3('Continuing to Jura'),
  para("From Port Askaig, foot passengers and cyclists can take the Jura Passenger Ferry to Feolin on Jura — a 5-minute crossing, no booking required for foot passengers. Bikes are welcome."),
];

// ─── TRAVELLING-WITH-YOUR-DOG extended editorial ──────────────────────────────

const withDogEditorial = [
  h3('Good News First'),
  para("Islay is genuinely dog-friendly. CalMac welcomes dogs on all its ferries. Two of our three properties welcome dogs — with secure outdoor space and dog-walking country right on the doorstep. And the island itself, with quiet roads, open coastline, and wide beaches, is as good as it gets for dogs."),

  h3('Dogs on the Ferry — CalMac'),
  para('CalMac welcomes dogs on all sailings between Kennacraig and Islay. Dogs must be kept on a lead at all times on board. Foot passengers travelling with dogs use the designated outdoor deck areas for the crossing. Guests arriving by car: dogs travel with the vehicle on the vehicle deck during boarding and disembarkation, with deck access during the crossing. There is no extra charge from CalMac for dogs.'),
  paraWithLink('For full details of the ferry crossing — routes, booking, timetables — see our ', 'ferry guide →', '/islay-travel/ferry-to-islay'),

  h3('Dogs on the Bus — Important'),
  para('Citylink (Glasgow to Kennacraig): Dogs are not permitted on Citylink services. Assistance dogs only. If you\'re travelling to Islay with a dog, you\'ll need to travel by car or arrange private transport to Kennacraig. There is no alternative bus route that accepts dogs.'),
  para('Local Islay buses (Islay Coaches): Dogs are not permitted on local Islay buses. Assistance dogs only. If you\'re planning a car-free trip to Islay with a dog, the bus is not an option. Contact us and we\'ll help you think through alternatives.'),
  paraWithLink('', 'Getting around Islay — taxis, bikes and cycling options →', '/islay-travel/getting-around-islay'),

  h3('Where to Stay with Your Dog'),
  para('Our three properties on Islay:'),
  bullet('Portbahn House — dogs welcome. £15 per dog per stay. Secure garden, direct access to coastal cycle path.'),
  bullet('Shorefield Eco House — dogs welcome. £15 per dog per stay. Shore of Loch Indaal, coastal path walks from the door.'),
  bullet('Curlew Cottage — pet-free. Maintained for allergy sufferers.'),

  h3('Arriving with Your Dog'),
  para('If you\'re arriving as a foot passenger with a dog at Port Askaig or Port Ellen, taxi services operate at both ports. Confirm when booking that the taxi takes dogs — most do, but it\'s worth a quick call ahead. Two firms we use: Bruichladdich Taxis (07899 942673 / 01496 850271) and Attic Cabs (07944 873323).'),

  h3('On Islay with Your Dog'),
  paraWithLink(
    'Once you\'re here, Islay is a dog\'s paradise — quiet roads, open moorland, wide beaches, and a coast that goes on for miles. For the full guide to dog-friendly beaches, walks, pubs, and cafés on Islay, see our ',
    'dog-friendly Islay guide →',
    '/explore-islay/dog-friendly-islay'
  ),
];

// ─── ARRIVING-ON-ISLAY extended editorial ─────────────────────────────────────

const arrivingEditorial = [
  h3('You Made It'),
  para("The ferry docks, the ramp goes down, and Islay is right there. After the crossing from Kennacraig, stepping onto the island has a particular quality — you're properly somewhere else now. Take a breath. The island works at its own pace, and you might as well start as you mean to go on."),

  h3('Port Askaig or Port Ellen — Your First Steps'),
  para("Port Askaig: Small, quiet, and beautiful — sitting right on the Sound of Islay with Jura across the water. There are no shops or services at Port Askaig itself. The Port Askaig Hotel is steps from the ferry — if you're arriving in the afternoon or evening, the bar has some of the best views on the island. From Port Askaig to Bruichladdich is around 30 minutes. Follow the only road until you reach Bridgend, take the turning signed for Bruichladdich and Port Charlotte, and follow that road all the way in."),
  para("Port Ellen: Larger, with more on arrival. The Co-op is in the village and is the most convenient stop for supplies before heading north. There's a pub, a café, and fuel available. If you're arriving late and need to stock up, Port Ellen is the better arrival point. From Port Ellen to Bruichladdich is also around 30 minutes — follow the main road through Bowmore and continue north to Bridgend, then take the Bruichladdich and Port Charlotte turning."),
  paraWithLink('For full information on the two routes, see our ', 'ferry guide →', '/islay-travel/ferry-to-islay'),

  h3('Arriving Late'),
  para("If your ferry arrives in the evening — or later than planned — the Co-op in Bowmore and the Co-op in Port Ellen are both well-stocked for supplies. Petrol stations on Islay close earlier than mainland equivalents — fill up during daylight if arriving late."),
  para("If you're arriving late, let us know in advance and we'll make sure the heating is on, the house is warm, and there's something ready for a cup of tea when you walk in. We've done this hundreds of times — a late arrival is no problem as long as we know it's coming."),

  h3('Early Departures'),
  para("If you have an early sailing home, we'll make sure everything is ready the night before — checkout paperwork, any last-minute questions answered, and the house set for a quick and easy morning. If you need to leave before a standard check-out time, just let us know in advance."),

  h3('If Your Ferry Is Cancelled'),
  para("Ferry cancellations happen on Islay. Southwest gales are the main cause, typically in winter and sometimes in autumn. Port Askaig is more sheltered than Port Ellen — when one route is affected, CalMac often continues to run the other. Check CalMac's website and app for real-time updates."),
  para("If your outbound crossing is cancelled: contact me immediately. I've helped dozens of guests navigate this and there's always a solution. We'll find the next available sailing, adjust your check-in, and if you need to stay near Kennacraig overnight, Tarbert is 5 minutes from the terminal."),
  para("If your return crossing is cancelled: contact me immediately. We'll extend your stay at no charge while we find the next sailing. In 8+ years and over 600 guest stays, we've never had a booking collapse due to CalMac. There is always a solution — it just sometimes takes a day longer to find it. Our communication rating is 5.0/5 across 30+ reviews that specifically mention ferry support."),

  h3('Weather: What to Expect'),
  para("Islay weather is changeable year-round. It rains here. It blows here. And then the light does something extraordinary and you'll understand immediately why guests keep coming back. Pack layers and waterproofs regardless of the season."),

  h3('Your First Stop'),
  para("Arriving at Port Askaig: The Port Askaig Hotel bar is steps from the ferry and looks straight across the Sound of Islay to Jura. A good place to decompress before the drive."),
  para("Arriving at Port Ellen: Walk along the Port Ellen seafront towards the distillery malting buildings before getting in the car. It takes 10 minutes and sets the tone properly."),
  para("Then: Bruichladdich, your home for the week. Portbahn House and Shorefield Eco House are both a 5-minute walk from Bruichladdich Distillery along the coastal cycle path. The distillery visitor centre welcomes walk-in visitors — no booking needed, just drop in."),
];

// ─── GETTING-AROUND-ISLAY extended editorial ──────────────────────────────────

const gettingAroundEditorial = [
  h3('The Whisky Trail Without a Key'),
  para("Scotland's drink-drive limit is lower than England's — 50mg per 100ml versus 80mg — and for a full distillery day on Islay, the only sensible approach is not to drive at all. That's not a limitation; it's an invitation. Islay has taxis, bike hire, and properties within walking distance of distilleries. You can do a proper whisky day and not get behind a wheel."),

  h3('Taxis on Islay'),
  para("Islay's taxi services are the most practical option for distillery days — particularly for groups. Pre-book for distillery days, as the island has limited taxi capacity and drivers fill up during Fèis Ìle and peak summer. Taxis are available at Port Askaig and Port Ellen when ferries arrive."),
  para('Two firms we recommend: Bruichladdich Taxis — 07899 942673 or 01496 850271. Covers the Rhinns and most of the island. Attic Cabs — 07944 873323.'),

  h3('Local Buses — Islay Coaches'),
  para("Islay Coaches operates Routes 450 and 451, connecting the main villages: Portnahaven, Port Charlotte, Bruichladdich, Bowmore, Port Ellen, Ardbeg, and Port Askaig. The service covers most of the island's settlements in a single route. Timetables are published by Argyll and Bute Council."),
  para('Dogs are not permitted on Islay Coaches services (assistance dogs only).'),

  h3('Cycling Around Islay'),
  para('Islay has quiet roads and is well-suited to cycling. The Rhinns peninsula — where our properties are based — is flat, coastal, and beautiful by bike. Key cycling routes:'),
  bullet('The Rhinns Loop — Bruichladdich to Port Charlotte to Portnahaven and back. Flat, scenic, around 18 miles. The road runs along the shore of Loch Indaal for most of the route.'),
  bullet('The Whisky Coast — Port Ellen to Laphroaig to Lagavulin to Ardbeg to Kildalton Cross. Moderate, around 14 miles one way. The distillery trail by bike.'),
  bullet('Bowmore to Port Charlotte — Via Bridgend. Easy and flat, around 12 miles. Passes through the centre of the island.'),
  bullet('RSPB Loch Gruinart — Excellent for birdwatching by bike. The reserve road is traffic-free and quiet.'),

  h3('Bike Hire'),
  para('Three operators on the island, one on Jura:'),
  bullet('Islay Bike Hire (islay-bikehire.co.uk) — standard bicycle rental.'),
  bullet("Islay E-Wheels (islayewheels.co.uk) — electric bikes with Bosch drive systems. Good for covering more ground on distillery days."),
  bullet('Jura Cycles (juracycles.com) — based on Jura, with hire options for visitors crossing on the passenger ferry from Port Askaig.'),
  bullet('Islay Cycles — currently closed until further notice (as of early 2026). Check islaycycles.co.uk for updates before planning around them.'),
  para('Check each operator\'s website directly for current availability, pricing, and booking — seasonal availability varies.'),

  h3('Walking from Our Properties'),
  para('If you\'re staying at Portbahn House or Shorefield Eco House, a significant amount of what you\'ll want to do is within walking distance.'),
  bullet('Bruichladdich Distillery: 5 minutes along the coastal cycle path. The visitor centre welcomes walk-ins without a booking.'),
  bullet('Portbahn Beach: 5 minutes via the war memorial path — three sheltered bays with rock pools.'),
  bullet('Port Charlotte: 40 minutes on foot along the coast, 5 minutes by car. The village has the Port Charlotte Hotel, a museum, and the Lochindaal Seafood Kitchen.'),

  h3('The Jura Passenger Ferry'),
  para("From Port Askaig, foot passengers and cyclists can reach Jura on the Jura Passenger Ferry — a 5-minute crossing to Feolin. No booking required for foot passengers. The crossing runs regularly throughout the day."),
];

// ─── DOG-FRIENDLY-ISLAY extended editorial ────────────────────────────────────

const dogFriendlyEditorial = [
  h3("Islay Is a Dog's Island"),
  para("Quiet roads, open coastline, wide beaches, and a pace of life that suits dogs as much as their owners. We welcome dogs regularly at Portbahn House and Shorefield Eco House, and our guests tell us their dogs fall in love with the place as much as they do."),

  h3('Dog-Friendly Beaches on Islay'),
  para('Islay has some of the finest beaches in Scotland — and there are no seasonal dog restrictions. Dogs are welcome on all beaches, year-round. Always clean up after your dog and keep them on a lead near fields, farmland, and livestock — Islay is a working farming community and this applies everywhere, not just on beaches.'),
  bullet('Portbahn Beach — 5 minutes from Portbahn House and Shorefield Eco House via the war memorial path. Three sheltered bays with rock pools and calm water. Safe for dogs and swimming. Rarely busy even in summer.'),
  bullet('Port Charlotte Beach — 5 minutes by car from Bruichladdich. Wide sandy beach, shallow water. Good for dogs. The village itself is dog-friendly.'),
  bullet('Machir Bay — One of Islay\'s most dramatic beaches. Very open to the Atlantic. The surf is powerful — keep dogs on a lead near the water\'s edge.'),
  bullet("Laggan Bay (Airport Beach) — A long, flat, empty beach alongside the airport runway. Rarely busy. Good for dogs."),

  h3('Walks with Your Dog'),
  para('Coastal path — Bruichladdich to Port Charlotte: Directly accessible from Portbahn House and Shorefield Eco House. The flat coastal cycle path runs along the shore of Loch Indaal all the way to Port Charlotte — around 40 minutes one way. Good off-lead stretches away from road sections. This is the easiest daily walk from the properties.'),
  para("Bridgend Woods: Woodland walking through some of Islay's limited tree cover — a pleasant change from open coast. Park at Bridgend Stores or the Bridgend Hotel. Good off-lead ground in the woods. Well-suited for dogs who like sniffing around in undergrowth."),

  h3('Dog-Friendly Pubs and Cafés'),
  para("We've always had dogs — crazy working cocker spaniels — and know how tricky it can be to grab a coffee or a bite of lunch when you've got one in tow. Always confirm ahead of your visit — policies can change."),
  para("Pubs: All pubs on Islay welcome dogs in their bar areas. Near our properties: Port Charlotte Hotel and An Tigh Seinnse in Portnahaven. Across the island: Bridgend Hotel (Katie's Bar) and Bowmore Hotel (Luccis Whisky Bar)."),
  para("Cafés: Several cafés on Islay welcome dogs. The closest to our properties is Debbie's Coffee Shop in Bruichladdich. Others include Craigard Kitchen in Ballygrant, Labels on Shore Street in Bowmore, Little Charlotte's Café in Port Ellen, and Cafaidh Blasta at the Islay Gaelic Centre in Bowmore."),
  para("Restaurants and food venues: Islay Oysters at Killinallan, Islay's Plaice in Bowmore, and Peatzeria are among those with dog-friendly options. A quick call ahead is worth it if you're planning a meal out."),

  h3('Practical Notes for Dog Owners on Islay'),
  bullet("Livestock: Sheep are everywhere on Islay — on roads, in fields adjacent to paths, sometimes in unexpected places. Dogs must be on leads near livestock. Particularly important during lambing season (spring)."),
  bullet("Ticks: Common in long grass and bracken, particularly in summer and autumn. Check your dog thoroughly after walks in moorland or woodland. Tick removal tools are worth packing."),
  bullet("Local vet: Beth Newman, Islay Vet — 20 Shore St, Bowmore PA43 7LB. Phone: 01496 810205."),
  bullet("Dog grooming: Woof Wash Islay — phone: 07954 085630."),

  h3('Getting Here with Your Dog and Where to Stay'),
  paraWithLink(
    "Travelling to Islay with a dog? CalMac welcomes dogs on all ferries. Two of our properties — Portbahn House and Shorefield Eco House — welcome dogs. Curlew Cottage is pet-free. For the full guide to ferry policy, bus restrictions (Citylink does not allow dogs), and property options: ",
    'Travelling to Islay with your dog →',
    '/islay-travel/travelling-to-islay-with-your-dog'
  ),
];

// ─── Featured Entity Reference Arrays ─────────────────────────────────────────

const ferryEntities = [
  'kennacraig-ferry-terminal',
  'port-askaig-ferry-terminal',
  'port-ellen-ferry-terminal',
  'jura-passenger-ferry',
  'tarbert',
  'loch-fyne-oysters',
  'tree-shop-garden-centre',
  'lochgilphead-coop',
  'feis-ile',
].map(id => ref(`siteEntity.${id}`));

const planningEntities = [
  'feis-ile',
  'bruichladdich-distillery',
  'lochindaal-seafood-kitchen',
  'coop-bowmore',
  'port-ellen-coop',
].map(id => ref(`siteEntity.${id}`));

const withoutCarEntities = [
  'citylink',
  'glasgow-buchanan-street',
  'kennacraig-ferry-terminal',
  'ardrossan-ferry-terminal',
  'brodick',
  'lochranza',
  'claonaig',
  'jura-passenger-ferry',
  'ncn-route-753',
  'ncn-route-75',
].map(id => ref(`siteEntity.${id}`));

const withDogEntities = [
  'calmac',
  'citylink',
  'islay-coaches',
  'bruichladdich-taxis',
  'attic-cabs-islay',
].map(id => ref(`siteEntity.${id}`));

const arrivingEntities = [
  'port-askaig-ferry-terminal',
  'port-ellen-ferry-terminal',
  'port-askaig-hotel',
  'coop-bowmore',
  'port-ellen-coop',
  'tarbert',
  'kennacraig-ferry-terminal',
  'bruichladdich-distillery',
].map(id => ref(`siteEntity.${id}`));

const gettingAroundEntities = [
  'bruichladdich-taxis',
  'attic-cabs-islay',
  'islay-coaches',
  'islay-bike-hire',
  'islay-e-wheels',
  'jura-cycles',
  'jura-passenger-ferry',
  'bruichladdich-distillery',
  'portbahn-beach',
  'port-charlotte-hotel',
  'lochindaal-seafood-kitchen',
].map(id => ref(`siteEntity.${id}`));

const dogFriendlyEntities = [
  'portbahn-beach',
  'port-charlotte-beach',
  'machir-bay',
  'laggan-bay',
  'port-charlotte-hotel',
  'an-tigh-seinnse-portnahaven',
  'bridgend-hotel',
  'bowmore-hotel',
  'debbies-coffee-shop',
  'craigard-kitchen',
  'labels-bowmore',
  'little-charlottes-cafe',
  'cafaidh-blasta',
  'islay-oysters',
  'islays-plaice-bowmore',
  'peatzeria-bowmore',
  'woof-wash-islay',
  'beth-newman-islay-vet',
].map(id => ref(`siteEntity.${id}`));

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== import-travel-pages-2026-02-28.ts ===\n');

  // 1. Patch gettingHerePage scopeIntro
  console.log('1. Patching gettingHerePage scopeIntro...');
  const hub = await client.fetch(
    `*[_type == "gettingHerePage" && !(_id in path("drafts.**"))][0]{_id}`
  );
  if (hub?._id) {
    await client
      .patch(hub._id)
      .set({
        scopeIntro: "This guide covers how to travel to the Isle of Islay — CalMac ferry from Kennacraig (2 hours to Port Askaig, 2 hours 20 minutes to Port Ellen), Loganair flights from Glasgow (25 minutes), and options for travelling without a car or with your dog. From Glasgow, count on a full day's travel: two and a half hours to Kennacraig, then two hours on the water. Islay takes effort. That effort is the point.",
      })
      .commit();
    console.log(`  ✓ ${hub._id} scopeIntro set`);
  } else {
    console.log('  ! gettingHerePage not found — skipping');
  }

  // 2. Patch guide-ferry-to-islay
  console.log('\n2. Patching guide-ferry-to-islay...');
  await client
    .patch('guide-ferry-to-islay')
    .set({
      introduction: 'CalMac operates year-round sailings from Kennacraig to Port Askaig (2 hours) and Port Ellen (2 hours 20 minutes). Book vehicle spaces 12 weeks ahead for summer and Fèis Ìle.',
      extendedEditorial: ferryEditorial,
      featuredEntities: ferryEntities,
      seoTitle: 'Ferry to Islay | CalMac Routes, Booking & What to Expect',
      seoDescription: 'Complete guide to the CalMac ferry from Kennacraig to Islay — routes, timetables, booking tips, A83 stops, and what to do if your ferry is cancelled. From a local host with 600+ guest stays.',
    })
    .commit();
  console.log('  ✓ guide-ferry-to-islay updated');

  // 3. Patch guide-planning-your-trip
  console.log('\n3. Patching guide-planning-your-trip...');
  await client
    .patch('guide-planning-your-trip')
    .set({
      introduction: "There's no wrong season on Islay — but each is genuinely different. This guide covers when to visit, Fèis Ìle, how long to stay, and how to plan your crossing.",
      extendedEditorial: planningEditorial,
      featuredEntities: planningEntities,
      seoTitle: 'Planning Your Islay Trip | When to Visit, How Long to Stay',
      seoDescription: "Complete guide to planning a trip to the Isle of Islay: best times to visit, Fèis Ìle whisky festival, how many days to stay, and what to pack. From local hosts with 600+ guest stays.",
    })
    .commit();
  console.log('  ✓ guide-planning-your-trip updated');

  // 4. Create guide-travelling-without-a-car
  console.log('\n4. Creating guide-travelling-without-a-car...');
  await client.createOrReplace({
    _id: 'guide-travelling-without-a-car',
    _type: 'guidePage',
    title: 'Travelling to Islay Without a Car',
    slug: { _type: 'slug', current: 'travelling-without-a-car' },
    introduction: 'Foot passengers are welcome on every CalMac sailing to Islay. This guide covers getting from Glasgow to Islay by bus, bike, or on foot — and arriving with everything you need.',
    extendedEditorial: withoutCarEditorial,
    featuredEntities: withoutCarEntities,
    schemaType: 'Article',
    seoTitle: 'Travelling to Islay Without a Car | Bus, Bike & Foot Passenger Guide',
    seoDescription: 'How to reach Islay without a car: Citylink bus from Glasgow to Kennacraig, adventure cycling route via Arran, and foot passenger guide. Bikes travel free on CalMac. Year-round and seasonal options covered.',
  });
  console.log('  ✓ guide-travelling-without-a-car created');

  // 5. Create guide-travelling-to-islay-with-your-dog
  console.log('\n5. Creating guide-travelling-to-islay-with-your-dog...');
  await client.createOrReplace({
    _id: 'guide-travelling-to-islay-with-your-dog',
    _type: 'guidePage',
    title: 'Travelling to Islay with Your Dog',
    slug: { _type: 'slug', current: 'travelling-to-islay-with-your-dog' },
    introduction: "CalMac welcomes dogs on all sailings to Islay. Two of our three properties take dogs — with secure outdoor space and dog country right on the doorstep. Here's everything you need to know for the journey.",
    extendedEditorial: withDogEditorial,
    featuredEntities: withDogEntities,
    schemaType: 'Article',
    seoTitle: 'Travelling to Islay with Your Dog | Ferry, Buses & Where to Stay',
    seoDescription: 'Complete guide to travelling to Islay with a dog: CalMac ferry dog policy, bus restrictions (Citylink and Islay Coaches do not allow dogs), and which properties welcome dogs. From hosts who\'ve welcomed dogs since 2017.',
  });
  console.log('  ✓ guide-travelling-to-islay-with-your-dog created');

  // 6. Create guide-arriving-on-islay
  console.log('\n6. Creating guide-arriving-on-islay...');
  await client.createOrReplace({
    _id: 'guide-arriving-on-islay',
    _type: 'guidePage',
    title: 'Arriving on Islay',
    slug: { _type: 'slug', current: 'arriving-on-islay' },
    introduction: 'Stepping off the ferry at Port Askaig or Port Ellen, you are properly somewhere else now. Here is what to expect on arrival — ports, late arrivals, cancellations, and your first steps on the island.',
    extendedEditorial: arrivingEditorial,
    featuredEntities: arrivingEntities,
    schemaType: 'Article',
    seoTitle: 'Arriving on Islay | Your First Hours, Late Arrivals & Ferry Cancellations',
    seoDescription: "What to do when you arrive on Islay — Port Askaig or Port Ellen, what's open late, and how to handle a cancelled CalMac ferry. From a local host who has helped 600+ guests arrive.",
  });
  console.log('  ✓ guide-arriving-on-islay created');

  // 7. Create guide-getting-around-islay
  console.log('\n7. Creating guide-getting-around-islay...');
  await client.createOrReplace({
    _id: 'guide-getting-around-islay',
    _type: 'guidePage',
    title: 'Getting Around Islay',
    slug: { _type: 'slug', current: 'getting-around-islay' },
    introduction: "Scotland's drink-drive limit is 50mg/100ml — and for a full distillery day on Islay, not driving is the only sensible approach. Taxis, bikes, and walking paths cover everything you need.",
    extendedEditorial: gettingAroundEditorial,
    featuredEntities: gettingAroundEntities,
    schemaType: 'Article',
    seoTitle: 'Getting Around Islay | Taxis, Buses, Bikes & the Distillery Trail',
    seoDescription: 'How to get around Islay without driving: taxis, Islay Coaches buses, bike hire, and walking distance from Bruichladdich. Includes the Rhinns Loop, whisky coast cycle route, and distillery access guide.',
  });
  console.log('  ✓ guide-getting-around-islay created');

  // 8. Create guide-dog-friendly-islay (under /explore-islay/)
  console.log('\n8. Creating guide-dog-friendly-islay...');
  await client.createOrReplace({
    _id: 'guide-dog-friendly-islay',
    _type: 'guidePage',
    title: 'Dog-Friendly Islay',
    slug: { _type: 'slug', current: 'dog-friendly-islay' },
    introduction: 'Islay has no seasonal beach restrictions — dogs are welcome year-round. This guide covers the best dog-friendly beaches, walks, pubs, and cafés on the island, plus the local vet.',
    extendedEditorial: dogFriendlyEditorial,
    featuredEntities: dogFriendlyEntities,
    schemaType: 'Article',
    seoTitle: 'Dog-Friendly Islay | Beaches, Walks, Pubs & What to Know',
    seoDescription: "Complete guide to Islay with a dog: no seasonal beach restrictions, dog-friendly pubs and cafés, best walks, local vet, and grooming. From hosts who've welcomed dogs at Portbahn House and Shorefield Eco House since 2017.",
  });
  console.log('  ✓ guide-dog-friendly-islay created');

  console.log('\n=== Done ===');
  console.log('  1 hub patched (gettingHerePage scopeIntro)');
  console.log('  2 existing guide pages patched (ferry, planning)');
  console.log('  5 new guide pages created (without-car, with-dog, arriving, getting-around, dog-friendly)');
}

run().catch(console.error);
