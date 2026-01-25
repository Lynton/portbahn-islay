# Claude Code Implementation Brief - All 6 Pages to 10/10
**Date:** 2026-01-23 (Updated 2026-01-25)
**Task:** Implement content updates for 6 pages (3 guide pages + 3 property pages)
**Target:** All pages at 10/10 Playbook v1.3.1 + Tone of Voice compliance
**Vercel Site:** https://portbahn-islay.vercel.app

---

## IMPORTANT: Read Baseline Status First

**Before starting, review:** `VERCEL-BASELINE-STATUS-2026-01-25.md`

This file contains the verified current state of the Vercel deployment as of 2026-01-25:
- What's already working (schema fields rendering correctly)
- What's missing (guide pages 404, FAQ sections not visible)
- Prioritized implementation order

**Also reference:** `FINAL-IMPLEMENTATION-BRIEF-10-10.md` for complete technical requirements including:
- Schema field definitions
- Keyword integration checklist
- Technical pre-launch checklist
- Enhanced local content (Bruichladdich, whisky bars, seafood)

---

## Overview

This brief contains all content updates needed to bring 6 Portbahn Islay pages to 10/10 quality:

**Guide Pages (New V2 Content):**
1. Getting Here
2. Explore Islay
3. Homepage

**Property Pages (FAQ Additions + Enhancements):**
4. Portbahn House
5. Shorefield Eco House
6. Curlew Cottage

---

## Part 1: Guide Pages Implementation

### **Task:** Replace existing content with V2 final versions

**Source Files:**
- `/sessions/practical-determined-goldberg/mnt/_www_claude/_session-work/pbi-content-strategy-2026-01-23/GETTING-HERE-PAGE-V2-FINAL.md`
- `/sessions/practical-determined-goldberg/mnt/_www_claude/_session-work/pbi-content-strategy-2026-01-23/EXPLORE-ISLAY-PAGE-V2-FINAL.md`
- `/sessions/practical-determined-goldberg/mnt/_www_claude/_session-work/pbi-content-strategy-2026-01-23/HOMEPAGE-V2-FINAL.md`

**Implementation Approach:**

#### **1. Getting Here Page**

**Document Type:** `gettingHerePage` (singleton) OR similar
**Action:** Replace existing content with V2 content

**Key Changes:**
- Add Pi's voice opening paragraph
- Update all section content with trust signals
- Add 5 embedded FAQs as H3 headings (not separate FAQ block)
- Update SEO fields

**Fields to Update:**
```
title: "Getting to the Isle of Islay"
seoTitle: "Getting to Islay | Ferry & Flight Guide | Portbahn Islay"
seoDescription: [see V2 file]
content: [Full V2 content as Portable Text blocks]
  - H2 sections with subsections
  - Question-format H3 headings for FAQs
  - Internal links to /explore, property pages
  - External links to CalMac, Loganair
```

**Critical:**
- Maintain H2 → H3 hierarchy
- Questions are H3 headings (not Q&A formatted blocks)
- NO FAQPage schema

---

#### **2. Explore Islay Page**

**Document Type:** `exploreIslayPage` (singleton) OR similar
**Action:** Replace existing content with V2 content

**Key Changes:**
- Add Pi's personal introduction
- Expand Portbahn Beach section (dedicated H3)
- Expand Shorefield bird hides section (dedicated H3, Jackson family story)
- 21 H3 subsections throughout
- Add 5 embedded FAQs

**Fields to Update:**
```
title: "Explore the Isle of Islay"
seoTitle: "Explore Islay | Distilleries, Beaches & Wildlife | Portbahn Guide"
seoDescription: [see V2 file]
content: [Full V2 content with 21 H3 subsections]
```

**Critical:**
- Portbahn Beach gets full H3 subsection (not just mention)
- Shorefield bird hides gets full H3 subsection with Jackson family creation story
- 5 FAQs embedded at page end as H3 question headings

