# Working Sitemap: Portbahn Islay
**Version:** 1.0
**Date:** 2026-01-23
**Status:** MVP Planning
**Playbook:** AI Search Playbook v1.3.1

---

## Overview

This sitemap defines all pages for the Portbahn Islay site, mapping content ownership, FAQ distribution, entity definitions, and schema requirements following AI Search Playbook principles.

**Site Role:** Secondary Authority (vacation rentals on Islay)
**Primary Entities:** 3 vacation rental properties + multi-property management service
**Domain Saturation Strategy:** Property-focused with supporting travel/area content

---

## Page Inventory

### MVP Pages (Launch Priority)

| Page | URL | Status | Entity Owner | FAQs |
|------|-----|--------|--------------|------|
| Homepage | `/` | Enhance | Portbahn Islay (property management) | 0 |
| Portbahn House | `/properties/portbahn-house` | Enhance | Portbahn House | 3-5 |
| Shorefield | `/properties/shorefield` | Enhance | Shorefield | 3-5 |
| Curlew Cottage | `/properties/curlew-cottage` | **UPDATE** | Curlew Cottage | 3-5 |
| Compare Properties | `/compare` | Enhance | Property comparison | 0 |
| Getting Here | `/getting-here` | Enhance | Ferry travel to Islay | 3-5 |
| Explore Islay | `/explore` | Enhance | Islay attractions | 3-5 |
| About Us | `/about` | Enhance | Pi & Lynton (hosts) | 0 |
| Contact | `/contact` | Enhance | Booking inquiry | 0 |
| FAQs | `/faqs` | Create | Booking logistics | 8-12 |
| **Visit Jura** | `/jura/` | **NEW** | Multi-island holiday | 2-3 |

**Total MVP:** 11 pages (10 enhance, 1 new)

### Post-Launch Pages (Long-tail)

| Page | URL | Status | Purpose |
|------|-----|--------|---------|
| Distillery Guides | `/distilleries/[slug]` | Planned | Individual distillery content |
| Beach Guides | `/beaches/[slug]` | Planned | Individual beach content |
| Seasonal Content | `/seasons/[topic]` | Planned | Whisky festivals, birding |
| Activities | `/activities/[type]` | Planned | Deep local guides |

---

## Page Specifications

### 1. Homepage (`/`)

**Primary Entity:** Portbahn Islay — vacation rental management
**Entity Definition:** Three distinctive self-catering properties on the Isle of Islay, Scotland—Portbahn House, Shorefield, and Curlew Cottage. Managed by Airbnb Superhosts Pi and Lynton with 4.97/5 rating across 380+ reviews.

**Content Sections:**
1. **Hero** — Entity definition (200 words max)
2. **Property Cards** — 3 properties, key differentiators
3. **Why Book With Us** — Superhost credentials, real homes narrative
4. **Location Context** — Islay positioning (ferry port, distillery region)
5. **Trust Signals** — Review highlights, rating display

**FAQ Distribution:** None (property-specific Qs go to property pages)

**Schema Requirements:**
- `Organization` (Portbahn Islay)
- `LocalBusiness` (vacation rental service)
- `ItemList` (3 properties)

**Content Source:** `docs/content/PBI-NUANCE-BRIEF-ENHANCED.md`

---

### 2. Portbahn House (`/properties/portbahn-house`)

**Primary Entity:** Portbahn House — 8-guest waterfront cottage
**Entity Definition:** Waterfront self-catering cottage sleeping 8 guests in 4 bedrooms with direct beach access and sea views across Laggan Bay. Dog-friendly with secure garden. Located near Port Ellen ferry terminal on Islay's south coast.

**Content Sections:**
1. **Overview** — Entity definition, key features
2. **Accommodation** — Room-by-room detail
3. **Location & Access** — Ferry proximity, beach access
4. **House Rules** — Pet policy, check-in
5. **What's Supplied** — Equipment, amenities
6. **Guest Reviews** — Curated highlights
7. **Embedded Q&As** — Property-specific FAQs

