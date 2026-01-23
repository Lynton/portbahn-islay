# Other Pages Inventory — Live Site vs Nuance Brief

**Date:** 2026-01-23
**Purpose:** Compare current Lodgify site content with enhanced nuance brief to identify gaps, restructuring needs, and new page requirements.

---

## 1. LIVE SITE PAGES (Current Lodgify)

### Navigation Structure
```
Home
All properties (dropdown)
  ├── All properties
  ├── Portbahn, Islay
  ├── Shorefield, Islay
  └── Curlew Cottage, Islay
Islay
Bruichladdich
Travel
FAQs
Bothan Jura Retreat
Contact us
```

### Page-by-Page Content Audit

#### HOME (`/`)
**Current:** Full-screen hero with booking widget only. No content.
**Issues:**
- No brand positioning
- No property cards with personalities
- No social proof
- No "real homes" messaging
- No entity definition

#### ISLAY (`/en/2474022/islay`)
**Title:** "Islay Travel Guide & Essential Visitor Information"
**Current Content:**
- Brief intro paragraph about self-catering on Islay
- "5 amazing things to do":
  1. Whisky Distillery Tours (brief, generic)
  2. Islay Beaches (mentions Loch Indaal, Loch Gruinart, Laggan Bay, Portbahn beach)
  3. The Isle of Jura (day trip mention)
  4. The Museum of Islay Life (Port Charlotte)
  5. Islay Sea Adventures (Revenge Charter, Port Ellen)
- CTA to Portbahn
**Issues:**
- Very thin content (~400 words)
- Generic "travel guide" voice, not owner voice
- No distillery details (just "8 distilleries, 9th opening")
- No beaches named with swimming info
- No birding/wildlife content
- No food/restaurant recommendations
- No dark skies/stargazing
- Not passage-extractable for AI
- Missing entity relationships

#### BRUICHLADDICH (`/en/2487599/bruichladdich`)
**Title:** "Bruichladdich, Islay - distillery and local area"
**Current Content:**
- Location context (Rhinns of Islay, between Bruichladdich & Port Charlotte)
- 10-min walk to Bruichladdich Distillery (Octomore, Black Art, The Botanist gin)
- Aileen's mini-market mention (shop, post office, coffee, cake)
- Port Charlotte restaurants (40-min walk / 4-min drive): Lochindaal pub seafood platter
- Bowmore Co-op (15-min drive, or bus)
- Ardbeg, Laphroaig, Lagavulin = 45-min drive
- Airport/port timing (40 mins, arrive 30 mins before check-in)
**Issues:**
- ~150 words total - very thin
- Good practical info but no personality
- Missing: distillery booking links, seasonal events, local walks
- Not structured for AI extraction
- No entity definition block

#### TRAVEL (`/en/3895376/travel`)
**Title:** "Travel to Islay & Jura - Ferries, flights, taxis and buses"
**Current Content:**
- "How to get here?" intro
- **By air:** Islay Airport, 5 miles from Port Ellen, daily Glasgow/Oban flights, 45 mins from Glasgow. Links to: Islay Airport, buses/taxis/car hire, Skyscanner
- **By ferry:** Port Ellen & Port Askaig from Kennacraig (~2 hours). Links to: Port Ellen, Port Askaig, Kennacraig, car hire, Calmac booking
**Issues:**
- ~200 words - too brief
- Missing: Pi's ferry survival advice, CalMac chaos tips, travel insurance warning
- Missing: on-island transport details (car rental essential?)
- Missing: ferry booking lead time (12+ weeks for cars)
- Not the "Ferry Survival Guide" the nuance brief recommends
- No reassurance block about Pi's support

