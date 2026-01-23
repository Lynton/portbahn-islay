# Other Pages — AI Search Playbook Specifications

**Date:** 2026-01-23
**Playbook Version:** 1.3.1
**Purpose:** Apply AI Search Playbook to all non-property pages for portbahnislay.co.uk

---

## Playbook Principles Applied

### Core Mental Models
1. **Passages over pages** - Each section must be extractable and standalone
2. **Entity-first architecture** - One primary entity per page, explicit definitions
3. **Fixed spine, flexible skin** - Factual core first, emotional language layered
4. **Recall before precision** - Explicit over implicit, repeated over elegant
5. **Conversational flow** - What → Where → Distinctive → Do → Know → Proceed

### Site Role (Per Multi-Site Coordination)
**portbahnislay.co.uk = Secondary Authority**
- Owns: PBI property details, practical accommodation information
- Intent: Booking confidence, at-a-glance info
- References: DMO (isleofjura.scot), distilleries, CalMac for authority

---

## PAGE SPECS

---

### 1. HOMEPAGE

**Primary Entity:** Portbahn Holiday Cottages (business entity)
**Intent:** Discovery, orientation, trust-building, property selection
**Fan-out queries targeted:**
- "holiday cottages Islay"
- "self-catering Bruichladdich"
- "where to stay Islay whisky"
- "family accommodation Islay"
- "dog friendly cottages Islay"

#### Entity Definition Block (Must be in first 200 words)
```
Portbahn Holiday Cottages is a collection of self-catering holiday homes
on the Isle of Islay, Scotland. The properties are located in Bruichladdich
village, a 10-minute walk from Bruichladdich Distillery and overlooking
Loch Indaal. The portfolio includes Portbahn House (sleeps 8), Shorefield
(sleeps 6), and Curlew Cottage (sleeps 6). All properties are dog-friendly
and owned by Pi and Lynton, who manage bookings directly.
```

#### Section Structure (Conversational Flow)
1. **Hero + Entity Definition** - What is this? Brand positioning
2. **Property Cards** - What are my options? Quick comparison
3. **Trust Signals** - Why should I trust this? Reviews, ratings
4. **Location Context** - Where is this? Bruichladdich, Islay positioning
5. **Quick Links** - How do I proceed? Ferry, guides, booking

#### Passage Specifications

**Section 1: Hero**
- H1: "Portbahn Holiday Cottages — Real Homes on Islay"
- Subhead: "Walk to the distillery. Wake to the view. Stay where we used to live."
- Entity definition paragraph (see above)
- 3-6 sentences, extractable

**Section 2: Our Properties**
- H2: "Three Properties, Two Personalities"
- Brief intro: "Modern brightness or quirky charm—choose your match."
- Property cards with:
  - Name + nickname ("Portbahn House — The View House")
  - Sleeps/beds/baths
  - One-line personality ("Sunrise views, garden trampoline, modern comfort")
  - Rating badge (4.97/5)
  - Price from
  - CTA
- Comparison link: "Not sure which? Compare properties →"

**Section 3: Trust Signals**
- H2: "What 600+ Guests Say"
- Stats block: "4.97/5 Airbnb • 9.5/10 Booking.com • 5.0/5 Google"
- Key theme quotes (3 max):
  - "Home from home" (most repeated)
  - "Better than the pictures"
  - "Pi looked after us like family"
- Link: "Read all reviews →"

**Section 4: Location**
- H2: "Bruichladdich, Isle of Islay"
- Brief context (3-4 sentences):
  - Location on Rhinns of Islay
  - 10-min walk to Bruichladdich Distillery
  - Overlooks Loch Indaal
  - Port Charlotte restaurants 5-min drive
- Link: "Explore Islay →"

**Section 5: Quick Links**
- H2: "Plan Your Stay"
- Grid of 4 cards:
  - "Getting Here" (ferry/flight icon) → Ferry guide
  - "Explore Islay" (map icon) → Guides
  - "FAQs" (question icon) → FAQs
  - "Contact Us" (message icon) → Contact

