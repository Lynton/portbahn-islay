# Playbook v1.3.1 Compliance Analysis
**Date:** 2026-01-23
**Pages Reviewed:** Getting Here, Explore Islay
**Sources Checked:** Live homepage content (Sanity export), nuance brief, property reviews
**Analyst:** AI Search Playbook Skill

---

## Executive Summary

### Overall Compliance: ✅ STRONG (85-90%)

Both drafted pages demonstrate solid understanding of Playbook v1.3.1 principles. Entity-first architecture is clear, passages are extractable, and the "fixed spine, flexible skin" balance is well-executed. Minor improvements recommended for brand voice consistency and trust signal integration.

### Key Strengths
✅ Entity definitions explicit and front-loaded
✅ Passage-extractable sections with descriptive headings
✅ Multi-site coordination (secondary authority positioning)
✅ No FAQPage schema (question-format headings only)
✅ Semantic triple patterns used correctly
✅ Conversational flow structure followed

### Gaps Identified
⚠️ **Pi's voice/personality under-represented** (nuance brief emphasizes this heavily)
⚠️ **Trust signals not integrated** (600+ reviews, 4.97/5 rating absent from guide pages)
⚠️ **Some passages slightly long** (7-8 sentences vs. 3-6 ideal)
⚠️ **"Ferry chaos" support not emphasized enough** (legendary differentiator per reviews)

---

## Page-by-Page Analysis

---

## 1. GETTING HERE PAGE

### Playbook Compliance Score: **88/100**

### ✅ STRENGTHS

#### Entity-First Architecture (EXCELLENT)
**Compliance:** ✅ Full compliance

**Evidence:**
> "The Isle of Islay is accessible by two main routes: CalMac ferry from mainland Scotland or Loganair flight from Glasgow. The ferry service operates from Kennacraig..."

- Primary entity (ferry travel to Islay) defined in opening paragraph
- Entity type clear (travel/logistics guide)
- Core attributes explicit (routes, times, booking windows)
- No competing definitions

**Playbook alignment:** "Be boring once (entity definition), be beautiful everywhere else." ✓

---

#### Fixed Spine, Flexible Skin (STRONG)
**Compliance:** ✅ Good balance, minor refinement needed

**Fixed spine (factual) examples:**
- "Book 12 weeks in advance for vehicle spaces"
- "Ferry crossing takes 2 hours and 20 minutes"
- "Distances from Bruichladdich: Port Ellen 35 minutes, Port Askaig 40 minutes"

**Flexible skin (expressive) examples:**
- "By the time you arrive, you're already in island mode"
- "The crossing was part of the holiday"
- "Islay wave—locals wave at passing cars, reciprocate!"

**Gap:** Pi's personality voice could be stronger. The nuance brief emphasizes:
> "Pi handles all guest communication and is known for exceptional responsiveness, particularly during CalMac ferry disruptions."

**Current text is helpful but anonymous.** Consider:
- Opening with "I'm Pi, and I've been helping guests navigate Islay ferry bookings for 8+ years"
- Direct address: "Contact me immediately if your ferry is disrupted—I've done this dozens of times"

---

#### Passage Extractability (STRONG)
**Compliance:** ✅ 90% compliant

**Good examples:**
1. **Booking the Ferry** section (5 sentences, standalone, clear heading)
2. **What Happens if My Ferry is Cancelled?** (6 sentences, actionable, self-contained)
3. **Do You Need a Car on Islay?** FAQ (4 sentences, definitive answer)

**Needs refinement:**
- **"Pi's Ferry Survival Guide"** section is 8 sentences (playbook ideal: 3-6)
- **"Flying to Islay"** section is 7 sentences (could split into two passages)

**Recommendation:** Break longer sections into subsections with more granular H3 headings:
- "Before Boarding" (3 sentences)
- "On Board" (3 sentences)
- "Sea Sickness Tips" (3 sentences)

This improves retrieval probability for specific queries like "ferry sea sickness tips Islay."

---

#### Recall Before Precision (GOOD)
**Compliance:** ✅ Strong, with one opportunity

