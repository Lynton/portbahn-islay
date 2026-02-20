# AI Search Playbook — Essence Document v1.4.0
**Last updated:** February 17, 2026
**Full playbook:** 40+ files across 8 modules + appendices
**This file:** Single-source context for new threads. Covers principles, structure, stack, tools, and file references.

---

## 1. What This Is

A strategic and practical framework for optimising a multi-site accommodation ecosystem for AI-driven discovery surfaces (ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews) while maintaining human-first editorial quality.

The playbook is based on iPullRank research, Search Matrix analysis, Semrush zero-click data, and hands-on implementation experience. It is iterative — updated as new research validates or challenges the approach.

---

## 2. The Ecosystem

Three interrelated sites. Each has a distinct remit. They must not compete with each other.

| Site | Role | Status |
|------|------|--------|
| isleofjura.scot | Official DMO authority for Jura. Travel, activities, guides, practical info. | Currently WordPress. Will move to Next.js/Sanity once PBI & BJR established. |
| bothanjuraretreat.co.uk (BJR) | Jura accommodation. Personal, experiential lens. Trust + booking confidence. | Currently Wix Studio + Velo backend + Lodgify API. Being redeveloped. |
| portbahnislay.co.uk (PBI) | Islay accommodation. Clarity, local context, booking. | Active rebuild in Next.js/Tailwind/Sanity. Template for other sites. |

**Properties:**
- BJR: Mrs Leonard's Cottage, The Black Hut, The Rusty Hut, The Shepherd's Hut (4 units, 2-night minimum)
- PBI: Portbahn House, Shorefield House, Curlew Cottage (3 houses, 2-night minimum)

**Cross-site rules:**
- Sites cross-pollinate authority and reinforce a shared semantic graph
- No content duplication across sites
- Each site defers to stronger external authorities where appropriate (distilleries, CalMac, etc.)
- Authority and placement decisions are owned by Lynton, not AI agents

---

## 3. Core Principles (The Rules That Never Change)

1. **Retrieval before ranking.** If AI systems can't retrieve your content, nothing else matters.
2. **Passages, not pages, are the unit of retrieval.** Design every section as an independently extractable unit.
3. **One primary entity per page.** Define it explicitly, early, without metaphor.
4. **Fixed spine, flexible skin.** Clear facts first (machine-extractable), human emotion layered after.
5. **Recall before precision.** Explicit > implicit. Redundant > elegant for core definitions.
6. **Semantic triples for key facts.** Subject-Predicate-Object structure for all defining statements.
7. **Entity consistency compounds.** Same names, same attributes, same relationships — everywhere, always.
8. **Outbound linking to stronger authorities increases trust.** This is not SEO leakage.
9. **Editorial restraint.** Absence is better than noise. Don't publish content that exists only to fill a checklist.
10. **No content decision is local in a multi-site ecosystem.** Every page affects the whole graph.

---

## 4. Key Strategic Concepts

**Query Fan-Out (Module 01-05)**
AI systems generate 10-28 synthetic queries per user prompt. 95% have no traditional search volume. Domain saturation effect: 7+ appearances across fan-out queries = 80%+ citation probability.

**Site-Level Vector Coherence (Module 04-04)**
AI systems calculate a site's average embedding (centroid). Pages far from the centroid dilute authority. Each site should maintain tight topical focus. Measurable via Screaming Frog v22+.

**Domain Saturation via Multi-Site (Module 06-05)**
The three-site ecosystem can appear across multiple fan-out query branches simultaneously, compounding citation probability. Single-site = ~18% at 2 appearances. Ecosystem = potentially 80%+ at 7+ appearances.

**Breadth + Depth (Module 06-02)**
One comprehensive page targets multiple fan-out queries naturally. Deep coverage of primary entity + light coverage of adjacent concepts. Never fragment into thin separate pages.

---

## 5. Development Stack

**Current (migrating from):**

| Tool | Used By | Notes |
|------|---------|-------|
| Wix Studio + Velo | BJR | Current live site. Custom calendar + Lodgify API integration. |
| WordPress | IoJ | Current live site. Will be last to migrate. |
| Lodgify (standard site) | PBI | Original site. Being replaced by Next.js build. |

**Target Stack:**

| Tool | Purpose | Status |
|------|---------|--------|
| Next.js | Framework (React, SSR/SSG) | PBI actively building. Template for BJR and IoJ. |
| Tailwind CSS | Styling | Active on PBI. |
| Sanity CMS | Content management | Schemas being developed. Field-level guidance for content creators. |
| Lodgify API | Booking system integration | Working on BJR (Wix). Being ported to Next.js for PBI. |
| Vercel | Hosting & deployment | PBI deploying. CI/CD via GitHub. |
| Cloudflare | CDN / DNS | Integration with Vercel. |
| Cursor | Development & iteration | Primary code editor. AI-assisted. |
| GitHub | Version control | Connected to Vercel for auto-deploy. |

**AI Tool Workflow:**

| Tool | Role |
|------|------|
| Claude Pro (claude.ai) | Strategic decisions — content hierarchy, SEO/AEO/GEO strategy, playbook development |
| Claude Code | Autonomous structural tasks — schema generation, component scaffolding |
| Cursor | Refinement, polish, implementation |

