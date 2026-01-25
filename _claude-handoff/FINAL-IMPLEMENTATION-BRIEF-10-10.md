# Final Implementation Brief: Portbahn Islay Content Upgrade to 10/10
**Date:** 2026-01-25
**Status:** Ready for Claude Code/Cursor Implementation
**Playbook:** AI Search Playbook v1.3.1
**Voice:** Portbahn Tone of Voice Skill v1.0

---

## Executive Summary

This brief provides everything needed to implement a 10/10 playbook-compliant content upgrade across all pages. Start with GitHub schema as canonical source, then apply these enhancements.

**Key Decisions Made:**
1. ✅ Curlew Cottage is LIVE and BOOKABLE (update live site "Coming Soon" text)
2. ✅ FAQ strategy: Contextual Q&As on entity pages + aggregation page (see Section 6)
3. ✅ Property schema: Use existing `commonQuestions` field, enhance with full content
4. ✅ "What's Included" content from live FAQ page must be captured
5. ✅ Nice-to-haves (comparison table, seasonal guidance) included

---

## 1. Current Schema Status (GitHub = Canonical)

### Property Schema (`property.ts`)
**Location:** `/schemas/collections/property.ts`
**Status:** Already includes `commonQuestions` field (lines 157-215)

**Existing field:**
```typescript
defineField({
  name: 'commonQuestions',
  title: 'Common Questions',
  type: 'array',
  // ... validation for 3-6 questions, 400 char max answers
})
```

**Enhancement needed:** Validation allows 400 chars max but some answers need ~600 chars for trust signals. Consider:
- Increase to 600 chars, OR
- Keep 400 with warning (not error)

### Missing Content Fields to Add

**1. What's Included Block** (captures live FAQ content)
```typescript
defineField({
  name: 'whatsIncluded',
  title: "What's Included",
  type: 'object',
  group: 'details',
  fields: [
    {
      name: 'intro',
      type: 'string',
      title: 'Intro Sentence',
      description: 'e.g., "Everything you need for a comfortable stay"'
    },
    {
      name: 'linens',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Linens & Towels',
      description: 'What bedding/towels are provided'
    },
    {
      name: 'kitchen',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Kitchen Supplies',
      description: 'What kitchen items/staples are provided'
    },
    {
      name: 'babyEquipment',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Baby & Family Equipment',
      description: 'High chairs, bath toys, etc.'
    },
    {
      name: 'notIncluded',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Please Bring',
      description: 'Items guests should bring (beach towels, dog towels)'
    }
  ]
})
```

**2. Cross-Links Field for FAQs**
```typescript
defineField({
  name: 'faqCrossLinks',
  title: 'FAQ Cross-Links',
  type: 'array',
  group: 'content',
  of: [{
    type: 'object',
    fields: [
      { name: 'text', type: 'string', title: 'Link Text' },
      { name: 'property', type: 'reference', to: [{ type: 'property' }] }
    ]
  }],
  description: 'Links to related property FAQs (e.g., "See logistics questions at Portbahn House")'
})
```

---

## 2. Content From Live Site FAQs (Must Capture)

The live `/faq-islay` page has valuable content not in V2 rewrites:

### What We Supply (All Properties)
```
We supply:
- Bath towels (you bring beach / dog towels!)
- Loo roll, washing up liquid, kitchen roll, foil, cling film, tea towels
- Teas, coffee, oils, vinegars, spices, herbs
- Honesty box system for logs in winter
- Saucepans big enough for lobster cooking
- Hand blender, cafetieres (bring your own ground coffee)
- Microwave, dishwasher, dining for 8
- Nespresso machine (I leave a few pods but bring your own if you drink lots)
```

### Baby Equipment (Family Properties)
```
For babies: 2 high chairs, bath toys, loads of books and toys,
baby bibs, cutlery, plates, sippy cups, plastic cups, drawing, pens etc...
```

### Late Checkout Flexibility
```
If no-one is booked to come in that day at 4pm, then yes that's fine.
However if someone is booked to come in at 4pm that day then there are
ways around it also!! For example it's a popular compromise, in exchange
for putting on the first few washes of sheets you can have a much later
check out - just let me know when booking!
```

**Action:** This content should populate the `whatsIncluded` field for each property, with property-specific variations where needed.

---

## 3. Property Page Content Updates

### Portbahn House (Universal Logistics Hub)