#### Schema.org
```json
{
  "@type": "LodgingBusiness",
  "name": "Portbahn Holiday Cottages",
  "description": "Self-catering holiday homes on the Isle of Islay, Scotland",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bruichladdich",
    "addressRegion": "Isle of Islay",
    "addressCountry": "GB"
  },
  "aggregateRating": {...},
  "hasOfferCatalog": {...}
}
```

---

### 2. ABOUT US

**Primary Entity:** Pi & Lynton (owners) / Portbahn Holiday Cottages (business)
**Intent:** Trust-building, differentiation, human connection
**Fan-out queries targeted:**
- "who owns Portbahn Islay"
- "Islay holiday cottage owners"
- "personal service Islay accommodation"

#### Entity Definition Block
```
Portbahn Holiday Cottages is owned and managed by Pi and Lynton, who lived
on Islay before moving to the neighbouring Isle of Jura. Pi handles all guest
communication and is known for exceptional responsiveness, particularly during
CalMac ferry disruptions. The properties are real family homes—Portbahn was
the family home, Shorefield belongs to bird-watching, world-travelling owners
whose personality fills every room.
```

#### Section Structure
1. **Our Story** - Who are we? Background and journey
2. **Real Homes Philosophy** - Why are we different? Not template rentals
3. **Meet the Team** - Who will I deal with? Pi, Amba, Janine
4. **Also Visit** - What else do you offer? Bothan Jura Retreat

#### Passage Specifications

**Section 1: Our Story**
- H2: "From Islay to Jura"
- 2-3 paragraphs covering:
  - Lived on Islay, now on Jura
  - Portbahn was family home
  - Shorefield owners' story (bird watchers, painters, world travelers)
  - Connection to both islands
- Extractable: "Pi and Lynton are the owners of Portbahn Holiday Cottages on the Isle of Islay, Scotland. They previously lived at Portbahn House before moving to the Isle of Jura, where they now run Bothan Jura Retreat."

**Section 2: Real Homes, Not Rentals**
- H2: "Why We're Different"
- Core message: "These aren't anonymous rentals. You're staying in places we lived, with our books, games, and personality still present."
- 3-4 bullet points:
  - No template rental aesthetic
  - Owner personality visible (Shorefield: bird books, art, renewables)
  - Personal lens on recommendations
  - Direct communication with Pi

**Section 3: Meet the Team**
- H2: "Who Looks After You"
- Pi (primary contact): Communication, booking, ferry crisis support
- Amba: Local support
- Janine: Housekeeping, turnover
- Communication score: 5.0/5.0 (Airbnb)

**Section 4: Also Visit**
- H2: "Bothan Jura Retreat"
- Brief intro (2-3 sentences): "On the neighbouring Isle of Jura, we run Bothan Jura Retreat—a cottage and two luxury huts with hot tub, sauna, and mountain views."
- Link to bothanjura.co.uk
- (Moves this from main nav to appropriate location)

#### Schema.org
```json
{
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "LodgingBusiness",
    "name": "Portbahn Holiday Cottages",
    "founder": [
      {"@type": "Person", "name": "Pi"},
      {"@type": "Person", "name": "Lynton"}
    ]
  }
}
```

---

### 3. COMPARE PROPERTIES

**Primary Entity:** Property comparison (functional entity)
**Intent:** Decision support, self-selection, booking confidence
**Fan-out queries targeted:**
- "Portbahn vs Shorefield"
- "which Islay cottage should I choose"
- "modern vs character cottage Islay"
- "Islay cottage with dishwasher"

#### Entity Definition Block
```
Portbahn Holiday Cottages offers two distinct property personalities on the
Isle of Islay: Portbahn House ("The View House") is modern, bright, and
family-focused with garden play and a dishwasher. Shorefield ("The Character
House") is quirky, cosy, and filled with the owners' books, art, and world
travel mementos—without a dishwasher. Both offer stunning Loch Indaal views
and are a short walk from Bruichladdich Distillery.
```

