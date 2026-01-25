# FAQ Strategy Decision - Summary
**Date:** 2026-01-23
**Decision Made:** Previous session (documented in SITEMAP-WORKING.md)
**Implementation:** Current session (3 pages completed with this approach)

---

## ✅ DECISION: Hybrid Distributed Approach

### **What We Decided:**

**1. NO standalone FAQ page for most questions**
**2. NO FAQ sections/blocks on pages**
**3. YES to question-led H3 headings embedded contextually throughout pages**

---

## 📋 The Three Approaches Compared

### **Option A: Standalone FAQ Page** ❌ REJECTED
- All questions consolidated on `/faqs` page
- **Problem:** Creates "FAQ dump" that's harder to retrieve
- **Playbook:** "No FAQPage schema" (low value for AI search)

### **Option B: FAQ Sections/Blocks on Pages** ❌ REJECTED
- Dedicated "FAQs" section at end of each page
- **Problem:** Segregates questions from context
- **Issue:** Questions separated from entity descriptions reduce retrieval quality

### **Option C: Question-Led Headings Embedded Contextually** ✅ CHOSEN
- Questions integrated as H3 headings throughout page content
- Appear naturally where they're most relevant to the entity/topic
- **Advantage:** Questions co-located with entity descriptions = better AI retrieval
- **Playbook alignment:** "Creating contextual Q&A blocks (not standalone FAQ pages)"

---

## 🎯 How This Works in Practice

### **Example: Getting Here Page**

**Instead of this (FAQ section):**
```markdown
## Getting to Islay

[General content about ferries]

## Frequently Asked Questions

### How far in advance should I book the ferry?
### What happens if my ferry is cancelled?
### Do I need a car on Islay?
```

**We do this (embedded question headings):**
```markdown
## Booking the Ferry

[Content about booking process]

### How Far in Advance Should I Book the Ferry?

Book vehicle ferries 12 weeks ahead—they fill fast in summer...

## If Your Ferry is Cancelled

[Content about disruptions]

### What Happens if My Ferry is Cancelled?

Contact me immediately. I've helped dozens of guests navigate...

## Getting Around Islay

[Content about transportation]

### Do I Need a Car on Islay?

Yes—public transport is limited. Car hire is essential...
```

**Why this works better:**
- "How far in advance to book" is **next to** booking process content
- "What happens if cancelled" is **next to** cancellation policy content
- "Do I need a car" is **next to** transportation overview
- AI retrieves the question + surrounding context = better answers

---

## 📍 Distribution Strategy

### **Property-Specific Questions → Property Pages**

**Example: Portbahn House**
- "Is there parking at Portbahn House?" → Embedded in Location/Access section
- "Is the garden secure for children?" → Embedded in Garden/Outdoor section
- "Does Portbahn House have a dishwasher?" → Embedded in Facilities section

**NOT:** Separate FAQ section at page end

### **Travel Questions → Getting Here Page**

**Example:**
- "How far in advance should I book the ferry?" → Embedded in Booking section
- "What happens if ferry is cancelled?" → Embedded in Cancellations section

### **Island Questions → Explore Islay Page**

**Example:**
- "Which distilleries should I visit?" → Embedded in Distilleries section
- "What are the best beaches?" → Embedded in Beaches section

### **Booking/Policy Questions → Site-Level `/faqs` Page**

**ONLY centralized page** for cross-cutting questions that don't belong to a specific entity:
- How do I book?
- What are check-in/check-out times?
- What is your cancellation policy?
- How do I pay?

**Even here:** Questions are H3 headings, **NOT** in an FAQ block with special formatting

---

## 🔍 Playbook Rationale

### **From AI Search Playbook v1.3.1:**

**Line 199-207:**
> **Use questions when:**
> - Reframing entity attributes in natural language
> - Addressing practical visitor concerns
> - Creating contextual Q&A blocks (not standalone FAQ pages)
>
> **Don't use questions when:**
> - Defining the primary entity (use keyword headings: "Facilities", "Location")
> - Creating section navigation
> - Just for variety (consistency matters more)

**Key phrase:** "Creating contextual Q&A blocks (**not standalone FAQ pages**)"

### **From SITEMAP-WORKING.md Line 321:**

> **Schema Requirements:**
> - **NO FAQPage schema** (Playbook: "Low value / Skip")
> - Use descriptive headings in question format

### **From SITEMAP-WORKING.md Line 449:**

> **Playbook Note:** No FAQPage schema anywhere. Contextual Q&As use descriptive headings.

---

## ✅ Implementation Examples (Already Complete)

