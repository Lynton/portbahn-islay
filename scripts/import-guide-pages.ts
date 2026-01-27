/**
 * Import Guide Pages to Sanity
 *
 * This script creates/updates the gettingHerePage and exploreIslayPage singletons
 * with content from the V2-FINAL markdown files.
 *
 * Run with: npx sanity exec scripts/import-guide-pages.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

// Helper to create a Portable Text block
const block = (text: string, style: 'normal' | 'h2' | 'h3' = 'normal') => ({
  _type: 'block',
  _key: Math.random().toString(36).substring(7),
  style,
  children: [
    {
      _type: 'span',
      _key: Math.random().toString(36).substring(7),
      text,
      marks: [],
    },
  ],
  markDefs: [],
});

// Getting Here Page content
const gettingHereContent = [
  block('Getting to the Isle of Islay', 'h2'),
  block("I'm Pi, and I've been welcoming guests to Islay since 2017. Over 600 guests have traveled here to stay with us, and I've learned a thing or two about getting here smoothly—especially when CalMac throws a curveball. Let me walk you through it."),
  block("The Isle of Islay is accessible by two main routes: CalMac ferry from mainland Scotland or Loganair flight from Glasgow. The ferry service operates from Kennacraig on the Kintyre Peninsula to two ports on Islay—Port Ellen and Port Askaig. Both ports are approximately 30-40 minutes' drive from our Bruichladdich properties. The ferry crossing takes 2 hours and 20 minutes and offers stunning views across the Sound of Islay. Vehicle reservations are essential and should be booked up to 12 weeks in advance, especially during peak season and whisky festival periods in late May."),
  block("Loganair operates daily flights from Glasgow to Islay Airport, with the flight taking approximately 40 minutes. The airport is 15-20 minutes' drive from our properties. Two flights typically operate daily (one on weekends). This option suits travelers preferring speed over scenery, though the ferry crossing itself is part of the island experience."),

  block('How to Book Your Ferry Crossing', 'h2'),
  block('Booking Timeline', 'h3'),
  block("Book 12 weeks in advance for vehicle spaces—CalMac ferries fill quickly, particularly for summer dates, school holidays, and Fèis Ìle (the whisky festival in late May). Foot passengers have more flexibility but should still pre-book to secure a space."),
  block("The CalMac booking system releases spaces 12 weeks ahead. Set a calendar reminder to book exactly at that point for peak summer weeks. This isn't overcautious—I've seen guests miss out by booking just days late."),

  block('Which Port to Choose', 'h3'),
  block("Port Ellen is marginally closer to Bruichladdich (35 minutes vs 40 minutes from Port Askaig). Both routes work equally well. Check which sailing times suit your schedule—Port Ellen and Port Askaig ferries operate on different timetables throughout the day."),

  block('What to Expect on the Crossing', 'h2'),
  block('Before Boarding', 'h3'),
  block("Arrive at Kennacraig ferry terminal 30-45 minutes before departure. The marshalling area has toilets and a small café. Once you drive onto the ferry, leave your car and head upstairs to the passenger lounges—you cannot remain in your vehicle during crossing."),

  block('On Board', 'h3'),
  block("The ferry has a café serving hot food, snacks, and drinks (including Islay whisky). Seats are available inside and on outdoor decks. The crossing is generally smooth, though the open water section can be choppy in windy conditions."),
  block("Most guests find it relaxing rather than rough. On clear days, views of the Paps of Jura and the Kintyre coastline are spectacular. One of my guests recently said, \"The crossing was part of the holiday\"—and I hear that a lot."),

  block('Sea Sickness Tips', 'h3'),
  block("If you're prone to motion sickness, sit near the center of the vessel on the lower passenger deck where movement is minimized. Avoid reading or looking at screens—focus on the horizon instead. The café sells basic remedies, or bring your own travel sickness tablets."),

  block('When Ferry Cancellations Happen', 'h2'),
  block('Why Cancellations Occur', 'h3'),
  block("Weather is the main culprit—wind gusts above 40-45mph can prevent safe boarding or crossing. CalMac also occasionally suspends sailings due to mechanical issues (the fleet is ageing) or industrial action. Winter months see more disruptions than summer, but cancellations can happen any time of year."),

  block('Our Ferry Chaos Track Record', 'h3'),
  block("Here's the reality: I've helped dozens of guests navigate CalMac disruptions since 2017. We hold a 5.0/5 communication rating on Airbnb, and 30+ reviews specifically mention our ferry crisis support. One guest wrote: \"Pi looked after us like family during the ferry chaos.\""),
  block("If your crossing is disrupted, you're not alone—and I've got your back."),

  block('What to Do If Your Ferry is Cancelled', 'h3'),
  block("CalMac will contact you via text or email if they cancel your sailing. Call CalMac immediately on 0800 066 5000 to rebook onto the next available sailing. Contact me—I can offer advice or flexible check-in arrangements. Sign up for live updates by texting \"calmac subscribe 09\" to 60030 for ferry status alerts."),

  block('Travel Insurance', 'h3'),
  block("We strongly recommend travel insurance that covers ferry cancellations. Weather disruptions are rare but possible, and insurance protects your accommodation costs if you cannot reach Islay on your planned dates. Most travel policies include \"delayed departure\" cover."),

  block('Flying from Glasgow', 'h2'),
  block('Flight Details', 'h3'),
  block("Loganair operates two flights daily (one on Sundays) between Glasgow and Islay Airport. Flight time is approximately 40 minutes, with stunning aerial views of the islands on clear days. The aircraft are small (typically 30-40 passengers), and hand luggage is limited. Check baggage allowances when booking."),

  block('From Airport to Bruichladdich', 'h3'),
  block("The drive takes 15-20 minutes via A846 through Port Ellen and along the southern coast. Car hire is available at the airport through Islay Car Hire—book in advance, especially in summer. Taxis should also be pre-booked."),

  block('Do You Need a Car on Islay?', 'h2'),
  block("Yes, a car is strongly recommended. Islay has limited public transport, and taxis must be booked in advance. Most distilleries, beaches, and attractions require driving to reach. The freedom to explore at your own pace is essential to enjoying the island."),

  block('Driving on Islay', 'h3'),
  block("Roads are often single-track with passing places. Locals use passing places to allow faster traffic to overtake, not just for oncoming vehicles. Driving is relaxed and unhurried—expect wildlife on roads (sheep, cattle, birds)."),
  block("Locals wave at passing cars (\"the Islay wave\")—reciprocate! It's part of island culture."),

  block('Distances from Bruichladdich', 'h3'),
  block("Bruichladdich Distillery: 10-minute walk. Port Charlotte (restaurants, shops): 5-minute drive. Port Ellen ferry terminal: 35 minutes. Port Askaig ferry terminal: 40 minutes. Machir Bay beach: 15 minutes. Ardbeg/Lagavulin/Laphroaig distilleries: 40-50 minutes."),

  block('Drinking and Driving', 'h3'),
  block("Scotland's drink-drive limit is effectively zero. If you're touring distilleries, designate a driver who takes the \"driver's dram\" away to enjoy later at your accommodation. Most distilleries provide these complimentary takeaway samples for drivers."),

  block('Practical Tips for Islay Travel', 'h2'),
  block('How Many Days?', 'h3'),
  block("Minimum: 2-3 nights allows time to visit 3-4 distilleries and see main beaches. Recommended: 5-7 nights for leisurely exploration, Jura day trip, wildlife watching. Whisky-focused: 3-4 full days to visit 5-6 distilleries comfortably."),
  block("Remember your first and last days are mostly travel. A week-long stay gives you 5 genuine activity days. Our guests who book for 7+ nights consistently tell us they wish they'd had longer."),

  block('Best Time to Visit', 'h3'),
  block("April-June: Sunniest months, good weather, fewer crowds, reasonable prices. July-August: Warmest (relatively), busiest, school holiday premium. Late May: Fèis Ìle whisky festival—book accommodation and ferry 12+ weeks ahead. September-October: Barnacle geese arrive (30,000+ birds), beautiful autumn light. Winter (November-March): Dramatic weather, limited daylight, some distilleries closed."),

  block('Common Questions', 'h2'),
  block('How far in advance should I book the ferry?', 'h3'),
  block("Book 12 weeks ahead for vehicle spaces. CalMac releases bookings 12 weeks in advance, and ferries fill quickly for summer dates and Fèis Ìle (late May). Foot passengers have more flexibility but should still pre-book. I've seen guests miss out by booking just days late for peak weeks."),

  block('What happens if my ferry is cancelled?', 'h3'),
  block("Contact me immediately—I've helped dozens of guests navigate CalMac disruptions. CalMac will usually contact you directly; their helpline is 0800 066 5000. Sign up for ferry status alerts by texting \"calmac subscribe 09\" to 60030. We strongly recommend travel insurance covering delayed departure. One guest wrote: \"Pi looked after us like family during the ferry chaos.\""),

  block('Do I need to hire a car on Islay?', 'h3'),
  block("Yes, a car is strongly recommended. Public transport is limited, and most distilleries, beaches, and attractions require driving. Car hire is available at the airport and ferry ports through Islay Car Hire—book in advance. You can walk to Bruichladdich Distillery (10 minutes) and Port Charlotte (40 minutes), but broader exploration needs a vehicle."),

  block('How long is the ferry crossing?', 'h3'),
  block("The ferry crossing from Kennacraig to Port Ellen or Port Askaig takes 2 hours and 20 minutes. The entire journey from Glasgow to Bruichladdich (including 3-hour drive to Kennacraig and onward travel from the ferry) takes 5-6 hours minimum. Plan for a full travel day each direction."),
];

// Explore Islay Page content (abbreviated - key sections)
const exploreIslayContent = [
  block('Explore the Isle of Islay', 'h2'),
  block("Islay is one of the Inner Hebrides islands of Scotland, renowned for its nine working whisky distilleries, dramatic Atlantic coastline, and abundant wildlife. From our Bruichladdich properties, you're perfectly positioned to explore everything the island offers."),
  block("The island measures roughly 25 miles by 20 miles—small enough to drive across in an hour, yet packed with enough to fill weeks of exploration. Most guests tell us a week isn't long enough."),

  block("Islay's Nine Whisky Distilleries", 'h2'),
  block("Islay is world-famous for whisky, producing some of Scotland's most distinctive and sought-after single malts. The island's nine distilleries each have unique characteristics, from the heavily peated whiskies of the south coast to the lighter, unpeated styles of Bruichladdich."),

  block('The Nine Distilleries', 'h3'),
  block("Ardbeg, Lagavulin, and Laphroaig cluster on the south coast, producing intensely peated, smoky whiskies. Bowmore sits in the island's capital, producing medium-peated malts. Bruichladdich (10-minute walk from our properties) produces unpeated Bruichladdich, heavily peated Port Charlotte, and the extreme Octomore series. Bunnahabhain and Caol Ila are on the northeast coast near Port Askaig. Kilchoman is a small farm distillery in the west. Ardnahoe is the newest distillery, opened in 2019."),

  block('Our Recommendation: Start at Bruichladdich', 'h3'),
  block("Bruichladdich isn't just our nearest distillery—it's one of Islay's most innovative. They're the only distillery producing four distinct spirits under one roof: unpeated Bruichladdich, heavily peated Port Charlotte, the extreme Octomore series (the world's most heavily peated whisky), and The Botanist gin made with 22 hand-foraged Islay botanicals."),
  block("What makes them special? They're the first Scotch whisky distillery to achieve B Corp certification, they use only Scottish barley (over 50% now Islay-grown), and they distill, mature, and bottle everything on the island. The Victorian equipment, the working bottling hall, the story—it's all 10 minutes' walk from your door."),

  block('Booking Distillery Tours', 'h3'),
  block("Book tours in advance, especially for summer and Fèis Ìle. Most distilleries offer standard tours (1 hour, £10-15) and premium experiences (2-3 hours, £30-100+). Warehouse tastings and cask drawing experiences are particularly memorable. Some distilleries require booking weeks ahead; others have walk-in availability."),

  block("Islay's Beaches", 'h2'),
  block("Islay's beaches range from dramatic Atlantic surf beaches to sheltered swimming coves. The west coast faces the full force of the Atlantic; the east coast and sea lochs offer calmer waters."),

  block('Portbahn Beach (Our Local Hidden Gem)', 'h3'),
  block("A hidden gem with three small, sheltered bays right on our doorstep—5 minutes via the war memorial path. This beach doesn't appear on most Islay guides; it's a local secret. Safe for swimming, rock pooling, and beach-combing, with stunning views across Loch Indaal to Bowmore. Our guests discover it from our directions and often have the entire beach to themselves."),

  block('Machir Bay', 'h3'),
  block("Two miles of golden sand backed by dunes—one of Scotland's most spectacular beaches. WARNING: Atlantic surf and strong currents make swimming dangerous. Locals call it a \"drowning beach.\" Perfect for walking, photography, and watching the sunset, but not for swimming."),

  block('Saligo Bay', 'h3'),
  block("Dramatic cliffs and Atlantic waves make this a stunning but dangerous beach. Popular with surfers (experienced only) and photographers. Not suitable for swimming."),

  block('Safe Swimming Locations', 'h3'),
  block("Portbahn Beach (our local, sheltered). Port Charlotte harbour (calm, sandy). Claggain Bay near Ardbeg (sheltered cove). Big Strand near Laggan (calmer than west coast)."),

  block('Wildlife on Islay', 'h2'),
  block("Islay is exceptional for wildlife watching, with over 200 bird species recorded annually. The island's diverse habitats—coastline, moorland, wetlands, and farmland—support abundant wildlife year-round."),

  block('Barnacle Geese', 'h3'),
  block("Over 30,000 barnacle geese arrive from Greenland each autumn (October-April), making Islay one of Europe's most important wintering sites. The sound of thousands of geese taking flight is unforgettable. RSPB Loch Gruinart reserve offers excellent viewing."),

  block("Shorefield's Bird Hides", 'h3'),
  block("One of our properties, Shorefield, has private bird hides created by the nature-loving owners behind the house. Binoculars, bird books, and wildlife guides are provided. The garden attracts woodland birds, and the loch views offer opportunities to spot waterfowl without leaving the property. For serious birders staying at Shorefield, this is a major bonus—morning coffee while watching birds from your own hide."),

  block('Other Wildlife', 'h3'),
  block("Seals haul out on rocks around the coast—Port Charlotte harbour is reliable. Golden eagles nest in remote areas; sightings are possible but not guaranteed. Red deer roam the hills; roe deer are common. Otters frequent the coastline, especially at dawn and dusk."),

  block('Where to Eat and Drink', 'h2'),
  block('Port Charlotte: Our Local Hub', 'h3'),
  block("Port Charlotte (5-minute drive) has two excellent options. The Port Charlotte Hotel boasts over 300 whisky bottles and excellent restaurant dining. The Lochindaal Hotel offers a more casual pub atmosphere with superb whisky selection. Both are perfect for an evening of exploration after a day of distillery tours."),

  block('Best Seafood on Islay', 'h3'),
  block("Lochindaal Seafood Kitchen (Port Charlotte) is exceptional—their seafood platters feature local oysters, langoustines, crab, and mussels. Order the full platter 24 hours ahead; it's worth planning your trip around. This is the best seafood experience on the island."),

  block('Other Recommendations', 'h3'),
  block("Bowmore Hotel and Lochside Hotel (Bowmore) both offer strong whisky selections with restaurant dining. Peatzeria in Port Ellen does excellent wood-fired pizza. The Islay Hotel in Port Ellen has a good restaurant. Shops in Port Charlotte and Bowmore stock local produce for self-catering."),

  block('Common Questions', 'h2'),
  block('Which distilleries should I visit?', 'h3'),
  block("Start at Bruichladdich (10-minute walk)—it's one of Islay's most innovative distilleries with four distinct spirits. For peat lovers: Ardbeg, Lagavulin, or Laphroaig on the south coast. For variety: Bunnahabhain (unpeated option) or Kilchoman (farm distillery). Most guests visit 4-6 distilleries over a week."),

  block('Is Machir Bay safe for swimming?', 'h3'),
  block("No—Atlantic surf and strong currents make Machir Bay dangerous for swimming. Locals call it a \"drowning beach.\" For swimming, head to Portbahn Beach (5 minutes from our properties), Port Charlotte harbour, or Claggain Bay. These offer sheltered, safer waters."),

  block('When do the geese arrive?', 'h3'),
  block("Barnacle geese arrive from Greenland in October and stay until April. Peak numbers (30,000+ birds) occur November-February. RSPB Loch Gruinart is the best viewing location. The sound of thousands of geese is one of Islay's most memorable wildlife experiences."),

  block('What wildlife might I see?', 'h3'),
  block("Seals (common at Port Charlotte harbour), red and roe deer, golden eagles (rare but possible), otters (dawn/dusk along coastline), over 200 bird species including barnacle geese, chough, and hen harriers. Shorefield guests have private bird hides for garden and loch views."),
];

async function importContent() {
  console.log('Starting content import...');

  // Import Getting Here page
  console.log('\n📄 Importing Getting Here page...');
  try {
    const gettingHereDoc = {
      _id: 'gettingHerePage',
      _type: 'gettingHerePage',
      title: 'Getting to the Isle of Islay',
      content: gettingHereContent,
      seoTitle: 'Getting to Islay | Ferry & Flight Guide | Portbahn Islay',
      seoDescription: 'Complete guide to reaching the Isle of Islay by CalMac ferry or Loganair flight. Includes booking strategies, ferry survival tips, and what to do if your crossing is cancelled.',
    };

    await client.createOrReplace(gettingHereDoc);
    console.log('✅ Getting Here page imported successfully');
  } catch (error) {
    console.error('❌ Error importing Getting Here page:', error);
  }

  // Import Explore Islay page
  console.log('\n📄 Importing Explore Islay page...');
  try {
    const exploreIslayDoc = {
      _id: 'exploreIslayPage',
      _type: 'exploreIslayPage',
      title: 'Explore the Isle of Islay',
      content: exploreIslayContent,
      seoTitle: 'Explore Islay | Distilleries, Beaches & Wildlife | Portbahn Islay',
      seoDescription: "Discover Islay's nine whisky distilleries, stunning beaches, abundant wildlife, and local restaurants. Your complete guide to exploring the island from Bruichladdich.",
    };

    await client.createOrReplace(exploreIslayDoc);
    console.log('✅ Explore Islay page imported successfully');
  } catch (error) {
    console.error('❌ Error importing Explore Islay page:', error);
  }

  console.log('\n🎉 Import complete!');
  console.log('\nNext steps:');
  console.log('1. Visit Sanity Studio to review and tweak content');
  console.log('2. Add hero images to both pages');
  console.log('3. Verify pages at:');
  console.log('   - https://portbahn-islay.vercel.app/getting-here');
  console.log('   - https://portbahn-islay.vercel.app/explore-islay');
}

importContent();
