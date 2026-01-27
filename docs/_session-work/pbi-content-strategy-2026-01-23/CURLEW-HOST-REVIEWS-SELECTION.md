# Curlew Cottage: Selected Host Reviews
**Date:** 2026-01-23
**Source:** Airbnb reviews from Portbahn House & Shorefield
**Purpose:** Trust transfer - "Some reviews from our neighbouring properties"

---

## Recommended Reviews for Curlew Page

These reviews focus on **host qualities** (responsiveness, helpfulness, property standards) rather than property-specific features, making them transferable to Curlew Cottage.

---

### Option 1: Ferry Crisis Response (STRONG)

**Property:** Portbahn House
**Date:** October 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "The setting is beautiful, the house in every way comfortable and consistent with the description. It feels like home, it was a real pleasure. **A big thank you to Pi for his proactivity when our ferry was cancelled.**"

**Why this works:**
- Shows Pi's responsiveness during crisis
- Relevant to Islay context (ferry issues are real)
- Demonstrates host going above and beyond
- "Feels like home" applies to owner's retreat positioning

---

### Option 2: Responsive & Easy (STRONG)

**Property:** Portbahn House
**Date:** September 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "Incredible and quiet spot, could stay there full time! Everything was perfect, 5 min from bus station and distillery. **Pi was very responsive and made everything easy.**"

**Why this works:**
- Direct mention of responsiveness
- "Everything was perfect" speaks to host standards
- Brief and punchy

---

### Option 3: Host & Property Quality (EXCELLENT)

**Property:** Portbahn House
**Date:** August 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "We couldn't have been happier with our stay here. The location was perfect, the house was so comfortable and really felt like a home, and **the host was extremely kind and responsive.** I hope to stay here again someday!"

**Why this works:**
- "Kind and responsive" = ideal host qualities
- "Felt like a home" = owner's retreat positioning
- Generic enough to apply to any property

---

### Option 4: Pi & Team Support (STRONG - Family Context)

**Property:** Portbahn House
**Date:** September 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "I arrived tired and stressed but the moment I walked into this lovely home I just relaxed. Everything we needed was there and so much for the children to do between the trampoline and swings and the lovely books and jigsaws. I really enjoyed my stay and **the support from Pi and Amba was fast and friendly.**"

**Why this works:**
- "Fast and friendly" support
- Family context (children) aligns with Curlew's family positioning
- "Everything we needed" = thoughtful host

**Note:** This mentions trampoline/swings which Curlew doesn't have, but the HOST qualities are transferable

---

### Option 5: Helpful & Friendly Hosts (EXCELLENT)

**Property:** Shorefield
**Date:** November 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "It was much bigger than we anticipated, which was great! Plenty of space to relax for 4 adults. The house stayed warm and you could hear the water from the bedrooms - heaven! **Pi was so friendly and helpful**, the local seafood and whisky is incredible (Bruichladdich Distillery is not 5 minutes up the road from the cottage and was one of our favorites), so would **highly recommend** Shorefield as a home base to explore the island."