#### Section Structure
1. **Comparison Intro** - Why compare? Honest self-selection
2. **Side-by-Side Table** - What are the differences? Quick scan
3. **Portbahn Profile** - Modern brightness in detail
4. **Shorefield Profile** - Quirky charm in detail
5. **Decision Guide** - Which is right for me? Use case matching

#### Passage Specifications

**Section 1: How to Choose**
- H2: "Modern Brightness or Quirky Charm?"
- Intro paragraph: "Our two properties have distinct personalities. One isn't better than the other—they're different. Guests who book the right one rave about it. Here's how to choose."
- 3-4 sentences, sets up honest comparison

**Section 2: Quick Comparison**
- H2: "At a Glance"
- Comparison table:

| Feature | Portbahn House | Shorefield |
|---------|----------------|------------|
| Personality | Modern, bright, family | Quirky, cosy, character |
| Sleeps | 8 guests | 6 guests |
| Bedrooms | 3 | 4 |
| Dishwasher | ✓ Yes | ✗ No |
| Garden | Enclosed, sunken trampoline | Enclosed, nature-focused |
| Aesthetic | New-build modern | Well-loved, "a bit tired" |
| Heating | Underfloor + log fire | Everhot stove + renewables |
| Walk to distillery | 10 minutes | 3-6 minutes |
| Rating | 4.97/5 | 4.97/5 |
| From | £150/night | £240/night |

**Section 3: Portbahn House — The View House**
- H3: "Best For: Families, Whisky Groups, Modern Comfort"
- 2 paragraphs covering:
  - Sunrise views, open-plan living, garden play
  - Emma mattresses, underfloor heating, fully equipped kitchen
  - Guest quote: "Better than the pictures"
- Link to full property page

**Section 4: Shorefield — The Character House**
- H3: "Best For: Character Seekers, Couples, Nature Lovers"
- 2 paragraphs covering:
  - Bird books, world travel mementos, cosy den
  - Wood stove, renewables, deceptively spacious
  - Guest quote: "Like a big hug"
  - Honest note: "A bit worn, a lot loved"
- Link to full property page

**Section 5: Which Should I Choose?**
- H2: "Quick Decision Guide"
- If/then format (extractable passage):

```
Choose Portbahn House if you want:
- Modern, bright interiors
- A dishwasher
- Garden play for children (sunken trampoline)
- New-build finishes

Choose Shorefield if you value:
- Character and charm over polish
- Cosy, homely atmosphere
- Nature immersion (bird hides, gardens)
- Don't mind "a bit tired" aesthetic
```

#### Schema.org
None required (functional page, not entity page)

---

### 4. GETTING HERE (Ferry Survival Guide)

**Primary Entity:** Travel to Islay (functional/guide entity)
**Intent:** Logistics confidence, anxiety reduction, Pi's support value
**Fan-out queries targeted:**
- "how to get to Islay"
- "Islay ferry booking"
- "CalMac Islay cancellation"
- "Islay airport flights"
- "getting around Islay"

#### Entity Definition Block
```
Islay is accessible by ferry from Kennacraig (2 hours to Port Ellen or Port
Askaig) or by air from Glasgow to Islay Airport (45 minutes). Ferry bookings
with CalMac should be made 12 weeks in advance for vehicles. Pi and the
Portbahn team provide legendary support during ferry disruptions, helping
guests navigate rebooking and backup plans.
```

#### Section Structure
1. **Overview** - How do I get there? Quick summary
2. **By Ferry** - CalMac details, booking advice, Pi's support
3. **By Air** - Flights, airport logistics
4. **Getting Around** - On-island transport
5. **If Things Go Wrong** - Ferry cancellation survival guide

#### Passage Specifications