#### FAQS (`/en/2487600/faq-islay`)
**Title:** "FAQs about visiting & staying on Islay"
**Current Content:**
Q&A format covering:
- What do you supply? (towels, kitchen items, honesty box for logs, baby equipment)
- Can I have late check out? (flexible if no booking, or help with laundry)
- What's good on the doorstep? (Portbahn beach, Bruichladdich distillery, Aileen's, craft fair, play park, Port Charlotte beach, museum, petrol)
- Can you walk to pub/restaurants? (Port Charlotte 40-min walk, new cycle path, hotels & restaurants listed)
- Is there a beach nearby? (War memorial path to hidden beach, can swim opposite house but boggy)
**Issues:**
- Only 5 questions (nuance brief has 20)
- Missing: ferry booking, dog policy, dishwasher question, WiFi, warmth in winter
- Missing: property comparison ("which should I choose?")
- Missing: CalMac cancellation handling
- Missing: accessibility info
- Good local knowledge but incomplete
- Not structured with FAQPage schema potential

#### BOTHAN JURA RETREAT (`/en/2474023/bothanjuraretreat`)
**Title:** "Bothan Jura Retreat, boutique holiday accommodation on Isle of Jura"
**Current Content:**
- Welcome message
- 1 cottage + 2 luxury huts on Isle of Jura
- Wood fired hot tub, sauna, wood burning stoves, sea/mountain views
- Link to www.bothanjura.co.uk
- Email: pi@bothanjura.co.uk
- Featured properties section
**Issues:**
- This is a cross-site link, not core PBI content
- Appropriate as brief promo, but should live in footer/about
- Takes prominent nav position currently

#### CONTACT US (`/en/2473314/contact-us`)
**Title:** "Contact us - Pi & Lynton, Isle of Islay and Jura"
**Current Content:**
- Booking inquiry form only (email, name, guests, dates, comment, rental dropdown)
- Rental options: Portbahn, Shorefield, Curlew Cottage
**Issues:**
- No contact details visible (phone, email)
- No "book with confidence" messaging
- No Pi introduction or team info
- No response time expectation
- Pure form, no personality

#### ALL PROPERTIES (`/en/2473312/all-properties/`)
**Title:** "Self-catering holiday cottages and houses on the Isle of Islay"
**Current Content:**
- Search/filter bar
- 3 property cards with: image, name, rating, type, guests, beds, amenities, price
- Map view
**Issues:**
- No comparison content
- No "which property?" guidance
- Property cards are functional but lack personality
- No "modern vs character" framing

#### PROPERTY PAGES (via Lodgify)
**Example: Portbahn** (`/en/2473378/portbahn-islay`)
**Title:** "Portbahn, Islay - Vacation Home in Isle of Islay"
**Current:** Lodgify template - hero image, booking widget, presumably description/amenities below
**Issues:**
- Standard Lodgify template
- Missing personality-led positioning
- Missing guest superlatives
- Missing magic moments
- Missing honest friction
- Missing "perfect for" segments
- (Property pages being rebuilt in new site - focus on other pages for now)

---

## 2. NUANCE BRIEF RECOMMENDED PAGES

### Priority 1 (MVP Must-Haves)
1. **Homepage** - Brand positioning, property cards, social proof ❌ Missing
2. **Property Detail Pages** - Personality-led, honest, review-grounded ⚠️ Lodgify templates
3. **Properties Comparison** - Side-by-side modern vs character ❌ Missing
4. **Getting Here / Ferry Survival Guide** - CalMac advice, Pi's support ⚠️ Thin (Travel page)
5. **FAQs** - 20 questions ⚠️ Only 5 questions
6. **About / Why Us** - Owner story, team, philosophy ❌ Missing
7. **Contact / Booking** - With personality ⚠️ Form only

### Priority 2 (Launch Enhancement)
8. **Local Guides** - Distilleries, beaches, walks, food ⚠️ Very thin (Islay/Bruichladdich pages)
9. **Licensing Transparency** - Status per property ❌ Missing
10. **Curlew Cottage Holding Page** - Enquiries only ❌ Missing (shows as bookable)

