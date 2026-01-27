# AI Search Playbook v1.3.1

## Skill Overview

**Purpose:** Strategic framework for optimizing websites for AI-driven discovery surfaces (ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews) while maintaining human-first editorial quality.

**Scope:** Content strategy, information architecture, semantic optimization, and multi-site ecosystem coordination.

**Context:** Developed for Isle of Jura & Islay accommodation ecosystem (isleofjura.scot, bothanjuraretreat.co.uk, portbahnislay.co.uk).

**Version:** 1.3.1 (January 23, 2026)

---

## When to Use This Skill

Invoke this skill when:
- Designing site architecture or information hierarchies
- Writing or reviewing content for AI search optimization
- Making decisions about entity modeling or schema implementation
- Coordinating content strategy across multiple related sites
- Evaluating passage quality or semantic clarity
- Planning content structures for retrieval and synthesis
- Making technical decisions about crawlability or rendering

**Trigger phrases:** "use the playbook", "check against AI search standards", "follow AEO guidelines", "apply relevance engineering principles"

---

## Core Mental Models

### 1. Relevance Engineering vs Traditional SEO

**Old model:** Optimize pages to rank → Users click → Users read

**New model:** Optimize passages to retrieve → AI reads → AI synthesizes → Users receive answers

**Key shift:** The unit of competition is no longer the page—it's the passage and the entity.

### 2. Query Fan-Out Reality

AI systems don't search once. They generate **10-28 synthetic queries** per user prompt.

**Critical data (iPullRank research):**
- 95% of fan-out queries have NO traditional search volume
- 1 domain appearance = 9.7% citation probability
- 7+ appearances = 80%+ citation probability
- No position bias across fan-out queries (~21-22% overlap each)

**Implication:** Breadth + depth beats narrow optimization. One page should target multiple related queries naturally.

### 3. Passages Over Pages

**RAG pipeline (simplified):**
1. Pages split into passages → converted to embeddings → stored in vector DB
2. User query → semantic search → top passages retrieved
3. Passages injected into LLM context → answer synthesized

**Reality:** Only 3-10 passages typically make it into final context. Passage quality determines inclusion.

### 4. Entity-First Architecture

AI systems understand the world through **entities and relationships**, not pages.

**Design principle:** One primary entity per page. Consistent entity definitions across ecosystem.

**Why it matters:** Consistent entities → stable embeddings → reliable retrieval → increased citations.

### 5. Zero-Click Visibility

**Traffic ≠ impact.** Influence often happens before/without clicks.

**New success signals:**
- AI citation frequency
- Multi-query appearance rate
- Domain saturation score
- Branded search growth
- Self-reported attribution

---

## Strategic Principles (Non-Negotiable)

### Fixed Spine, Flexible Skin

**Fixed spine (factual core):**
- Entity name and type
- Core attributes (location, capacity, constraints)
- Explicit relationships
- Unambiguous scope

**Flexible skin (expressive layer):**
- Emotional language
- Sensory descriptions
- Human perspective
- Narrative color

**Rule:** Be boring once (entity definition), be beautiful everywhere else.

### Recall Before Precision

AI systems favor **explicit over implicit**, **repeated over elegant**.

**Example:**
- ❌ Weak: "A contemplative space overlooking the bay"
- ✅ Strong: "Portbahn House is a self-catering holiday home on the Isle of Islay, Scotland. The property sleeps 8 guests and overlooks Loch Indaal bay."

The second is less poetic but vastly more retrievable.

### Programmatic Legibility

> "We are no longer just formatting for 'skimmability' or 'dwell time.' We are formatting for Programmatic Legibility."  
> — Mike King, iPullRank

Content must be structured for machine extraction, not just human reading.

---

## Practical Decision Framework

### Should This Be a Page?

**Ask:**
1. Which entity does this primarily represent?
2. Is this entity distinct from others?
3. Does this add coverage for fan-out queries?
4. Can this stand as a coherent, comprehensive unit?

**If unclear → Don't create the page yet.**

### Is This Passage Extractable?

**Test:** Could this section be lifted out and still make sense?

**Good passage characteristics:**
- Answers one clear question
- Defines terms explicitly
- Contains 3-6 sentences (typically)
- Has descriptive heading
- Uses entity names (not just pronouns)

**Bad passage characteristics:**
- Mixes multiple ideas
- Relies on surrounding context
- Uses vague references ("this", "it")
- Drifts across topics

