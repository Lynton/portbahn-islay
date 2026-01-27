# AI Search Playbook - Quick Reference Guide

**Version:** 1.3.1  
**Last Updated:** January 23, 2026  
**For:** Fast operational decisions and pre-publish validation

---

## 30-Second Decision Trees

### "Should this be a page?"

```
Does it represent ONE primary entity? 
  ├─ YES → Is this entity distinct from others?
  │   ├─ YES → Does it add fan-out query coverage?
  │   │   ├─ YES → CREATE PAGE
  │   │   └─ NO → MERGE or SECTION
  │   └─ NO → SECTION in parent page
  └─ NO → SPLIT or CLARIFY scope
```

### "Is this passage extractable?"

```
Can this section stand alone if lifted out?
  ├─ YES → Does it answer ONE clear question?
  │   ├─ YES → GOOD PASSAGE ✓
  │   └─ NO → SPLIT into focused sections
  └─ NO → ADD CONTEXT or MERGE
```

### "Entity or noise?"

```
Does this strengthen entity definition?
  ├─ YES → KEEP
  └─ NO → Is there a stronger authority elsewhere?
      ├─ YES → LINK to authority, REMOVE
      └─ NO → EVALUATE: Does it help users?
          ├─ YES → KEEP but SIMPLIFY
          └─ NO → REMOVE (absence > noise)
```

---

## Fast Entity Check (30 seconds)

**Before publishing any entity page:**

1. **Name it:** Can you state the entity name in 5 words?
2. **Type it:** What category does it belong to? (Place/Product/Experience/Brand)
3. **Locate it:** Where is it? (Geographic or conceptual position)
4. **Define it:** What IS it? (One sentence, no metaphors)
5. **Distinguish it:** What makes it different? (Not better—different)

**If you can't answer all 5 clearly → Don't publish yet.**

---

## Passage Quality Scorecard

**Score each section 0-5:**

| Criteria | Score |
|----------|-------|
| Answers one clear question | 0-1 |
| Can stand alone (no dependencies) | 0-1 |
| Uses entity names explicitly | 0-1 |
| Has descriptive heading | 0-1 |
| 3-6 sentences, focused scope | 0-1 |

**3-5 = Good passage**  
**0-2 = Needs revision**

---

## Content Pattern Cheat Sheet

### Standard Entity Page Structure

```
H1: [Entity Name]

Section 1: What is this? (Definition + category)
  └─ 2-3 sentences, explicit entity framing

Section 2: Where is it? (Location + context)
  └─ Geographic position, relationships to known places

Section 3: What makes it special? (Differentiation)
  └─ Unique attributes, not generic superlatives

Section 4: What can I do? (Function/experience)
  └─ Activities, offerings, capabilities

Section 5: What do I need to know? (Constraints)
  └─ Policies, requirements, practical details

Section 6: How do I proceed? (Action)
  └─ Booking, access, next steps
```

### Semantic Triple Pattern

**Format:** [Subject] [Predicate] [Object]

**Examples:**
- "Portbahn House is located in Bruichladdich, Isle of Islay"
- "The property sleeps 8 guests in 4 bedrooms"
- "Bothan Jura Retreat offers 4 self-catering cottages"

**Use this pattern for all key entity relationships.**

---

## Writing Reminders

### Fixed Spine (Always First)

```
GOOD:
"Portbahn House is a self-catering holiday home on the Isle of Islay, 
Scotland. The property sleeps 8 guests and overlooks Loch Indaal."

BAD:
"A contemplative space where time slows and the sea becomes your companion."
```

**Rule:** Entity definition must be boring and explicit.

### Flexible Skin (After Spine)

Once spine is clear, ADD:
- Sensory details ("morning light across the bay")
- Emotional context ("quiet surroundings away from tourist routes")
- Human perspective ("perfect for families seeking space")

**Never REPLACE facts with emotion.**

---

## Heading Decision Matrix

| Content Type | Heading Style | Example |
|--------------|---------------|---------|
| Entity attribute | Keyword | "Facilities", "Location", "Sleeping Arrangements" |
| User concern | Question | "Can I bring my dog?", "How far is the ferry?" |
| Policy/Rule | Keyword | "House Rules", "Cancellation Policy" |
| Experience | Descriptive | "What Makes [Entity] Special" |

