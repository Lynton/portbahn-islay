# PBI Guide Pages: 10/10 Scorecard

Version: 1.0
Based on: AI Search Playbook v1.4.0
Reference files: GUIDE-PAGES-BRIEF.md | Full playbook: .skills/skills/ai-search-playbook/SKILL.md

---

## 10 Criteria — 1 Point Each

A page must score 10/10 before launch and before being used as a template for new pages.

| # | Criterion | Pass condition | Common fail |
|---|---|---|---|
| 1 | Entity-first opening | First paragraph explicitly names the entity, its type, location, and scope | Page drops straight into block content with no page-level framing |
| 2 | Entity-based h2 headings | All block h2 headings are descriptive entity titles set in Sanity's `heading` field | Raw blockId labels render: "Wildlife Geese", "Distilleries Overview" |
| 3 | Passage quality | Paragraphs 3–6 sentences; entity names used (not pronouns); each section standalone and extractable | 7+ sentence paragraphs; "it", "they", "the property" without referent; sections that only make sense in context |
| 4 | Extended editorial | Guide-level content beyond canonical blocks — Section 5 of spec is live on page | Page ends after block content; no guide layer |
| 5 | FAQ block | 5 visitor-specific Q&As (practical decisions: booking, timing, logistics) — not generic "what is X?" | Generic intro FAQs; proximity-only FAQs ("how close is [property]?"); no FAQs at all |
| 6 | FAQPage schema | FAQPage schema on FAQ section — wired to the correct block | FAQPage absent; Article schema only |
| 7 | Full schema suite | TouristDestination at page level + context-relevant types (LocalBusiness, TouristAttraction, Event) | Article + BreadcrumbList only |
| 8 | Internal links | Links to all 3 properties + 2+ related guide pages + /explore-islay hub, at natural anchor points | No internal links; links present but to wrong anchors or missing hub |
| 9 | Query fan-out coverage | 12+ distinct queries answerable from opening + blocks + editorial + FAQs (see Section 2 of each spec) | Fewer than 6–8 queries addressed; page too narrow for fan-out |
| 10 | Technical | AI bots allowed in robots.txt (GPTBot, anthropic-ai, PerplexityBot, GoogleOther); no rendering bugs; noindex removed; canonical set | Any AI crawler blocked; "---" separator rendering as literal text; noindex still live |

---

## Per-Page Score Sheet

Copy once per page. Must be 10/10 before launch.

```
Page: /guides/[slug]
Date reviewed:
Reviewer:

[ ] 1. Entity-first opening paragraph
[ ] 2. Entity-based h2 headings (set in Sanity heading field)
[ ] 3. Passage quality — 3-6 sentences, standalone, entity names not pronouns
[ ] 4. Extended editorial (Section 5) live on page
[ ] 5. FAQ block — 5 visitor-specific Q&As
[ ] 6. FAQPage schema on FAQ block
[ ] 7. Full schema suite — TouristDestination + context types
[ ] 8. Internal links — all 3 properties + 2+ guides + hub
[ ] 9. Query fan-out — 12+ queries answerable from page
[ ] 10. Technical — AI bots allowed, no rendering bugs, noindex off, canonical set

Score: /10

Status:   PASS (10/10) — clear for launch
          HOLD (< 10/10) — list fails below

Fails to resolve:
```

---

## Current Status: Existing 5 Pages

| Page | Pre-spec score | Post-spec implementation | Blocker |
|---|---|---|---|
| /guides/food-and-drink | ~5/10 | ~9.5/10 | Criterion 3 (passage audit), Criterion 10 (technical) |
| /guides/family-holidays | ~4/10 | ~9/10 | Criterion 3 (Block 12 version risk), Criterion 10 |
| /guides/islay-beaches | ~5/10 | ~9.5/10 | Criterion 3 (passage audit), Criterion 10 |
| /guides/islay-wildlife | ~5/10 | ~9.5/10 | Criterion 3 (passage audit), Criterion 10 |
| /guides/islay-distilleries | ~5/10 | ~9.5/10 | Criterion 3 (passage audit), Criterion 10 |

**Criterion 3 action:** Audit Blocks 8, 9, 10, 11, 12 in CANONICAL-BLOCKS-MERGED.md against passage criteria before sign-off.

**Criterion 10 action:** Confirm robots.txt allows GPTBot, anthropic-ai, PerplexityBot, GoogleOther. Fix BlockRenderer "---" separator. Remove noindex at launch.

**Family Holidays specific:** Confirm Block 12 Sanity import is v3.1 narrative (not temp_intake condensed bullets) before scoring criterion 3.

---

## Quick Fix Guide

| Fails | Where to fix |
|---|---|
| 1–5 (content) | Guide spec → Sanity import |
| 6–7 (schema) | Dev — schema config per guide spec Section 8 |
| 8 (links) | Dev — Sanity block content or page template per guide spec Section 6 |
| 9 (coverage) | Add targeted sections to extended editorial in guide spec Section 5 |
| 10 (technical) | Dev — robots.txt, BlockRenderer, canonical config, noindex toggle |

---

## New Page Checklist

For Walking, Visit Jura, and all pages after. Build these in from the start — don't retrofit.

Before writing the spec:
- [ ] Primary entity is unambiguous and distinct from existing pages
- [ ] Page belongs to PBI's topical centroid (Islay accommodation + activities)
- [ ] Intent ownership is correct for portbahnislay.co.uk (not duplicating isleofjura.scot)

Spec must include:
- [ ] Section 2: 12+ target queries
- [ ] Section 3: Block wiring + heading recommendations
- [ ] Section 4: Entity-first opening paragraph
- [ ] Section 5: Extended editorial (guide-level content, not just blocks)
- [ ] Section 6: Internal links table
- [ ] Section 7: 5 visitor-specific FAQ items
- [ ] Section 8: Full schema suite
- [ ] Section 9: Dev notes + [CONFIRM] items

Before dev hands off to live:
- [ ] Run per-page score sheet above
- [ ] Score 10/10 confirmed

---

*Maintained by Lynton Davidson | portbahnislay.co.uk*
*AI Search Playbook v1.4.0 | Next scorecard review: Q3 2026*