**Section 1: Getting to Islay**
- H2: "Two Ways to Reach the Island"
- Overview paragraph: Ferry or flight, book early, we've got your back
- Quick summary: Ferry (2hrs from Kennacraig) or flight (45mins from Glasgow)

**Section 2: By Ferry — CalMac**
- H2: "Ferry to Islay"
- Subsections:
  - **Booking:** "Book 12 weeks ahead for vehicles. Seriously. CalMac ferries fill fast, especially summer and festival weekends."
  - **Routes:** Kennacraig → Port Ellen or Port Askaig (~2 hours)
  - **Foot passengers:** More flexible, but car recommended for island exploration
  - **Link:** Book at calmac.co.uk
- Extractable passage: "CalMac ferries to Islay depart from Kennacraig on the Kintyre Peninsula and arrive at Port Ellen or Port Askaig. The crossing takes approximately 2 hours. Book vehicles 12 weeks in advance."

**Section 3: By Air**
- H2: "Flying to Islay"
- Paragraph covering:
  - Islay Airport, 5 miles from Port Ellen
  - Daily flights from Glasgow (~45 mins)
  - Flights from Oban and Colonsay
  - Book via Loganair
- Link: Islay Airport info

**Section 4: Getting Around the Island**
- H2: "On-Island Transport"
- Options:
  - **Car rental:** Recommended. Book in advance. Islay Car Hire.
  - **Taxis:** Limited availability. Book ahead.
  - **Bus:** Service exists but infrequent. Check timetables.
  - **Walking/cycling:** Properties walkable to Bruichladdich village
- Extractable: "Car rental is recommended for exploring Islay. Bus services exist but are limited. Taxis should be booked in advance."

**Section 5: Pi's Ferry Survival Guide**
- H2: "When CalMac Cancels (It Happens)"
- Direct, reassuring tone:
  - "Ferry cancellations happen. Weather, breakdowns, industrial action. It's part of island life."
  - "Get travel insurance. We can't stress this enough."
  - "If your ferry is cancelled, contact Pi immediately. We've helped guests navigate rebookings, arrange backup plans, and adjust arrivals dozens of times."
  - "We're legendary for this support—30+ reviews mention it specifically."
- Guest quote: "Pi looked after us like family during the ferry chaos"
- Contact link

#### Schema.org
```json
{
  "@type": "HowTo",
  "name": "How to Get to Islay",
  "step": [
    {"@type": "HowToStep", "text": "Book CalMac ferry 12 weeks in advance"},
    {"@type": "HowToStep", "text": "Travel to Kennacraig ferry terminal"},
    {"@type": "HowToStep", "text": "Take ferry to Port Ellen or Port Askaig (2 hours)"}
  ]
}
```

---

### 5. EXPLORE ISLAY (Consolidated Guide)

**Primary Entity:** Isle of Islay (place entity)
**Intent:** Trip planning, activity discovery, local knowledge
**Fan-out queries targeted:**
- "things to do Islay"
- "Islay distilleries"
- "Islay beaches swimming"
- "Islay wildlife birding"
- "where to eat Islay"

#### Entity Definition Block
```
The Isle of Islay is one of the Inner Hebrides islands of Scotland, known
for its eight whisky distilleries, dramatic coastline, and abundant wildlife.
Portbahn Holiday Cottages are located in Bruichladdich, a village on the
Rhinns of Islay overlooking Loch Indaal. The island offers beaches, birding,
dark sky stargazing, and local restaurants within easy reach of the properties.
```

#### Section Structure
1. **Island Overview** - What is Islay? Entity definition
2. **Distilleries** - What's Islay famous for? Whisky focus
3. **Beaches & Swimming** - Where can I swim? Coastal guide
4. **Wildlife & Birding** - What will I see? Nature focus
5. **Food & Drink** - Where do I eat? Restaurant guide
6. **Our Neighbourhood** - What's near the properties? Bruichladdich focus

#### Passage Specifications