**commonQuestions (5):**
1. Can we check in early or have late checkout?
2. Can you provide synthetic bedding for allergies?
3. Is there parking at Portbahn House?
4. How many bedrooms does Portbahn House have?
5. Which distillery should we visit first?

**whatsIncluded:**
```json
{
  "intro": "Everything you need for a comfortable stay—just bring beach towels and your own coffee pods",
  "linens": [
    "Bath towels provided for all guests",
    "Fresh bed linen included",
    "Quality duvets and pillows (synthetic available on request for allergies)"
  ],
  "kitchen": [
    "Fully stocked kitchen: teas, coffee, oils, vinegars, spices, herbs",
    "Nespresso machine (starter pods provided—bring your own for longer stays)",
    "Saucepans big enough for lobster cooking",
    "Hand blender, cafetieres, all cookware needed",
    "Dishwasher, microwave, full oven",
    "Dining table seating 8"
  ],
  "babyEquipment": [
    "2 high chairs",
    "Bath toys, books, games",
    "Baby bibs, plates, sippy cups, plastic cups",
    "Drawing supplies and pens",
    "Travel cot available on request"
  ],
  "notIncluded": [
    "Beach towels (one per guest recommended)",
    "Dog towels if traveling with pets",
    "Extra Nespresso pods if you're a heavy coffee drinker"
  ]
}
```

**faqCrossLinks:**
- Comparing our properties? See FAQs at [Shorefield] and [Curlew Cottage]

**Trust signals to add to description:**
- "Welcomed 600+ guests since 2017"
- "4.97/5 rating across 156 reviews"
- "5.0/5 communication rating"
- "Airbnb Superhost"

---

### Shorefield (Character & Eco Features)

**commonQuestions (5):**
1. What makes Shorefield different from the other properties?
2. Does Shorefield have a dishwasher?
3. What are the bird hides at Shorefield?
4. Is Shorefield in good condition?
5. How far is Shorefield from the beach?

**whatsIncluded:**
```json
{
  "intro": "The Jacksons' home is stocked with everything you need—including their personal collection of bird books and binoculars",
  "linens": [
    "Bath towels provided",
    "Fresh bed linen included",
    "Quality bedding throughout"
  ],
  "kitchen": [
    "Well-stocked kitchen basics: teas, coffee, oils, spices",
    "No dishwasher (part of the eco-house character)",
    "Washing machine and dryer available",
    "Full cooking facilities"
  ],
  "babyEquipment": [
    "High chair available",
    "Books and games for all ages",
    "The Jacksons' wildlife guides and binoculars"
  ],
  "notIncluded": [
    "Beach towels",
    "Dog towels if traveling with pets"
  ]
}
```

**faqCrossLinks:**
- Questions about check-in, bedding, general policies? See [Portbahn House FAQs]
- Comparing properties? See [Curlew Cottage FAQs]

**Unique content to emphasize:**
- Bird hides created by the Jacksons
- Eco-house (wind/solar powered)
- "90% of guests specifically love the quirky charm"
- Honest about condition: "carpets need refreshing, furniture well-loved"

---

### Curlew Cottage (New Listing & Family Features)

**commonQuestions (5):**
1. Why are there no reviews for Curlew Cottage yet?
2. Is Curlew Cottage pet-free?
3. Is the walled garden safe for children?
4. How many bedrooms does Curlew Cottage have?
5. What's the character of Curlew Cottage?

**whatsIncluded:**
```json
{
  "intro": "Allan's family retreat is stocked with everything his family uses—genuine 'holiday things' and all essentials",
  "linens": [
    "Bath towels provided",
    "Fresh bed linen included",
    "Quality bedding throughout"
  ],
  "kitchen": [
    "Fully equipped kitchen with all essentials",
    "Family cookware and dining supplies",
    "Everything you'd expect in a family home"
  ],
  "babyEquipment": [
    "Family-friendly setup",
    "Books and games from Allan's family collection"
  ],
  "notIncluded": [
    "Beach towels (no dog towels needed—this property is pet-free)"
  ]
}
```

**faqCrossLinks:**
- Questions about check-in, bedding, general policies? See [Portbahn House FAQs]
- Comparing properties? See [Shorefield FAQs]

**Key messaging:**
- Trust transfer: "Managed by Pi & Lynton with same care as our other properties"
- New to market: "Allan's family retreat, first-time letting in 2026"
- Pet-free positioning: "Only pet-free option for allergy-sensitive guests"
- Walled garden: "Fully enclosed, safe for children"

