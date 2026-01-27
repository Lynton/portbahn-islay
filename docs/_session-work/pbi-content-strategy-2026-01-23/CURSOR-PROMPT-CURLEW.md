# Cursor Implementation: Curlew Cottage Trust Transfer

**Date:** 2026-01-23
**Task:** Update Curlew Cottage content in Sanity + add trust transfer frontend section
**Reference:** AI Search Playbook v1.3.1 trust transfer pattern

---

## Context

Curlew Cottage is being let for the first time in 2026 and has zero reviews. We need to establish credibility by transferring trust from Portbahn House and Shorefield through host credentials and review highlights.

**Strategy:**
1. Update Sanity content with Superhost credentials and improved entity definition
2. Add host-focused reviews from other properties
3. Create new frontend section: "Some Reviews from Our Neighbouring Properties"

---

## Task 1: Update Sanity Content

### Step 1.1: Open Sanity Studio

Navigate to: `http://localhost:3333` (or your Sanity Studio URL)

Go to: **Accommodation → Curlew Cottage**

---

### Step 1.2: Update `overviewIntro` Field

**Current:**
```
Curlew Cottage is a cosy family holiday cottage in Bruichladdich on the
Isle of Islay, Scotland, sleeping 6 guests in 3 bedrooms with private
access road, walled garden, and safe environment for children.
```

**Replace with:**
```
Curlew Cottage is a cosy family holiday cottage in Bruichladdich on the
Isle of Islay, Scotland, sleeping 6 guests in 3 bedrooms. Managed by
Pi and Lynton, Airbnb Superhosts with a 4.97/5 rating across 380+ reviews
at Portbahn House and Shorefield. This converted steading features a private
access road, walled garden, and safe environment for families with children.
```

**Key changes:**
- ✅ Added Superhost credentials in second sentence
- ✅ Maintained existing family-friendly positioning

---

### Step 1.3: Update `description` Field

Replace the **first 3 paragraphs only** of the description with:

```
Curlew Cottage is a converted stone steading in Bruichladdich on the Isle
of Islay, sleeping 6 guests in 3 bedrooms. This is the owner's personal
Islay retreat—a family cottage kept for private use until now, and available
for guest bookings for the first time in 2026.

Managed by Pi and Lynton, Airbnb Superhosts with a 4.97/5 rating across
380+ reviews at their other Islay properties (Portbahn House and Shorefield).
You can expect the same high standards of cleanliness, thoughtful equipment,
and responsive hosting that have earned them consistently outstanding reviews.

Unlike Portbahn House and Shorefield, Curlew is pet-free, making it ideal
for families with children and guests with allergies. The cottage sits in
an elevated position surrounded by farmland between Bruichladdich and Port
Charlotte, overlooking Loch Indaal. With a private access road shared by
only two neighbouring homes and a fully walled garden, Curlew creates a
safe, secluded environment perfect for families.
```

**IMPORTANT:** Keep all remaining paragraphs unchanged (starting from "The ground floor features...")

**Key changes:**
- ✅ "Converted stone steading" in opening sentence
- ✅ "Owner's retreat, first time letting" in paragraph 1
- ✅ Superhost credentials with specific rating in paragraph 2
- ✅ Pet-free differentiator upfront in paragraph 3
- ✅ Entity clear in first 200 words

---

### Step 1.4: Add `reviewHighlights` Field

**Current:** Empty array `[]`

**Add these 4 reviews:**

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

**Note:** The `propertyReference` field is new - add it to the schema if it doesn't exist yet.

---

### Step 1.5: Verify Other Fields