**Section 1: The Isle of Islay**
- H2: "Scotland's Whisky Island"
- Entity definition paragraph (see above)
- Key facts: 8 distilleries, 130 miles of coastline, population ~3,000
- "Queen of the Hebrides"

**Section 2: Distilleries**
- H2: "Islay's Eight Distilleries"
- Intro: "Many guests visit Islay specifically for distillery tours. All eight welcome visitors, though booking is recommended."
- List format:
  - **Bruichladdich** (10-min walk from Portbahn) — Also produces The Botanist gin
  - **Port Charlotte** (15-min drive) — Heavily peated
  - **Bowmore** (15-min drive) — Oldest on Islay
  - **Kilchoman** (20-min drive) — Farm distillery
  - **Ardbeg, Lagavulin, Laphroaig** (45-min drive, Port Ellen) — Peat monsters
  - **Ardnahoe** (newest)
- Extractable: "Bruichladdich Distillery is a 10-minute walk from Portbahn House and Shorefield. It produces Bruichladdich single malt, The Botanist gin, and limited editions like Octomore and Black Art."

**Section 3: Beaches & Wild Swimming**
- H2: "Islay's Best Beaches"
- Intro: "Islay has 130 miles of coastline with beaches ranging from dramatic Atlantic surf to sheltered swimming spots."
- Key beaches:
  - **Portbahn Beach** (5-min walk from properties) — Hidden gem via war memorial path
  - **Port Charlotte Beach** (5-min drive) — Sandy, sheltered, safe for families
  - **Machir Bay** (west coast) — Dramatic Atlantic beach
  - **Big Strand** (Laggan Bay) — Miles of sand
  - **Saligo Bay** — Surf and seabirds
- Swimming note: "Wild swimming possible year-round. Wetsuit recommended. Loch Indaal is calmer than Atlantic beaches."

**Section 4: Wildlife & Birding**
- H2: "Wildlife on Islay"
- Intro: "Islay is renowned for birdlife, particularly wintering geese. Shorefield's owners created bird hides and wetlands behind the property."
- What to see:
  - **Barnacle geese** (Oct–Apr, 30,000+ birds)
  - **Golden eagles, sea eagles**
  - **Seals, otters, dolphins**
  - **RSPB Loch Gruinart reserve**
- Birding from properties: "Shorefield has bird hides and nature reserves created by the owners. Both properties offer sea views where you may spot dolphins and seals."

**Section 5: Food & Drink**
- H2: "Where to Eat on Islay"
- Local recommendations:
  - **Aileen's Mini-Market, Bruichladdich** (10-min walk) — Coffee, bacon rolls, basics
  - **Port Charlotte Hotel** (5-min drive) — Restaurant and bar
  - **The Lochindaal** (Port Charlotte) — Seafood platter (order 24hrs ahead)
  - **Bowmore** (15-min drive) — Butcher, Co-op, bakery
  - **Peatzeria, Bowmore** — Pizza
- Note: "Restaurant options are limited compared to mainland. Most guests enjoy cooking in the well-equipped kitchens."

**Section 6: Our Neighbourhood — Bruichladdich**
- H2: "Bruichladdich Village"
- Context: "Our properties are located between Bruichladdich and Port Charlotte on the Rhinns of Islay."
- What's walkable:
  - Bruichladdich Distillery (10 min)
  - Aileen's mini-market (10 min)
  - Portbahn Beach (5 min via path)
  - Port Charlotte (40 min scenic coastal walk, or 5 min drive)
- Extractable: "Bruichladdich is a small village on the Rhinns of Islay. Portbahn House and Shorefield are located between Bruichladdich and Port Charlotte, within walking distance of Bruichladdich Distillery and Aileen's mini-market."

#### Schema.org
```json
{
  "@type": "TouristDestination",
  "name": "Isle of Islay",
  "description": "Scottish island known for whisky distilleries and wildlife",
  "touristType": ["Whisky enthusiasts", "Wildlife watchers", "Families"]
}
```