**Default to keywords for entity attributes.**  
**Use questions only when they match exact user queries.**

---

## Multi-Site Coordination Quick Check

**Before publishing on secondary site:**

- [ ] Does DMO site (isleofjura.scot) cover this better?
  - YES → Link to DMO, don't duplicate
  - NO → Proceed

- [ ] Does this compete with DMO intent?
  - YES → Revise or remove
  - NO → Proceed

- [ ] Does entity definition match DMO?
  - YES → Good
  - NO → Align naming/typing

- [ ] Does this add fan-out query coverage?
  - YES → Publish
  - NO → Reconsider necessity

---

## Query Fan-Out Reality Check

**Remember:**
- 10-28 synthetic queries generated per user prompt
- 95% have NO search volume in keyword tools
- 7+ domain appearances = 80%+ citation rate

**Design implication:**
- One page targets multiple related queries
- Breadth (adjacent concepts) + Depth (core entity)
- Don't create separate thin pages for each query variant

---

## Schema Quick Decisions

### When to add schema:

```
Does schema reduce REAL ambiguity?
  ├─ YES → Does it align with visible content?
  │   ├─ YES → ADD schema
  │   └─ NO → FIX content first, then schema
  └─ NO → DON'T add schema
```

### Schema types worth using:

**High value:**
- LocalBusiness / Place (properties, locations)
- Accommodation (properties)
- TouristAttraction (guides, destinations)
- Organization (brands)

**Medium value:**
- Person (for author/host pages)
- Article (for substantial guides)

**Low value / Skip:**
- FAQPage (use contextual Q&As instead)
- BreadcrumbList (if navigation is clear)
- Generic WebPage (adds little value)

---

## Pre-Publish Checklist (Critical Path Only)

**Must verify before shipping:**

1. **Entity clear?** → Name, type, location explicit
2. **Passages standalone?** → Each section makes sense alone
3. **Headings descriptive?** → Not vague ("Overview", "More Info")
4. **Fixed spine present?** → Factual core stated early
5. **Schema aligned?** → Matches visible content exactly
6. **Links reinforce?** → Anchor text consistent with target
7. **No hidden content?** → Everything visible in DOM

**If ANY fail → Fix before publishing.**

**Full checklist:** See SKILL.md or playbook 07-01

---

## Common Mistakes (Catch These)

| Mistake | Fix |
|---------|-----|
| Multiple entities per page | Split or choose primary |
| Vague headings ("Overview") | Make descriptive ("Sleeping Arrangements") |
| Long paragraphs (7+ sentences) | Break into 3-6 sentence chunks |
| Pronouns without referents ("It offers...") | Use entity name explicitly |
| Clever but ambiguous copy | State facts plainly first |
| Content requiring JS to view | Move to initial HTML |
| Competing entity definitions across sites | Align to canonical version |

---

## Emergency Fixes

**If page isn't being cited:**

1. Check entity consistency (same name everywhere?)
2. Check passage extractability (can sections stand alone?)
3. Check heading clarity (descriptive, not vague?)
4. Check factual spine (is entity definition explicit?)
5. Check schema alignment (matches visible content?)

**Most common culprit:** Entity definition buried or vague.

---

## Tools You Should Know

**Free & Essential:**
- QFOria: Track Google AI Mode query fan-out
- Relevance Doctor: Score passage quality

**Worth Investment:**
- Profound: Deep ChatGPT query analysis
- N8N (self-hosted): Workflow automation

**Full guide:** See playbook 07-02

---

## When to Reference Full Playbook

**Use this quick reference for:**
- Fast decisions during writing/editing
- Pre-publish validation
- Resolving common issues

**Reference full playbook (SKILL.md or project files) for:**
- Strategic architectural decisions
- Multi-site coordination planning
- Technical implementation details
- Schema strategy and modeling
- Tool selection and integration

---

## Skill Integration

**To invoke full skill in any thread:**
"Use the AI Search Playbook skill"

**For Claude Code:**
"Reference AI Search Playbook v1.3.1 for [specific task]"

---

**Remember:** Strategy is simple. Execution requires discipline.

Most failures come from:
1. Skipping entity definition
2. Mixing multiple entities
3. Vague or buried facts
4. Inconsistent naming

**Get these right, everything else follows.**