**FAQ Distribution (3-5 questions):**
- Is the cottage dog-friendly?
- Is there a dishwasher?
- What heating does the property have?
- Is WiFi available?
- What's provided (linens, towels, etc.)?

**Schema Requirements:**
- `VacationRental` (primary)
- `Review` (aggregate + individual)
- `Offer` (booking)

**Content Source:** `data/imports/portbahn-house-enhanced.json`

---

### 3. Shorefield (`/properties/shorefield`)

**Primary Entity:** Shorefield — 5-guest cottage near distilleries
**Entity Definition:** Self-catering cottage sleeping 5 guests in 3 bedrooms, located near Laphroaig, Lagavulin, and Ardbeg distilleries. Dog-friendly with enclosed garden. Walking distance to Port Ellen amenities.

**Content Sections:**
1. **Overview** — Entity definition, key features
2. **Accommodation** — Room-by-room detail
3. **Location & Access** — Distillery proximity
4. **House Rules** — Pet policy, check-in
5. **What's Supplied** — Equipment, amenities
6. **Guest Reviews** — Curated highlights
7. **Embedded Q&As** — Property-specific FAQs

**FAQ Distribution (3-5 questions):**
- Can I bring my dog?
- How close are the distilleries?
- Is there central heating?
- What kitchen equipment is provided?
- Is there laundry?

**Schema Requirements:**
- `VacationRental` (primary)
- `Review` (aggregate + individual)
- `Offer` (booking)

**Content Source:** `data/imports/shorefield-enhanced.json`

---

### 4. Curlew Cottage (`/properties/curlew-cottage`) ⚠️ UPDATE REQUIRED

**Primary Entity:** Curlew Cottage — 6-guest family retreat, first time letting
**Entity Definition:** Converted steading sleeping 6 guests in 3 bedrooms with private walled garden. The owner's own Islay retreat, available for guest bookings for the first time in 2026. Pet-free accommodation ideal for families with children and guests with allergies. Managed by Airbnb Superhosts Pi and Lynton.

**Content Sections:**
1. **Overview** — Entity definition, "owner's retreat" positioning
2. **Accommodation** — Room-by-room detail
3. **Garden & Outdoor Space** — Walled garden features
4. **Family Features** — Child-friendly amenities
5. **What's Supplied** — Equipment, amenities
6. **Trust Transfer** — Reviews from Portbahn/Shorefield
7. **Embedded Q&As** — Property-specific FAQs

**FAQ Distribution (3-5 questions):**
- Why are there no reviews yet?
- Is the property pet-free?
- Is the garden safe for children?
- What makes Curlew suitable for families?
- What's the check-in process?

**Schema Requirements:**
- `VacationRental` (primary)
- `Offer` (booking)
- Note: No reviews yet (trust transfer via host narrative)

**Content Source:** `data/imports/curlew-cottage-enhanced.json` (NEEDS UPDATE)

**Required Updates:**
- Add `ownerContext` field content
- Revise `overviewIntro` to include "converted steading" + "first time letting"
- Update `description` opening paragraph
- Add trust transfer section with Portbahn/Shorefield review excerpts

---

### 5. Compare Properties (`/compare`)

**Primary Entity:** Property comparison tool
**Entity Definition:** Side-by-side comparison of Portbahn Islay's three properties—helping guests choose between waterfront access (Portbahn House), distillery location (Shorefield), or pet-free family space (Curlew Cottage).

**Content Sections:**
1. **Intro** — Why compare, decision factors
2. **Comparison Table** — Sleeps, pets, location, key features
3. **Decision Guide** — "Choose Portbahn if...", "Choose Shorefield if...", "Choose Curlew if..."
4. **Location Map** — Visual positioning

**FAQ Distribution:** None (property Qs handled on property pages)

**Schema Requirements:**
- `Table` (comparison data)
- `ItemList` (properties)

**Content Source:** `docs/OTHER-PAGES-PLAYBOOK-SPECS.md`