---

#### **3. Homepage**

**Document Type:** `homepage` (singleton)
**Action:** Update existing fields with V2 content

**Key Changes:**
- Add "Welcome to Portbahn Islay" section (Pi & Lynton intro)
- Add "Our Track Record" section (trust signals)
- Enhance property descriptions with ownership stories
- Condense "Getting Here" section (link to /getting-here page)

**Fields to Update:**
```
title: "Portbahn Islay"
tagline: "Self-Catering Holiday Homes in Bruichladdich, Isle of Islay"
seoTitle: "Portbahn Islay | Holiday Homes Bruichladdich, Isle of Islay"
seoDescription: [see V2 file]

Sections (map to existing schema):
  - Section 1: About Us (Pi & Lynton intro)
  - Section 2: Our Three Homes (with ownership stories)
  - Section 3: Our Track Record (trust signals)
  - Section 4: Why We Love Bruichladdich
  - Section 5: How to Get Here (condensed + link)
  - Section 6: Ready to Book?
```

**Critical:**
- Property ownership stories integrated:
  - Portbahn: "our family home for years"
  - Shorefield: "the Jacksons' creation—they built it, planted every tree..."
  - Curlew: "Allan's family retreat"
- Trust signals section with 3 guest quotes
- "Real homes, not purpose-built AirBnBs" positioning explicit

---

## Part 2: Property Pages - FAQ Implementation

### **Schema Requirement:**

**Add `faqs` field to property schema:**

```typescript
{
  name: 'faqs',
  title: 'Common Questions',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'question',
          title: 'Question',
          type: 'string',
          description: 'Question as H3 heading'
        },
        {
          name: 'answer',
          title: 'Answer',
          type: 'text',
          description: '2-5 sentences, Pi & Lynton voice'
        },
        {
          name: 'order',
          title: 'Order',
          type: 'number'
        }
      ]
    }
  ],
  validation: Rule => Rule.max(5)
}
```

**If schema update isn't immediate:** Document FAQs in this brief for manual addition to content field.

---

### **4. Portbahn House**

**Document:** `property` with slug `portbahn-house`

**Action:** Add 5 FAQs + minor voice enhancements

**FAQs to Add:**

```json
{
  "faqs": [
    {
      "question": "Can we check in early or have late checkout?",
      "answer": "Standard times are 4pm check-in and 10am checkout, but contact me about your ferry or flight times—I'm flexible when the property schedule allows. I can almost always accommodate bag drop-off before check-in or storage after checkout. Over 30 reviews specifically mention my flexibility and support, and I hold a 5.0/5 communication rating across all properties.",
      "order": 1
    },
    {
      "question": "Can you provide synthetic bedding for allergies?",
      "answer": "Yes—just let me know about allergies when you book and I'll provide synthetic pillows and duvets for the affected bedrooms. This is a common request (multiple inquiries per month) and easy to accommodate at any of our properties.",
      "order": 2
    },
    {
      "question": "Is there parking at Portbahn House?",
      "answer": "Yes—there's off-street parking for 2-3 cars directly adjacent to the property. You won't need to compete for street parking. Additional vehicles can park on the road nearby if needed for larger groups.",
      "order": 3
    },
    {
      "question": "How many bedrooms does Portbahn House have?",
      "answer": "Portbahn House has 3 bedrooms sleeping 8 guests across the ground floor: Master bedroom with ensuite (superking + single, sleeps 3), Triple bedroom (double + single, sleeps 3), Twin bedroom (two singles, sleeps 2). All bedrooms are ground floor with no stairs, making the property accessible for guests with mobility concerns.",
      "order": 4
    },
    {
      "question": "Which distillery should we visit first?",
      "answer": "Start with Bruichladdich—it's a 10-minute walk from Portbahn House along the coastal path. You can tour the distillery, sample The Botanist gin, then walk home without worrying about driving. From there, choose based on your whisky preferences: heavily peated (Ardbeg, Lagavulin, Laphroaig), balanced (Bowmore, Kilchoman), or gentle/unpeated (Bunnahabhain). Book tours 2-3 weeks in advance.",
      "order": 5
    }
  ]
}
```

