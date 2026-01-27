# Cursor: Curlew Cottage Content Update (No Schema Changes)

**Task:** Update Curlew Cottage content in Sanity + add trust transfer display
**Time:** 20-30 minutes
**Schema Changes:** NONE ✅

---

## What We're Doing

Curlew has zero reviews. We're adding:
1. Superhost credentials to content
2. Host-focused reviews from Portbahn/Shorefield
3. New frontend section: "Some Reviews from Our Neighbouring Properties"

**NO Sanity schema changes** - uses existing fields only.

---

## Part 1: Update Sanity Content (10 mins)

### Open Sanity Studio
`http://localhost:3333` → **Accommodation** → **Curlew Cottage**

---

### Update 1: `overviewIntro` Field

**Replace with:**
```
Curlew Cottage is a cosy family holiday cottage in Bruichladdich on the
Isle of Islay, Scotland, sleeping 6 guests in 3 bedrooms. Managed by
Pi and Lynton, Airbnb Superhosts with a 4.97/5 rating across 380+ reviews
at Portbahn House and Shorefield. This converted steading features a private
access road, walled garden, and safe environment for families with children.
```

**What changed:** Added Superhost credentials in second sentence

---

### Update 2: `description` Field

**Replace ONLY the first 3 paragraphs** with:

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

**What changed:**
- "Converted stone steading" (not just "stone cottage")
- "Owner's retreat, first time letting" upfront
- Superhost credentials
- Pet-free differentiator

**IMPORTANT:** Keep everything after these 3 paragraphs unchanged (starting from "The ground floor features...")

---

### Update 3: `reviewHighlights` Array

**Current:** Empty `[]`

**Add these 4 reviews:**

```json
[
  {
    "quote": "A big thank you to Pi for his proactivity when our ferry was cancelled.",
    "rating": 5,
    "source": "Airbnb, October 2025 (Portbahn House)"
  },
  {
    "quote": "The host was extremely kind and responsive. The house felt like a home.",
    "rating": 5,
    "source": "Airbnb, August 2025 (Portbahn House)"
  },
  {
    "quote": "Pi was so friendly and helpful, the local seafood and whisky is incredible. Would highly recommend as a home base to explore the island.",
    "rating": 5,
    "source": "Airbnb, November 2025 (Shorefield)"
  },
  {
    "quote": "Pi and the team were incredible hosts. Everything was clean, sufficient supplies, friendly communication.",
    "rating": 5,
    "source": "Airbnb, June 2025 (Portbahn House)"
  }
]
```

**Note:** The property name in parentheses is intentional - uses existing `source` field, no schema changes.

**Save and Publish** ✅

---

## Part 2: Frontend Component (10-15 mins)

### Create New Component

File: `components/PropertyHostTrustTransfer.tsx`

```tsx
import React from 'react';

interface TrustTransferProps {
  reviews: Array<{
    quote: string;
    rating?: number;
    source: string;
  }>;
  totalReviewCount: number;
}

export default function PropertyHostTrustTransfer({
  reviews,
  totalReviewCount
}: TrustTransferProps) {
  // Only show for properties with zero reviews
  if (totalReviewCount > 0 || !reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="my-12 py-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-4">About Your Hosts</h2>

      <div className="prose prose-lg max-w-none mb-8">
        <p>
          Curlew Cottage is managed by <strong>Pi and Lynton</strong>, who also own
          and manage Portbahn House and Shorefield on Islay. As{' '}
          <strong>Airbnb Superhosts with a 4.97/5 rating across 380+ reviews</strong>,
          they bring years of hospitality experience to this property.
        </p>
        <p>
          This is the owner's personal retreat, carefully maintained and now being
          shared with guests for the first time in 2026. You can expect the same high
          standards of cleanliness, thoughtful equipment, and responsive hosting that
          have earned Pi and Lynton consistently outstanding reviews.
        </p>
      </div>

      <h3 className="text-2xl font-semibold mb-6">
        Some Reviews from Our Neighbouring Properties
      </h3>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <blockquote key={index} className="border-l-4 border-blue-600 pl-6 py-2">
            <p className="text-lg italic text-gray-700 mb-2">
              &ldquo;{review.quote}&rdquo;
            </p>
            <footer className="text-sm text-gray-600">
              <strong>— {review.source}</strong>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
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

### Add to Property Page

File: `app/accommodation/[slug]/page.tsx`

**Import at top:**
```tsx
import PropertyHostTrustTransfer from '@/components/PropertyHostTrustTransfer';
```

**Add component** after "What's Included" section, before "House Rules":

```tsx
{/* Trust Transfer - only shows for zero-review properties */}
<PropertyHostTrustTransfer
  reviews={property.reviewHighlights || []}
  totalReviewCount={property.totalReviewCount || 0}
/>
```

**That's it!** The component automatically:
- Only renders if `totalReviewCount === 0`
- Displays "source" as-is (includes property name in parentheses)
- Links to other properties

---

## Part 3: Optional FAQ (5 mins - Phase 2)

If you want to add "Why no reviews?" FAQ, add this below the trust transfer section:

```tsx
{/* FAQ for new listings */}
{property.totalReviewCount === 0 && (
  <section className="my-12">
    <h2 className="text-3xl font-bold mb-6">Common Questions</h2>

    <div>
      <h3 className="text-xl font-semibold mb-2">
        Why doesn't Curlew Cottage have reviews yet?
      </h3>
      <p className="text-gray-700 leading-relaxed">
        Curlew Cottage is being let for the first time in 2026. This property has
        been the owner's personal Islay retreat for many years and is now being
        opened to guests. It's managed by <strong>Pi and Lynton</strong>, who have
        a <strong>4.97/5 Superhost rating across 380+ reviews</strong> at their
        other properties: Portbahn House and Shorefield.
      </p>
    </div>
  </section>
)}
```

---

## Testing

After implementing:

- [ ] Curlew page shows "About Your Hosts" section
- [ ] 4 reviews display with property names in source (e.g., "Portbahn House")
- [ ] Section does NOT appear on Portbahn House or Shorefield
- [ ] Links to other properties work
- [ ] Mobile responsive
- [ ] No console errors

---

## What Happens Later

When Curlew gets real reviews:
1. `totalReviewCount` increases
2. Replace `reviewHighlights` with actual guest reviews
3. Component automatically hides (conditional on `totalReviewCount === 0`)

**No cleanup needed** - it's self-hiding! ✨

---

## Summary of Changes

**Sanity:**
- ✅ `overviewIntro`: Added Superhost line
- ✅ `description`: Rewrote first 3 paragraphs
- ✅ `reviewHighlights`: Added 4 host-focused reviews

**Frontend:**
- ✅ New component: `PropertyHostTrustTransfer.tsx`
- ✅ Added to property page template
- ✅ Conditional display (only zero-review properties)

**Schema:**
- ✅ NO CHANGES - uses existing fields

---

**Ready to implement!** 🚀

Estimated time: 20-30 minutes total