---

## 6. SEO / AEO / GEO Tooling

**Currently Using:**

| Tool | Purpose | Notes |
|------|---------|-------|
| Screaming Frog SEO Spider | Crawl analysis, technical SEO | Free mode currently. v22 paid licence recommended — unlocks vector embedding workflows. See Module 07-02. |
| AnswerThePublic | Question/query research | Useful for identifying question-led content structures. |
| Ubersuggest | Keyword research, competitor analysis | Neil Patel tool. Basic keyword data. |
| Google Search Console | Search performance, indexing | Active for live sites. |
| GA4 | Analytics | 3 properties configured. |

**Recommended to Get / Explore:**

| Tool | Purpose | Priority | Notes |
|------|---------|----------|-------|
| Screaming Frog v22 (paid) | Vector embedding analysis, centroid audit, semantic search | High | ~£199/year. Operationalises core playbook principles. See Module 07-02, Section 2. |
| Ollama | Free local LLM + embeddings | High | Pairs with SF v22 for zero-cost embedding generation. Models: embedding-gemma, mxbai-embed-large. |
| QFOria (iPullRank) | Query fan-out tracking | Medium | Free. Reveals synthetic queries AI systems generate. |
| Relevance Doctor (iPullRank) | Passage scoring | Medium | Free. Pre-publish passage quality check. |
| Profound | Deep ChatGPT query analysis | Low–medium | Commercial. Most comprehensive QFO tracking. |
| MarketBrew | RAG simulation, content prediction | Low | Enterprise. Useful when ready for predictive testing. |
| N8N | Workflow automation | Low | Open source. Build custom analysis pipelines when scale demands it. |

---

## 7. Playbook Module Index

Full playbook files should be uploaded to a thread only when working deeply on that module's content. This index tells you what exists and where to look.

**Module 01: Mental Models**

| File | Summary |
|------|---------|
| 01-01 | Relevance engineering replaces traditional SEO as the operating model |
| 01-02 | How AI search actually works (RAG, retrieval, synthesis) |
| 01-03 | Visibility vs traffic — zero-click changes the value equation |
| 01-04 | Ranking is the wrong abstraction — retrieval eligibility is the gate |
| 01-05 | Query fan-out: 10-28 synthetic queries per prompt, domain saturation effect |

**Module 02: Retrieval Engineering**

| File | Summary |
|------|---------|
| 02-01 | Retrieval vs ranking — retrieval is the gate, ranking is downstream |
| 02-02 | Crawlability for AI bots — technical accessibility requirements |
| 02-03 | Rendering strategies — SSR, hydration, content in initial HTML |
| 02-04 | Passage-level retrieval — chunks not pages are retrieved |
| 02-05 | Internal linking as retrieval paths + vector-based link discovery (v1.4) |

**Module 03: Entity & Schema Discipline**

| File | Summary |
|------|---------|
| 03-01 | Entity-first site architecture — one entity per page |
| 03-02 | How LLMs build entity graphs — consistency beats cleverness + semantic triples |
| 03-03 | Schema as meaning transport — accelerant not foundation |
| 03-04 | JSON-LD graph strategy — practical schema patterns |
| 03-05 | Entity consistency and drift — prevention and detection |

**Module 04: Content for Synthesis**

| File | Summary |
|------|---------|
| 04-01 | Writing for passage extraction — fixed spine, flexible skin + triple pattern |
| 04-02 | Chunking and section design — sections within pages, not separate pages |
| 04-03 | Question-led content structures — FAQ deployment, latent follow-up intent |
| 04-04 | Avoiding semantic noise + site-level vector coherence (v1.4) |
| 04-05 | Good vs bad examples — concrete before/after patterns |

**Module 05: Zero-Click Visibility**

| File | Summary |
|------|---------|
| 05-01 | Zero-click visibility strategy |
| 05-02 | Mentions vs citations — different value, different strategy |
| 05-03 | Brand narrative control |
| 05-04 | Community and external surfaces |
| 05-05 | Measuring visibility without clicks |

**Module 06: Application Playbooks**

| File | Summary |
|------|---------|
| 06-01 | Site rebuild playbook — sequencing for the migration |
| 06-02 | Page design for AI search — breadth vs depth, section ordering |
| 06-03 | Entity mapping workflow |
| 06-04 | Schema decision tree |
| 06-05 | Multi-site coordination rules — domain saturation, authority boundaries |

**Module 07: Checklists, Tools & Patterns**

| File | Summary |
|------|---------|
| 07-01 | AI search practical checklist — the brutally practical list |
| 07-02 | Tools and platforms — SF v22 vector workflows (v1.4), QFO tools, automation, local AI |

**Module 08: Site-Specific Notes**

| File | Summary |
|------|---------|
| 08-01 | BJR AI-first page spec framework |
| 08-02 | PBI AEO content standards |
| 08-03 | PBI FAQ strategy |

**Supporting Files**