**Voice Enhancement (Optional):**

Update `description` or `overviewIntro` to include:
> "Portbahn House was our family home for years, and we're genuinely proud to share it with guests. Over 200 families have stayed here since 2017, and they keep coming back..."

**Cross-Link Text (Add at bottom of FAQ section):**

> **Comparing our properties?** See [Common Questions at Shorefield](/properties/shorefield#common-questions) and [Common Questions at Curlew Cottage](/properties/curlew-cottage#common-questions) for property-specific details.

---

### **5. Shorefield Eco House**

**Document:** `property` with slug `shorefield-eco-house`

**Action:** Add 5 FAQs + Jacksons' creation story enhancement

**FAQs to Add:**

```json
{
  "faqs": [
    {
      "question": "What makes Shorefield different from the other properties?",
      "answer": "Shorefield is the Jacksons' creation—they built this eco-house powered by wind and solar, planted every tree on the property, created the wetlands and bird hides, and filled the house with paintings, books, and curios from their travels. It's quirky, full of personality, and a bit tired in places—carpets need refreshing. If you prefer modern perfection, Portbahn House is your match. But if you value character and a house that feels like \"a big hug\" (as one guest said), Shorefield delivers.",
      "order": 1
    },
    {
      "question": "Does Shorefield have a dishwasher?",
      "answer": "No—it's part of Shorefield's character as an eco-house with a slower pace. There's a washing machine and dryer available for laundry. If a dishwasher is essential, Portbahn House has one. Guests who book Shorefield prioritize charm and character over modern conveniences, and they're never disappointed.",
      "order": 2
    },
    {
      "question": "What are the bird hides at Shorefield?",
      "answer": "The Jacksons created private bird hides in the wetlands behind the house—they're passionate birders and built these specifically for wildlife watching. The house is stocked with binoculars, bird books, and wildlife guides from their personal collection. Grab the gear, head to your own private hide, and watch waterfowl and woodland birds. It's a genuinely unique feature that birders specifically book Shorefield for.",
      "order": 3
    },
    {
      "question": "Is Shorefield in good condition?",
      "answer": "Shorefield is very clean and well-maintained (5.0 cleanliness ratings), but it's a bit tired in places: carpets are worn, furniture has been well-loved. This isn't a new-build rental; it's a real family home with 15+ years of character. If you prefer modern finishes, Portbahn House might suit you better. But if you value a house with a story, Shorefield is wonderful. One guest wrote: \"The house has a story—you can feel the love and care.\"",
      "order": 4
    },
    {
      "question": "How far is Shorefield from the beach?",
      "answer": "Portbahn Beach is about a 10-minute walk—three sheltered bays with rock pools and safe swimming. You'll often have it entirely to yourselves. Port Charlotte Beach (family-friendly, sandy) is a 5-minute drive. The dramatic west coast beaches—Machir Bay and Saligo Bay—are 10-15 minutes by car.",
      "order": 5
    }
  ]
}
```

**Content Enhancement:**

Add to `description` or `overviewIntro`:
> "Shorefield is the Jacksons' creation—they built this eco-house, planted every tree on the property, created the wetlands and bird hides, and filled the house with paintings, books, and curios from their travels around the world. Their personality is everywhere, from the bird books in the living room to the art on every wall."

**Cross-Link Text:**

> **Questions about check-in times, bedding options, or general policies?** See [Common Questions at Portbahn House](/properties/portbahn-house#common-questions).

---

### **6. Curlew Cottage**

**Document:** `property` with slug `curlew-cottage`

**Action:** Add 5 FAQs + complete description + trust transfer

**FAQs to Add:**

```json
{
  "faqs": [
    {
      "question": "Why are there no reviews for Curlew Cottage yet?",
      "answer": "Curlew is Allan's family retreat, and he's opening it to guests for the first time in 2026. We (Pi & Lynton) manage Curlew with the same care we give our other properties. We hold a 4.97/5 rating across 600+ guests since 2017, with Airbnb Superhost status and a 5.0/5 communication rating. Over 30 reviews mention our legendary ferry crisis support. You're getting the same level of care—just at a property that's new to the booking market.",
      "order": 1
    },
    {
      "question": "Is Curlew Cottage pet-free?",
      "answer": "Yes—Curlew is maintained pet-free as Allan's family retreat for his own continued use and for guests with allergies. If you're traveling with dogs, both Portbahn House and Shorefield welcome pets at £15 per dog per stay. We're happy to help you choose the right property for your group.",
      "order": 2
    },
    {
      "question": "Is the walled garden safe for children?",
      "answer": "Yes—the walled garden is fully enclosed and private, perfect for kids to play safely. The property is off the main road with its own private access, so there's no traffic noise or safety issues. Families with young children specifically choose Curlew for the safe outdoor space, quiet location, and pet-free environment (great for allergies).",
      "order": 3
    },
    {
      "question": "How many bedrooms does Curlew Cottage have?",
      "answer": "Curlew has 3 bedrooms sleeping 6 guests: Two bedrooms on the main floor (accessible without stairs), and one twin bedroom with ensuite accessed via a separate staircase. The separate staircase provides extra privacy (great for teens), but note this if you have mobility concerns. The other two bedrooms are fully accessible on the main floor.",
      "order": 4
    },
    {
      "question": "What's the character of Curlew Cottage?",
      "answer": "Curlew is Allan's family retreat—filled with his family's personal effects and \"holiday things\" like books, games, and comfortable furniture. It's cozy, authentic, and genuinely feels like \"home from home\" as guests describe our properties. This isn't a styled rental—it's a real family cottage with personality intact.",
      "order": 5
    }
  ]
}
```

**Content Fixes:**

1. **Complete description** (currently cuts off):
```
"Curlew Cottage is Allan's family retreat in Bruichladdich on the Isle of Islay—a converted stone steading sleeping 6 guests in 3 bedrooms. Allan has used Curlew as his family's Islay escape for years, and he's now opening it to guests for the first time in 2026. It's filled with his family's personal effects and 'holiday things'—books, games, comfortable furniture—everything you'd want for a proper Islay break. The walled garden is safe and private, and the property has its own access road for peace and quiet. This is a genuine family home, not a styled rental, managed by us (Pi & Lynton) with the same care we give our other properties."
```

2. **Populate `trustSignals`:**
```json
{
  "trustSignals": {
    "established": "Managed by Pi & Lynton since 2026",
    "localCredentials": [
      "First-time letting, managed by experienced Superhosts",
      "Pi & Lynton manage Portbahn & Shorefield (4.97/5 rating)",
      "600+ guests hosted across our properties since 2017"
    ],
    "ownership": "Owner's family retreat, opened to guests 2026"
  }
}
```

3. **Populate `magicMoments`:**
```json
{
  "magicMoments": [
    {
      "moment": "Morning coffee in the walled garden with complete privacy",
      "frequency": "Expected guest favorite"
    },
    {
      "moment": "Kids playing safely in enclosed garden while adults relax",
      "frequency": "Perfect for families"
    },
    {
      "moment": "Peaceful evenings with no road noise or neighbors",
      "frequency": "Unique to Curlew's location"
    },
    {
      "moment": "Discovering owner's book collection and family home touches",
      "frequency": "Authentic family home experience"
    }
  ]
}
```

**Cross-Link Text:**

> **Questions about check-in flexibility, bedding options, or general policies?** See [Common Questions at Portbahn House](/properties/portbahn-house#common-questions).

---

## Frontend Rendering Requirements

### **FAQ Section Template:**

```jsx
{faqs && faqs.length > 0 && (
  <section id="common-questions" className="common-questions">
    <h2>Common Questions About {propertyName}</h2>

    {faqs.sort((a, b) => a.order - b.order).map((faq, index) => (
      <div key={index} className="faq-item">
        <h3>{faq.question}</h3>
        <p>{faq.answer}</p>
      </div>
    ))}

    {/* Cross-links */}
    {crossLinks && (
      <div className="cross-links">
        {/* Property-specific cross-link content */}
      </div>
    )}
  </section>
)}
```

**Critical:**
- Section has `id="common-questions"` for anchor linking
- H3 for questions (NOT formatted as "Q: ...")
- Prose paragraphs for answers (NOT formatted as "A: ...")
- NO special FAQ styling (just normal section)
- NO FAQPage schema

---

## Schema Requirements

### **NO FAQPage Schema Anywhere**

**Do NOT add:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

**Reasoning:**
- Playbook guidance: "No FAQPage schema (low value / skip)"
- Questions are contextual content, not structured FAQ pages
- AI retrieval systems extract passages regardless of FAQ schema

---

## Quality Checklist

**Before deploying:**

**Guide Pages:**
- [ ] Getting Here has Pi's voice throughout
- [ ] Explore Islay has Portbahn Beach + Shorefield bird hides as dedicated H3s
- [ ] Homepage has Pi & Lynton intro + trust signals section
- [ ] All 3 pages have appropriate internal links
- [ ] SEO fields updated

**Property Pages:**
- [ ] All 5 FAQs added per property (15 total unique questions)
- [ ] Cross-links functional and appropriate
- [ ] Portbahn has ownership story enhancement
- [ ] Shorefield has Jacksons' creation story
- [ ] Curlew has complete description + trust transfer
- [ ] NO duplicate questions across properties

**Frontend:**
- [ ] FAQ sections render with `id="common-questions"`
- [ ] Questions are H3 headings
- [ ] NO FAQPage schema
- [ ] Cross-links clickable

---

## Testing

**After implementation:**

1. **Verify anchor links:** `/properties/shorefield#common-questions` should jump to FAQ section
2. **Check cross-links:** Links from Shorefield/Curlew to Portbahn FAQs work
3. **Test mobile:** FAQ sections readable on mobile
4. **Schema validation:** NO FAQPage schema present anywhere
5. **Accessibility:** H2 → H3 hierarchy correct

---

## File References

**All content source files location:**
`_session-work/pbi-content-strategy-2026-01-23/`

**Key files (read in this order):**
1. `VERCEL-BASELINE-STATUS-2026-01-25.md` - Current state verification (START HERE)
2. `FINAL-IMPLEMENTATION-BRIEF-10-10.md` - Complete technical requirements
3. `GETTING-HERE-PAGE-V2-FINAL.md` - Guide page content
4. `EXPLORE-ISLAY-PAGE-V2-FINAL.md` - Guide page content
5. `HOMEPAGE-V2-FINAL.md` - Homepage enhancements
6. `PROPERTY-FAQ-DISTRIBUTION-FINAL.md` - FAQ content for all 3 properties
7. `PORTBAHN-TONE-OF-VOICE-SKILL.md` - Voice reference

---

## Support

**Questions about:**
- Voice/tone → See `PORTBAHN-TONE-OF-VOICE-SKILL.md`
- Playbook compliance → See `PLAYBOOK-COMPLIANCE-ANALYSIS.md`
- FAQ strategy → See `FAQ-STRATEGY-DECISION-SUMMARY.md`
- Gmail inquiry data → See `GMAIL-INQUIRY-ANALYSIS.md`

---

**Status:** Implementation brief complete
**Ready for:** Claude Code to execute Sanity updates
**Estimated effort:** 2-3 hours for all 6 pages