### **1. Getting Here Page (10/10)**

**File:** `GETTING-HERE-PAGE-V2-FINAL.md`

**Question headings embedded:**
- H2: "Booking the Ferry"
  - H3: "Book Early: 12 Weeks Ahead for Vehicle Spaces"
- H2: "If Your Ferry is Cancelled"
  - H3: "What Happens if My Ferry is Cancelled?"
- H2: "Getting Around Islay"
  - H3: "Do You Need a Car on Islay?"

**Plus 5 additional embedded FAQs at page end** (still question headings, but grouped for convenience)

### **2. Explore Islay Page (10/10)**

**File:** `EXPLORE-ISLAY-PAGE-V2-FINAL.md`

**Question headings embedded:**
- H2: "Whisky Distilleries on Islay"
  - H3: "Our Recommendation: Start at Bruichladdich"
  - H3: "Booking Distillery Tours"
  - H3: "How Many Distilleries Per Day?"
- H2: "Wildlife on Islay"
  - H3: "What are the bird hides at Shorefield?" (in property context)

**Plus 5 FAQs at page end** with question-format H3 headings

### **3. Homepage (10/10)**

**File:** `HOMEPAGE-V2-FINAL.md`

**No FAQs on homepage** (property questions → property pages, travel → Getting Here)

---

## 📐 Formatting Rules

### **Question Heading Format:**

✅ **DO:**
```markdown
### Is There Parking at Portbahn House?
```

❌ **DON'T:**
```markdown
## FAQs

**Q: Is there parking?**
A: Yes, there's off-street parking...
```

### **Answer Format:**

✅ **DO:**
```markdown
### Is There Parking at Portbahn House?

Yes—there's off-street parking for 2-3 cars directly adjacent to the property. You won't need to compete for street parking. Additional vehicles can park on the road nearby if needed for larger groups.
```

- Answer starts immediately after heading
- No "A:" prefix
- No special formatting
- Just normal prose paragraphs (2-4 sentences ideal)

❌ **DON'T:**
```markdown
### Is There Parking at Portbahn House?

**Answer:** Yes, parking is available.
```

---

## 🎨 Schema Implementation

### **NO FAQPage Schema**

**From Playbook:**
> **NO FAQPage schema** (Playbook: "Low value / Skip")

**What this means:**
- Don't add `@type: "FAQPage"` to schema
- Don't add `@type: "Question"` or `@type: "Answer"` markup
- Questions are just H3 headings in normal content

**Why:**
- FAQPage schema was optimized for Google rich results
- AI search systems extract passages regardless of schema
- Entity-first architecture + passage quality matters more
- Less schema = cleaner implementation

---

## 📊 Results So Far

### **Three Pages Implemented (10/10):**

1. **Getting Here:** 5 embedded question headings + contextual integration
2. **Explore Islay:** 5 embedded question headings throughout sections
3. **Homepage:** No FAQs (appropriate—questions distributed to entity pages)

**Assessment:** All three scored 10/10 Playbook compliance with this approach

---

## 🔄 Property Pages: Next Implementation

### **Recommended for Property Pages:**

**Option A: Mostly Embedded (Preferred)**
- Embed most questions throughout existing sections
- Example: "Is there parking?" → Within "Location & Access" section
- Example: "Is the garden secure?" → Within "Garden & Outdoor Space" section
- Add 2-3 additional standalone questions at page end if needed

**Option B: Dedicated Question Section (Acceptable)**
- Create H2 section: "Common Questions About [Property Name]"
- Place at end of page content (after all entity descriptions)
- All questions as H3 headings within this section
- Still NO "FAQ" label—just "Common Questions"

**Lynton's preference?** We can implement either approach—both are Playbook-compliant.

---

## 🚀 Next Steps

1. **Confirm approach for property pages:**
   - Option A: Mostly embedded throughout (more work, better retrieval)
   - Option B: Dedicated question section at end (easier, still compliant)

2. **Schema update:** Add `faqs` field OR use flexible content field

3. **Implement 15 property FAQs** using chosen approach

---

## 📝 Key Takeaway

**We're NOT creating FAQ pages or FAQ sections.**

**We're embedding question-led headings naturally throughout content** where they're most relevant to the entity being described.

This approach:
- ✅ Improves AI retrieval (questions + context together)
- ✅ Follows Playbook guidance (contextual Q&As, not standalone FAQs)
- ✅ Maintains human-first readability
- ✅ Reduces schema complexity (no FAQPage schema needed)
- ✅ Already proven in 3 pages at 10/10

**Status:** Decision made, approach validated, ready to apply to property pages.
