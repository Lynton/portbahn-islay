# Chunking and Section Design
*(How to structure pages so meaning survives extraction)*

## TL;DR
Good chunking makes content easier to:
- Retrieve
- Extract
- Understand
- Reuse

Bad chunking hides meaning inside walls of text.

---

## 1. Chunking is not formatting

Chunking is not:
- Adding more headings
- Shortening paragraphs randomly
- Breaking text for readability alone

Chunking is:
> Designing sections as independent units of meaning.

---

## 2. What a good chunk looks like

A strong chunk:
- Covers one idea
- Has a clear scope
- Defines terms explicitly
- Does not rely on previous sections

A weak chunk:
- Mixes ideas
- References undefined context
- Drifts semantically
- Exists only to "flow"

---

## 3. Ideal chunk size (practical guidance)

While there is no fixed length:
- 3â€“6 sentences often performs well
- Lists and tables count as chunks
- Smaller beats larger when in doubt

If a chunk answers multiple questions:
> Split it.

---

## 4. Ordering chunks intentionally

Chunk order should follow:
- Logical dependency
- Not narrative flourish

Define first.
Explain second.
Elaborate third.

Humans appreciate flow.
AI systems need clarity first.

---

## 5. Section Ordering for Conversational Flow

Order sections to mirror natural discovery and reduce uncertainty progressively.

**Standard sequence:**
1. What is this? (definition, category)
2. Where is it? (location, context)
3. What makes it distinctive? (differentiation, unique attributes)
4. What can I do here? (function, experience, activities)
5. What do I need to know? (practical constraints, policies, requirements)
6. How do I proceed? (booking, access, next action)

This aligns with how AI systems expand single prompts into multi-step conversational queries.

**Rationale:**
- Each answer naturally leads to the next question
- Uncertainty decreases as the user progresses
- AI systems can extract logical sequences for synthesis

**Avoid:**
- Burying definitions below features
- Scattering practical information across sections
- Assuming prior knowledge without establishing it first
- Leading with edge cases before core information

**Example flow (property page):**

H1: Portbahn House
Section 1: What is Portbahn House? (definition)
Section 2: Location (where)
Section 3: What Makes It Special (differentiation)
Section 4: Facilities (what's included)
Section 5: Sleeping Arrangements (practical detail)
Section 6: House Rules (constraints)
Section 7: How to Book (action)

Each section answers the natural follow-up question from the previous one.

---

## 6. Critical Distinction: Sections Within Pages, Not Separate Pages

**Good chunking creates clear sections within coherent pages.**  
**Bad chunking fragments content across multiple thin pages.**

This distinction is critical given recent search engine guidance against artificial fragmentation.

**Examples:**

âœ“ **Good:** One beach guide with clear sections (access, safety, features)  
âœ— **Bad:** Three separate pages: "Beach Access", "Beach Safety", "Beach Features"

âœ“ **Good:** One property page with sections (overview, facilities, location)  
âœ— **Bad:** Four separate pages per property

**The goal:** Pages that are comprehensive for humans AND extractable for AI.

**Why this matters:**
- AI systems retrieve passages, but pages provide context
- Fragmenting into separate pages loses coherence
- Users expect complete information on a single page
- Search engines penalize thin, artificially fragmented content

**When designing content:**
- Create well-structured pages with multiple clear sections
- Each section should be independently extractable
- But sections exist as part of a coherent whole
- Don't create separate pages just to optimize passage extraction

---

## 7. Visual structure vs semantic structure

Visual layout can mislead.

Tabs, accordions, sliders:
- May hide content from crawlers
- Often reduce extraction reliability

If content matters:
- It should exist plainly in the DOM
- Without interaction required

---

## 8. Practical guidance

When designing sections:
- One heading = one chunk
- One idea per chunk
- No hidden dependencies

Ask:
> "Could this section live on its own?"

---

**Status:** Applied Â· Structural writing pattern
