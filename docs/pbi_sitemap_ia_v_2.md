# Portbahn Islay (PBI) — Sitemap & Information Architecture (IA v2)

This document defines the approved sitemap and information architecture for the Portbahn Islay (PBI) website. It reflects the strategic split between **SEO/AI discovery content** and **guest-focused informational content**, following the AI-First Page Specification Framework and the BJR shared design system.

---

# 1. Top-Level Sitemap (Phase 1 → Phase 2 Compatible)

**Primary navigation:**
- `/` — Home
- `/accommodation/` — Accommodation overview
- Dynamic CMS property pages:
  - `/accommodation/portbahn-house/`
  - `/accommodation/shorefield-house/`
  - `/accommodation/curlew-cottage/`
- `/about/` — About Portbahn Islay
- `/getting-here/` — Travel & arrival info
- `/islay-guides/` — Explore Islay hub (SEO/AI cluster)
- `/faq/` — Guest FAQs & property how-to guides
- `/contact/`
- Legal pages:
  - `/privacy/`
  - `/terms/`
  - `/cookies/`

This structure supports the long-term PBI content strategy while maintaining strict semantic clarity for SEO and AI retrieval.

---

# 2. SEO / AI Discovery Cluster — **Islay Guides**

## 2.1 Root URL
- **`/islay-guides/`**
- Visible nav label: **Explore Islay**

This is the primary entity-led content hub for all long-tail, high-intent discovery traffic.

## 2.2 Categories (optional in Phase 1, required in Phase 2)
- `/islay-guides/things-to-do-on-islay/` *(cornerstone pillar page)*
- `/islay-guides/beaches/`
- `/islay-guides/walks/`
- `/islay-guides/whisky/`
- `/islay-guides/distilleries/`
- `/islay-guides/food-and-drink/`
- `/islay-guides/ferries/`
- `/islay-guides/travel/`

## 2.3 Guide Detail Pages (CMS)
Pattern:
```
/islay-guides/{slug}/
```
Examples:
- `/islay-guides/machir-bay-beach/`
- `/islay-guides/finlaggan/`
- `/islay-guides/ardbeg-distillery/`

Each guide uses AI-First layout:
- H1 + hero
- Quick facts block
- GEO signals
- 4–6 semantic content chunks
- Bulleted lists where relevant
- Internal links to related guides and properties

---

# 3. Guest-Focused Content — **FAQ + Property Pages**

These pages target **already-aware visitors or guests**, not search discovery.

## 3.1 FAQ
- **`/faq/`** — single structured page

Recommended sections:
- Before You Arrive
- At the Property
- Local Essentials
- Troubleshooting

Example entries:
- How do I light the wood stove?
- Where is the nearest petrol station?
- How do I use the heating?
- Where can I park?

These may be stored in a simple `FAQ` CMS collection later but remain under a single URL for crawl clarity.

## 3.2 Property Page Guest Information
Located inside each dynamic property page:
```
/accommodation/{property-slug}/
```
Typical sub-sections:
- Check-in / Check-out
- Parking
- Stove / Heating
- House quirks
- Local essentials
- Links to `/faq/` and relevant `/islay-guides/`

---

# 4. Getting Here — Travel Logistics

- **`/getting-here/`** — main page

Content blocks:
- By ferry
- By air
- By car
- Winter travel guidance
- Links to `/islay-guides/ferries/` and `/islay-guides/travel/`

Optional future sub-pages:
- `/getting-here/by-ferry/`
- `/getting-here/by-air/`

---

# 5. CMS Overview (Reference for Future Studio Build)

## 5.1 `Properties` Collection
- Name
- Slug
- Hero image
- Gallery
- Summary
- Description (chunked)
- Sleeps, beds, bathrooms
- Amenities list
- Location metadata
- Guest information snippets
- SEO fields (title, meta description, OG)

## 5.2 `Guides` Collection (SEO/AI content)
- Title
- Slug
- Category (Beaches, Walks, Whisky, etc.)
- Hero image
- Summary
- Quick facts (structured)
- Body chunks (H2/H3 sections)
- GEO markers
- Related guides (multi-ref)
- Related properties (multi-ref)
- SEO fields

## 5.3 `FAQ` Collection (Optional)
- Question
- Answer
- Category (Before you arrive, At the property, etc.)
- Related property (optional)

---

# 6. Internal Linking Strategy

### Guide Detail Pages
- Link to at least one relevant property
- Link to 2–4 related guides

### Property Pages
- Link to nearby beaches/walks/food pages in `/islay-guides/`

### Core Pages (Home, Accommodation, About)
- Feature 1–3 key guide links to reinforce topical authority

---

# 7. Notes
- This sitemap is designed to maximise **long-tail discovery**, **AI citation**, and **clean user flow**.
- Guest-only content (FAQs, house info) is intentionally kept out of the `/islay-guides/` cluster.
- This IA will guide future CMS setup and page-level briefs.

---

*End of PBI Sitemap & IA v2*