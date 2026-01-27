# AI Search Practical Checklist
*(Single-source sanity check for pages, sections, design, and code)*

**Purpose**  
This checklist is a fast, binary validator.

Use it to ask:
> â€œDoes this page / section / template / sitemap / code decision adhere to our AI-search system?â€

If the answer is **no** to any critical item, fix it before proceeding.

This file assumes familiarity with the full library.  
It is a *reminder*, not an explanation.

---

## 1. Entity & Intent (Identity Layer)

- â˜ Is the **primary entity** of this page/section unambiguous?
- â˜ Is there **only one primary entity** being represented?
- â˜ Is the entity **named consistently** with canonical references?
- â˜ Is the entity **type/category** clear (what it is and is not)?
- â˜ Is intent ownership correct for this site (no cross-site conflict)?

**Fail here = entity drift risk**

---

## 2. Retrieval & Access (Can AI systems reach it?)

- â˜ Is the content **crawlable by AI bots** (robots/CDN checked)?
- â˜ Is core meaning present in **initial HTML** (no JS dependency)?
- â˜ Is the page **shallowly linked** from relevant hubs?
- â˜ Does the URL structure reinforce meaning (not random or generic)?
- â˜ Are canonicals intentional and correct?

**Fail here = invisible to AI systems**

---

## 3. Passage & Structure (Can it be extracted?)

- â˜ Does each section answer **one clear question or idea**?
- â˜ Can each section **stand alone** if extracted?
- â˜ Are headings **descriptive and scoped** (not clever or vague)?
- â˜ Are passages **concise and focused** (not multi-topic blocks)?
- â˜ Is important content **not hidden** behind tabs/accordions?

**Fail here = weak retrieval & synthesis**

---

## 4. Writing Quality (Fixed Spine, Flexible Skin)

- â˜ Is there a **clear factual spine** (boring, explicit, correct)?
- â˜ Is emotional / sensory language layered **after clarity**?
- â˜ Would removing adjectives still leave a **correct definition**?
- â˜ Is expressive language **not redefining scope or category**?
- â˜ Does the page feel **human, trustworthy, and natural**?

**Fail here = robotic or ambiguous content**

---

## 5. Entity Relationships & Linking

- â˜ Are relationships to other entities **explicitly stated**?
- â˜ Do internal links **reinforce meaning**, not just navigation?
- â˜ Is anchor text **descriptive and consistent**?
- â˜ Does linking reduce discovery cost for important content?
- â˜ Are hubs and supporting pages clearly distinguished?

**Fail here = weak semantic graph**

---

## 6. Schema & Structured Data

- â˜ Is schema reinforcing **visible content**, not adding new claims?
- â˜ Is schema solving a **real ambiguity**?
- â˜ Are entity `@id` values **stable and reused**?
- â˜ Is schema **minimal, intentional, and readable**?
- â˜ Does schema align across pages and sites?

**Fail here = noise, not clarity**

---

## 7. Multi-Site Consistency (If applicable)

- â˜ Is this entity represented **consistently across sites**?
- â˜ Is intent ownership clear (no duplication or competition)?
- â˜ Are cross-links reinforcing rather than fragmenting?
- â˜ Is narrative aligned with ecosystem positioning?

**Fail here = ecosystem drift**

---

## 8. Zero-Click & Influence Check

- â˜ Could this content **shape an AI answer**?
- â˜ Would an AI system feel **safe summarising or citing it**?
- â˜ Does it reinforce how we want to be **described externally**?
- â˜ Would a user remember or recognise us later?

**Fail here = low influence even if traffic exists**

---

## 9. Final Sanity Checks

- â˜ Is anything here clever at the expense of clarity?
- â˜ Is anything here verbose without adding meaning?
- â˜ Is anything here solving an internal goal, not a user question?
- â˜ Would removing this page/section weaken our entity graph?

---

## Pass Criteria

This page / section / decision is **approved** if:
- All critical sections pass
- Any â€œnoâ€ answers are consciously accepted trade-offs

If not:
> Fix before shipping.

---

**Status:** Final Â· Operational Â· Reference this constantly