---

### 6. FAQS (Expanded)

**Primary Entity:** FAQ (functional entity supporting properties)
**Intent:** Objection handling, confidence building, AI extraction
**Fan-out queries targeted:**
- "can I bring dog to Islay cottage"
- "Islay cottage with dishwasher"
- "CalMac ferry cancelled what do I do"
- "is there WiFi Islay holiday cottage"
- "warm Islay cottage in winter"

#### Section Structure
Group FAQs by theme for scannability:

1. **Booking & Logistics** (Q1-5)
2. **Property Features** (Q6-10)
3. **Local Area** (Q11-15)
4. **Practical Concerns** (Q16-20)

#### 20 Questions (From Nuance Brief)

**Booking & Logistics**

**Q1: How do I book a ferry to Islay?**
Book CalMac ferries at calmac.co.uk. For vehicles, book 12 weeks in advance—ferries fill quickly, especially summer and festival weekends. Foot passengers have more flexibility. Ferries depart Kennacraig and arrive at Port Ellen or Port Askaig (~2 hours).

**Q2: What if my ferry is cancelled?**
Contact Pi immediately. We've helped guests navigate CalMac disruptions dozens of times—rebooking, backup plans, adjusted arrivals. Travel insurance is strongly recommended. Pi's ferry support is mentioned in 30+ guest reviews.

**Q3: Can I get late check-out or early arrival?**
Often yes, if no one is booked that day. If someone is, we can sometimes arrange a late check-out in exchange for putting on the first load of laundry. Just ask when booking.

**Q4: Do I need a car on Islay?**
Recommended. Bus services exist but are limited. Taxis should be booked ahead. Car rental is available—book in advance through Islay Car Hire. Both properties are walkable to Bruichladdich village.

**Q5: Can I walk from the properties to restaurants?**
Port Charlotte is a 40-minute scenic coastal walk (or 5-minute drive). Bruichladdich Distillery is 10 minutes on foot. For evening meals, most guests drive to Port Charlotte or Bowmore.

**Property Features**

**Q6: Which property should I choose—Portbahn or Shorefield?**
**Portbahn House** if you want: modern, bright interiors, dishwasher, garden play for children, new-build finishes.
**Shorefield** if you value: quirky character, cosy atmosphere, nature focus, don't mind "a bit tired" aesthetic.
Both have stunning views, walk to distillery, dog-friendly. See our comparison page.

**Q7: Can I bring my dog?**
Yes, both properties are dog-friendly with enclosed gardens. £30 per dog per stay. You bring beach/dog towels—we provide bath towels.

**Q8: Is there a dishwasher?**
**Portbahn:** Yes. **Shorefield:** No—this is intentional, part of its character. Guests who need a dishwasher are directed to Portbahn.

**Q9: Will I be warm in winter?**
Yes. Portbahn has underfloor heating plus a log burner. Shorefield has an Everhot stove powered by renewables. Winter guests consistently praise the warmth and cosiness.

**Q10: What's the WiFi like?**
Both properties have functional WiFi for streaming and light work. Portbahn scores 7.5/10 on Booking.com; Shorefield scores 9.5/10. It's not ultra-fast, but Netflix and iPlayer work fine.

**Local Area**

**Q11: Where do I get groceries?**
**Aileen's mini-market** in Bruichladdich (10-min walk): coffee, bacon rolls, basics, post office. **Bowmore Co-op** (15-min drive): full supermarket. Fresh fish van and butcher also in Bowmore.

**Q12: Is there a beach nearby?**
**Portbahn Beach** is a 5-minute walk via the war memorial path—a hidden gem. **Port Charlotte Beach** (5-min drive) is sandy and sheltered, great for families. Wild swimming year-round (wetsuit advised).

**Q13: How far are the distilleries?**
**Bruichladdich:** 10-minute walk. **Port Charlotte:** 15-minute drive. **Bowmore, Kilchoman:** 15-20 minutes. **Ardbeg, Lagavulin, Laphroaig** (Port Ellen): 45-minute drive.