**CRITICAL UPDATE NEEDED:**
- Remove all "Coming Soon" / "licence pending" text
- Add to live site immediately: Curlew is LIVE and BOOKABLE

---

## 4. Guide Page Content (V2 Final Files)

### Getting Here Page
**File:** `GETTING-HERE-PAGE-V2-FINAL.md`
**Status:** 10/10 ready
**Key content:**
- Pi's voice throughout
- Ferry booking urgency
- Flight vs ferry comparison
- 5 embedded FAQs
- Ferry cancellation support (30+ reviews mention this)

### Explore Islay Page
**File:** `EXPLORE-ISLAY-PAGE-V2-FINAL.md`
**Status:** 10/10 ready
**Key content:**
- 21 H3 subsections
- All 9 distilleries covered
- Portbahn Beach expanded (unique asset)
- Shorefield bird hides expanded (unique asset)
- 5 embedded FAQs
- Swimming safety warnings (Machir Bay)

### Homepage
**File:** `HOMEPAGE-V2-FINAL.md`
**Status:** 10/10 ready
**Key content:**
- Pi & Lynton intro
- Trust signals (600+ guests, 4.97/5, Superhost)
- Property comparison section
- Ownership stories

---

## 5. Nice-to-Have Additions (Include in MVP)

### 5.1 Property Comparison Table (Homepage)

```markdown
## Choose Your Portbahn Property

| Feature | Portbahn House | Shorefield | Curlew Cottage |
|---------|---------------|------------|----------------|
| Sleeps | 8 guests | 6 guests | 6 guests |
| Bedrooms | 3 | 3 | 3 |
| Character | Modern, family-friendly | Quirky eco-house | Traditional retreat |
| Pets | Dogs welcome (£15) | Dogs welcome (£15) | Pet-free |
| Unique feature | Trampoline & swings | Bird hides & nature | Walled garden |
| Best for | Families, whisky groups | Nature lovers, birders | Families with allergies |
| Reviews | 156 reviews, 4.97/5 | 30+ reviews, 5.0/5 | New for 2026 |
```

### 5.2 Seasonal Booking Guidance (Getting Here or Homepage)

```markdown
## When to Book

**Peak Season (July-August, Fèis Ìle late May):**
- Book ferry 2-3 months ahead
- Book accommodation 3-4 months ahead
- Distillery tours sell out weeks in advance

**Shoulder Season (April-June, September-October):**
- Book ferry 2-4 weeks ahead
- More availability, same great weather
- October: 30,000+ barnacle geese arrive

**Winter (November-March):**
- Ferry rarely books out
- Quieter island, dramatic weather
- Cozy fires in all our properties
- Some restaurants have reduced hours
```

---

## 6. FAQ Aggregation Strategy (Playbook Compliant)

