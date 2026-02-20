# JSON-LD Graph Strategy
*(Designing structured data as a coherent system, not isolated blocks)*

## TL;DR
Effective schema is not a collection of snippets.
It is a **connected graph**.

JSON-LD works best when:
- Entities are explicitly identified
- Relationships are intentional
- The same entities recur across pages with stable identifiers

---

## 1. The problem with page-level schema thinking

Most schema implementations treat each page as an island:
- One page = one block of JSON-LD
- Minimal reuse of identifiers
- Little relationship modelling

This mirrors page-first SEO thinking â€” and carries the same flaws.

In AI systems:
> Disconnected schema produces disconnected understanding.

---

## 2. Why JSON-LD graphs matter

JSON-LD supports graph structures via:
- `@id`
- `@graph`
- Reusable entity references

This allows:
- The same entity to appear across pages
- Attributes to accumulate coherently
- Relationships to remain stable

For AI systems:
> Stability of identifiers = confidence.

---

## 3. Designing stable entity identifiers

Key principles:
- One canonical `@id` per entity
- Human-readable where possible
- Stable over time
- Reused consistently

Examples:
- A place entity used on multiple pages
- An organisation referenced across domains
- A person appearing in articles and profiles

Changing identifiers resets learning.

---

## 4. Page schema as views into the graph

Each pageâ€™s schema should be seen as:
> A contextual view into a larger entity graph

That means:
- Pages reference existing entities
- Pages rarely introduce entirely new primary entities
- Attributes align with visible content

Pages reinforce the graph â€” they do not redefine it.

---

## 5. Relationship modelling in practice

High-value relationships to model explicitly:
- Organisation â†’ Place
- Place â†’ Activity / Experience
- Person â†’ Organisation
- Article â†’ About (entity)

These relationships:
- Reduce ambiguity
- Improve synthesis accuracy
- Increase citation confidence

Implicit relationships are weaker than explicit ones.

---

## 6. Multi-site graph alignment

For our three-site ecosystem:

We should:
- Share entity identifiers where appropriate
- Maintain consistent naming and typing
- Allow each domain to contribute attributes

This creates:
- A richer shared graph
- Stronger entity confidence
- Reduced cross-domain ambiguity

---

## 7. Common JSON-LD graph mistakes

Typical issues:
- New `@id` values on every page
- Inconsistent entity naming
- Over-nesting without intent
- Schema that contradicts visible content

These weaken trust rather than build it.

---

## 8. Practical guidance for this project

We will:
- Define core entity IDs upfront
- Reuse entities across pages intentionally
- Keep graphs simple and readable
- Validate against real content, not assumptions

Before adding schema, ask:
> â€œWhich existing entity does this reinforce?â€

---

## 9. Mental shortcut

If two schema blocks:
- Describe the same thing
- With different identifiers

They are competing, not cooperating.

---

## 10. Working definition

**JSON-LD Graph Strategy**  
> The intentional design of structured data as a coherent, reusable network of entities and relationships, rather than isolated page-level annotations.

---

**Status:** Applied Â· Enables scalable schema implementation
