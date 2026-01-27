# Entity-First Site Architecture
*(Designing sites around entities, not pages)*

## TL;DR
AI systems understand the world through **entities and relationships**, not pages.

A modern site should be architected as:
> An explicit, consistent entity system â€” with pages acting as delivery mechanisms, not the organising principle.

---

## 1. Why page-first architecture breaks

Traditional site architecture assumes:
- Pages are primary assets
- Navigation defines meaning
- URLs imply importance

This worked when:
- Ranking was page-centric
- Context was reconstructed by humans
- Links were the main relational signal

In AI search systems, this model degrades.

Pages:
- Are decomposed into passages
- Lose navigational context
- Compete fragment-by-fragment

What persists is not the page â€” itâ€™s the **entity**.

---

## 2. How AI systems represent the world

Across *Search Matrix*, *iPullRank*, and broader LLM research, a consistent pattern emerges:

AI systems build:
- Entity representations
- Attribute sets
- Relationship graphs

Examples of entities:
- Places
- Brands
- People
- Products
- Concepts
- Experiences

Each entity accumulates:
- Facts
- Descriptions
- Associations
- Trust signals

Pages are simply sources feeding this graph.

---

## 3. What â€œentity-firstâ€ actually means

Entity-first architecture means:

- Every important thing has a clear identity
- That identity is represented consistently
- Content reinforces entities intentionally
- Relationships are explicit, not implied

Practically:
- One primary entity per page (usually)
- Clear naming and terminology
- Consistent internal references
- Canonical representations

---

## 4. Pages as entity containers

In this model:
- Pages do not *define* entities
- Pages *express* entities

A strong entity page:
- Clearly states what the entity is
- Defines attributes unambiguously
- Reinforces relationships to other entities
- Avoids mixing unrelated concepts

A weak entity page:
- Covers multiple entities loosely
- Uses inconsistent naming
- Relies on assumed context
- Blurs scope

---

## 5. Entity hubs and supporting content

Entity-first sites naturally form hubs:

- Primary entity pages (canonical)
- Supporting pages (attributes, activities, FAQs)
- Contextual content (guides, comparisons)

Internal links:
- Point back to the entity hub
- Use consistent anchor language
- Reinforce centrality

This mirrors how AI systems expect knowledge to be organised.

---

## 6. Multi-site entity ecosystems

For our three-site project:

We are not building three isolated sites.
We are building:
> A connected entity ecosystem across domains.

Each site:
- Has a distinct intent focus
- Reinforces shared entities
- Contributes complementary context

Consistency across domains:
- Strengthens entity confidence
- Reduces ambiguity
- Increases citation likelihood

---

## 7. Common entity-architecture failures

Typical problems:
- Multiple pages claiming the same entity role
- Slight naming variations across pages
- Entities buried inside generic content
- No clear canonical representation

These lead to:
- Fragmented understanding
- Weakened authority
- Unstable AI interpretations

---

## 8. Practical guidance for this project

We will:
- Identify core entities upfront
- Assign clear canonical pages
- Design IA around entity relationships
- Use internal linking to reinforce entity graphs
- Avoid page sprawl without entity purpose

Before creating a page, ask:
> â€œWhich entity does this primarily exist to represent?â€

If the answer is unclear:
- The page probably should not exist yet.

---

## 9. Mental shortcut

If two pages:
- Describe the same thing
- With overlapping purpose

They are likely:
- Competing entity representations

Consolidate or clarify.

---

## 10. Working definition

**Entity-First Architecture**  
> A site structure that prioritises clear, consistent representation of real-world entities and their relationships, using pages as containers rather than organising primitives.

---

**Status:** Foundational Â· Opens the Meaning & Schema module