Check these fields are already correct (should be from yesterday's updates):

- ✅ **ownerContext**: "This is a family-owned cottage that has been used by the owner for many years as his quiet Islay retreat and is now being opened up to visitors for the first time in 2026."
- ✅ **availabilityStatus**: "bookable"

**Save and Publish** the Curlew Cottage document.

---

## Task 2: Update Sanity Schema (if needed)

### Step 2.1: Check `reviewHighlights` Schema

Open: `sanity/schemas/collections/property.ts`

Find the `reviewHighlights` field definition.

**Check if `propertyReference` field exists.** It should look like:

```typescript
{
  name: 'reviewHighlights',
  title: 'Review Highlights',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'rating',
          title: 'Rating',
          type: 'number',
          validation: (Rule) => Rule.required().min(1).max(10),
        },
        {
          name: 'source',
          title: 'Source',
          type: 'string',
          description: 'e.g., "Airbnb, September 2024"',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'propertyReference',
          title: 'Property Reference',
          type: 'string',
          description: 'For trust transfer reviews: which property this review is from (e.g., "Portbahn House", "Shorefield")',
          hidden: ({ parent }) => !parent?.source, // Only show if source exists
        },
      ],
    },
  ],
}
```

**If `propertyReference` field doesn't exist:** Add it to the schema as shown above.

---

## Task 3: Frontend Implementation

### Step 3.1: Create Trust Transfer Component

Create new file: `components/PropertyHostTrustTransfer.tsx`

```tsx
import React from 'react';

interface TrustTransferReview {
  quote: string;
  rating: number;
  source: string;
  propertyReference?: string;
}

interface PropertyHostTrustTransferProps {
  reviews: TrustTransferReview[];
  hostNames: string;
  hostRating: string;
  hostReviewCount: number;
}

export default function PropertyHostTrustTransfer({
  reviews,
  hostNames,
  hostRating,
  hostReviewCount,
}: PropertyHostTrustTransferProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="my-12 py-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-4">About Your Hosts</h2>

      <div className="prose prose-lg max-w-none mb-8">
        <p>
          Curlew Cottage is managed by <strong>{hostNames}</strong>, who also own and
          manage Portbahn House and Shorefield on Islay. As{' '}
          <strong>
            Airbnb Superhosts with a {hostRating} rating across {hostReviewCount}+ reviews
          </strong>
          , they bring years of hospitality experience to this property.
        </p>
        <p>
          This is the owner's personal retreat, carefully maintained and now being shared
          with guests for the first time in 2026. You can expect the same high standards
          of cleanliness, thoughtful equipment, and responsive hosting that have earned{' '}
          {hostNames} consistently outstanding reviews.
        </p>
      </div>

      <h3 className="text-2xl font-semibold mb-6">
        Some Reviews from Our Neighbouring Properties
      </h3>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <blockquote key={index} className="border-l-4 border-blue-600 pl-6 py-2">
            <p className="text-lg italic text-gray-700 mb-2">"{review.quote}"</p>
            <footer className="text-sm text-gray-600">
              <strong>
                — Guest at {review.propertyReference || 'one of our properties'}, {review.source}
              </strong>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <a
          href="/accommodation/portbahn-house"
          className="text-blue-600 hover:underline font-medium"
        >
          Read more reviews from Portbahn House →
        </a>
        <a
          href="/accommodation/shorefield"
          className="text-blue-600 hover:underline font-medium"
        >
          Read more reviews from Shorefield →
        </a>
      </div>
    </section>
  );
}
```

---

### Step 3.2: Update Property Page Template

Open: `app/accommodation/[slug]/page.tsx`

**Find the section rendering order** (should be around line 150-300).

**Add the trust transfer component** after the "What's Included" section and before "House Rules":

```tsx
{/* Trust Transfer Section - ONLY for properties with no reviews */}
{property.totalReviewCount === 0 && property.reviewHighlights && property.reviewHighlights.length > 0 && (
  <PropertyHostTrustTransfer
    reviews={property.reviewHighlights}
    hostNames="Pi and Lynton"
    hostRating="4.97/5"
    hostReviewCount={380}
  />
)}
```

**Import the component at the top:**

```tsx
import PropertyHostTrustTransfer from '@/components/PropertyHostTrustTransfer';
```

---

### Step 3.3: Add FAQ Component (Optional - Can be Phase 2)

If you want to add the "Why no reviews?" FAQ, create a simple FAQ component:

```tsx
{/* FAQ for new listings */}
{property.totalReviewCount === 0 && (
  <section className="my-12">
    <h2 className="text-3xl font-bold mb-6">Common Questions</h2>

    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">
          Why doesn't Curlew Cottage have reviews yet?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Curlew Cottage is being let for the first time in 2026. This property has
          been the owner's personal Islay retreat for many years and is now being
          opened to guests. It's managed by <strong>Pi and Lynton</strong>, who have
          a <strong>4.97/5 Superhost rating across 380+ reviews</strong> at their
          other properties: Portbahn House and Shorefield. You can read guest reviews
          about their hosting standards, responsiveness, and local knowledge on those
          property pages.
        </p>
      </div>
    </div>
  </section>
)}
```

---

## Task 4: Verify Schema.org Markup

Open: `lib/schema-markup.tsx`

Find the `generatePropertySchema` function.

**Verify that for Curlew:**
- ✅ No `Review` schema (zero reviews)
- ✅ No `AggregateRating` at property level
- ✅ Standard `VacationRental` schema
- ✅ `Offer` schema for booking

**Optional enhancement:** Add host Person schema:

```typescript
// Inside VacationRental schema
"host": {
  "@type": "Person",
  "name": "Pi",
  "description": "Airbnb Superhost with 4.97/5 rating across 380+ reviews"
}
```

---

## Testing Checklist

After implementation, verify:

- [ ] Sanity: Curlew Cottage has updated `overviewIntro`
- [ ] Sanity: Curlew Cottage has updated `description` opening (first 3 paragraphs)
- [ ] Sanity: Curlew Cottage has 4 `reviewHighlights` with `propertyReference` field
- [ ] Frontend: "About Your Hosts" section appears on Curlew page
- [ ] Frontend: Reviews display with property references (e.g., "Guest at Portbahn House")
- [ ] Frontend: Section does NOT appear on Portbahn House or Shorefield pages
- [ ] Frontend: Links to other properties work
- [ ] Schema: No review/rating schema for Curlew
- [ ] Visual: Styling matches site design system

---

## Deployment Notes

**Before deploying to production:**

1. Test on staging/localhost first
2. Verify all 3 properties still render correctly
3. Check mobile responsiveness of new section
4. Ensure no console errors
5. Verify schema.org markup in Google Rich Results Test

**Content is ready to publish immediately** - all review excerpts are real and from 2025.

---

## Success Metrics

**What this achieves:**

✅ **Trust Transfer**: Curlew now has visible social proof via host credentials
✅ **Entity Clarity**: "Converted steading, first time letting" in first 200 words
✅ **Differentiation**: Pet-free positioning clear upfront
✅ **AI Relevance**: Extractable passages about host quality and property uniqueness
✅ **User Confidence**: Clear explanation of why there are no reviews yet

**Before:**
- Zero reviews = zero credibility
- Generic "characterful cottage" description
- No host credentials visible

**After:**
- Superhost credentials in opening sentence
- 4 host-focused reviews from established properties
- Clear "first time letting" positioning
- Natural explanation via "Some Reviews from Our Neighbouring Properties"

---

## Reference Files

All source files are in:
`/_www_claude/_session-work/pbi-content-strategy-2026-01-23/`

- `CURLEW-CONTENT-UPDATE.json` - Complete content updates
- `CURLEW-HOST-REVIEWS-SELECTION.md` - Review selection rationale
- `CURLEW-TRUST-TRANSFER-SPEC.md` - Full strategy document

---

## Questions or Issues?

If anything is unclear:
1. Check the reference files above
2. Review the AI Search Playbook trust transfer pattern
3. Test on Portbahn House first (has reviews) to see normal review display
4. Compare Curlew's new section to that pattern

**Estimated time:** 30-45 minutes for full implementation

---

**Ready to implement!** 🚀