---

### 6. Getting Here (`/getting-here`)

**Primary Entity:** Ferry travel to Islay
**Entity Definition:** How to reach Islay via CalMac ferry from Kennacraig (mainland Scotland) to Port Ellen or Port Assan. Includes booking strategies, cancellation policies, and alternative routes via Islay Airport.

**Content Sections:**
1. **Ferry Overview** — CalMac service, routes, duration
2. **Booking the Ferry** — Advance booking strategy, peak times
3. **Ferry Survival Guide** — Pi's support narrative, what to expect
4. **Cancellations & Changes** — Weather disruptions, flexible tickets
5. **Getting Around Islay** — Car hire, driving distances
6. **Flying to Islay** — Airport option
7. **Embedded Q&As** — Travel FAQs

**FAQ Distribution (3-5 questions):**
- How far in advance should I book the ferry?
- What happens if the ferry is cancelled?
- Do I need to hire a car on Islay?
- Can I change my ferry booking?
- How long is the ferry crossing?

**Schema Requirements:**
- `HowTo` (getting to Islay)
- `Place` (Islay, ferry terminals)

**Content Source:** `docs/FAQ-RESEARCH.md` Section B (Travel & Logistics)

---

### 7. Explore Islay (`/explore`)

**Primary Entity:** Islay attractions overview
**Entity Definition:** Guide to Islay's main attractions—distilleries, beaches, wildlife, and local food. Consolidated overview linking to authoritative local sources.

**Content Sections:**
1. **Distilleries** — 9 working distilleries, visitor info, link to distillery sites
2. **Beaches** — Machir Bay, Saligo, Singing Sands
3. **Wildlife** — Bird watching, seals, seasonal highlights
4. **Food & Drink** — Restaurants, seafood, local specialties
5. **Practical Info** — Opening hours, booking ahead
6. **Embedded Q&As** — Area FAQs

**FAQ Distribution (3-5 questions):**
- Which distilleries should I visit?
- Do I need to book distillery tours?
- What are the best beaches on Islay?
- Where can I eat on Islay?
- What wildlife can I see?

**Schema Requirements:**
- `TouristAttraction` (Islay)
- `ItemList` (distilleries, beaches)

**Content Source:** `docs/FAQ-RESEARCH.md` Section C (Islay & Activities)

**Multi-site Strategy:**
- Link to visitislay.com (DMO authority)
- Link to individual distillery sites
- "Go light" on detailed guides (post-launch opportunity)

---

### 8. About Us (`/about`)

**Primary Entity:** Pi & Lynton (property hosts)
**Entity Definition:** Pi and Lynton, Islay property owners and Airbnb Superhosts managing three distinctive holiday cottages. 4.97/5 rating across 380+ reviews.

**Content Sections:**
1. **Real Homes Narrative** — Why we let, personal connection to properties
2. **Our Properties** — Brief overview of all three
3. **Hosting Approach** — Responsiveness, local knowledge
4. **Islay Connection** — Why Islay, how long we've owned properties
5. **Bothán Jura** — Cross-promotion to BJR

**FAQ Distribution:** None

**Schema Requirements:**
- `Person` (Pi, Lynton)
- `Organization` (Portbahn Islay)

**Content Source:** `docs/content/PBI-NUANCE-BRIEF-ENHANCED.md`

**Cross-promotion:** Link to `/jura/` and `bothanjura.co.uk`

---

### 9. Contact (`/contact`)

**Primary Entity:** Booking inquiry
**Entity Definition:** Contact form and Pi's contact details for booking inquiries, property questions, and guest support.

**Content Sections:**
1. **Pi Intro** — Host photo, responsiveness message
2. **Contact Form** — Inquiry fields
3. **Booking Info** — How bookings work, response time
4. **Property Locations** — Map or addresses

**FAQ Distribution:** None

**Schema Requirements:**
- `ContactPage`
- `Person` (Pi as contact)

**Content Source:** New content needed

---

