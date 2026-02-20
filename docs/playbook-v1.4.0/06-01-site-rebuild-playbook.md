# Site Rebuild Playbook (AI-First)
*(From sitemap to synthesis)*

## Purpose
Provide a repeatable process for rebuilding sites so they are:
- Retrievable by AI systems
- Semantically clear
- Human and trust-focused

---

## 1. Start with entities, not pages
- Identify core entities (places, brands, experiences, people)
- Define canonical entity pages
- Decide which site owns which intent

No sitemap work begins before this.

---

## 2. Design the information architecture
- Entity hubs first
- Supporting content second
- Contextual guides last

Key pages must be:
- Shallowly linked
- Clearly scoped
- Non-duplicative

---

## 3. Decide rendering and templates
- Ensure core content is in initial HTML
- Avoid JS-only meaning
- Design templates around passages, not blocks

---

## 4. Content production rules
- One primary entity per page
- Question-led sections
- Fixed spine, flexible skin

---

## 5. Pre-launch checks

**Technical validation:**
- Crawlability for AI bots
- Rendering verification (core content in initial HTML)
- Passage extraction sanity check
- Entity consistency review
- Schema alignment with visible content

**Content validation:**
- Relevance engineering check (see 07-01)
- Section ordering follows conversational flow
- No semantic noise or "checklist" content

**Prompt-based qualitative testing:**
- Test 5-10 representative queries in live AI systems:
  - ChatGPT
  - Claude
  - Gemini
  - Perplexity
  
- Observe whether the site:
  - Appears in results
  - Is cited correctly
  - Influences answer framing
  - Is positioned appropriately vs competitors

- Document failures and trace back to:
  - Content clarity issues
  - Schema misalignment
  - Internal linking gaps
  - Entity definition problems

**Prompt testing examples (for PBI):**

"Tell me about Portbahn House on Islay"
"Best self-catering accommodation Bruichladdich"
"Family-friendly holiday homes Isle of Islay"
"Dog-friendly houses Islay Scotland"
"Where to stay near Bruichladdich Distillery"


If results are:
- Absent â†’ retrieval problem
- Present but wrong â†’ interpretation problem
- Correct but weak positioning â†’ authority/trust problem

Fix before launch.

---

**Outcome:** A site that works for AI systems *and* humans, validated through actual AI system behaviour.