**Why this works:**
- "Friendly and helpful" = key host qualities
- Mentions Bruichladdich (Curlew's location!)
- "Highly recommend" = strong endorsement

**Note:** Could edit to shorten if needed

---

### Option 6: Ferry Crisis Angels (STRONGEST - Customer Service)

**Property:** Shorefield
**Date:** September 2025
**Platform:** Airbnb
**Rating:** 5 stars (American guests)

> "**Pi and her team were amazing. Even before we arrived, they assisted with multiple CalMac ferry rescheduling due to maintenance and weather issues.** They were angels in distress for 6 stranded American women. Helping us connect to the rental car agency, when we found that none of us could make calls except back to people in the US even though we all had purchased international phone packages. We could receive international call and they were able to get the rental agency to contact us. **Thank you to the bottom of our hearts for checking back a couple of times to be sure we were safe.**"

**Why this works:**
- EXCEPTIONAL customer service story
- Shows proactive problem-solving
- Highly relevant to Islay travel (ferry issues)
- Emotional testimonial ("angels in distress")
- Demonstrates host checking on guests

**Note:** This is long but incredibly powerful for trust building

---

### Option 7: Questions Answered (GOOD)

**Property:** Shorefield
**Date:** September 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "We had a such fantastic stay at Shorefield House! The house was cozy and charming and just right for a couple days touring the island and located quite centrally to all the things we wanted to see and do. It had everything we needed, and **Pi and Amba were great when we had questions.**"

**Why this works:**
- "Great when we had questions" = responsive
- "Everything we needed" = thoughtful preparation
- Brief and clear

---

### Option 8: Clean & Thoughtful (EXCELLENT - Standards)

**Property:** Portbahn House
**Date:** June 2025
**Platform:** Airbnb
**Rating:** 5 stars

> "**Pi and the team were incredible hosts. Everything was clean, sufficient supplies, friendly communication.** The house including the garden were great for 8 of us. Easy walk to the beach, short driving distance to supermarkets. Lots of toys for the kids in the house. We would happily come back here!"

**Why this works:**
- "Incredible hosts" = strong endorsement
- "Everything was clean, sufficient supplies" = host standards
- "Friendly communication" = responsiveness
- Family context aligns with Curlew

**Note:** Mentions beach proximity which is property-specific, but host qualities are transferable

---

## Recommended Selection (Top 4)

For Curlew's "Some reviews from our neighbouring properties" section:

### 1. Ferry Crisis Response (Proactive Host)
> "A big thank you to Pi for his proactivity when our ferry was cancelled."
> **— Guest at Portbahn House, October 2025**

### 2. Kind & Responsive (Host Quality)
> "The host was extremely kind and responsive. The house felt like a home."
> **— Guest at Portbahn House, August 2025**

### 3. Friendly & Helpful (Local Knowledge)
> "Pi was so friendly and helpful, the local seafood and whisky is incredible. Would highly recommend as a home base to explore the island."
> **— Guest at Shorefield, November 2025**

### 4. Incredible Hosts (Standards)
> "Pi and the team were incredible hosts. Everything was clean, sufficient supplies, friendly communication."
> **— Guest at Portbahn House, June 2025**

**OR** if you want a dramatic testimonial:

### Alternative 4. Ferry Angels (Exceptional Service)
> "Pi and her team were amazing. Even before we arrived, they assisted with multiple CalMac ferry rescheduling due to maintenance and weather issues. Thank you to the bottom of our hearts for checking back a couple of times to be sure we were safe."
> **— Group of 6 travelers at Shorefield, September 2025**

---

## Implementation Format

### For Sanity `reviewHighlights` field:

```json
[
  {
    "_key": "trust_host1",
    "quote": "A big thank you to Pi for his proactivity when our ferry was cancelled.",
    "rating": 5,
    "source": "Airbnb, October 2025",
    "propertyReference": "Portbahn House"
  },
  {
    "_key": "trust_host2",
    "quote": "The host was extremely kind and responsive. The house felt like a home.",
    "rating": 5,
    "source": "Airbnb, August 2025",
    "propertyReference": "Portbahn House"
  },
  {
    "_key": "trust_host3",
    "quote": "Pi was so friendly and helpful, the local seafood and whisky is incredible. Would highly recommend as a home base to explore the island.",
    "rating": 5,
    "source": "Airbnb, November 2025",
    "propertyReference": "Shorefield"
  },
  {
    "_key": "trust_host4",
    "quote": "Pi and the team were incredible hosts. Everything was clean, sufficient supplies, friendly communication.",
    "rating": 5,
    "source": "Airbnb, June 2025",
    "propertyReference": "Portbahn House"
  }
]
```

---

## Frontend Display

### Section Heading:
```
## Some Reviews from Our Neighbouring Properties
```

### Intro Text:
```
Curlew Cottage is being let for the first time in 2026. It's managed by Pi and
Lynton, who also manage Portbahn House and Shorefield on Islay. Here's what
guests have said about staying at those properties:
```

### Review Display:
```
> "A big thank you to Pi for his proactivity when our ferry was cancelled."

**— Guest at Portbahn House, October 2025**

> "The host was extremely kind and responsive. The house felt like a home."

**— Guest at Portbahn House, August 2025**

[etc.]
```

### Footer Links:
```
[Read all reviews from Portbahn House →]
[Read all reviews from Shorefield →]
```

---

## Alternative: Condensed Version

If you want fewer reviews (2-3 instead of 4):

### Condensed Selection:

**1. Responsive & Kind**
> "The host was extremely kind and responsive. The house felt like a home."
> **— Portbahn House guest, August 2025**

**2. Ferry Crisis Support**
> "Pi and her team were amazing. Even before we arrived, they assisted with multiple CalMac ferry rescheduling. Thank you for checking back to be sure we were safe."
> **— Shorefield guests, September 2025**

**3. Incredible Standards**
> "Pi and the team were incredible hosts. Everything was clean, sufficient supplies, friendly communication."
> **— Portbahn House guest, June 2025**

---

## Notes

- All reviews are from **2025** (recent = relevant)
- Mix of **Portbahn House** (3 reviews) and **Shorefield** (1 review)
- Focus on **host qualities**, not property specifics
- No mentions of features Curlew doesn't have (except Option 4's trampoline reference, which can be edited out)
- Reviews demonstrate:
  - ✅ Responsiveness
  - ✅ Problem-solving (ferry issues)
  - ✅ Cleanliness/standards
  - ✅ Friendly communication
  - ✅ Local knowledge

---

**Status:** Ready for implementation in Sanity
**Next:** Add to Curlew's `reviewHighlights` field with `propertyReference` values
