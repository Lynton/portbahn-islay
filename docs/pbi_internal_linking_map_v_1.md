# Portbahn Islay — Internal Linking Architecture (v1)

This document defines the **internal linking strategy** for PBI, optimised for:
- SEO (topical authority, crawl depth)
- AI retrievability (RAG-friendly structure, semantic clarity)
- User journeys (discovery → decision → booking)
- CMS-powered teaser blocks

It works hand‑in‑hand with the CMS Schema and Sitemap IA.

---

# 1. Internal Linking Principles

1. **Every page must link to at least 2 other relevant pages.**
2. **Guides link to guides** to build topical clusters.
3. **Guides link to properties** to drive booking intent.
4. **Properties link to guides** to provide local context.
5. **FAQ links to both guides and properties.**
6. **Teaser blocks power automatic cross‑linking across the site.**
7. **All linking should use descriptive, entity‑rich anchor text** (e.g. “walks near Portbahn House”, “beaches on Islay”).
8. **Use mono text with dotted underline → solid hover** as per interaction rules.

---

# 2. Internal Link Flow

Primary flows reflect how new users discover the site.

## 2.1 Search → Guide → Property → Booking
1. User lands on `/islay-guides/{slug}` from search or AI.
2. Page suggests 1–3 relevant properties in “Related Properties”.
3. User clicks into a property page.
4. Property page contains a CTA → Lodgify checkout.

## 2.2 Guide → Guide (Cluster Reinforcement)
Every guide page includes:
- 3–6 CMS-related guides under “Related Guides”.
- 1 inline link inside first or second chunk.
- Category link back to `/islay-guides/{category}`.

## 2.3 Property → Guide
Property pages must link to:
- The nearest beach
- A nearby walk
- At least one whisky / distillery guide
- A food & drink page

Displayed as a teaser block: **“Nearby on Islay”**.

## 2.4 FAQ → Guide
FAQ entries often direct users to:
- Petrol station guide
- Food shops + ATMs
- Local essentials pages
- Walks or beaches
- Seasonal travel notes

## 2.5 Home → Guide / Property
Homepage includes two key blocks:
- Featured Guides (3 CMS items)
- Accommodation cards

---

# 3. Link Placement Guidelines

## 3.1 Placement Priority
1. **Above-the-fold contextual link** (first chunk) — AI citation boost.
2. **End-of-section link** inside or after a chunk.
3. **Teaser blocks** — CMS-driven cross-link.
4. **Footer minis** — small “Explore Islay” and “Visitor Essentials”.

## 3.2 Anchor Text Rules
- Use descriptive anchors with clear entities ("Islay whisky distilleries", “walks near Shorefield House”).
- Avoid “click here”, “read more”, “learn more”.
- Include Islay / place entities where relevant.

---

# 4. Linking by Page Type

## 4.1 Home
**Links to:**
- 3 featured guides
- `/accommodation/`
- `/getting-here/`
- `/islay-guides/`

## 4.2 Accommodation Overview
**Links to:**
- Each property page
- Featured guides (walks, beaches, whisky)

## 4.3 Property Page
**Links to:**
- 3–5 relevant guides (beach, walk, whisky, essentials)
- FAQ section for house info
- Home → CTA

## 4.4 Explore Islay Hub
**Links to:**
- All categories
- Selected guides
- Properties (contextual teasers)

## 4.5 Guide Detail Pages
**Links to:**
- Category page
- 3–6 related guides
- 1–3 relevant properties
- 1 FAQ (if relevant)

## 4.6 Getting Here
**Links to:**
- Ferry guide
- Travel guide
- Local essentials

## 4.7 FAQ
**Links to:**
- Related guides
- Related property (when relevant)

---

# 5. Dynamic Teaser Blocks (CMS-Powered)

These blocks allow sitewide cross-linking with minimal manual effort.

## 5.1 Types of Teaser Blocks
- **Related Guides** (by category or manual select)
- **Nearby on Islay** (property page → guides)
- **Visitor Essentials** (petrol, shops, ATMs)
- **Before You Arrive** (FAQ → local essentials)
- **Featured Guides** (homepage)
- **Seasonal Picks** (optional future)

## 5.2 Block Behaviour
- Always include image, title, and short summary.
- Links use H3 or H4 depending on context.
- Sorted by relevance or manual pinning.

---

# 6. Special Linking Cases

## 6.1 Local Essentials
These pages should:
- Link to nearest properties
- Link to Getting Here
- Link to 2–3 related essentials

## 6.2 FAQ
Each FAQ article should:
- Link to at least one guide
- Link to accommodation if relevant

## 6.3 Getting Here
Add GEO context links:
- “See our guide to Islay ferries”
- “Islay Airport information” (if guide exists)

---

# 7. Footer Link Strategy

Footer includes:
- Accommodation
- Explore Islay
- Getting Here
- FAQ
- Top 3 Guides (random or pinned)

This strengthens crawl coverage and AI chunk exposure.

---

# 8. Future-Proofing

As Guides grow, we may introduce:
- "Collections" or "Themes"
- Seasonal blocks (“Winter on Islay”, “Whisky Month”)
- Dynamic homepage hero linking to big guides

CMS architecture supports this with no IA changes.

---

*End of Internal Linking Architecture v1*

