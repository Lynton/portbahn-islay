# Content Architecture — MVP
**Date:** 2026-01-26
**Status:** For sign-off before implementation

---

## Site Structure Overview

```
PAGES
├── / (Homepage)
├── /accommodation/portbahn-house
├── /accommodation/shorefield-eco-house
├── /accommodation/curlew-cottage
├── /getting-here
├── /explore-islay
├── /jura (NEW)
├── /about (NEW)
└── /contact

CANONICAL BLOCKS (reusable content)
├── Entity blocks (places, activities)
├── Trust blocks (credentials, support)
└── Property cards (comparison component)
```

---

## Canonical Blocks — Full List

### TIER 1: Core Blocks (existing content, refined)

| Block ID | Entity Type | Canonical Home | Teaser Used On |
|----------|-------------|----------------|----------------|
| `ferry-basics` | Travel | Getting Here | Homepage, Property pages |
| `ferry-support` | Trust/Service | Getting Here | Homepage, Property FAQs |
| `trust-signals` | Credibility | Homepage | Property pages, About |
| `bruichladdich-proximity` | Location | Homepage | Property pages, Explore Islay |
| `portbahn-beach` | Place | Explore Islay (Beaches) | Homepage, Property pages |
| `shorefield-character` | Property | Shorefield page | Homepage, Explore Islay |
| `port-charlotte-village` | Place | Homepage | Property pages |
| `distilleries-overview` | Activity | Explore Islay | Homepage, Property FAQs |
| `wildlife-geese` | Nature | Explore Islay | Homepage |

### TIER 2: New Blocks (to create for MVP)

| Block ID | Entity Type | Canonical Home | Teaser Used On |
|----------|-------------|----------------|----------------|
| `food-drink-islay` | Activity | Explore Islay | Homepage |
| `beaches-overview` | Place | Explore Islay | Homepage |
| `families-children` | Activity | Explore Islay | Homepage, Property pages |
| `jura-day-trip` | Activity | Jura page | Explore Islay, Getting Here |
| `jura-longer-stay` | Activity | Jura page | — |
| `bothan-jura-teaser` | Property | Jura page | Homepage, Explore Islay |
| `about-us` | Trust | About page | — |

### TIER 3: Property Components (not blocks, but reusable)

| Component | Description | Used On |
|-----------|-------------|---------|
| `property-card` | Summary card with key info, image, CTA | Homepage, Compare section, Explore Islay |

---

## Page-by-Page Content Structure

### Homepage `/`

| Section | Content Type | Source |
|---------|--------------|--------|
| Hero | Custom | Page-specific |
| Welcome (Pi & Lynton intro) | Custom | Page-specific |
| Three Homes | Property cards × 3 | Component |
| Track Record | `trust-signals` FULL | Block |
| Why Bruichladdich | `bruichladdich-proximity` FULL + `port-charlotte-village` FULL | Blocks |
| Getting Here | `ferry-basics` TEASER | Block |
| Ready to Book | Custom CTA | Page-specific |

---

### Getting Here `/getting-here`

| Section | Content Type | Source |
|---------|--------------|--------|
| Pi's Welcome | Custom | Page-specific |
| Travel Overview | `ferry-basics` FULL | Block (canonical home) |
| Booking the Ferry | Custom | Page-specific |
| Ferry Survival Guide | Custom | Page-specific |
| Ferry Chaos Support | `ferry-support` FULL | Block (canonical home) |
| Flying to Islay | Custom | Page-specific |
| Getting Around Islay | Custom | Page-specific |
| Planning Your Journey | Custom | Page-specific |
| FAQs | Embedded Q&A | Page-specific |

---

### Explore Islay `/explore-islay`

| Section | Content Type | Source |
|---------|--------------|--------|
| Pi's Introduction | Custom | Page-specific |
| Distilleries | `distilleries-overview` FULL | Block (canonical home) |
| Beaches | `beaches-overview` FULL | Block (canonical home) — **NEW** |
| Wildlife | `wildlife-geese` FULL + eagles, seals, Shorefield hides | Block + custom |
| Food & Drink | `food-drink-islay` FULL | Block (canonical home) — **NEW** |
| Families & Children | `families-children` FULL | Block (canonical home) — **NEW** |
| Practical Info | Custom (weather, packing, signal) | Page-specific |
| Day Trip to Jura | `jura-day-trip` TEASER | Block |
| FAQs | Embedded Q&A | Page-specific |

---

### Jura Page `/jura` — **NEW**

| Section | Content Type | Source |
|---------|--------------|--------|
| Intro to Jura | Custom | Page-specific |
| Day Trip from Islay | `jura-day-trip` FULL | Block (canonical home) |
| Staying Longer on Jura | `jura-longer-stay` FULL | Block (canonical home) |
| Stay at Bothan Jura Retreat | `bothan-jura-teaser` FULL | Block (canonical home) |
| FAQs | Embedded Q&A | Page-specific |

---

