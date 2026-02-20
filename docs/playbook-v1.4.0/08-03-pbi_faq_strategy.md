# FAQ Strategy - Q&A as Content Pattern

## Core Principle
FAQs are not a page type - they're a content presentation pattern deployed strategically across entity pages.

## Architecture Decision
âŒ No standalone /faq page  
âœ… Q&A blocks integrated into relevant entity pages

---

## Where Q&A Blocks Appear

### Property Pages
**Section:** "Common Questions About {property}"  
**Location:** After Facilities, before Location  
**Count:** 4-6 questions  
**Purpose:** Answer property-specific queries in natural language

**Example:**
```
Q: Does Portbahn House have WiFi?
A: Yes, reliable WiFi is available throughout the property.
```

---

### Guide Pages (Beaches, Distilleries, Walks)
**Section:** "Visitor Questions" or "Planning Your Visit"  
**Location:** End of page, before related content  
**Count:** 3-5 questions  
**Purpose:** Practical visitor information

**Example:**
```
Q: Is Machir Bay safe for swimming?
A: Atlantic surf makes it best for experienced swimmers. 
Supervised swimming area available in summer.
```

---

### Hub Pages (Getting Here, About)
**Section:** Inline Q&A blocks within relevant sections  
**Location:** Integrated throughout (e.g., "Common Ferry Questions" within "By Ferry" section)  
**Count:** 2-4 questions per section  
**Purpose:** Address common anxieties/blockers

**Example:**
```
Common Ferry Questions

Q: When should I book my ferry to Islay?
A: Book 2-3 months ahead for summer travel, 2-4 weeks for winter.
```

---

## Content Reuse Pattern

Same fact, three formats:

1. **Entity format:** "Facilities: Dishwasher available"
2. **Q&A format:** "Q: Does it have a dishwasher? A: Yes, full kitchen includes dishwasher..."
3. **Schema format:** `amenityFeature: "Dishwasher"`

This creates multiple extraction opportunities for AI while maintaining single source of truth.

---

## Schema Markup Rules

- **Property pages:** Accommodation schema (NOT FAQPage)
- **Guide pages:** TouristAttraction/Place schema (NOT FAQPage)
- **Hub pages:** WebPage schema (NOT FAQPage)
- **Only use FAQPage schema if standalone FAQ page exists** (we don't have one)

**Why:** Q&A blocks enhance entity pages - they don't replace entity schema.

---

## Display Rules

- âœ… All Q&As fully visible (no accordions)
- âœ… Semantic HTML: h2 > h3 + p structure
- âœ… No interaction required
- âœ… Maximum 6 Q&As per block (keeps scannable)
- âœ… Border or visual separator between Q&As
- âœ… Mobile-responsive spacing

---

## Content Creation Checklist

Before adding Q&A block to any page:

- [ ] Q&As reframe existing content, don't duplicate it verbatim
- [ ] Questions match natural language queries users would actually search
- [ ] Answers are 2-3 sentences maximum
- [ ] Content is fully visible in DOM (view source check)
- [ ] Questions are contextually relevant to the page entity
- [ ] Answers can stand alone if extracted by AI
- [ ] No more than 6 questions per block

---

## Good vs Bad Examples

### âŒ Bad (Duplicates List)
**On property page with facilities list:**
```
Q: What facilities does Portbahn have?
A: Dishwasher, WiFi, parking, wood stove, washer/dryer, trampoline.
```
*This just repeats the facilities list as a question*

### âœ… Good (Reframes/Extends)
**On property page with facilities list:**
```
Q: Is Portbahn suitable for remote work?
A: Yes, with reliable WiFi, a large dining table seating 8, 
and quiet surroundings away from the main road.
```
*Uses facilities to answer specific use case*

---

### âŒ Bad (Too Long)
```
Q: How do I get to Islay?
A: You can get to Islay by taking the CalMac ferry from Kennacraig 
on the mainland which runs daily to either Port Askaig taking 2 hours 
or Port Ellen taking 2.5 hours. You should book 2-3 months in advance 
for summer travel. Alternatively you can fly with Loganair from Glasgow 
which takes 45 minutes and runs 2-3 times daily in summer. The airport 
is 25 minutes from Bruichladdich. You'll need to arrange car hire or 
taxi transfer from either the ferry port or airport.
```
*Too long - should be split into multiple Q&As or shortened*

### âœ… Good (Concise)
```
Q: How do I get to Islay?
A: CalMac ferries run daily from Kennacraig (2-2.5 hours) or 
fly with Loganair from Glasgow (45 minutes). Book ferries 2-3 months 
ahead for summer travel.
```
*Concise, links available for full details*

---

## Why This Approach

### For Users:
âœ… Answers where they need them (contextual)  
âœ… No hunting for separate FAQ page  
âœ… Scannable alongside detailed content  

### For AI/AEO:
âœ… More natural language on entity pages  
âœ… Better query matching ("Can I..." vs "Pet Policy")  
âœ… Multiple passage extraction opportunities  
âœ… Entity pages answer more questions = more authority  

### For SEO:
âœ… More long-tail keyword coverage  
âœ… Question phrases match voice search  
âœ… Content depth signals  

### For Maintenance:
âœ… No separate FAQ section to maintain  
âœ… Content lives where it makes logical sense  
âœ… Single source of truth per topic  
âœ… Less duplication across site  

---

## Implementation Phases

**Phase 1:** Property pages (3 pages, 4-6 Q&As each)  
**Phase 2:** Getting Here page (inline Q&A blocks)  
**Phase 3:** Guide pages (beaches, distilleries, walks)  
**Phase 4:** Other pages as needed  

---

**Status:** Final - Approved Strategy  
**Date:** December 2024  
**Next Review:** After Phase 3 complete