---

## Q&A Content Blocks (FAQ Pattern)

### When to Use Q&A Format

Use Q&A format to reframe entity attributes in natural language:
- **Property pages:** 4-6 questions about the specific property
- **Guide pages:** 3-5 questions about visiting/accessing the location
- **Hub pages:** 2-4 questions per section addressing common concerns

### Q&A Block Structure

**Standard Format:**
```
H2: Common Questions About [Entity Name]

Q: [Natural language question matching how users search]?
A: [2-3 sentence answer with key facts]
```

**Display Requirements:**
- âœ… Fully visible (no accordions, tabs, or hidden content)
- âœ… Semantic HTML (h2 section heading, h3 question, p answer)
- âœ… No JavaScript interaction required
- âœ… Mobile-responsive spacing

---

### Content Rules for Q&As

#### Questions Should:
- Match natural language search queries
- Be specific to the entity on the page
- Address practical visitor concerns
- Use conversational phrasing ("Does...", "Can I...", "How far...")

#### Answers Should:
- Be 2-3 sentences maximum (under 400 characters)
- Contain factual information
- Reframe/extend existing page content (not duplicate)
- Be extractable as standalone passages
- Lead naturally to deeper content if available

#### Maximum Per Block:
- 6 Q&As per block (readability limit)
- If more needed, reconsider content strategy

---

### Schema Markup for Q&As

**Do NOT use FAQPage schema on:**
- Property pages (use Accommodation schema)
- Guide pages (use Place/TouristAttraction schema)
- Hub pages (use WebPage schema)

**Why:** Q&A blocks enhance entity pages - they don't become FAQ pages.

**Only use FAQPage schema if:**
- You have a dedicated standalone FAQ page
- The page's primary purpose is answering questions
- We currently don't have this - all Q&As are contextual

---

### Content Reuse Pattern

Same information should exist in multiple formats:

**Entity Attribute (List Format):**
```
Facilities:
- WiFi
- Dishwasher
- Parking
```

**Q&A Format (Natural Language):**
```
Q: Is Portbahn suitable for remote work?
A: Yes, with reliable WiFi, large dining table seating 8, 
and quiet location away from main road.
```

**Schema Format (Machine-Readable):**
```json
"amenityFeature": [
  {"@type": "LocationFeatureSpecification", "name": "WiFi", "value": true}
]
```

**Result:** Same fact, three extraction opportunities for AI.

---

### Good vs Bad Q&A Examples

#### âŒ Bad: Duplicates Existing List
```
On property page with "Pet Policy: Dogs welcome Â£15/stay" section:

Q: What's the pet policy?
A: Dogs welcome Â£15 per stay.
```
**Why bad:** Just repeats the heading verbatim, adds no value.

---

#### âœ… Good: Reframes with Context
```
On property page with pet policy section:

Q: Can I bring my dog to Portbahn House?
A: Yes, dogs are welcome at Â£15 per stay. The property has 
enclosed outdoor space perfect for dogs.
```
**Why good:** Natural question, adds context about outdoor space.

---

#### âŒ Bad: Too Long
```
Q: How do I get there?
A: You can reach the property by taking the CalMac ferry from 
Kennacraig to either Port Askaig or Port Ellen, then driving 30 
minutes. Ferries run multiple times daily but should be booked 
2-3 months ahead in summer. Alternatively fly to Islay Airport 
and drive 25 minutes. Car hire available at airport and ferry ports.
```
**Why bad:** 5+ sentences, too much information, not scannable.

---

#### âœ… Good: Concise with Key Facts
```
Q: How do I get to Portbahn House?
A: 30 minutes from Port Askaig or Port Ellen ferry terminals. 
Islay Airport is 25 minutes by car.
```
**Why good:** Brief, key facts only, scannable. Full travel info elsewhere.

---

#### âŒ Bad: Wrong Context
```
On beach guide page:

Q: What's the weather like on Islay?
A: Islay has a mild oceanic climate with frequent rain...
```
**Why bad:** Generic island question on specific beach page. Wrong context.

---

#### âœ… Good: Contextually Relevant
```
On beach guide page:

Q: Is Machir Bay safe for swimming?
A: Atlantic surf makes it best for experienced swimmers. 
Supervised swimming area available in summer months.
```
**Why good:** Specific to this beach, practical visitor concern.

---

### Implementation Checklist

Before publishing any page with Q&A blocks:

- [ ] Questions match natural search queries for this entity
- [ ] Answers are under 400 characters each
- [ ] Q&As reframe content, don't duplicate lists verbatim
- [ ] All content visible in DOM (no accordions)
- [ ] Semantic HTML structure (h2 > h3 + p)
- [ ] Maximum 6 Q&As in the block
- [ ] Mobile responsive spacing
- [ ] No schema markup conflicts (not using FAQPage on entity pages)

---

### Testing Q&A Effectiveness

After launch, monitor:
- Search Console queries matching Q&A phrasing
- AI chatbot citations of Q&A content
- User feedback on helpfulness
- Passage extraction in AI search results

Iterate based on actual query patterns observed.

---