### Priority 3 (Phase 2)
11. Blog / seasonal updates
12. Guest photo gallery (UGC)

---

## 3. GAP ANALYSIS

### CRITICAL GAPS (Must Create)

| Gap | Current | Needed | Priority |
|-----|---------|--------|----------|
| Homepage content | Empty | Brand positioning, property cards, social proof | P1 |
| About page | None | Owner story, Pi's team, philosophy | P1 |
| Property comparison | None | Side-by-side "which property?" with honest tradeoffs | P1 |
| Ferry Survival Guide | ~200 words generic | Pi's legendary support, 12+ weeks booking, insurance | P1 |
| Full FAQ | 5 questions | 20 questions from nuance brief | P1 |

### ENHANCEMENT GAPS (Expand Existing)

| Page | Current | Needed Enhancement |
|------|---------|-------------------|
| Islay guide | 400 words, generic | Full guide: distilleries, beaches, wildlife, food, dark skies |
| Bruichladdich | 150 words | Expand: local walks, seasonal events, village character |
| Travel | 200 words, links only | Ferry survival narrative, on-island transport, Pi's support |
| Contact | Form only | Add personality, response time, Pi intro |

### STRUCTURAL GAPS (Reorg Needed)

| Issue | Current | Recommendation |
|-------|---------|----------------|
| Bothan Jura in main nav | Prominent nav item | Move to footer "Also visit" or About page |
| No About page | Scattered owner info | Create dedicated About with owner story |
| Curlew status unclear | Shows as bookable | "Enquiries only" holding page |
| No licensing info | None visible | Transparency page or property badges |

---

## 4. RECOMMENDED NEW SITE STRUCTURE

```
Homepage
  └── Brand positioning, property cards, social proof, quick links

Properties
  ├── Compare Properties (new: side-by-side "which should I choose?")
  ├── Portbahn House ("The View House")
  ├── Shorefield ("The Character House")
  └── Curlew Cottage (holding page: "Enquiries only")

Explore Islay (consolidate Islay + Bruichladdich)
  ├── Overview (island intro, entity definition)
  ├── Distilleries (detailed, walkability emphasized)
  ├── Beaches & Wild Swimming
  ├── Wildlife & Birding
  ├── Food & Drink
  └── Dark Skies & Stargazing

Getting Here (expand Travel)
  ├── Ferry Guide (CalMac survival, Pi's support)
  ├── Flying to Islay
  └── Getting Around (car rental, taxis, buses)

About Us (new)
  ├── Our Story (Pi & Lynton, Islay → Jura)
  ├── Meet the Team (Pi, Amba, Janine)
  └── Also Visit: Bothan Jura Retreat (move from main nav)

FAQs (expand to 20 questions)

Contact
  └── Booking inquiry + Pi intro + response time

Footer
  ├── Licensing info
  ├── Social links
  └── Bothan Jura cross-promo
```

---

## 5. CONTENT MIGRATION PLAN

### Phase 1: Core Pages
1. Homepage - Write from scratch per nuance brief
2. About Us - Write from scratch per nuance brief
3. Property Comparison - Write from scratch per nuance brief
4. FAQs - Expand from 5 → 20 questions using nuance brief

### Phase 2: Enhanced Guides
5. Getting Here - Rewrite Travel page with ferry survival narrative
6. Explore Islay - Consolidate Islay + Bruichladdich, expand significantly
7. Contact - Add personality to form page

### Phase 3: Property Pages
8. Apply playbook to Portbahn, Shorefield, Curlew (schema already done)

---

## 6. NEXT STEPS

1. **Apply AI Search Playbook** to recommended structure
2. **Create page-by-page content specs** with:
   - Entity definition blocks
   - Passage-extractable sections
   - Conversational flow
   - Schema.org requirements
3. **Write content** for each page type
4. **Create Sanity schemas** for new content types (Guide, FAQ, About)
5. **Build pages** in Next.js

---

**Status:** Ready for playbook application