### Entity Consistency Check

**Before publishing, verify:**
- [ ] Entity name used consistently
- [ ] Entity type/category clear
- [ ] Core attributes stated explicitly
- [ ] No competing definitions elsewhere
- [ ] Schema aligns with visible content

### Multi-Site Coordination

**For ecosystem projects:**
- Define intent ownership per site (who answers which queries)
- Share entity identifiers where appropriate
- Maintain consistent terminology across domains
- Cross-link as reinforcement, not duplication

**Goal:** Domain saturation across ecosystem → 8X citation advantage

---

## Content Patterns That Work

### Section Ordering (Conversational Flow)

Standard sequence for entity pages:
1. What is this? (definition, category)
2. Where is it? (location, context)
3. What makes it distinctive? (differentiation)
4. What can I do here? (function, activities)
5. What do I need to know? (constraints, policies)
6. How do I proceed? (booking, access)

**Rationale:** Mirrors natural discovery, reduces uncertainty progressively.

### Semantic Triple Pattern

Write relationships as clear semantic triples:

**Format:** Subject → Predicate → Object

**Examples:**
- "Portbahn House is located in Bruichladdich, Isle of Islay"
- "The property sleeps 8 guests in 4 bedrooms"
- "Portbahn House offers sea views across Loch Indaal"

**Why:** LLMs extract relationships from these patterns to build entity graphs.

### Question-Led Sections (When Appropriate)

**Use questions when:**
- Reframing entity attributes in natural language
- Addressing practical visitor concerns
- Creating contextual Q&A blocks (not standalone FAQ pages)

**Don't use questions when:**
- Defining the primary entity (use keyword headings: "Facilities", "Location")
- Creating section navigation
- Just for variety (consistency matters more)

### Breadth vs Depth Strategy

**Go deep on core entity:**
- Exhaustive attributes
- Clear differentiation
- Multiple extraction angles

**Go light on adjacent concepts:**
- Brief context or summary
- Link to authoritative sources
- Just enough for fan-out query retrieval

**Example (property page):**
- Deep: Property details, facilities, house rules
- Light: Local area overview + links to guide pages

---

## Common Failure Modes (Avoid These)

### ❌ Multiple Entities Per Page
**Problem:** Weakens both entities, creates ambiguous embeddings

**Fix:** One primary entity per page. Supporting entities get mentions + links.

### ❌ Clever but Vague Headings
**Problem:** "Overview", "More Information", "Things to Consider"

**Fix:** Descriptive headings: "Sleeping Arrangements", "Pet Policy", "Getting Here"

### ❌ Long Narrative Paragraphs
**Problem:** Meaning buried, poor extraction, weak passages

**Fix:** 3-6 sentence sections with clear scope

### ❌ Hidden Dependencies
**Problem:** Passage assumes context from elsewhere

**Fix:** Each section self-contained (can stand alone if extracted)

### ❌ Inconsistent Entity Naming
**Problem:** Fragments embeddings, reduces consensus, lowers citations

**Fix:** Canonical entity name used consistently everywhere

### ❌ Semantic Noise
**Problem:** Adjectives without facts, vague superlatives, metaphors in definitions

**Fix:** Fixed spine first (facts), then flexible skin (emotion)

### ❌ Checklist Content
**Problem:** Content that exists only to "cover a topic" without adding value

**Fix:** Remove it. Absence is better than noise. Link to stronger authorities.

---

## Pre-Publish Checklist

Run every page through this before shipping:

**Entity & Intent:**
- [ ] Primary entity is unambiguous
- [ ] Only one primary entity per page
- [ ] Entity named consistently with canonical references
- [ ] Entity type/category clear
- [ ] Intent ownership correct for this site

**Retrieval & Access:**
- [ ] Content crawlable by AI bots
- [ ] Core meaning in initial HTML (no JS dependency)
- [ ] Page shallowly linked from relevant hubs
- [ ] Canonicals intentional and correct

**Passage & Structure:**
- [ ] Each section answers one clear question
- [ ] Sections can stand alone if extracted
- [ ] Headings descriptive and scoped
- [ ] Passages concise and focused (3-6 sentences typical)
- [ ] Important content not hidden behind accordions/tabs

**Writing Quality:**
- [ ] Clear factual spine (entity definition explicit)
- [ ] Emotional language layered after clarity
- [ ] Removing adjectives still leaves correct definition
- [ ] Expressive language doesn't redefine scope

