# Option B Questions - Quick Decisions for 10/10 Implementation

**Purpose:** 5 minutes of your input will get us from 9/10 to 10/10
**Based on:** Tone of Voice v1.2, Playbook v1.3.1, Entity audit

---

## QUESTION 1: Hub Page Intro Scope Statements

I need to add explicit "what this page is" statements to each hub page. Using your tone of voice guide, here are my drafts. **Which sounds better for each?**

### `/explore-islay` - Pick A or B:

**Option A (Conversational, "we" voice):**
> "Having lived and worked on Islay for a number of years, we know the island well. This guide covers activities, attractions and experiences across Islay - from whisky distilleries to hidden beaches. Islay is one of the Inner Hebrides islands of Scotland, renowned for its ten working whisky distilleries, dramatic Atlantic coastline and abundant wildlife."

**Option B (More direct):**
> "This guide covers what to see and do on Islay. Islay is one of the Inner Hebrides islands of Scotland, renowned for its ten working whisky distilleries, dramatic Atlantic coastline and abundant wildlife. From our Bruichladdich properties, you're perfectly positioned to explore everything the island offers."

**Your choice:** A / B / Other (write alternative)

---

### `/getting-here` - Pick A or B:

**Option A (Adventure framing, matches tone guide example):**
> "Travel to Islay is not straightforward - you don't come to the Scottish islands if you want easy. This guide covers all your travel options for reaching Islay by ferry or flight. Whether you choose the scenic CalMac ferry crossing or a quick Loganair flight from Glasgow, we're here to help make your journey smooth."

**Option B (More practical):**
> "This guide covers travel options and planning for reaching the Isle of Islay. Reaching Islay is part of the adventure. Whether you choose the scenic ferry crossing or a quick flight from Glasgow, we're here to help make your journey smooth. Our comprehensive ferry support service ensures you never miss a sailing."

**Your choice:** A / B / Other (write alternative)

---

### `/accommodation` - Pick A or B:

**Option A (Direct property focus):**
> "We offer three unique self-catering holiday properties in Bruichladdich. Portbahn House is our family home. Shorefield is the Jacksons' creation - they built it, planted every tree, created the bird hides. Curlew Cottage is Alan's family retreat. These aren't purpose-built rentals - they're real family homes with personality."

**Option B (Current + scope statement added):**
> "This page shows our three holiday properties in Bruichladdich. We offer three unique holiday properties in Bruichladdich, each with its own character and charm. All are perfectly positioned to explore Islay's distilleries, beaches and wildlife."

**Your choice:** A / B / Other (write alternative)

---

## QUESTION 2: Section Headings (H2 before card grids)

**Context:** Playbook says hub pages need descriptive H2 headings before card grids for better AI passage extraction.

### `/explore-islay` - Pick one:

- A) "Islay Activities and Attractions"
- B) "What to See and Do on Islay"
- C) "Explore Islay"
- D) Other: _______________

---

### `/getting-here` - Pick one:

- A) "Ways to Reach Islay"
- B) "Travel Options"
- C) "Ferry and Flight Guides"
- D) Other: _______________

---

### `/accommodation` - Pick one:

- A) "Our Holiday Properties"
- B) "Self-Catering Accommodation in Bruichladdich"
- C) "Three Family Homes"
- D) Other: _______________

---

## QUESTION 3: Entity Naming Consistency

**Found inconsistency:** "Shorefield" vs "Shorefield Eco House"

**Your tone guide says:**
- Body copy: "Shorefield"
- Page titles: "Shorefield Eco House"

**But I found variations in code:**
- "Shorefield House" (in one place)
- "Shorefield Eco-House" (hyphenated)
- "Shorefield Eco House" (no hyphen)

**DECISION NEEDED:**

1. **For H1 page titles**, which is correct?
   - [ ] "Shorefield Eco House" (no hyphen)
   - [ ] "Shorefield Eco-House" (with hyphen)

2. **For body text**, confirm:
   - [ ] Always use "Shorefield" (no suffix)

3. **For schema.org markup**, which?
   - [ ] "Shorefield Eco House"
   - [ ] "Shorefield"

**Your answer:**

---

## QUESTION 4: Islay Entity Naming Rule

**Context:** Playbook wants consistency in entity naming (first mention vs subsequent).

**Current practice** (seems good, just confirming):
- Formal contexts: "Isle of Islay"
- Casual/subsequent: "Islay"

**Example from proposed intro:**
> "This guide covers activities on Islay. Islay is one of the Inner Hebrides islands of Scotland..."

Should I:
- A) ✓ Keep as-is (casual "Islay" in scope, formal "Islay is..." in definition)
- B) Change to: "...activities on the Isle of Islay. The Isle of Islay is one of..."
- C) Change to: "...activities on Islay. The island is one of..." (avoid repetition)

**Your choice:** A / B / C

---

## QUESTION 5: "Portbahn Islay" vs "Portbahn"

**Context:** Your tone guide says distinguish "Portbahn House" from "Portbahn Beach" and "Portbahn Islay" (the brand).

**Found in code:**
- Schema uses: "Portbahn Islay Accommodation"
- Some places: "Portbahn Islay" (brand/organization)
- Some places: "Portbahn" (shorthand)

**DECISION NEEDED - When referring to the BUSINESS (not the house), which?**

Example sentences:
1. "Portbahn Islay has been hosting guests since 2017"
2. "Portbahn has been hosting guests since 2017"
3. "We've been hosting guests since 2017" (no brand name)

**Your preference:** 1 / 2 / 3

---

## QUESTION 6: Guide Page Schema Type

**Context:** Guide pages (like `/guides/ferry-to-islay`) currently have NO schema. I'm adding it.

**Best type for guides?**

- A) `Article` (general content)
- B) `HowTo` (for actionable guides like ferry/flights)
- C) `TouristAttraction` (for attraction guides like distilleries)
- D) Mix: Use `HowTo` for travel guides, `Article` for attraction guides

**Your choice:** A / B / C / D

---

## BONUS QUESTION 7 (Optional): Hub Page Component Consolidation

**Context:** All three hub pages have nearly identical code (~700 lines duplicated).

**Phase 2 recommendation:** Extract to reusable `HubPage` component.

**Decision:** Do this NOW (Phase 1) or LATER (Phase 2)?

- A) Do it NOW (cleaner, takes +1 hour)
- B) Do it LATER (faster deployment, refactor after content is perfect)

**Your choice:** A / B

---

## SUMMARY

**Time to complete:** ~5 minutes
**Impact:** Gets us from 9/10 → 10/10 on first deploy

**After you answer these, I will:**
1. Implement all technical fixes
2. Add your exact content choices
3. Update all schema.org markup
4. Run build test
5. Commit with detailed summary

**Estimated implementation time:** 20-30 minutes after receiving your answers.

---

**Please reply with:**

Q1: /explore-islay: A / B / Other
Q1: /getting-here: A / B / Other
Q1: /accommodation: A / B / Other
Q2: /explore-islay: A / B / C / D
Q2: /getting-here: A / B / C / D
Q2: /accommodation: A / B / C / D
Q3: Title format, Body format, Schema format
Q4: A / B / C
Q5: 1 / 2 / 3
Q6: A / B / C / D
Q7: A / B (optional)