**Q14: Can we see wildlife?**
Yes. Seals and dolphins in Loch Indaal. Wintering geese (Oct–Apr). Golden eagles. RSPB Loch Gruinart reserve nearby. Shorefield has bird hides created by the owners.

**Q15: Are the properties accessible?**
Portbahn is generally single-level inside with some outdoor steps. Shorefield has some low furniture (accessibility note for joint issues). Neither is fully wheelchair accessible.

**Practical Concerns**

**Q16: Are the beds comfortable?**
Yes—Emma mattresses throughout both properties. Guests specifically praise the beds in reviews.

**Q17: What do you supply?**
Bath towels, loo roll, kitchen basics (washing up liquid, foil, cling film, tea towels), teas, coffees, oils, vinegars, spices, herbs. Honesty box for logs in winter. Baby equipment (high chairs, toys, bibs) at Portbahn.

**Q18: Will my kids be entertained if it rains?**
Yes. **Portbahn:** toys, games, DVDs, space to play. Sunken trampoline if dry. **Shorefield:** books, board games, DVDs, cosy fire. Rainy days are praised as atmospheric in reviews.

**Q19: How responsive is Pi really?**
Extremely. Communication score: 5.0/5.0 on Airbnb. Pi responds quickly and helps with everything from recommendations to ferry chaos. "Looked after us like family" appears in 30+ reviews.

**Q20: What about the Ring doorbell at Portbahn?**
External Ring doorbell covers the driveway only—for security and to monitor arrivals. No internal cameras. Some guests note it; most appreciate the security.

#### Schema.org
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I book a ferry to Islay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Book CalMac ferries at calmac.co.uk. For vehicles, book 12 weeks in advance..."
      }
    },
    // ... all 20 questions
  ]
}
```

---

### 7. CONTACT

**Primary Entity:** Contact/booking (functional)
**Intent:** Conversion, enquiry submission, trust reinforcement
**Fan-out queries targeted:**
- "book Portbahn Islay"
- "contact Islay holiday cottage"

#### Section Structure
1. **Contact Intro** - Who will respond? Pi introduction
2. **Booking Form** - How do I enquire? Form
3. **Response Expectation** - When will I hear back?
4. **Direct Contact** - Alternative contact methods

#### Passage Specifications

**Section 1: Get in Touch**
- H2: "Contact Pi"
- Brief intro: "Pi handles all enquiries and bookings directly. You're not dealing with a booking agency—you're talking to the person who will look after you throughout your stay."
- Response time: "We typically respond within 24 hours, often much faster."

**Section 2: Booking Inquiry Form**
- Lodgify form embed
- Fields: Email, name, guests, dates, property, message

**Section 3: Other Ways to Reach Us**
- Email: pi@portbahnislay.co.uk (example)
- Phone: [number if applicable]
- Note: "For ferry emergencies or urgent questions, email is fastest."

---

## IMPLEMENTATION CHECKLIST

### Pre-Publish (Per Page)
- [ ] Primary entity unambiguous
- [ ] Entity named consistently
- [ ] Entity definition in first 200 words
- [ ] Each section answers one clear question
- [ ] Sections can stand alone if extracted
- [ ] Headings descriptive and scoped
- [ ] Passages concise (3-6 sentences)
- [ ] Important content not hidden behind accordions
- [ ] Clear factual spine
- [ ] Emotional language layered after clarity
- [ ] Schema reinforces visible content

### Content Migration Priority
1. Homepage (brand foundation)
2. FAQs (expanded to 20, high extraction value)
3. Getting Here (ferry survival narrative)
4. Compare Properties (decision support)
5. About Us (trust building)
6. Explore Islay (consolidated guide)
7. Contact (personality added)

---

**Status:** Ready for content writing
**Next:** Create Sanity schemas for new content types, write actual content
