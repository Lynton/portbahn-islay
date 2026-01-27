# How AI Search Actually Works
*(Retrieval â†’ Interpretation â†’ Synthesis)*

## TL;DR
AI search systems do not rank pages and return links.  
They **retrieve information**, **interpret meaning**, and **synthesize answers**.

Optimisation today means engineering content so it survives â€” and wins â€” at **each stage**.

---

## 1. The old mental model vs the new one

### Traditional search (simplified)
```
Query â†’ Crawl â†’ Index â†’ Rank pages â†’ Click
```

This model assumes:
- Pages are the unit of relevance
- Ranking position determines visibility
- The user consumes the source directly

### AI-first search (simplified)
```
Query
 â†’ Query expansion (fan-out)
 â†’ Retrieval (lexical + semantic)
 â†’ Passage extraction
 â†’ Interpretation (entities + context)
 â†’ Synthesis (answer generation)
 â†’ Optional citation / mention
```

This framing appears consistently across:
- *Search Matrix series* (Modules 1â€“3)
- *Mike King / iPullRank* (RAG explanations)
- *BrightonSEO AI Search Playbook*

The crucial shift:
> **Visibility happens before â€” and often without â€” a click.**

---

## 2. Stage 1: Query expansion (fan-out)

AI systems rarely use the userâ€™s query verbatim.

Instead, they:
- Expand the query into multiple sub-queries
- Add implied context (location, expertise level, intent)
- Generate parallel retrieval paths

This is sometimes called **query fan-out**  
(*Search Matrix terminology*).

**Implication:**  
You are not optimising for a single keyword.  
You are optimising for a *cluster of related questions*.

---

## 3. Stage 2: Retrieval (getting into the candidate set)

Retrieval is where classic SEO still matters â€” but not alone.

Modern systems use **hybrid retrieval**:
- **Lexical retrieval** (keywords, inverted index)
- **Semantic retrieval** (embeddings, similarity search)

These signals are often combined and re-ranked  
(e.g. reciprocal rank fusion, per Search Matrix).

**Key retrieval inputs:**
- Crawlability
- Indexability
- Clean HTML
- Internal linking
- Speed to content

If your content cannot be efficiently retrieved:
> It will never be interpreted or synthesised.

---

## 4. Stage 3: Passage extraction (chunk selection)

AI systems rarely pass full pages downstream.

Instead, they extract:
- Paragraphs
- Sections
- FAQ blocks
- Definitions
- Lists

These become **candidate passages**.

Consistent guidance across sources:
- Passages should be self-contained
- Each chunk should answer *one thing*
- Noise weakens extraction confidence

> â€œEach passage should make sense on its own.â€  
> â€” Semrush Zero-Click Playbook

This is why **chunking** and **structure** now matter as much as links once did.

---

## 5. Stage 4: Interpretation (meaning & entities)

Once passages are selected, systems attempt to understand:

- What entities are involved?
- What is being asserted?
- How does this relate to other known information?
- Is the source trustworthy?

This relies heavily on:
- Entity consistency
- Clear terminology
- Contextual reinforcement
- Structured data (where present)

At this stage:
- Pages disappear
- Navigation disappears
- Design disappears

Only **meaning** remains.

---

## 6. Stage 5: Synthesis (answer construction)

Synthesis is probabilistic, not deterministic.

AI systems:
- Combine multiple passages
- Resolve conflicts
- Weight trust and authority
- Generate a fluent response

Important constraints:
- You do not control which passages are chosen
- You do not control how they are combined
- You *can* influence what is available and how clear it is

This is why relevance engineering focuses on **increasing inclusion probability**, not guaranteeing outcomes.

---

## 7. Citations, mentions, and invisibility

Not all synthesis produces:
- Links
- Citations
- Attributions

You may:
- Shape the answer
- Influence the framing
- Still receive no visible credit

This is normal.

Across *Semrush Zero-Click* and *iPullRank* research:
- Influence often shows up later
- Branded search increases
- Assisted conversions rise
- Direct attribution lags

**Absence of a click â‰  absence of impact.**

---

## 8. Where optimisation actually applies

| Stage | What we can influence |
|---|---|
| Query expansion | Topic coverage, question framing |
| Retrieval | Crawlability, speed, linking |
| Passage extraction | Structure, chunking |
| Interpretation | Entities, schema, clarity |
| Synthesis | Trust, authority, consistency |

This explains why:
- Technical SEO still matters
- Content quality matters more
- Entity clarity compounds value

---

## 9. Practical consequence for this project

For our library and site builds:

We will:
- Design pages as **passage containers**
- Treat internal links as **semantic signals**
- Use schema to **reinforce meaning**, not chase features
- Write content that survives extraction

We are engineering **retrievability**, **interpretability**, and **trust** â€” not just rankings.

---

## 10. Mental shortcut (keep this in mind)

When deciding *anything*, ask:

> â€œAt which stage of the pipeline does this help?â€

If the answer is â€œnoneâ€ â€” it probably doesnâ€™t matter anymore.

---

**Status:** Foundational Â· Stable Â· Referenced throughout the library
