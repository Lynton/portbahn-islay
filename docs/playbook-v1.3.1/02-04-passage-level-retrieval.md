# Passage-Level Retrieval
*(Why chunks, not pages, are what AI systems retrieve)*

## TL;DR
AI systems do not retrieve pages â€” they retrieve **passages**.

If your content is not structured as clear, self-contained units of meaning, it will struggle to be extracted, embedded, and reused.

Passage design is now a core optimisation discipline.

---

## 1. Why pages are decomposed

In classic search:
- Pages were ranked as whole documents
- Relevance was inferred at page level

In AI-first search:
- Pages are split into fragments
- Each fragment is evaluated independently
- Only the most relevant passages survive

This behaviour is consistently described in:
- *Search Matrix series* (passage relevance)
- *iPullRank / Mike King* RAG explanations
- *Semrush Zero-Click Playbook*

From the systemâ€™s perspective:
> A page is just a container for candidate passages.

---

## 2. What a â€œpassageâ€ actually is

A passage is not defined by:
- Word count
- Paragraph count
- Visual layout

A passage is:
> A self-contained semantic unit that answers one question or makes one clear assertion.

Examples of strong passages:
- A definition
- A step-by-step explanation
- A comparison
- A concise FAQ answer
- A scoped list with context

---

## 3. How passages are evaluated

When passages are extracted, systems assess:

- Topical relevance to the query
- Semantic clarity
- Entity presence and consistency
- Context completeness
- Noise-to-signal ratio

Weak passages:
- Drift across topics
- Reference undefined terms
- Depend on surrounding context
- Contain unnecessary tangents

Strong passages:
- Stay on one idea
- Define entities explicitly
- Can stand alone without loss of meaning

---

## 4. Chunk size: smaller is usually better

While there is no universal ideal length:

General guidance across practitioner research:
- Short-to-medium passages outperform long ones
- Dense meaning beats verbose explanation
- Clarity beats completeness

Overlong sections:
- Dilute embeddings
- Increase ambiguity
- Reduce extraction confidence

If a section answers multiple questions:
> It should probably be split.

---

## 5. Recall Before Precision

Retrieval systems favour recall over precision early in the pipeline.

This means:
- Explicit > implicit
- Redundant > elegant (for core definitions)
- Simple repeated framing > varied creative phrasing

Common failure mode:
- Editing out "obvious" clarity in favor of sophisticated prose
- Assuming context that "should be understood"
- Removing repetition that feels redundant to human editors

Reserve elegance for narrative and emotional layers.
Core entity definitions should bias toward clarity and repetition.

**Example:**

Weak (elegant but ambiguous):
> "A contemplative space overlooking the bay"

Strong (clear and retrievable):
> "Portbahn House is a self-catering holiday home on the Isle of Islay, Scotland. The property sleeps 8 guests and overlooks Loch Indaal bay."

The second version is "less poetic" but vastly more retrievable and synthesizable.

---

## 6. Headings as extraction anchors

Headings are critical signals.

They help systems:
- Identify passage boundaries
- Infer topic scope
- Associate questions with answers

Effective headings:
- Are descriptive, not clever
- Reflect real user questions
- Define scope clearly

Poor headings:
- â€œOverviewâ€
- â€œMore informationâ€
- â€œThings to considerâ€

Headings should make sense even when isolated.

---

## 7. Common passage-level failure modes

Typical problems:
- Long narrative paragraphs
- Multiple ideas in one block
- Heavy reliance on pronouns (â€œthisâ€, â€œitâ€)
- Implicit context only defined elsewhere
- Examples that introduce unrelated entities

Each increases the chance that:
- The passage is skipped
- Or misinterpreted

---

## 8. Passage design patterns that work

Patterns that consistently perform well:
- Question â†’ direct answer â†’ brief elaboration
- Definition â†’ attributes â†’ constraints
- Comparison tables with clear labels
- Ordered lists with scoped steps

These patterns:
- Reduce ambiguity
- Improve embedding quality
- Increase reuse probability

---

## 9. Practical guidance for page design

For our project:

We will:
- Design pages as collections of passages
- Treat each section as a retrieval candidate
- Avoid monolithic blocks of text
- Use headings to frame extractable meaning

Page success is now:
> The sum of its retrievable passages.

---

## 10. Mental shortcut

When writing or editing, ask:

> â€œCould this section be lifted out and still make sense?â€

If not:
- It will struggle in AI retrieval.

---

## 11. Working definition

**Passage**  
> A discrete, self-contained unit of meaning designed to be independently retrieved, interpreted, and reused by AI systems.

---

**Status:** Applied Â· Bridge between technical and content strategy
