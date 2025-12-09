# Portbahn Islay — CMS Schema (v1)

This document defines the full CMS schema for the Portbahn Islay (PBI) website. It reflects a unified, AI‑optimised content model designed to:
- Enable deep internal linking
- Support teaser blocks across pages
- Improve AI citation & SEO extractability
- Keep guest-facing and SEO-facing content clearly separated
- Provide future expansion space (PDF guides, welcome guide, etc.)

All CMS collections follow BJR’s shared structural system.

---

# 1. Collections Overview

PBI requires five core collections:

1. **Properties** — Portbahn House, Shorefield House, Curlew Cottage
2. **Guides** — All public SEO/AI discovery content (Islay Guides)
3. **FAQ** — Guest support articles (accordion + full article pages)
4. **Local Essentials** — Optional, but structurally part of Guides
5. **Welcome Guides (Phase 2/3)** — Optional for guest PDF + web guides

Additional notes:
- Collections are structured for cross-linking.
- All collections include SEO fields.
- All rich text follows chunking patterns.

---

# 2. `Properties` Collection Schema

### **Purpose:**
Accommodation detail pages & teaser blocks.

### **Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `name` | Text | Full property name (Portbahn House) |
| `short_name` | Text | For UI where shorter labels are needed |
| `slug` | Slug | Auto-generated |
| `hero_image` | Image | Used for hero & cards |
| `gallery` | Gallery (multi-image) | For dynamic lightbox gallery |
| `summary` | Text (short) | 25–40 words |
| `description_chunked` | Rich text (multi-section) | Overview → features → story |
| `sleeps` | Number | |
| `bedrooms` | Number | |
| `bathrooms` | Number | |
| `amenities` | Multi-select list | e.g. WiFi, Wood Stove, Sea Views |
| `location_notes` | Rich text | GEO markers and travel orientation |
| `nearest_beach` | Reference (Guide) | Optional |
| `nearest_walk` | Reference (Guide) | Optional |
| `related_guides` | Multi-ref (Guides) | Auto-populates teaser blocks |
| `guest_information` | Rich text (chunked) | FAQ-style notes shown on page |

### **Future Fields (Phase 2/3)**
| Field | Type |
|-------|------|
| `welcome_pdf` | File |
| `house_rules_pdf` | File |
| `pets_policy_pdf` | File |
| `property_map_pdf` | File |
| `emergency_info` | Rich text |

---

# 3. `Guides` Collection Schema

### **Purpose:**
Public-facing, SEO/AI-driven Islay content.

### **Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `title` | Text | Guide title (e.g. Machir Bay Beach) |
| `slug` | Slug | Auto-generated under `/islay-guides/` |
| `category` | Single-select | Beaches, Walks, Whisky, Distilleries, Food & Drink, Ferries, Travel, Local Essentials |
| `hero_image` | Image | |
| `summary` | Text (short) | 25–40 words |
| `quick_facts` | Rich text / Key-value fields | GEO markers, safety notes, durations |
| `body_chunks` | Rich text (structured sections) | Overview → Highlights → GEO → Notes |
| `geo_markers` | Multi-select | Distillery names, beaches, villages |
| `related_guides` | Multi-ref | Auto-populates teasers |
| `related_properties` | Multi-ref (Properties) | Used for cross-link cards |
|
### **SEO Fields:**
- `seo_title`
- `seo_description`
- `og_image`

---

# 4. `FAQ` Collection Schema

### **Purpose:**
Guest support content + long-form operational articles.

### **Dual structure:**
- **Accordion source:** `/faq/`
- **Full article pages:** `/faq/{slug}/`

### **Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `question` | Text | Accordion label |
| `slug` | Slug | For /faq/article-name |
| `short_answer` | Rich text | For accordion, max 3 sentences |
| `full_answer` | Rich text (chunked) | For long-form article pages |
| `category` | Single-select | Before You Arrive, At the Property, Local Essentials, Troubleshooting |
| `related_property` | Reference (Properties) | Optional |
| `related_guides` | Multi-ref | Cross-link SEO content |
|
### SEO Fields:
- `seo_title`
- `seo_description`
- `og_image`

---

# 5. `Local Essentials` (Part of Guides)

This content can live in `Guides` with category = **Local Essentials**.

Example items:
- Petrol stations on Islay
- Supermarkets & food shops
- ATMs
- EV charging points
- Local taxis

Keeping these as Guides:
- Helps SEO
- Supports teaser blocks
- Enables cross-linking from FAQ and Property pages

---

# 6. Welcome Guide (Phase 2/3)

A later expansion collection.

### Fields:
| Field | Type |
|-------|------|
| `property` | Reference (Properties) |
| `intro_text` | Rich text |
| `house_rules` | Rich text or file |
| `check_in` | Rich text |
| `check_out` | Rich text |
| `local_map_pdf` | File |
| `quick_contacts` | Repeater |
| `emergency_info` | Rich text |

---

# 7. Field Naming Conventions

- Use lowercase snake_case
- Summaries = short text
- Descriptions = chunked long-form
- Slugs match primary entity (Islay, beaches, whisky, etc.)

---

# 8. Cross-Collection Relationships

### **Properties → Guides**
- `related_guides`
- Nearest beach / walk / distillery

### **Guides → Properties**
- Related properties section

### **FAQ → Guides / Properties**
- Link operational info to relevant SEO content

### **Teaser Blocks**
All pages can pull from:
- Guides (top 3, related, by category)
- FAQs (top 5 by category)
- Local Essentials (highly recommended)
- Property-specific blocks

---

# 9. CMS & AI: Chunking Rules

All long-form fields must be structured as:
- H2 section
- 1–3 sentences
- Optional bullet lists
- Images placed between chunks only
- GEO entities repeated explicitly

This matches the AI-first page spec and ensures high extractability.

---

*End of PBI CMS Schema (v1)*