| File | Purpose |
|------|---------|
| Appendix A | Technical context (RAG, embeddings, vector databases) — optional background |
| SKILL.md | Condensed strategic guide for Claude skill system (~25KB) |
| quick-reference.md | Operational quick-reference (~8KB) |
| changelog.md | Version history and validation sources |

---

## 8. What Changed Recently

**v1.4.0 (February 2026)**
- Screaming Frog v22+ vector workflows added to 07-02 (5 operational workflows)
- Site-level vector coherence concept added to 04-04 (centroid analysis, audit workflow)
- Vector-based internal link discovery added to 02-05 (3 methods with thresholds)
- Paragraph-level competitive scoring workflow added to 07-02
- Ollama section updated with SF integration and model recommendations
- Validated against Mike King / Wix AI Search Lab vector embedding research (Feb 2026)

**v1.3.0–1.3.1 (January 2026)**
- Query fan-out module (01-05) with iPullRank QFO research data
- Tools & Platforms guide (07-02)
- Semantic triples pattern added to 03-02 and 04-01
- Technical context appendix (Appendix A)
- SKILL.md and quick-reference.md for skill system

---

## 9. Key Project Files (Non-Playbook)

These files contain site-specific implementation details. They are canonical in their respective environments, not in this thread.

| File | Contents | Location |
|------|---------|---------|
| BJR-Configuration-Notes.md | Lodgify API config, property IDs, iCal URLs, checkout URLs | Cowork sites/bjr/ |
| bjr-cal.js | Custom availability calendar component (Wix/Lodgify) | BJR dev repo |
| http-functions.js | Wix Velo backend — Lodgify API proxy functions | BJR dev repo |
| bjr_design_system_brief_v1.md | BJR visual design system | Cowork sites/bjr/design/ |
| bjr_typography_interaction_rules.md | Typography and interaction patterns | Cowork sites/bjr/design/ |
| bjr_rebuild_master_summary.md | BJR rebuild status and decisions | Cowork sites/bjr/ |
| bjr_transition_summary.md | BJR migration tracking (analytics, apps, etc.) | Cowork sites/bjr/ |
| pbi_nextjs_reference.md | PBI Next.js rebuild reference (stack setup, phases, Lodgify integration) | /dev portbahn-islay/docs/ |
| phase_1_checkout_spec.md | PBI checkout flow specification | Cowork sites/pbi/content/ |

---

## 10. Thread Guidelines

- Check with Lynton before executing token-heavy tasks (code generation, large content blocks)
- Token efficiency matters — use master threads for key discussions, spin off sub-threads for heavy execution
- Authority decisions are Lynton's — if placement or content ownership is unclear, stop and ask
- This essence file is the starting point — upload full playbook modules only when working deeply on them
- Update this file when significant decisions are made or the playbook evolves

---

## 11. Decision-Making Boundaries

**You decide:** How to structure content for retrieval, passage design, schema patterns, technical implementation within agreed constraints.

**Lynton decides:** Which site content belongs on, whether content should exist, which site is primary authority, design direction, publishing decisions.

**If unclear:** Stop and ask. Do not guess placement or authority.

---

## 12. Research Notes & Watchlist

Dated notes from ongoing research. Folded into playbook modules when enough accumulates for a version bump.

### Feb 2026 — iPullRank AI Search Manual Update Review

*Source: iPullRank AI Search Manual, Feb 2026 update (4 new chapters, multiple chapter revisions). Reviewed against playbook v1.4.0.*

**1. ChatGPT 5.2: Fewer, more specific fan-out queries**
Affects: Module 01-05 (Query Fan-Out)
ChatGPT's 5.2 model generates longer-tail queries with minimal fan-out branches, down from the 10-28 range in earlier models. Implication: content needs to be more precisely targeted per primary query. Our breadth + depth principle still holds but emphasis tilts toward precision.
**Action:** Note for next 01-05 revision. No strategic change required.

**2. Local citation corroboration — genuine gap identified**
Affects: Module 05-04 (Community and External Surfaces), Module 07-01 (Checklist)
Yext study (6.9M citations): AI models verify facts against multiple source types. A fact appearing only on your own site is treated as less trustworthy. We cover outbound linking to authorities but haven't explicitly addressed the reverse: ensuring entity facts appear on third-party platforms.
**Action for ecosystem:** Ensure core entity facts (property names, locations, capacities, categories) are consistent across GBP, VisitScotland, Jura Development Trust, directory listings, and review platforms. This is entity consistency (03-05) applied externally.

**3. Google Business Profile as AI retrieval signal**
Affects: Module 07-01 (Checklist)
GBP categories, attributes, and Q&A sections are now direct inputs to AI answer generation. AI Overviews are being blended directly into GBP displays.
**Action:** Ensure all three sites have optimised GBPs with accurate categories, complete attributes, and populated Q&A. Add to pre-launch checklist.

**4. Video as retrieval surface (YouTube — watch only)**
New chapter covers YouTube content as an AI retrieval signal. Not actionable now.
**Action:** None yet. Revisit when video content strategy is on the table.

**5. Agentic booking (AI automation — watch only)**
AI agents making bookings on behalf of users. Our Lodgify API integration positions us well for this future.
**Action:** None yet. Architecture is already compatible.
