# How LLMs Build Entity Graphs
*(Why consistency beats cleverness)*

## TL;DR
LLMs do not "understand pages" — they construct **entity graphs**.

Every piece of content you publish either:
- Reinforces an entity graph, or
- Introduces ambiguity into it

Consistency compounds. Ambiguity erodes trust.

---

## 1. What an entity graph actually is

An entity graph is a structured representation of:
- **Entities** (things that exist)
- **Attributes** (facts about them)
- **Relationships** (how they connect)

LLMs continuously update these graphs using:
- Web content
- Structured data
- Repeated co-occurrence patterns
- Trusted external sources

Pages are inputs.  
Graphs are the output.

---

## 2. How entity graphs are formed

Entity graphs are built probabilistically, not deterministically.

LLMs:
- Aggregate signals across many sources
- Weight consistency over novelty
- Prefer stable representations

Key contributors:
- Naming consistency
- Attribute repetition
- Clear relationship statements
- Cross-source agreement

A single page rarely defines an entity.  
Repeated clarity does.

---

## 3. Attributes matter more than descriptions

Descriptions help humans.

Attributes help machines.

Examples of attributes:
- Location
- Type / category
- Capabilities
- Constraints
- Associations

Vague prose weakens graphs.  
Explicit attributes strengthen them.

> "Being descriptive is not the same as being precise."  
> *(iPullRank / Search Matrix framing)*

---

## 4. Relationships are the real signal

Entities gain meaning through relationships.

LLMs pay close attention to:
- "X is located in Y"
- "X is part of Y"
- "X offers Y"
- "X is known for Y"

Repeated, consistent relationship statements:
- Increase confidence
- Reduce ambiguity
- Improve citation likelihood

Implicit relationships are risky.  
Explicit relationships scale.

---

## 5. Why inconsistency is so damaging

Inconsistency forces models to choose.

Common sources of drift:
- Slight name variations
- Competing descriptions
- Conflicting attributes
- Multiple "primary" pages

When confidence drops:
- Retrieval probability drops
- Citation likelihood drops
- Synthesised answers become generic

Ambiguity is treated as risk.

---

## 6. The role of frequency and reinforcement

Entity graphs are reinforced by:
- Repetition across pages
- Reinforcement across domains
- Alignment with trusted sources

This is why:
- One "perfect" page is not enough
- Consistency across the ecosystem matters
- Multi-site alignment compounds value

For our project:
> The three sites reinforce a shared graph.

---

## 7. Where schema fits (preview)

Schema does not create entities.

Schema:
- Clarifies attributes
- Reinforces relationships
- Reduces interpretation ambiguity

Schema is an **accelerant**, not a foundation.

Without consistent content:
- Schema has limited effect

(We'll cover this in depth next.)

---

## 8. Semantic triples strengthen graphs

Semantic triples (Subject-Predicate-Object) are fundamental building blocks of entity graphs.

AI systems recognize and extract these patterns naturally.

**Structure:**
- **Subject:** The entity being described
- **Predicate:** The relationship or action
- **Object:** The target entity or attribute

**Examples:**

✅ **Strong triples:**
- "Portbahn House overlooks Loch Indaal"  
  (Subject: Portbahn House, Predicate: overlooks, Object: Loch Indaal)
- "The property sleeps 8 guests"  
  (Subject: property, Predicate: sleeps, Object: 8 guests)
- "Isle of Jura is located in Scotland"  
  (Subject: Isle of Jura, Predicate: located in, Object: Scotland)

❌ **Weak patterns:**
- "It's a great place with stunning views"  
  (No clear subject, vague predicate, undefined object)
- "There are beautiful facilities available"  
  (Passive voice, ambiguous relationships)

**Implementation:**
- Use active voice consistently
- Make subjects explicit (avoid pronouns without clear antecedents)
- State relationships directly
- Define entities before referencing them

**Why semantic triples work:**
- Knowledge graphs are built from them
- They reduce ambiguity
- They survive passage extraction
- They reinforce entity consistency

**Practical guideline:**  
Every key fact should be expressible as a clear S-P-O triple.

---

## 9. Practical guidance for this project

We will:
- Define entity names explicitly
- Use consistent terminology everywhere
- Repeat core attributes intentionally
- State relationships clearly as semantic triples
- Avoid clever phrasing that changes meaning

Before publishing content, ask:
> "Does this reinforce or confuse the entity graph?"

---

## 10. Mental shortcut

If a sentence:
- Introduces a new description
- Without adding a new attribute

It may be:
- Interesting
- But unhelpful for AI understanding

---

## 11. Working definition

**Entity Graph**  
> A probabilistic network of entities, attributes, and relationships constructed by AI systems to represent real-world knowledge.

**Semantic Triple**  
> A Subject-Predicate-Object assertion that explicitly states a relationship between entities or attributes, forming the atomic unit of knowledge graph construction.

---

**Status:** Foundational · Prepares schema strategy