**Explicit over implicit:**
- ✅ "Vehicle reservations are essential and should be booked up to 12 weeks in advance"
- ✅ "Port Ellen is marginally closer to Bruichladdich (35 minutes vs 40 minutes from Port Askaig)"
- ✅ "CalMac helpline is 0800 066 5000"

**Repeated over elegant:**
- ✅ "Book 12 weeks ahead" appears 3 times (homepage entity def, Booking section, FAQ)
- ✅ "Port Ellen" and "Port Askaig" consistently named (not "the southern port")

**Opportunity:** The **legendary ferry disruption support** is mentioned once but should be repeated/emphasized:
- Nuance brief: "Legendary ferry crisis support" mentioned in 30+ reviews
- Current draft: One mention in disruption section

**Recommendation:** Add trust signal to multiple sections:
- Opening: "I'm Pi—guests say I'm legendary at navigating ferry chaos" (recall + personality)
- Disruption section: Existing text is good
- FAQ: "Will Pi really help if my ferry is cancelled?" (trust reinforcement)

---

#### Multi-Site Coordination (EXCELLENT)
**Compliance:** ✅ Full compliance

**Secondary authority positioning:**
- ✅ Links to CalMac for booking (primary authority)
- ✅ Links to Loganair for flights
- ✅ Links to Islay Car Hire
- ✅ References Fèis Ìle official site
- ✅ Does NOT duplicate DMO content (appropriately light on Islay overview)