### The Problem
Playbook says "No standalone FAQ page" but:
- Users expect /faq to exist
- Practical content (what's supplied) doesn't fit neatly on one entity page
- Cross-property questions need a home

### The Solution: Aggregation Page

**Architecture:**
```
Entity Pages (Source of Truth)
├── /properties/portbahn-house#common-questions (5 Q&As)
├── /properties/shorefield#common-questions (5 Q&As)
├── /properties/curlew-cottage#common-questions (5 Q&As)
├── /getting-here (5 embedded Q&As)
└── /explore-islay (5 embedded Q&As)

Aggregation Page (Dynamic)
└── /faq (pulls from all above, grouped by category)
```

**Implementation:**
1. Each entity page has its own Q&As (authoritative source)
2. `/faq` page DYNAMICALLY aggregates all Q&As
3. No duplicate content—aggregation page renders same content
4. Schema: NO FAQPage schema anywhere (per playbook)

**Sanity Schema for Aggregation:**
```typescript
// faqPage.ts - becomes an aggregation singleton
defineType({
  name: 'faqPage',
  title: 'FAQ Aggregation Page',
  type: 'document',
  fields: [
    ...baseSingletonFields,
    defineField({
      name: 'introText',
      title: 'Page Introduction',
      type: 'text',
      description: 'Brief intro explaining FAQ categories'
    }),
    defineField({
      name: 'categories',
      title: 'FAQ Categories',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Category Title' },
          { name: 'description', type: 'string', title: 'Category Description' },
          { name: 'sourceType', type: 'string', options: {
            list: [
              { title: 'Property FAQs', value: 'property' },
              { title: 'Getting Here FAQs', value: 'gettingHere' },
              { title: 'Explore Islay FAQs', value: 'exploreIslay' }
            ]
          }}
        ]
      }]
    })
  ]
})
```

**Frontend Query (GROQ):**
```groq
{
  "properties": *[_type == "property"] {
    name,
    slug,
    commonQuestions
  },
  "gettingHere": *[_type == "gettingHerePage"][0] {
    faqs
  },
  "exploreIslay": *[_type == "exploreIslayPage"][0] {
    faqs
  }
}
```

**Categories for Aggregation:**
1. **Before You Arrive** - Ferry, flights, booking, packing
2. **About Our Properties** - Property-specific questions
3. **On Islay** - Distilleries, beaches, restaurants
4. **Practical Essentials** - What's supplied, check-in/out

---

## 7. Implementation Checklist

### Phase 1: Schema Updates
- [ ] Enhance `commonQuestions` validation (600 char warning)
- [ ] Add `whatsIncluded` field to property schema
- [ ] Add `faqCrossLinks` field to property schema
- [ ] Update `faqPage` singleton to aggregation model

### Phase 2: Property Pages (GitHub schema + this brief)
- [ ] Portbahn House: 5 FAQs + whatsIncluded + trust signals
- [ ] Shorefield: 5 FAQs + whatsIncluded + honest character notes
- [ ] Curlew Cottage: 5 FAQs + whatsIncluded + REMOVE "Coming Soon"

### Phase 3: Guide Pages (V2 Final files)
- [ ] Getting Here: Implement V2-FINAL content
- [ ] Explore Islay: Implement V2-FINAL content
- [ ] Homepage: Implement V2-FINAL content + comparison table

### Phase 4: FAQ Aggregation
- [ ] Update faqPage schema
- [ ] Implement GROQ query
- [ ] Build aggregation component
- [ ] Test category grouping

### Phase 5: Quality Assurance
- [ ] All pages pass playbook checklist
- [ ] Pi's voice consistent throughout
- [ ] Trust signals integrated
- [ ] Cross-links functional
- [ ] NO FAQPage schema anywhere
- [ ] Mobile responsive

---

## 8. File References

**Content Files (in this folder):**
- `GETTING-HERE-PAGE-V2-FINAL.md`
- `EXPLORE-ISLAY-PAGE-V2-FINAL.md`
- `HOMEPAGE-V2-FINAL.md`
- `PROPERTY-FAQ-DISTRIBUTION-FINAL.md`

**Schema Reference (GitHub canonical):**
- `/schemas/collections/property.ts`
- `/schemas/singletons/faqPage.ts`
- `/schemas/collections/faqItem.ts`

**Playbook Reference:**
- `playbook-v1.3.1/08-03-pbi_faq_strategy.md`
- `playbook-v1.3.1/07-01-ai-search-practical-checklist.md`

**Source Documents:**
- `docs/property_reviews/airbnb_reviews_snapshot.md`
- `sites/pbi/nuance/site-nuance-brief-PBI-LL.md`
- Live site: portbahnislay.co.uk/en/faq-islay (capture before replacing)

---

## 9. Summary for Claude Code

**Start here:**
1. Read this brief completely
2. Check GitHub for latest property.ts schema
3. Implement schema enhancements (Section 1)
4. Populate property content (Section 3)
5. Implement guide pages from V2-FINAL files
6. Build FAQ aggregation (Section 6)
7. Run through checklist (Section 7)

**Key constraints:**
- GitHub schema is canonical (don't duplicate from temp_intake)
- V2-FINAL files are content-ready (implement as-is)
- NO FAQPage schema anywhere
- Pi's first-person voice throughout
- Curlew is LIVE (remove all "Coming Soon" references)

**Expected outcome:**
- All 6 pages at 10/10 playbook compliance
- FAQ aggregation page working
- Trust signals integrated throughout
- Cross-linking functional
- Ready for production deployment

---

---

## 10. Technical Pre-Launch Checklist

### 10.1 Crawlability Verification
- [ ] **robots.txt** allows: GPTBot, ClaudeBot, PerplexityBot, Googlebot, Bingbot
- [ ] No `noindex` meta tags on key entity pages
- [ ] **Sitemap.xml** includes all entity pages with correct lastmod dates
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools

### 10.2 Rendering & Performance
- [ ] Core content visible in initial HTML (view-source check)
- [ ] No critical content behind JavaScript interactions or accordions
- [ ] Page load < 3 seconds on mobile (Core Web Vitals)
- [ ] Images have proper alt text and lazy loading

### 10.3 Schema Markup
- [ ] Stable `@id` values using pattern: `{domain}/properties/{slug}#entity`
- [ ] Schema validates at schema.org/validator or Google Rich Results Test
- [ ] **NO FAQPage schema** anywhere (per playbook)
- [ ] LodgingBusiness schema on property pages
- [ ] TouristAttraction schema on Explore Islay page

### 10.4 Canonical & Duplicate Prevention
- [ ] Each page has self-referencing canonical tag
- [ ] No duplicate content across property pages
- [ ] Pagination handled correctly (if applicable)
- [ ] Trailing slash consistency

### 10.5 Internal Linking
- [ ] All cross-property links functional
- [ ] FAQ cross-links use anchor IDs (#common-questions)
- [ ] Breadcrumbs implemented
- [ ] No orphan pages

---

## 11. Additional Schema Fields to Add

### 11.1 STL License Display (Legal Compliance)
```typescript
defineField({
  name: 'stlLicenseNumber',
  title: 'STL License Number',
  type: 'string',
  group: 'policies',
  description: 'Scottish Short-Term Let license number for display (e.g., AR02246F)',
  placeholder: 'AR02246F'
})
```

**License Numbers (from PDFs in temp_intake):**
- Portbahn House: AR01981F
- Shorefield: AR02246F
- Curlew Cottage: AR02532F

### 11.2 Review Statistics (Multi-Platform)
```typescript
defineField({
  name: 'reviewStats',
  title: 'Review Statistics',
  type: 'object',
  group: 'ai-search',
  description: 'Aggregate review data across platforms for trust signals',
  fields: [
    { name: 'airbnbRating', type: 'number', title: 'Airbnb Rating (e.g., 4.97)' },
    { name: 'airbnbCount', type: 'number', title: 'Airbnb Review Count' },
    { name: 'bookingRating', type: 'number', title: 'Booking.com Rating (e.g., 9.5)' },
    { name: 'bookingCount', type: 'number', title: 'Booking.com Review Count' },
    { name: 'googleRating', type: 'number', title: 'Google Rating (e.g., 5.0)' },
    { name: 'googleCount', type: 'number', title: 'Google Review Count' },
    { name: 'totalGuests', type: 'string', title: 'Total Guests (e.g., "600+")' }
  ]
})
```

**Current Stats (from review files):**

| Property | Airbnb | Booking.com | Google |
|----------|--------|-------------|--------|
| Portbahn House | 4.97/5 (156 reviews) | 9.5/10 (33 reviews) | 5.0/5 (37 reviews) |
| Shorefield | 4.97/5 (86 reviews) | 9.2/10 (57 reviews) | 5.0/5 (13 reviews) |
| Curlew Cottage | New listing | New listing | New listing |

---

## 12. Keyword Integration Checklist (ATP-Derived)

Based on Answer The Public research (Jan 2026), ensure these high-volume phrases appear naturally in content:

### 12.1 Homepage Must Include
- [ ] "self-catering holiday" or "self-catering accommodation" (720 searches)
- [ ] "holiday cottage islay" (880 searches)
- [ ] "holiday home islay" (720 searches)
- [ ] "islay accommodation" (1.9K searches)
- [ ] "families visiting Islay" (Gemini AI query)
- [ ] "distillery tours with accommodation" (ChatGPT AI query)
- [ ] "best places to stay on Islay" (Gemini AI query)

### 12.2 Getting Here Must Include
- [ ] "kennacraig to islay" / "kennacraig ferry to islay" (880 searches)
- [ ] "islay ferry times" / "islay ferry timetable" (590 searches)
- [ ] "islay to jura ferry" / "islay jura ferry" (590 searches)
- [ ] "travel to Islay from the Scottish mainland" (Gemini AI query)
- [ ] "ferry times from Kennacraig to Port Ellen" (Gemini AI query)
- [ ] Both ports mentioned: "Port Ellen" AND "Port Askaig"
- [ ] "glasgow to islay flight" (720 searches)

### 12.3 Explore Islay Must Include
- [ ] "things to do in islay scotland" (590 searches)
- [ ] "islay whisky distillery" / "islay whisky distilleries" (320 searches)
- [ ] "islay beaches" (390 searches)
- [ ] "islay distillery tour" (260 searches)
- [ ] "restaurants on Islay with whisky" (ChatGPT AI query)
- [ ] "islay distillery map" context (320 searches)

### 12.4 Property Pages Must Include
- [ ] "best places to stay on Islay" in descriptions (Gemini AI query)
- [ ] Property-specific location context

### 12.5 Shorefield Specifically
- [ ] "birding" / "bird watching" / "wildlife" (captures "islay bird blog" 260 searches)

---

## 13. Enhanced Local Content

### 13.1 Bruichladdich Distillery - Our Unique Selling Point

**Why this matters:** Bruichladdich is not just "a distillery"—it's one of Islay's most progressive and exclusive distilleries, and guests can WALK there from our properties.

**Key facts to integrate (source: bruichladdich.com research):**

**Progressive Philosophy:**
- First Scotch whisky distillery in the world to achieve B Corp certification (2020)
- Commitment to terroir—only uses 100% Scottish-grown barley
- Over 50% of production now uses Islay-grown barley (as of 2024)
- All whisky is distilled, matured, AND bottled on Islay (rare for Scotch)

**Four Spirits Under One Roof:**
1. **Bruichladdich** — Unpeated Islay single malt (rare for Islay!)
2. **Port Charlotte** — Heavily peated at 40PPM (named after nearby village)
3. **Octomore** — World's most heavily peated whisky (80+ PPM), cult following
4. **The Botanist** — First and only Islay dry gin, 22 hand-foraged local botanicals

**Unique Visitor Experience:**
- Victorian-era equipment still in use
- Working distillery you can walk through
- On-site bottling hall (installed 2003)
- The Botanist uses "Ugly Betty"—last surviving Lomond pot-still

**Content to add to Explore Islay page (under "Our Recommendation: Start at Bruichladdich"):**

> Bruichladdich isn't just our nearest distillery—it's one of Islay's most innovative. They're the only distillery producing four distinct spirits under one roof: unpeated Bruichladdich, heavily peated Port Charlotte, the extreme Octomore series (the world's most heavily peated whisky), and The Botanist gin made with 22 hand-foraged Islay botanicals.
>
> What makes them special? They're the first Scotch whisky distillery to achieve B Corp certification, they use only Scottish barley (over 50% now Islay-grown), and they distill, mature, and bottle everything on the island. The Victorian equipment, the working bottling hall, the story—it's all 10 minutes' walk from your door.

**Content to add to Property descriptions:**

> You're a 10-minute walk from Bruichladdich Distillery—one of Islay's most progressive distilleries, producing four distinct spirits including The Botanist gin and the cult-favourite Octomore series.

### 13.2 Islay Whisky Bars & Restaurants (Enhanced)

**Update Explore Islay "Where to Eat" section with whisky bar details:**

**Best Whisky Selections on Islay:**

| Venue | Location | Whisky Selection | Food | Notes |
|-------|----------|-----------------|------|-------|
| **Port Charlotte Hotel** | Port Charlotte (5 min drive) | 300+ bottles | Full restaurant | Best overall whisky bar on island |
| **Lochindaal Hotel** | Port Charlotte (5 min drive) | Excellent selection | Pub food | More casual atmosphere |
| **Bowmore Hotel** | Bowmore (15 min drive) | Strong Bowmore focus | Restaurant & bar | Central location |
| **Lochside Hotel** | Bowmore (15 min drive) | Good selection | Restaurant | Also does accommodation |

**Add to Explore Islay content:**

> **Port Charlotte: Islay's Whisky Bar Hub**
>
> The village of Port Charlotte—a 5-minute drive from our properties—has two of Islay's best whisky bars. The Port Charlotte Hotel boasts over 300 bottles and excellent restaurant dining. The Lochindaal Hotel offers a more casual pub atmosphere with a superb selection. Both are perfect for an evening of exploration after a day of distillery tours.
>
> In Bowmore, the Bowmore Hotel and Lochside Hotel both offer strong whisky selections with their own character. But for sheer variety and atmosphere, Port Charlotte is where whisky lovers head.

### 13.3 Best Local Seafood (Enhanced)

**Add to Explore Islay "Where to Eat" section:**

> **Islay's Seafood Highlights**
>
> **Lochindaal Seafood Kitchen** (Port Charlotte) is exceptional—their seafood platters feature local oysters, langoustines, crab, and mussels. Order the full platter 24 hours ahead; it's worth planning your trip around. This is the best seafood experience on the island.
>
> Fresh fish also comes to you—a fish van visits villages weekly with local catch. Ask us for the current schedule when you arrive.
>
> Most restaurants feature local seafood: the Port Charlotte Hotel does excellent fish dishes, and even the simpler pubs serve fresh Islay oysters and mussels when available.

---

## 14. Updated Implementation Checklist (Complete)

### Phase 1: Schema Updates
- [ ] Enhance `commonQuestions` validation (600 char warning instead of error)
- [ ] Add `whatsIncluded` field to property schema
- [ ] Add `faqCrossLinks` field to property schema
- [ ] Add `stlLicenseNumber` field to property schema
- [ ] Add `reviewStats` field to property schema
- [ ] Update `faqPage` singleton to aggregation model

### Phase 2: Property Pages
- [ ] Portbahn House: 5 FAQs + whatsIncluded + trust signals + license
- [ ] Shorefield: 5 FAQs + whatsIncluded + character notes + birding emphasis
- [ ] Curlew Cottage: 5 FAQs + whatsIncluded + REMOVE "Coming Soon" + trust transfer
- [ ] All properties: Add review stats from multi-platform data

### Phase 3: Guide Pages
- [ ] Getting Here: V2-FINAL content + keyword phrases + both ferry ports
- [ ] Explore Islay: V2-FINAL + enhanced Bruichladdich section + whisky bars + seafood
- [ ] Homepage: V2-FINAL + comparison table + seasonal guidance + keywords

### Phase 4: FAQ Aggregation
- [ ] Update faqPage schema
- [ ] Implement GROQ query
- [ ] Build aggregation component
- [ ] Test category grouping

### Phase 5: Technical Verification
- [ ] robots.txt allows AI bots
- [ ] Sitemap includes all pages
- [ ] Schema validates (no FAQPage)
- [ ] Canonical tags correct
- [ ] Page speed acceptable
- [ ] Mobile responsive

### Phase 6: Keyword Verification
- [ ] Run through Section 12 checklist
- [ ] Verify high-volume phrases appear naturally
- [ ] Check AI query phrases are answered

### Phase 7: Final QA
- [ ] All pages pass playbook 1.3.1 checklist
- [ ] Pi's voice consistent throughout
- [ ] Trust signals integrated
- [ ] Cross-links functional
- [ ] Content matches live site info (prices, times, etc.)

---

## 15. Summary for Claude Code (Updated)

**Start here:**
1. Read this brief completely (especially new sections 10-14)
2. Check GitHub for latest property.ts schema
3. Implement schema enhancements (Section 1 + Section 11)
4. Populate property content (Section 3)
5. Implement guide pages from V2-FINAL files + enhancements (Section 13)
6. Build FAQ aggregation (Section 6)
7. Run through technical checklist (Section 10)
8. Verify keyword integration (Section 12)
9. Complete full implementation checklist (Section 14)

**Key constraints:**
- GitHub schema is canonical (don't duplicate from temp_intake)
- V2-FINAL files are content-ready (implement with Section 13 enhancements)
- NO FAQPage schema anywhere
- Pi's first-person voice throughout
- Curlew is LIVE (remove all "Coming Soon" references)
- Include STL license numbers on property pages
- Bruichladdich positioning is a key differentiator—emphasize the walk

**Content enhancements to apply:**
- Enhanced Bruichladdich section (B Corp, 4 spirits, terroir)
- Whisky bar guide (Port Charlotte Hotel 300+ bottles, Lochindaal)
- Seafood emphasis (Lochindaal Seafood Kitchen)
- High-volume keywords integrated naturally
- AI query phrases answered explicitly

**Expected outcome:**
- All 6 pages at 10/10 playbook compliance
- FAQ aggregation page working
- Trust signals integrated throughout
- Cross-linking functional
- Technical checklist passed
- Keyword coverage verified
- Ready for production deployment

---

**Status:** ✅ FINAL - Ready for Implementation (v2 - Enhanced)
**Author:** Claude (Cowork session 2026-01-25)
**Review:** Lynton (owner confirmation on Curlew status, FAQ strategy, local content)
**Version:** 2.0 - Added technical checklist, schema fields, keyword integration, enhanced local content
