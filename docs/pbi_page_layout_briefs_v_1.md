# Portbahn Islay — Page Layout Briefs (AI‑First, SEO/GEO‑Optimised)

This document defines **page-level layout briefs** for all core PBI pages. These follow the AI‑First Page Specification Framework, ensuring each page is structured for:
- Efficient semantic chunking
- Maximum extractability for AI systems
- Clean SEO hierarchy
- GEO clarity (Islay entities, local markers)
- Smooth migration into Figma + Wix Studio

All pages follow the BJR inherited system:
- Serif for major typographic moments (H1–H3)
- Mono for body text, metadata, lists
- Clear vertical rhythm + spacious editorial pacing

---

# 1. Home

**URL:** `/`
**Purpose:** Introduce PBI; direct users into Accommodation and Explore Islay.
**Pattern:** Editorial / Narrative

## H‑Tag Map
- **H1:** Portbahn Islay
- **H2:** Our Accommodation
- **H2:** Explore Islay
- **H2:** Getting Here
- **H2:** About Us

## Content Blocks (Chunked)
**Block 1 — Hero**
- Large serif title (H1)
- Short mono intro (2 sentences max)
- Single hero image or minimal image blend

**Block 2 — Accommodation Overview (H2)**
- 50–80 word intro (mono)
- 3 property cards (CMS)
- Bullet list: sleeps, location, highlights

**Block 3 — Explore Islay (H2)**
- 40–60 word intro
- 3–5 featured guides
- Bullet list: beaches, walks, whisky

**Block 4 — Getting Here (H2)**
- 3–4 bullets: ferry, driving, air, distances

**Block 5 — About Us (H2)**
- 60–90 words
- Inline link → About page

## GEO Signals
Mention: “Islay”, “Port Ellen”, “Sound of Islay”, “Inner Hebrides”.

---

# 2. Accommodation Overview

**URL:** `/accommodation/`
**Purpose:** Showcase 3 properties and help users compare.
**Pattern:** Grid / Directory

## H‑Tag Map
- **H1:** Accommodation on Islay
- **H2:** Portbahn House
- **H2:** Shorefield House
- **H2:** Curlew Cottage

## Content Blocks
**Block 1 — Intro (H1)**
- 60–80 words explaining the accommodation offering on Islay
- List: locations, views, amenities

**Block 2 — Property Cards (CMS)**
Each card includes:
- Property name (H2)
- 25–40 word summary
- Bullet list of key features
- 1 hero image

## GEO Signals
- “East coast of Islay”, “near Port Askaig”, “near Port Ellen ferry terminal”.

---

# 3. Property Template

**URL pattern:** `/accommodation/{property-name}/`
**Purpose:** Detailed profile of each accommodation.
**Pattern:** Detail / Narrative

## H‑Tag Map
- **H1:** {Property Name}
- **H2:** Overview
- **H2:** Features
- **H2:** Location
- **H2:** Guest Information
- **H2:** Gallery

## Content Blocks
**Hero Gallery**
- 3–5 images (CMS)

**Overview (H2)**
- 80–120 words describing the property
- 1 GEO reference

**Features (H2)**
- Bulleted list grouped by: Indoors / Outdoors / Essentials / Extras

**Location (H2)**
- Map image or static reference
- 3–4 bullets: nearest beach, nearest distillery, ferry times

**Guest Information (H2)**
- Stove lighting
- Parking
- WiFi
- Heating
(These follow FAQ pattern but displayed inline)

**Gallery (H2)**
- CMS repeater → lightbox

---

# 4. Getting Here

**URL:** `/getting-here/`
**Purpose:** Optimise the arrival journey.
**Pattern:** Informational

## H‑Tag Map
- **H1:** Getting to Islay
- **H2:** By Ferry
- **H2:** By Air
- **H2:** Driving Routes
- **H2:** Travel Tips

## Content Blocks
**Intro (H1)**
- 50–70 words
- Bullet list: Port Ellen, Port Askaig, ferries

**By Ferry (H2)**
- 1–2 short paras
- Bullet list: routes, times, distances

**By Air (H2)**
- Flights into Islay Airport
- Bullet travel notes

**Driving Routes (H2)**
- Distances from Glasgow, Oban, Kennacraig

**Travel Tips (H2)**
- Best times to book
- Weather notes
- Seasonal variations

---

# 5. About

**URL:** `/about/`
**Pattern:** Narrative

## H‑Tag Map
- **H1:** About Portbahn Islay
- **H2:** Our Story
- **H2:** The Properties
- **H2:** The Island

## Content Blocks
**Intro (H1)**
- 50–70 words

**Our Story (H2)**
- 120–160 words

**The Properties (H2)**
- 3 property cards summary

**The Island (H2)**
- 2 short paragraphs
- Link to `/islay-guides/`

---

# 6. FAQ

**URL:** `/faq/`
**Pattern:** Single-page accordion

## H‑Tag Map
- **H1:** Frequently Asked Questions
- **H2:** Before You Arrive
- **H2:** At the Property
- **H2:** Local Essentials
- **H2:** Troubleshooting

## Content Blocks
Each section contains 4–7 FAQs.

Each FAQ =
- **Question (H3)**
- Short 2–4 sentence answer
- Optional bullet list

---

# 7. Explore Islay (Islay Guides Hub)

**URL:** `/islay-guides/`
**Purpose:** Bring in long-tail traffic from users who don’t know the brand.
**Pattern:** Directory / Editorial

## H‑Tag Map
- **H1:** Explore Islay
- **H2:** Categories
- **H2:** Featured Guides

## Content Blocks
**Intro (H1)**
- 60–90 word island overview
- AI-friendly phrasing (e.g. “things to do on Islay”, “best beaches on Islay”)

**Categories (H2)**
List of cards:
- Beaches
- Walks
- Whisky
- Distilleries
- Food & Drink
- Ferries
- Travel

**Featured Guides (H2)**
- 3–6 CMS items
- Each = title (H3) + 20–30 word extract + image

---

# 8. Guide Detail Template

**URL pattern:** `/islay-guides/{slug}/`
**Purpose:** Topical authority pages for SEO + AI citation.

## H‑Tag Map
- **H1:** Guide Title
- **H2:** Quick Facts
- **H2:** Overview
- **H2:** Highlights / Things to Know
- **H2:** Location
- **H2:** Related Guides

## Content Blocks
**Hero Image**
- 1 wide landscape image

**Quick Facts (H2)**
- Bulleted list
- Entities: location, distances, difficulty (walks), opening hours (distilleries)

**Overview (H2)**
- 80–120 words

**Highlights (H2)**
- 4–7 bullets

**Location (H2)**
- GEO notes
- Map reference or static image

**Related Guides (H2)**
- 3–4 CMS cards

---

# 9. Contact

**URL:** `/contact/`

## H‑Tag Map
- **H1:** Contact
- **H2:** Get in Touch
- **H2:** Find Us

---

# 10. Design + AI Considerations (Applied to All Pages)

- Every page must contain **at least one list** (bullets).
- Max paragraph length: **2–3 sentences**.
- Sections must be **chunked into H2/H3** blocks.
- GEO markers must be explicit: Islay, Port Ellen, Port Askaig, distillery names, beaches.
- Images should be placed **between chunks** to control pacing.
- All detail pages must have **Quick Facts** for extractability.
- Internal links mandatory: guide → guide, guide → property, property → relevant guides.

---

*End of Page Layout Briefs v1*