### 10. FAQs (`/faqs`) 🆕 CREATE

**Primary Entity:** Booking & logistics FAQs
**Entity Definition:** Frequently asked questions about booking, check-in, payment, and general policies across all Portbahn Islay properties.

**Content Sections:**
1. **Booking Questions** — How to book, payment, deposits
2. **Check-in & Keys** — Arrival process, key collection
3. **Policies** — Cancellation, late checkout, damage
4. **General** — Accessibility, special requests

**FAQ Distribution (8-12 questions from FAQ-RESEARCH.md Section D):**
- How do I book a property?
- What are your check-in/check-out times?
- Can I request early check-in or late checkout?
- What is your cancellation policy?
- How do I pay?
- Do you accept pets? (link to property pages)
- Is there parking?
- What if I damage something?

**Schema Requirements:**
- **NO FAQPage schema** (Playbook: "Low value / Skip")
- Use descriptive headings in question format

**Content Source:** `docs/FAQ-RESEARCH.md` Section D (Booking & Policies)

**Playbook Note:** Site-level FAQ page is booking-focused ONLY. Property and area questions distributed to contextual pages.

---

### 11. Visit Jura (`/jura/`) 🆕 NEW PAGE

**Primary Entity:** Multi-island Islay + Jura holiday
**Entity Definition:** Combining Islay and Jura in a multi-island Scottish holiday. Jura is accessible via 5-minute ferry from Port Askaig on Islay.

**Content Sections:**
1. **Why Visit Jura** — Brief intro (2-3 paragraphs)
2. **Why Combine Islay + Jura** — Multi-island appeal
3. **Getting to Jura from Islay** — Port Askaig ferry, timing
4. **Bothán Jura** — Property summary, trust signals
5. **About Your Hosts** — Pi & Lynton connection
6. **CTA** — Link to bothanjura.co.uk

**FAQ Distribution (2-3 questions):**
- How do I get to Jura from Islay?
- Can I do a day trip to Jura?
- Should I book both islands?

**Schema Requirements:**
- `TouristDestination` (Jura)
- `Place` (Port Askaig ferry)

**Content Source:** NEW — requires page spec (Priority 3)

**Playbook Rationale:**
- Creates extractable passage for "multi-island Islay Jura holiday" queries
- Supports domain saturation across ecosystem
- "Go light on adjacent topics" — clear link to stronger authority (BJR site)

**Cross-promotion:** External link to `bothanjura.co.uk`

---

## FAQ Distribution Summary

### Property-Specific FAQs (Distributed to Property Pages)

**Source:** FAQ-RESEARCH.md Section A (Property Questions)

| FAQ | Assigned To |
|-----|-------------|
| Is the cottage dog-friendly? | Portbahn, Shorefield |
| Is there a dishwasher? | Portbahn, Shorefield, Curlew |
| What heating does the property have? | All properties |
| Is WiFi available? | All properties |
| What's provided (linens, towels)? | All properties |
| Why are there no reviews for Curlew? | Curlew only |
| Is the garden safe for children? | Curlew only |

### Travel FAQs (Distributed to Getting Here)

**Source:** FAQ-RESEARCH.md Section B (Travel & Logistics)

| FAQ | Assigned To |
|-----|-------------|
| How far in advance should I book the ferry? | Getting Here |
| What happens if ferry is cancelled? | Getting Here |
| Do I need to hire a car? | Getting Here |
| Can I change my ferry booking? | Getting Here |
| How long is the ferry crossing? | Getting Here |

### Area FAQs (Distributed to Explore Islay)

**Source:** FAQ-RESEARCH.md Section C (Islay & Activities)

| FAQ | Assigned To |
|-----|-------------|
| Which distilleries should I visit? | Explore Islay |
| Do I need to book distillery tours? | Explore Islay |
| What are the best beaches? | Explore Islay |
| Where can I eat on Islay? | Explore Islay |
| What wildlife can I see? | Explore Islay |

### Booking FAQs (Site-Level FAQ Page)

