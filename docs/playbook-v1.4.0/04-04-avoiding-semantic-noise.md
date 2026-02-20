# Avoiding Semantic Noise
*(How to reduce ambiguity without flattening tone)*

## TL;DR
Semantic noise is content that:
- Sounds good
- Feels human
- But weakens meaning

Reducing noise improves:
- Extraction
- Interpretation
- Trust

---

## 1. What semantic noise looks like

Common sources:
- Overuse of adjectives
- Vague superlatives
- Metaphors in defining statements
- Unscoped claims

Example:
> â€œA truly unforgettable experienceâ€

Unforgettable how?
Compared to what?

---

## 2. Where noise is most harmful

Noise hurts most when:
- Defining entities
- Explaining scope
- Describing offerings
- Stating relationships

This is where clarity matters most.

---

## 3. Noise vs narrative

Noise â‰  narrative.

Narrative:
- Adds context
- Enhances emotion
- Builds trust

Noise:
- Obscures facts
- Introduces ambiguity
- Weakens extraction

---

## 4. Practical guidance

When editing:
- Identify defining sentences
- Strip them back to facts
- Add colour elsewhere

**Status:** Applied Â· Content quality control

---

## 5. Editorial Restraint

Content that exists only to:
- "Cover a topic"
- Satisfy a checklist
- Pad perceived completeness
- Match competitor page structure

â€¦without adding clarity, trust, or utility:

**Remove it.**

**Questions to ask before publishing:**

1. Would we trust an AI to summarise this fairly?
2. Does it represent us accurately?
3. Could this be synthesised from better sources elsewhere?

**If "no" to any:**
- Don't publish, or
- Reduce to summary + link to authoritative source

**Rationale:**

Low-value, checklist-driven content:
- Erodes trust with both humans and AI systems
- Increases semantic noise
- Dilutes authority on core topics
- Creates maintenance burden

Absence is better than noise.
Linking to stronger authorities increases trust.

**Example:**

Weak approach:
> Create a "Complete Guide to Islay Distilleries" that shallowly covers all 9 distilleries to compete with official distillery websites

Strong approach:
> Create "Distillery Visiting on Islay" that covers logistics, touring tips, and links to each distillery's official site for detailed information

The second approach:
- Acknowledges stronger authorities
- Adds genuine value (coordination, practical guidance)
- Avoids competing where we cannot win
- Increases trust by deferring appropriately

---

## 6. Site-Level Vector Coherence

Every page on a site produces a vector embedding — a mathematical representation of its meaning. AI systems (and tools like Screaming Frog v22+) calculate the **average embedding** across all pages to produce a **site centroid**: a single vector representing what the site is "about."

Each page is then measured by its distance from the centroid.

**Pages close to the centroid:** Reinforce the site's core authority.
**Pages far from the centroid:** Dilute it.

This is not theoretical. The Google leak hinted at centroid-based deviation scoring, and iPullRank's relevance engineering work confirms that pruning outlier content produces measurable authority improvements.

### Why this matters for our ecosystem

Each of our three sites has a tight topical remit:
- **isleofjura.scot:** Jura as a destination (travel, activities, practical info)
- **bothanjuraretreat.co.uk:** Jura accommodation (trust, emotion, booking)
- **portbahnislay.co.uk:** Islay accommodation (clarity, local context, booking)

This architecture naturally produces high centroid coherence per site. Content that drifts — e.g. a deep Islay distillery guide on the Jura site — would literally shift the centroid away from core authority.

### Practical audit

Screaming Frog v22+ can calculate site centroid and flag low-relevance outliers natively:
- `Config > Content > Embeddings > Enable Low Relevance`
- Filter: `Content tab > Low Relevance Content`
- Pages furthest from the centroid appear as outliers

*(See Module 07-02 for full Screaming Frog vector workflow.)*

### Decision rule

Before publishing any page, ask:
> "Does this page pull the site centroid toward or away from our core authority?"

If away:
- Consider whether it belongs on a different site in the ecosystem
- Reduce to summary + link to stronger authority
- Or don't publish it

**This is editorial restraint (Section 5) made measurable.**

---

**Status:** Applied · Operational guardrail