### About Page `/about` — **NEW**

| Section | Content Type | Source |
|---------|--------------|--------|
| Pi & Lynton Story | `about-us` FULL | Block (canonical home) |
| Photo | Image | Page-specific |
| Our Philosophy | Custom | Page-specific |
| The Homes We Manage | Property cards × 3 | Component |
| Bothan Jura Retreat | `bothan-jura-teaser` TEASER | Block |

---

### Property Pages `/accommodation/[slug]`

| Section | Content Type | Source |
|---------|--------------|--------|
| Hero + Gallery | Custom | Property-specific |
| Description | Custom | Property-specific |
| Facilities | Custom | Property-specific |
| Location | `bruichladdich-proximity` TEASER | Block |
| Local Area | `port-charlotte-village` TEASER | Block |
| Nearby Beach | `portbahn-beach` TEASER | Block |
| FAQs | Property-specific Q&A | Property-specific |
| Booking/Availability | Custom | Property-specific |

---

## New Content to Create

### 1. Food & Drink Block (`food-drink-islay`)

**Full Version (for Explore Islay):**

Needs to cover:
- **Port Charlotte:** Lochindaal Seafood Kitchen (order platter 24h ahead), Port Charlotte Hotel (whisky bar, live music Wed/Sun)
- **Portnahaven:** An Tigh Seinnse (traditional pub, seals in harbour)
- **Bowmore:** Peatzeria (wood-fired pizza), Chinese/Indian takeaways, bakery, butcher
- **Distillery cafés:** Ardbeg (great café, lunch stop), Ardnahoe (visitor centre, food & drink), Kilchoman (café, farm distillery)
- **Local shops:** Aileen's/Debbie's in Bruichladdich (coffee, bacon rolls, institution), Bowmore Co-op
- **Jean's Fish Van:** Weekly visits