**Source:** FAQ-RESEARCH.md Section D (Booking & Policies)

| FAQ | Assigned To |
|-----|-------------|
| How do I book? | /faqs |
| Check-in/out times? | /faqs |
| Early check-in / late checkout? | /faqs |
| Cancellation policy? | /faqs |
| Payment methods? | /faqs |
| Pet policy? | /faqs (with links to property pages) |
| Parking availability? | /faqs |
| Damage policy? | /faqs |

---

## Entity Ownership Map

| Entity | Primary Page | Supporting Pages |
|--------|--------------|------------------|
| Portbahn Islay (organization) | Homepage | About Us, Contact |
| Portbahn House | /properties/portbahn-house | Homepage, Compare |
| Shorefield | /properties/shorefield | Homepage, Compare |
| Curlew Cottage | /properties/curlew-cottage | Homepage, Compare |
| Pi & Lynton (hosts) | About Us | Homepage, property pages, Contact |
| Ferry travel to Islay | Getting Here | Homepage (location context) |
| Islay attractions | Explore Islay | Property pages (location benefits) |
| Multi-island holiday (Jura) | /jura/ | About Us (BJR cross-link) |

---

## Schema Requirements Summary

| Page | Primary Schema | Additional Schema |
|------|----------------|-------------------|
| Homepage | `Organization`, `LocalBusiness` | `ItemList` (properties) |
| Property pages (×3) | `VacationRental` | `Review`, `Offer` |
| Compare Properties | `Table` | `ItemList` |
| Getting Here | `HowTo` | `Place` |
| Explore Islay | `TouristAttraction` | `ItemList` |
| About Us | `Person` (×2) | `Organization` |
| Contact | `ContactPage` | `Person` |
| FAQs | None | Question-format headings only |
| Visit Jura | `TouristDestination` | `Place` |

**Playbook Note:** No FAQPage schema anywhere. Contextual Q&As use descriptive headings.

---

## Content Source Reference

| Page | Primary Source | Status |
|------|----------------|--------|
| Homepage | PBI-NUANCE-BRIEF-ENHANCED.md | Ready |
| Portbahn House | portbahn-house-enhanced.json | Complete |
| Shorefield | shorefield-enhanced.json | Complete |
| Curlew Cottage | curlew-cottage-enhanced.json | **Needs update** |
| Compare Properties | OTHER-PAGES-PLAYBOOK-SPECS.md | Ready |
| Getting Here | FAQ-RESEARCH.md (B), OTHER-PAGES | Ready |
| Explore Islay | FAQ-RESEARCH.md (C), OTHER-PAGES | Ready |
| About Us | PBI-NUANCE-BRIEF-ENHANCED.md | Ready |
| Contact | New content needed | Create |
| FAQs | FAQ-RESEARCH.md (D) | Ready |
| Visit Jura | **NEW** — spec needed | Priority 3 |

---

## Implementation Priorities

### Immediate (This Session)
1. ✅ Create this working sitemap
2. Update Curlew Cottage data (Priority 2)
3. Create BJR/Jura page spec (Priority 3)
4. Create detailed FAQ distribution doc (Priority 4)

### Next Steps
1. Implement property page enhancements
2. Create site-level FAQ page
3. Build Visit Jura page
4. Enhance supporting pages (Getting Here, Explore, etc.)

### Post-Launch
1. Individual distillery guides
2. Beach detail pages
3. Seasonal content
4. Deep local guides

---

## Notes

- **Playbook Compliance:** All pages follow entity-first, passage-extractable approach
- **Multi-site Strategy:** PBI = Secondary Authority, links to DMO + distillery sites + CalMac
- **Trust Transfer:** Curlew uses Portbahn/Shorefield reviews to establish host credibility
- **Schema:** No FAQPage schema; contextual Q&As with descriptive headings throughout
- **Cross-Promotion:** BJR positioned as natural multi-island extension on dedicated page

---

**Status:** Ready for implementation
**Next:** Curlew Cottage content updates