**Entity Relationships:**
- [ ] Relationships to other entities explicitly stated
- [ ] Internal links reinforce meaning
- [ ] Anchor text descriptive and consistent

**Schema:**
- [ ] Schema reinforces visible content (no new claims)
- [ ] Schema solves real ambiguity
- [ ] Entity @id values stable and reused
- [ ] Schema minimal, intentional, readable

**Zero-Click Check:**
- [ ] Could this shape an AI answer?
- [ ] Would AI feel safe citing it?
- [ ] Reinforces how we want to be described?

**Full checklist:** See `quick-reference.md` or playbook module 07-01

---

## Tool Recommendations

**Query Fan-Out Analysis:**
- QFOria (iPullRank) - Free Google AI Mode tracking
- Profound - Deep ChatGPT analysis
- MarketBrew - RAG simulation

**Passage Scoring:**
- Relevance Doctor (iPullRank) - Free passage quality checker
- Ollama + local models - Privacy-first testing

**Workflow Automation:**
- N8N (self-hosted) - Visual workflow automation
- Ollama - Local LLM processing
- Crew.AI - Multi-agent systems

**Full tool guide:** See playbook module 07-02

---

## Integration with Project Files

**Full playbook location:** `/mnt/project/playbook-v1.3.1/`

**Quick reference:** `/mnt/skills/user/ai-search-playbook/quick-reference.md`

**Key modules for deep reference:**
- 01-05: Query fan-out mechanics and data
- 02-04: Passage-level retrieval patterns
- 03-02: How LLMs build entity graphs
- 04-01: Writing for passage extraction
- 04-02: Chunking and section design
- 06-02: Page design patterns
- 07-01: Complete pre-publish checklist
- 07-02: Tools and platforms guide
- Appendix A: Technical context (RAG, embeddings, vector DBs)

---

## Working with Claude Code

**Effective handoffs to Claude Code:**

```
Reference AI Search Playbook v1.3.1.

Key modules for this task:
- 04-02: Chunking guidelines
- 06-02: Page design patterns
- 07-01: Pre-publish checklist

Build [specific deliverable] following these specs.
```

**Claude Code can read playbook files directly from project.**

---

## Multi-Site Coordination Rules

**For Jura/Islay ecosystem:**

**isleofjura.scot (Primary Authority):**
- Owns: Destination guides, comprehensive area information
- Intent: Research, planning, discovery
- Entity role: Canonical definitions for locations, activities

**bothanjuraretreat.co.uk (Secondary):**
- Owns: BJR property details, experiential narrative
- Intent: Booking confidence, emotional connection
- Entity role: References DMO, reinforces entities

**portbahnislay.co.uk (Secondary):**
- Owns: PBI property details, practical information
- Intent: Accommodation booking, at-a-glance info
- Entity role: References DMO and stronger authorities (distilleries, CalMac)

**Coordination strategy:**
- Shared entity definitions (consistent naming, typing)
- Clear intent ownership (no competitive overlap)
- Cross-linking as reinforcement
- Domain saturation: 8X advantage when all three sites appear in fan-out queries

---

## Version-Specific Notes (v1.3.1)

**What's new:**
- Added Appendix A (technical context on RAG, embeddings, vector DBs)
- Updated README to reference technical appendix
- Minor version bump from v1.3 to v1.3.1

**Previous major updates (v1.3):**
- Query fan-out module with iPullRank research data
- Tools & platforms operational guide
- Enhanced semantic triple guidance

**Validation:**
- Aligned with Mike King's "Programmatic Legibility" framework
- Incorporates iPullRank QFO research (10-28 queries, 95% no volume)
- Validated against chunking defense article

---

## Sources & Authority

**Primary influences:**
- iPullRank / Mike King (Relevance Engineering, QFO research)
- Search Matrix (Technical foundations)
- Semrush Zero-Click Research
- BrightonSEO AI Search Playbook
- Original research and testing

**Maintained by:** Lynton Davidson  
**Last updated:** January 23, 2026  
**Next review:** April 2026

---

## How to Update This Skill

**When playbook evolves:**
1. Update version number in this file
2. Add to "Version-Specific Notes" section
3. Update key module references if structure changes
4. Regenerate quick-reference.md if decision trees change
5. Update project file location if moved

**This skill is authoritative for AI search optimization decisions in this project.**
