/**
 * Import commonQuestions to property documents in Sanity
 * Source: _claude-handoff/PROPERTY-FAQ-DISTRIBUTION-FINAL.md
 * Run with: node scripts/import-property-faqs.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 't25lpmnm',
  dataset: 'production',
  apiVersion: '2025-02-19',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const PROPERTY_IDS = {
  portbahn: '7adb6498-a6dd-4ca9-a5a2-e38ee56cab84',
  shorefield: 'b3bb432f-1bde-479f-953e-2507c459f4f3',
  curlew: '0d37a3b4-a777-4999-b1d3-916c1b74744b',
};

// Portbahn House - Universal Logistics Hub (5 Questions)
const portbahnQuestions = [
  {
    _key: 'pb-q1',
    question: 'Can we check in early or have late checkout?',
    answer: "Standard times are 4pm check-in and 10am checkout, but contact me about your ferry or flight times—I'm flexible when the property schedule allows. I can almost always accommodate bag drop-off before check-in or storage after checkout. Over 30 reviews specifically mention my flexibility, and I hold a 5.0/5 communication rating across all properties.",
  },
  {
    _key: 'pb-q2',
    question: 'Can you provide synthetic bedding for allergies?',
    answer: "Yes—just let me know about allergies when you book and I'll provide synthetic pillows and duvets for the affected bedrooms. This is a common request and easy to accommodate at any of our properties.",
  },
  {
    _key: 'pb-q3',
    question: 'Is there parking at Portbahn House?',
    answer: "Yes—there's off-street parking for 2-3 cars directly adjacent to the property. You won't need to compete for street parking. Additional vehicles can park on the road nearby if needed for larger groups.",
  },
  {
    _key: 'pb-q4',
    question: 'How many bedrooms does Portbahn House have?',
    answer: "Portbahn House has 3 bedrooms sleeping 8 guests across the ground floor: master bedroom with ensuite (superking + single, sleeps 3), triple bedroom (double + single, sleeps 3), and twin bedroom (two singles, sleeps 2). All bedrooms are ground floor with no stairs, making the property accessible for guests with mobility concerns.",
  },
  {
    _key: 'pb-q5',
    question: 'Which distillery should we visit first?',
    answer: "Start with Bruichladdich—it's a 10-minute walk from Portbahn House along the coastal path. Tour the distillery, sample The Botanist gin, then walk home without worrying about driving. From there, choose based on your preferences: heavily peated (Ardbeg, Lagavulin, Laphroaig), balanced (Bowmore, Kilchoman), or gentle/unpeated (Bunnahabhain). Book tours 2-3 weeks ahead, especially for summer.",
  },
];

// Shorefield Eco House - Character & Eco Features (5 Questions)
const shorefieldQuestions = [
  {
    _key: 'sh-q1',
    question: 'What makes Shorefield different from the other properties?',
    answer: "Shorefield is the Jacksons' creation—they built this eco-house powered by wind and solar, planted every tree, created the wetlands and bird hides, and filled the house with paintings, books, and curios from their travels. It's quirky, full of personality, and a bit tired in places. This isn't a styled rental; it's a real family home. Over 90% of guests specifically love the quirky charm and personal touches.",
  },
  {
    _key: 'sh-q2',
    question: 'Does Shorefield have a dishwasher?',
    answer: "No—it's part of Shorefield's character as an eco-house with a slower pace. There's a washing machine and dryer available. Most guests say it wasn't a problem and fits the property's vibe. If a dishwasher is essential, Portbahn House has one—but guests who book Shorefield prioritise charm over modern conveniences.",
  },
  {
    _key: 'sh-q3',
    question: 'What are the bird hides at Shorefield?',
    answer: "The Jacksons created private bird hides in the wetlands behind the house—they're passionate birders. The house is stocked with binoculars, bird books, and wildlife guides from their personal collection. Grab the gear, head to your own private hide, and watch waterfowl and woodland birds. It's a genuinely unique feature that birders and nature lovers specifically book Shorefield for.",
  },
  {
    _key: 'sh-q4',
    question: 'Is Shorefield in good condition?',
    answer: "Shorefield is very clean and well-maintained (5.0 cleanliness ratings), but a bit tired in places: carpets are worn and furniture well-loved over years of family use. If you prefer modern finishes, Portbahn House might suit better. But if you value a house with a story and authentic charm, Shorefield is wonderful. One guest wrote that the house feels like \"a big hug.\"",
  },
  {
    _key: 'sh-q5',
    question: 'How far is Shorefield from the beach?',
    answer: "Portbahn Beach is about a 10-minute walk—three sheltered bays with rock pools, safe swimming, and stunning views across Loch Indaal. You'll often have it entirely to yourselves. Port Charlotte Beach (family-friendly, sandy) is a 5-minute drive. The dramatic west coast beaches—Machir Bay and Saligo Bay—are 10-15 minutes by car.",
  },
];

// Curlew Cottage - New Listing & Family Features (5 Questions)
const curlewQuestions = [
  {
    _key: 'cc-q1',
    question: 'Why are there no reviews for Curlew Cottage yet?',
    answer: "Curlew is Allan's family retreat, and he's opening it to guests for the first time in 2026. We (Pi & Lynton) manage Curlew with the same care we give Portbahn House and Shorefield. We hold a 4.97/5 rating across 600+ guests since 2017, with Airbnb Superhost status and 5.0/5 communication. Over 30 reviews mention our legendary ferry crisis support. You're getting the same level of care—just at a property new to the market.",
  },
  {
    _key: 'cc-q2',
    question: 'Is Curlew Cottage pet-free?',
    answer: "Yes—Curlew is maintained pet-free as Allan's family retreat for his continued use and for guests with allergies. If you're travelling with dogs, both Portbahn House and Shorefield welcome pets at £15 per dog per stay. We're happy to help you choose the right property for your group.",
  },
  {
    _key: 'cc-q3',
    question: 'Is the walled garden safe for children?',
    answer: "Yes—the walled garden is fully enclosed and private, perfect for kids to play safely without supervision concerns. The property is off the main road with its own private access. Families with young children specifically choose Curlew for the combination of safe outdoor space, quiet location, and pet-free environment.",
  },
  {
    _key: 'cc-q4',
    question: 'How many bedrooms does Curlew Cottage have?',
    answer: "Curlew has 3 bedrooms sleeping 6 guests: two bedrooms on the main floor (accessible without stairs) and one twin bedroom with ensuite accessed via a separate staircase. The separate staircase provides extra privacy (great for teens or separate families), but note this if you have mobility concerns.",
  },
  {
    _key: 'cc-q5',
    question: "What's the character of Curlew Cottage?",
    answer: "Curlew is Allan's family retreat—filled with his family's personal effects and holiday things like books, games, comfortable furniture. It's cosy, authentic, and genuinely feels like home from home. This isn't a styled, minimalist rental—it's a real family cottage with personality intact.",
  },
];

async function importFAQs() {
  console.log('Starting FAQ import...\n');

  const imports = [
    { id: PROPERTY_IDS.portbahn, name: 'Portbahn House', questions: portbahnQuestions },
    { id: PROPERTY_IDS.shorefield, name: 'Shorefield Eco House', questions: shorefieldQuestions },
    { id: PROPERTY_IDS.curlew, name: 'Curlew Cottage', questions: curlewQuestions },
  ];

  for (const { id, name, questions } of imports) {
    console.log(`Importing ${questions.length} FAQs for ${name}...`);
    try {
      await client.patch(id).set({ commonQuestions: questions }).commit();
      console.log(`  Done\n`);
    } catch (error) {
      console.error(`  Error: ${error.message}\n`);
    }
  }

  console.log('FAQ import complete!');
}

importFAQs();
