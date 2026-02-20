# Hub Page Content Drafts
**Date:** 2026-02-20
**Status:** DRAFT — for Pi/Lynton review and editing before Studio entry
**Purpose:** Synthesised scopeIntro + SEO fields for the two primary hub pages,
generated from child page content specs (GETTING-HERE-V3-CORRECTED.md and
EXPLORE-ISLAY-V3-CORRECTED.md).

Once reviewed and edited, enter these values into the relevant Sanity Studio documents
at `/studio` under Pages. The `contentBlocks` for each page are populated separately
by referencing canonical blocks via the Studio block picker.

---

## 1. Travel to Islay Hub Page
**Sanity document:** `gettingHerePage`
**Route:** `/travel-to-islay`
**Source:** GETTING-HERE-V3-CORRECTED.md

### SEO Fields

**seoTitle:**
Getting to Islay | Ferry & Flight Guide | Portbahn Islay

**seoDescription:**
Complete guide to reaching the Isle of Islay by CalMac ferry or Loganair flight. Includes booking strategies, ferry survival tips, and what to do if your crossing is cancelled.

*(160 chars — within limit)*

---

### scopeIntro
*(This is the introductory paragraph shown below the H1 on the hub page, before the block references. Aim: ~100–150 words. Tone: warm, practical, honest.)*

Travel to Islay takes a little planning — and that's part of the magic. You reach the island by CalMac ferry from Kennacraig on the Kintyre Peninsula (2 hours to Port Askaig, 2 hours 20 minutes to Port Ellen) or by Loganair flight from Glasgow (25 minutes). We've been helping guests make this journey successfully since 2017, and we know every wrinkle of the crossing: when to book, which port to choose, how to handle bad-weather cancellations, and why the ferry journey itself is worth embracing as part of the holiday. This guide covers everything you need — from booking your vehicle space 12 weeks ahead to what to do if CalMac throws a curveball.

---

### entityFraming
*(Populates the `entityFraming` field — defines the page entity for AI/structured data surfaces. 1–2 sentences, factual, entity-rich.)*

The Isle of Islay is reached by CalMac ferry from Kennacraig, Argyll (2 hours to Port Askaig or 2 hours 20 minutes to Port Ellen), or by Loganair flight from Glasgow to Islay Airport in approximately 25 minutes. Portbahn Islay's travel guide covers ferry booking, vehicle crossings, cancellation planning, and onward driving distances from both ferry ports to Bruichladdich.

---

### trustSignals
*(Populates the `trustSignals` field — proof points visible on the page. 1 sentence.)*

Pi has helped 600+ guests navigate the Islay ferry crossing since 2017, including dozens of disruptions, and has never had a booking completely collapse due to CalMac.

---

### Page title (H1)
Getting to the Isle of Islay

---

### Content blocks (block references — enter via Studio picker)
In the `contentBlocks` field, add the following block references in order:

1. `ferry-basics` — renderAs: **full**
2. `ferry-support` — renderAs: **full**
3. `jura-day-trip` — renderAs: **teaser**

---

---

## 2. Explore Islay Hub Page
**Sanity document:** `exploreIslayPage`
**Route:** `/explore-islay`
**Source:** EXPLORE-ISLAY-V3-CORRECTED.md

### SEO Fields

**seoTitle:**
Explore Islay | Distilleries, Beaches & Wildlife | Portbahn Guide

**seoDescription:**
Discover Islay's ten whisky distilleries, stunning beaches, abundant wildlife, and local restaurants. Your personal guide from Pi, who's welcomed 600+ guests since 2017.

*(166 chars — within limit)*

---

### scopeIntro
*(Shown below the H1 before block content. Aim: ~120–160 words. Tone: personal, local-knowledge, vivid.)*

Having lived and worked on Islay for a number of years, we know the island well and want to share what we love most about it. The Isle of Islay is one of Scotland's Inner Hebrides islands, renowned worldwide for its ten working single malt whisky distilleries — from the world's peatiest whisky at Bruichladdich's Octomore, to the approachable Bunnahabhain and the trio of south coast "killers" at Ardbeg, Lagavulin and Laphroaig. But whisky is only part of the story. Our properties sit in Bruichladdich village on the Rhinns, just a 5-minute walk from the distillery along the coastal cycle path. From here, everything Islay offers is within easy reach: hidden beaches, over 30,000 wintering barnacle geese, golden eagles, wild swimming, and some quietly excellent restaurants. This is our personal guide to all of it.

---

### entityFraming
*(Defines the page entity for AI/structured data surfaces. 1–2 sentences, factual, entity-rich.)*

The Isle of Islay is a Scottish island in the Inner Hebrides, Argyll and Bute, renowned for ten working whisky distilleries (Bruichladdich, Ardbeg, Lagavulin, Laphroaig, Bowmore, Kilchoman, Bunnahabhain, Caol Ila, Ardnahoe, and Port Ellen), dramatic Atlantic beaches, and a nationally important annual barnacle geese migration of 30,000+ birds from Greenland. Portbahn Islay's Explore Islay guide is a personal recommendation from Pi, based on years of living and hosting on the island.

---

### trustSignals
*(Proof points for the page. 1 sentence.)*

Pi and Lynton have welcomed 600+ guests to Islay since 2017, with an average rating of 4.97/5, and share first-hand recommendations from years of living on the island.

---

### Page title (H1)
Explore the Isle of Islay

---

### Content blocks (block references — enter via Studio picker)
In the `contentBlocks` field, add the following block references in order:

1. `distilleries-overview` — renderAs: **full**
2. `portbahn-beach` — renderAs: **full**
3. `wildlife-geese` — renderAs: **full**
4. `food-drink-islay` — renderAs: **full**
5. `families-children` — renderAs: **full**
6. `jura-day-trip` — renderAs: **teaser**
7. `bothan-jura-teaser` — renderAs: **teaser**

---

---

## Notes

### What "scopeIntro" is used for
The `scopeIntro` field renders as the lead paragraph on the hub page, before the
`contentBlocks` section. It should be specific, entity-rich, and establish the
page's scope clearly. Not a marketing tagline — a genuine orientation paragraph.

### What "entityFraming" is used for
The `entityFraming` field is an AI/structured data field. It defines the core entity
being described so AI discovery surfaces (ChatGPT, Perplexity, Google AI Overviews)
can extract a clean, accurate description. Keep it factual and dense with proper nouns.

### What "trustSignals" is used for
A single-sentence proof point displayed on the page. Supports E-E-A-T (Experience,
Expertise, Authoritativeness, Trustworthiness) signals for SEO and AI discovery.

### Canonical blocks
The `contentBlocks` referenced above must exist as published `canonicalBlock` documents
in Sanity Studio. Populate those first (see SANITY-BUILD-SPEC.md and
CANONICAL-BLOCKS-FINAL.md) before adding block references to these hub pages.