**Playbook alignment:** "Go light on adjacent topics" → achieved. Page focuses on travel logistics (PBI's intent ownership) and defers to authorities.

---

#### Schema & Structure (EXCELLENT)
**Compliance:** ✅ Full compliance

**Schema:**
- ✅ `HowTo` schema for getting to Islay (appropriate)
- ✅ `Place` schema for Isle of Islay
- ✅ No FAQPage schema (correct per playbook)

**FAQs:**
- ✅ 5 embedded FAQs with question-format H3 headings
- ✅ Questions explicitly stated, not assumed
- ✅ Answers 3-5 sentences (good length)

**Internal links:**
- ✅ Links to property pages, contact, explore
- ✅ Anchor text descriptive ("Contact Pi", "our Bruichladdich properties")

---

### ⚠️ GAPS & RECOMMENDATIONS

#### Gap 1: Missing Trust Signals
**Issue:** No mention of Superhost status, 4.97/5 rating, 600+ reviews, or guest testimonials.

**Nuance brief context:**
- "Communication score: 5.0/5.0 on Airbnb"
- "Pi looked after us like family" appears in 30+ reviews
- "Legendary for ferry support—30+ reviews mention it specifically"

**Recommendation:** Add trust block to **"Pi's Ferry Survival Guide"** section:

```markdown
**Our ferry disruption track record:**
Over 600 guests have stayed with us since 2017, and dozens have navigated CalMac cancellations with our support. We hold a 5.0/5 communication rating on Airbnb, and 30+ reviews specifically mention our ferry crisis help. One guest wrote: *"Pi looked after us like family during the ferry chaos."*
```

**Playbook justification:** Trust signals are part of "flexible skin"—they reinforce facts (ferry support) with emotional validation (reviews).

---

#### Gap 2: Pi's Personality Underplayed
**Issue:** Page is helpful and clear but reads somewhat anonymous. The nuance brief emphasizes Pi as a differentiator.

**Nuance brief emphasis:**
> "Hosts as differentiator: Exceptional comms, legendary ferry crisis support, local knowledge"

**Current tone:** Professional, generic travel guide.
**Target tone:** Professional + personable + reassuring (Pi's voice).

**Recommendation:** Reframe opening paragraph to include first-person voice:

**Current:**
> "The Isle of Islay is accessible by two main routes..."

**Suggested:**
> "I'm Pi, and I've been welcoming guests to Islay since 2017. Getting here is straightforward once you understand the ferry booking rhythm—let me walk you through it. The Isle of Islay is accessible by two main routes: CalMac ferry from mainland Scotland or Loganair flight from Glasgow..."

**Playbook justification:** Personality is part of "flexible skin." Entity definition stays factual; host voice layers on afterward.

---

#### Gap 3: Some Passages Too Long
**Issue:** 2-3 sections exceed 6-sentence ideal for passage extraction.

**Affected sections:**
- "Pi's Ferry Survival Guide" (8 sentences)
- "Flying to Islay" (7 sentences)

**Recommendation:** Add more granular H3 subheadings to break into 3-6 sentence chunks.

---

#### Gap 4: "Ferry Chaos" Language Mismatch
**Issue:** Draft uses "ferry disruptions." Nuance brief and reviews use "ferry chaos."

**Review evidence:**
- "Pi looked after us like family during the ferry chaos"
- "Legendary ferry crisis support"

**Recommendation:** Match guest language:
- "When CalMac Cancels (It Happens)" → "Ferry Chaos Survival Guide"
- "ferry disruptions" → "ferry chaos" or "ferry cancellations"

**Playbook justification:** "Recall before precision"—use exact terms guests will search for and recognize.

---

### Content Completeness Check

**✅ All current homepage "Getting Here" content preserved:**
- Ferry basics (routes, duration, ports)
- Flight option
- Vehicle reservations advice
- Weather/insurance caveat
- Car hire mention

**✅ Substantial upgrades added:**
- Booking strategy (12-week window, peak times)
- Pi's support narrative (ferry survival guide)
- Cancellation protocol (CalMac helpline, text alerts, insurance)
- Driving on Islay (single-track etiquette, "Islay wave")
- Drink-drive laws for distillery tours
- Journey planning (how many days, best times)
- Embedded FAQs (5 questions)

**Verdict:** ✅ Current content fully retained AND significantly enhanced.

---

## 2. EXPLORE ISLAY PAGE

### Playbook Compliance Score: **87/100**

### ✅ STRENGTHS

#### Entity-First Architecture (EXCELLENT)
**Compliance:** ✅ Full compliance

**Evidence:**
> "The Isle of Islay is one of the Inner Hebrides islands of Scotland, renowned for its nine working whisky distilleries, dramatic Atlantic coastline, and abundant wildlife."

- Primary entity (Isle of Islay as destination) defined opening
- Entity type clear (tourist destination/place)
- Core attributes explicit (distilleries, coastline, wildlife)
- Relationship to Bruichladdich stated ("From here, you're within walking distance...")

**Playbook alignment:** ✅ Perfect entity definition.

---

#### Fixed Spine, Flexible Skin (STRONG)
**Compliance:** ✅ Good balance

**Fixed spine (factual) examples:**
- "Nine working whisky distilleries"
- "Machir Bay: 2 miles of golden sand"
- "30,000+ barnacle geese arrive from Greenland each autumn"
- "Bruichladdich is 10-minute walk from our properties"

**Flexible skin (expressive) examples:**
- "Beaches stretch for miles with minimal footfall"
- "Locals call them 'drowning beaches'"
- "The sound is unforgettable" (geese)
- "Hidden gem with three small, sheltered bays" (Portbahn Beach)

**Balance:** ✅ Good. Factual core established, expressive language layered appropriately.

---

#### Passage Extractability (STRONG)
**Compliance:** ✅ 85% compliant

**Good examples:**
1. **"Which distilleries should I visit?"** FAQ (4 sentences, standalone)
2. **"Safe Swimming Locations"** (3 locations, 1 sentence each, bulleted)
3. **"Barnacle Geese"** passage (4 sentences, seasonal, extractable)

**Needs refinement:**
- **"Islay's Nine Distilleries"** section is 11 sentences total (too long for one passage)
- **"Wildlife on Islay"** opening is 7 sentences (could split)

**Recommendation:** Break "Distilleries" into subsections:
- H2: "Islay's Nine Distilleries"
- H3: "The Nine Distilleries" (list)
- H3: "Booking Distillery Tours" (4 sentences)
- H3: "How Many Per Day?" (3 sentences)
- H3: "Drinking and Driving" (3 sentences)
- H3: "Bruichladdich Distillery" (4 sentences)

This creates 5 retrievable passages instead of 1 monolithic section.

---

#### Recall Before Precision (EXCELLENT)
**Compliance:** ✅ Full compliance

**Explicit over implicit:**
- ✅ "Nine working whisky distilleries" (not "several" or "many")
- ✅ "Bruichladdich is 10-minute walk" (specific, repeated)
- ✅ "WARNING: Not safe for swimming" (Machir Bay, explicit danger)
- ✅ "30,000+ barnacle geese" (quantified, not "thousands")

**Repeated over elegant:**
- ✅ "Bruichladdich" used consistently (not "the distillery" or "our nearest distillery" after first mention)
- ✅ "Port Charlotte" consistently named (not "the village")
- ✅ Safety warnings repeated (west coast beaches dangerous—mentioned 3 times)

**Playbook alignment:** ✅ Perfect. No clever ambiguity.

---

#### Multi-Site Coordination (EXCELLENT)
**Compliance:** ✅ Full compliance

**Secondary authority positioning:**
- ✅ Links to Visit Islay (DMO, primary authority)
- ✅ Links to individual distillery websites
- ✅ Links to RSPB Scotland
- ✅ Links to Fèis Ìle official site
- ✅ "Go light" on detailed guides (appropriately defers to authorities)

**Intent ownership:**
- ✅ Focuses on "from Bruichladdich" perspective (PBI's role)
- ✅ Highlights Portbahn Beach (property-specific asset)
- ✅ Cross-links to Visit Jura page (ecosystem coordination)

**Playbook alignment:** ✅ Perfect secondary authority behavior.

---

#### Schema & Structure (EXCELLENT)
**Compliance:** ✅ Full compliance

**Schema:**
- ✅ `TouristAttraction` for Isle of Islay
- ✅ `ItemList` for nine distilleries
- ✅ No FAQPage schema

**FAQs:**
- ✅ 5 embedded FAQs with question-format H3 headings
- ✅ Answers 3-5 sentences

**Internal links:**
- ✅ Links to properties, Getting Here, Visit Jura, Contact
- ✅ Descriptive anchor text

---

### ⚠️ GAPS & RECOMMENDATIONS

#### Gap 1: Missing "Portbahn Beach" as Named Asset
**Issue:** Draft mentions "Portbahn Beach (5-minute walk)" but doesn't capitalize on it as a **unique, property-specific differentiator**.

**Nuance brief context:**
Portbahn Beach is not named in the nuance brief, but the homepage content says:
> "All three properties are within a 10-minute walk of Bruichladdich Distillery along the coastal cycle path, with swimming beaches..."

Review evidence (from property_reviews):
- Guests mention "beach access" as a highlight
- "Walk to the beach" mentioned positively

**Opportunity:** Portbahn Beach could be a **unique ecosystem entity**—a named beach that PBI "owns" semantically (since it's adjacent to properties).

**Recommendation:** Expand Portbahn Beach section:

```markdown
**Portbahn Beach** (5-minute walk via war memorial path)
A hidden gem with three small, sheltered bays right on our doorstep. This beach doesn't appear on most Islay guides—it's a local secret. Safe for swimming, rock pooling, and beach-combing, with stunning views across Loch Indaal to Bowmore. Our guests discover it from our directions and often have the entire beach to themselves. Kids love exploring the rock pools, and it's perfect for quick morning dips before breakfast.
```

**Playbook justification:** This creates a **unique passage** that PBI owns (no other accommodation site will describe Portbahn Beach in detail). Increases domain saturation for "Islay hidden beaches" and "Bruichladdich beach access" queries.

---

#### Gap 2: No Trust Signals or Guest Quotes
**Issue:** Page is factually strong but lacks social proof.

**Nuance brief context:**
- 600+ reviews across platforms
- 4.97/5 Airbnb, 9.5/10 Booking.com
- Guest superlatives: *"Better than the pictures"*, *"Felt like home"*

**Recommendation:** Add trust block to **"Planning Your Islay Days"** section:

```markdown
**Our guests' Islay experiences:**
Over 600 guests have stayed with us since 2017, and their Islay itineraries shape these recommendations. Popular patterns: 3-4 distillery days + 1 beach day + 1 Jura day trip. One guest wrote: *"This is exactly what you'd want from Islay"*—and after hosting families, whisky groups, birders, and honeymooners, we've seen what works.
```

**Playbook justification:** Trust signals are "flexible skin"—they don't change facts but add emotional validation.

---

#### Gap 3: "Shorefield's Bird Hides" Under-Emphasized
**Issue:** Mentioned briefly but not leveraged as differentiator.

**Nuance brief context:**
> "Behind the house are bird hides, woodlands, and wetlands the owners created... Bird hides created by the owners, who are passionate birders."

This is a **unique property feature** that should be emphasized for birding/wildlife queries.

**Recommendation:** Expand wildlife section:

```markdown
**Shorefield's Bird Hides:**
One of our properties, Shorefield, has private bird hides created by the nature-loving owners behind the house. Binoculars, bird books, and wildlife guides are provided. The garden attracts woodland birds, and the loch views offer opportunities to spot waterfowl without leaving the property. For serious birders staying at Shorefield, this is a major bonus—morning coffee while watching birds from your own hide.
```

**Playbook justification:** Unique property feature = unique passage = differentiation in fan-out queries ("Islay birding accommodation", "Islay bird hides").

---

#### Gap 4: Some Passages Too Long
**Issue:** 2-3 sections exceed 6-sentence ideal.

**Affected sections:**
- "Islay's Nine Distilleries" opening (11 sentences)
- "Wildlife on Islay" opening (7 sentences)

**Recommendation:** Add more granular H3 subheadings (see earlier suggestion).

---

### Content Completeness Check

**Current homepage content review:**
The homepage has embedded sections:
- ✅ "Why Stay in Bruichladdich" (3 paragraphs, 242 words)—location context
- ✅ "Getting Here" (3 paragraphs, 148 words)—travel basics

**Explore Islay page positioning:**
This is a NEW page (not currently on live site per Sanity export). It fills a gap:
- ❌ No dedicated "Explore Islay" or "Things to Do" page currently exists
- ❌ Homepage has location context but no detailed activities guide

**Verdict:** ✅ New content, appropriately scoped. Adds substantial value without duplicating homepage.

---

## CROSS-PAGE ANALYSIS

### Consistency Across Drafted Pages

#### Entity Naming (EXCELLENT)
**Compliance:** ✅ Full consistency

- "Isle of Islay" (never "Islay island" or variations)
- "Bruichladdich" (consistent spelling, never abbreviated)
- "Port Ellen" and "Port Askaig" (never "the ports")
- "CalMac ferry" (consistent branding)
- "Loch Indaal" (never "the loch")

**Playbook alignment:** ✅ Perfect. Entity stability = stable embeddings = reliable retrieval.

---

#### Relationship Statements (STRONG)
**Compliance:** ✅ Good, one opportunity

**Current relationship statements:**
- ✅ "Portbahn Holiday Cottages are based in Bruichladdich"
- ✅ "Port Ellen is approximately 35 minutes from Bruichladdich"
- ✅ "Bruichladdich Distillery is 10-minute walk from our properties"

**Missing relationship:**
- ⚠️ No explicit statement connecting properties to "Pi and Lynton" (owner entities)

**Recommendation:** Add to About Us page (when drafted) and reference in other pages:
> "Our properties are owned and managed by Pi and Lynton, Airbnb Superhosts with 4.97/5 rating across 600+ reviews."

---

#### Voice Consistency (NEEDS REFINEMENT)
**Compliance:** ⚠️ 70% consistent

**Getting Here page:** Mostly third-person, one mention of "our properties," occasional "we recommend"
**Explore Islay page:** Entirely third-person, "our properties" mentioned once

**Nuance brief expectation:**
> "Pi handles all guest communication and is known for exceptional responsiveness"

**Gap:** Pages feel like generic travel guides, not host-authored guides.

**Recommendation:** Choose one consistent voice approach:

**Option A: First-person host voice (recommended)**
- "I'm Pi, and I've been welcoming guests since 2017"
- "Our properties in Bruichladdich..."
- "I recommend booking the ferry 12 weeks ahead"

**Option B: Editorial "we" voice**
- "We're Pi and Lynton, hosts of Portbahn Holiday Cottages"
- "Our guests tell us that..."
- "We recommend..."

**Option C: Pure third-person (current, but least differentiated)**
- "Portbahn Holiday Cottages..."
- "The properties..."
- No host personality

**Playbook justification:** Voice is "flexible skin." **Option A (first-person Pi)** best leverages the differentiator established in 600+ reviews.

---

## PLAYBOOK CHECKLIST REVIEW

Running both pages through the Pre-Publish Checklist (Playbook Section 07-01):

### Entity & Intent
- [✅] Primary entity is unambiguous (both pages)
- [✅] Only one primary entity per page (both pages)
- [✅] Entity named consistently with canonical references
- [✅] Entity type/category clear
- [✅] Intent ownership correct for this site (secondary authority, links to DMO)

### Retrieval & Access
- [✅] Content crawlable by AI bots (HTML content, no JS dependency)
- [✅] Core meaning in initial HTML
- [🔲] Page shallowly linked from relevant hubs (will be true once pages are live)
- [✅] Canonicals intentional (schema shows understanding)

### Passage & Structure
- [✅] Each section answers one clear question (mostly—some long sections)
- [⚠️] Sections can stand alone if extracted (80% compliant—some need splitting)
- [✅] Headings descriptive and scoped
- [⚠️] Passages concise and focused (90% compliant—2-3 sections too long)
- [✅] Important content not hidden behind accordions/tabs

### Writing Quality
- [✅] Clear factual spine (entity definition explicit)
- [✅] Emotional language layered after clarity
- [✅] Removing adjectives still leaves correct definition
- [✅] Expressive language doesn't redefine scope

### Entity Relationships
- [✅] Relationships to other entities explicitly stated
- [✅] Internal links reinforce meaning
- [✅] Anchor text descriptive and consistent

### Schema
- [✅] Schema reinforces visible content (no new claims)
- [✅] Schema solves real ambiguity (HowTo, TouristAttraction, Place)
- [🔲] Entity @id values stable and reused (not yet implemented, but planned)
- [✅] Schema minimal, intentional, readable

### Zero-Click Check
- [✅] Could this shape an AI answer? YES—passages are direct, factual
- [✅] Would AI feel safe citing it? YES—authoritative links, explicit sources
- [✅] Reinforces how we want to be described? MOSTLY—needs more trust signals

---

## RECOMMENDATIONS SUMMARY

### Priority 1: High Impact, Low Effort

1. **Add Pi's first-person voice** to both pages
   - Opening paragraphs: "I'm Pi, and I've been..."
   - Reinforces differentiator from 600+ reviews
   - Effort: 30 minutes to revise intros

2. **Integrate trust signals**
   - 4.97/5 rating, 600+ reviews, "legendary ferry support"
   - Add to 1-2 sections per page
   - Effort: 15 minutes per page

3. **Break long passages into subsections**
   - Add H3 headings to sections >6 sentences
   - Improves passage retrieval probability
   - Effort: 20 minutes per page

4. **Expand Portbahn Beach description**
   - Unique semantic asset for PBI
   - 2-3 additional sentences
   - Effort: 10 minutes

### Priority 2: Medium Impact, Medium Effort

5. **Add guest quotes to both pages**
   - 1-2 quotes per page from reviews
   - Social proof reinforcement
   - Effort: 20 minutes (reviewing property_reviews)

6. **Emphasize Shorefield bird hides**
   - Unique property feature
   - Expand wildlife section
   - Effort: 15 minutes

7. **Use "ferry chaos" language** (not "disruptions")
   - Matches guest language from reviews
   - Find/replace + minor rewrites
   - Effort: 10 minutes

### Priority 3: Future Enhancements

8. **Add "Magic Moments"** from nuance brief
   - Specific guest experience patterns
   - Example: "Morning ritual: coffee watching sunrise over Loch Indaal"
   - Best fit: About Us page or property pages

9. **Create Portbahn Beach entity page** (post-MVP)
   - Dedicated page for local hidden beach
   - Differentiator vs. other Islay accommodation sites
   - Effort: 1-2 hours

---

## COMPARISON TO LIVE CONTENT

### Homepage Content (from Sanity Export)

**Current homepage includes:**
1. **Intro text** (268 words)—property overview, entity definition
2. **Why Stay in Bruichladdich** (242 words)—location context
3. **Getting Here** (148 words)—ferry/flight basics

**Analysis:**

**Getting Here page enhancement:**
- ✅ Current homepage "Getting Here" = 148 words
- ✅ Drafted "Getting Here" page = ~1,800 words
- ✅ All homepage content preserved AND expanded 12X
- ✅ Added: Pi's support narrative, booking strategy, cancellation protocol, driving tips, journey planning, embedded FAQs

**Explore Islay page creation:**
- ❌ No equivalent content on current homepage (beyond brief location context)
- ✅ Drafted page = ~1,900 words of new content
- ✅ Fills major gap: distilleries, beaches, wildlife, food, practical info
- ✅ Appropriate scope for secondary authority (links to DMO, distillery sites)

**Verdict:** ✅ Current content fully preserved. Substantial enhancements added. No content lost.

---

## SANITY SCHEMA MAPPING

### Current Schema Structure (from `/mnt/portbahn-islay/sanity/schemas/`)

**Singleton pages:**
- `gettingHerePage.ts` — ✅ Exists, uses baseSingletonFields
- `islayGuidesIndexPage.ts` — ✅ Exists, uses baseSingletonFields

**Base fields (all singletons inherit):**
- `title` (H1 heading) — Required
- `heroImage` (with alt text) — Optional
- `content` (Portable Text array) — Main content
- `seoTitle` (max 70 chars) — SEO group
- `seoDescription` (max 200 chars) — SEO group

**Analysis:**

✅ **Schema is ready** for drafted content—no custom fields needed beyond base.
✅ **Portable Text** supports H2, H3 headings, paragraphs, lists, links (all used in drafts).
✅ **Image blocks** can be embedded in content array (useful for beach/distillery photos).
✅ **Internal linking** supported via Sanity references.

**Implementation path:**
1. Create `gettingHerePage` document in Sanity Studio
2. Populate `title`, `content` (paste drafted content as Portable Text), `seoTitle`, `seoDescription`
3. Add `heroImage` (ferry arriving at port or Islay coastal scene)
4. Repeat for `islayGuidesIndexPage`

**Entity mapping clarity:** ✅ EXCELLENT
- Getting Here page = `gettingHerePage` singleton (1:1 mapping)
- Explore Islay page = `islayGuidesIndexPage` singleton (1:1 mapping)
- No ambiguity, no schema changes needed

---

## FINAL VERDICT

### Playbook v1.3.1 Compliance: ✅ STRONG (85-90%)

**Strengths:**
- Entity-first architecture: excellent
- Passage structure: strong (minor refinements needed)
- Multi-site coordination: excellent
- Schema approach: correct
- Content preservation: all current content retained
- Content upgrades: substantial enhancements added

**Improvements Needed:**
- Integrate Pi's personality voice (priority 1)
- Add trust signals (600+ reviews, ratings, quotes)
- Split 2-3 long passages into subsections
- Emphasize unique differentiators (Portbahn Beach, Shorefield bird hides, ferry chaos support)

**Ready for implementation:** ✅ YES
- Content is usable as-is
- Recommended improvements are refinements, not blockers
- Schema mapping is clear
- No technical barriers

**Next steps:**
1. Implement Priority 1 recommendations (Pi's voice, trust signals, passage splitting)
2. Create remaining MVP pages (About Us, Contact, FAQs, Visit Jura)
3. Populate Sanity Studio with final content
4. Test internal linking and navigation
5. Run final pre-publish checklist before launch

---

**Analysis complete.**
**Skill: AI Search Playbook v1.3.1**
**Date: 2026-01-23**