**Teaser Version:**
> Islay's food scene emphasises local seafood, lamb, and whisky. Don't miss Lochindaal Seafood Kitchen in Port Charlotte (order the platter 24h ahead) and the distillery cafés at Ardbeg and Kilchoman. [Full food guide →](/explore-islay#where-to-eat-on-islay)

---

### 2. Beaches Block (`beaches-overview`)

**Full Version (for Explore Islay):**

Expand current content to include:
- **Portbahn Beach** — our hidden gem, 5 min walk, 3 sheltered bays, safe swimming, rock pools
- **Port Charlotte Beach** — 5 min drive, family-friendly, shallow, sandy
- **Machir Bay** — Islay's most famous, 2 miles golden sand, dramatic but NOT SAFE FOR SWIMMING
- **Saligo Bay** — dramatic Atlantic, NOT SAFE FOR SWIMMING
- **Sanaigmore** — rock formations, art gallery with coffee/cakes
- **Ardnave Point** — massive sand dunes (ADD)
- **Airport Beach / Laggan Bay** — long, shallow, sandy, safe (ADD)
- **Port Ellen town beach** — convenient (ADD)
- **Kilnaughton Bay** — family-friendly, safe, near Port Ellen (ADD)
- **Singing Sands** — beautiful remote beach (ADD)
- **Claggain Bay** — secluded, lovely walk (ADD)

**Safety warning** for Atlantic beaches must be prominent.

**Teaser Version:**
> Islay has dozens of beaches — from our hidden gem Portbahn Beach (5-minute walk, safe swimming) to dramatic Machir Bay (stunning but not safe for swimming). [Beach guide →](/explore-islay#islays-beaches)

---

### 3. Families & Children Block (`families-children`)

**Full Version (for Explore Islay):**

- **Safe beaches:** Portbahn Beach (rock pools), Port Charlotte Beach (shallow, sandy), Kilnaughton Bay, Laggan Bay
- **Playgrounds:** Port Mor playground in Port Charlotte, others?
- **Activities:** Pottery painting at Persabus Pottery, Islay Woollen Mill
- **Swimming:** Mactaggart Leisure Centre (indoor pool)
- **Wildlife:** Rock pooling, seal spotting, geese (Oct-Apr)
- **Distillery cafés:** Family-friendly lunch stops (Ardbeg, Kilchoman)

**Teaser Version:**
> Islay is great for families — safe beaches with rock pools, the swimming pool at Mactaggart Leisure Centre, pottery painting at Persabus, and playgrounds in Port Charlotte. [Family activities →](/explore-islay#families-children)

---

### 4. Jura Day Trip Block (`jura-day-trip`)

**Full Version (for Jura page):**

- **Getting there:** 5-minute ferry from Port Askaig (no booking needed for foot passengers, short queue for cars)
- **Jura Distillery:** Tour and tasting
- **Lunch:** Antlers (pub food) or Jura Hotel (restaurant)
- **Activities:** Hire bikes and cycle to Small Isles Bay / Corran Sands, walk the coastal path
- **Wildlife:** Red deer everywhere (6,000+ deer, ~200 people)
- **Views:** Paps of Jura dominate the skyline
- **Return:** Last ferry times (check timetable)

**Teaser Version:**
> A 5-minute ferry from Port Askaig takes you to Jura — visit the distillery, lunch at the Antlers, cycle to Small Isles Bay. It feels like a different world. [Jura day trip guide →](/jura)

---

### 5. Jura Longer Stay Block (`jura-longer-stay`)

**Full Version (for Jura page):**

- **Barnhill:** Where Orwell wrote 1984, remote northern tip
- **Corryvreckan:** Third largest whirlpool in the world, visible from northern tip
- **West coast walk:** Remote, dramatic, challenging
- **Climb a Pap:** Beinn an Oir (highest), serious hill walk
- **K Foundation:** The boathouse where the KLF burned £1 million
- **Wildlife:** Red deer, eagles, seals
- **Pace:** Even slower than Islay — proper escape

---

### 6. Bothan Jura Retreat Block (`bothan-jura-teaser`)

**Full Version (for Jura page):**

- **What it is:** Our passion project on Jura — the kind of place we'd want to escape to ourselves
- **Accommodation:** Old renovated stone cotters' cottage, lodge, cabin, shepherd's hut — each sleeping 2
- **Features:** Hot tub, sauna, fire pit — at the foot of the Paps, under the stars
- **Character:** Remote, peaceful, dramatic landscape
- **Link:** [Bothan Jura Retreat website]

**Teaser Version:**
> We also own Bothan Jura Retreat on Jura — a passion project with a cottage, lodge, cabin and shepherd's hut, each sleeping 2, with hot tub and sauna under the stars. [Visit Jura →](/jura)

---

### 7. About Us Block (`about-us`)

**Full Version (for About page):**

> We're Pi and Lynton, and we've been welcoming guests to Islay since 2017. We started by letting out our own family home, Portbahn House, and now manage three properties in Bruichladdich — each one with its own story.
>
> Portbahn House was our family home for years. Shorefield is the Jacksons' creation — they built it, planted every tree, created the bird hides, and filled it with their art and travels. Curlew Cottage is our friend Alan's family retreat, now opening to guests for the first time.
>
> These aren't purpose-built holiday lets — they're real family homes with personality. We manage them the way we'd want our own managed: with care, attention, and a genuine interest in making your stay brilliant.
>
> We now live on Jura (one more ferry away!), where we built Bothan Jura Retreat from scratch — the kind of place we'd want to escape to ourselves. A hot tub at the foot of the Paps, under the stars.
>
> We try to create the sort of places we like to stay when we go away — a genuine home from home.

**Photo:** Pi & Lynton (need image)

---

## Property Cards Component

Not a canonical block, but a reusable component:

```
┌─────────────────────────────────────┐
│ [Image]                             │
│                                     │
│ PORTBAHN HOUSE                      │
│ Our family home — modern, bright    │
│                                     │
│ 👥 Sleeps 8  🛏️ 3 bedrooms          │
│ 🐕 Dogs welcome  🚗 Parking         │
│                                     │
│ [View Property →]                   │
└─────────────────────────────────────┘
```

Key info to include:
- Property name
- Tagline (1 line)
- Sleeps
- Bedrooms
- Pet policy
- Key differentiator (e.g., "Bird hides", "Pet-free", "Ground floor bedrooms")

This replaces a dedicated /compare page — the comparison happens naturally through consistent cards.

---

## Content Creation Priority

### Must Have for MVP
1. ✅ Homepage (V3 done)
2. ✅ Getting Here (V3 done)
3. ✅ Explore Islay (V3 done, needs beaches/families expansion)
4. ✅ Property FAQs (V3 done)
5. 🟡 Beaches expansion (quick win from existing + web research)
6. 🟡 Families & Children block (new content needed)
7. 🟡 Food & Drink block (consolidate existing mentions)
8. 🟡 About page (new content needed)
9. 🟡 Property cards component

### Should Have for MVP
10. 🟡 Jura page with day trip + longer stay + Bothan teaser

### Nice to Have (Post-MVP)
- Individual distillery pages
- Individual beach pages
- Walking routes
- Answer the Public long-tail content

---

## Questions for Sign-Off

1. **Is this the right structure?** Any blocks to add/remove?

2. **Beaches expansion** — I can do a quick web search to fill in details for Ardnave, Singing Sands, Claggain Bay etc. Want me to proceed?

3. **Families block** — Do you have more activities to add (pottery at Persabus, pool at Mactaggart are noted)?

4. **Jura page** — Is the day trip / longer stay / Bothan structure right?

5. **About page** — Is the draft content on the right track? Need a photo of you both.

6. **Property cards** — Happy with the info shown, or want different fields?

---

Once you confirm, I'll:
1. Create the new block content (beaches, families, food, Jura, about)
2. Finalise all canonical blocks in one clean document
3. Write the Sanity schema
4. Create the Claude Code handoff

---

**Token count:** ~2,400 tokens
