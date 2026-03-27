# Guest Review Schema Spec
**Version:** 1.0
**Date:** 2026-03-27
**Status:** Draft
**Applies to:** PBI + BJR (shared Sanity dataset)

---

## Purpose

Standalone document type for guest reviews that can be:
- Tagged by topic for contextual display on guide pages
- Filtered by property and site
- Curated with `featured` flag for homepage/property page use
- Queried by GROQ to pull relevant reviews per page

This supplements (not replaces) the existing `reviewScores` and `reviewHighlights` fields on the `property` schema. Property-level aggregate ratings stay on the property document. Individual review documents enable topic-based surfacing across the site.

---

## Document Type: `guestReview`

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'guestReview',
  title: 'Guest Review',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Full Review Text',
      type: 'text',
      rows: 6,
      description: 'Complete review text as written by the guest.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'string',
      description: 'One-liner extract for use as pull quote on pages. Max 150 chars. Manually curated — the single best line from the review.',
      validation: Rule => Rule.max(150)
    }),
    defineField({
      name: 'reviewer',
      title: 'Reviewer Name',
      type: 'string',
      description: 'First name or display name as shown on platform.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Airbnb', value: 'airbnb' },
          { title: 'Booking.com', value: 'booking' },
          { title: 'Google', value: 'google' },
          { title: 'TripAdvisor', value: 'tripadvisor' },
          { title: 'Other', value: 'other' },
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'property',
      title: 'Property',
      type: 'reference',
      to: [{ type: 'property' }],
      description: 'Which property this review is for. Leave empty for site-wide reviews (e.g. Google reviews for BJR as a whole).'
    }),
    defineField({
      name: 'site',
      title: 'Site',
      type: 'string',
      options: {
        list: [
          { title: 'PBI (Portbahn Islay)', value: 'pbi' },
          { title: 'BJR (Bothan Jura Retreat)', value: 'bjr' },
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Rating given by guest. Airbnb/Google: 1-5. Booking.com: 1-10.',
    }),
    defineField({
      name: 'ratingOutOf',
      title: 'Rating Scale',
      type: 'number',
      description: '5 for Airbnb/Google, 10 for Booking.com.',
      options: {
        list: [
          { title: '/5', value: 5 },
          { title: '/10', value: 10 },
        ]
      }
    }),
    defineField({
      name: 'date',
      title: 'Review Date',
      type: 'date',
      description: 'Date of review. Approximate is fine for Google reviews with relative dates.'
    }),
    defineField({
      name: 'tags',
      title: 'Topic Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          // Experience tags
          { title: 'Hot Tub', value: 'hot-tub' },
          { title: 'Sauna', value: 'sauna' },
          { title: 'Cold Water / Ice Barrel', value: 'cold-water' },
          { title: 'Stargazing / Dark Skies', value: 'stargazing' },
          { title: 'Wood Burner / Cosy', value: 'cosy' },
          // Activity tags
          { title: 'Walking / Hiking', value: 'walks' },
          { title: 'Wild Swimming', value: 'swimming' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Photography', value: 'photography' },
          // Place tags
          { title: 'Views (Sea / Paps / Bay)', value: 'views' },
          { title: 'Beach / Corran Sands', value: 'beach' },
          { title: 'Distillery / Whisky', value: 'whisky' },
          { title: 'Food & Drink', value: 'food' },
          // Theme tags
          { title: 'Peace & Quiet', value: 'peace-quiet' },
          { title: 'Dog Friendly', value: 'dog-friendly' },
          { title: 'Travel / Ferry / Journey', value: 'travel' },
          { title: 'Hosts (Pi / Lynton)', value: 'hosts' },
          { title: 'Build Story / Community', value: 'build-story' },
          { title: 'Returning Guest', value: 'returning' },
          { title: 'Honeymoon / Special Occasion', value: 'special-occasion' },
          { title: 'Family / Children', value: 'family' },
          { title: 'Slowing Down / Reset', value: 'slow-down' },
          { title: 'Design / Interiors', value: 'design' },
          // PBI-specific tags (for future PBI import)
          { title: 'Islay Distilleries', value: 'islay-distilleries' },
          { title: 'Bruichladdich', value: 'bruichladdich' },
          { title: 'Ferry Support', value: 'ferry-support' },
        ]
      },
      description: 'Topic tags for contextual display. A review can appear on any guide page matching its tags.'
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Curated for prominent display on property pages, homepage, or about page.',
      initialValue: false
    }),
    defineField({
      name: 'featuredOn',
      title: 'Featured On',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Property Page (hero quote)', value: 'property-hero' },
          { title: 'Property Page (reviews section)', value: 'property-reviews' },
          { title: 'About / Our Story', value: 'about' },
          { title: 'Stay Hub', value: 'stay-hub' },
        ]
      },
      description: 'Specific pages where this review should appear in a featured position.',
      hidden: ({ parent }: any) => !parent?.featured
    }),
    defineField({
      name: 'hostResponse',
      title: 'Host Response',
      type: 'text',
      rows: 3,
      description: 'Pi/Lynton response to the review (if any). From platform.'
    }),
    defineField({
      name: 'stayDetails',
      title: 'Stay Details',
      type: 'object',
      fields: [
        { name: 'duration', type: 'string', title: 'Stay Duration' },
        { name: 'guestType', type: 'string', title: 'Guest Type',
          options: { list: [
            { title: 'Couple', value: 'couple' },
            { title: 'Family', value: 'family' },
            { title: 'Solo', value: 'solo' },
            { title: 'Group', value: 'group' },
            { title: 'Business', value: 'business' },
          ]}
        },
        { name: 'season', type: 'string', title: 'Season',
          options: { list: [
            { title: 'Spring (Mar-May)', value: 'spring' },
            { title: 'Summer (Jun-Aug)', value: 'summer' },
            { title: 'Autumn (Sep-Nov)', value: 'autumn' },
            { title: 'Winter (Dec-Feb)', value: 'winter' },
          ]}
        },
      ],
      description: 'Optional context about the stay. Helps with seasonal and audience-specific display.'
    }),
  ],
  preview: {
    select: {
      quote: 'pullQuote',
      text: 'text',
      reviewer: 'reviewer',
      platform: 'platform',
      site: 'site',
      featured: 'featured',
    },
    prepare({ quote, text, reviewer, platform, site, featured }) {
      const displayText = quote || (text ? text.substring(0, 80) + '...' : 'No text')
      return {
        title: `${featured ? '⭐ ' : ''}${displayText}`,
        subtitle: `${reviewer} · ${platform} · ${site?.toUpperCase()}`
      }
    }
  },
  orderings: [
    { title: 'Featured First', name: 'featured', by: [{ field: 'featured', direction: 'desc' }, { field: 'date', direction: 'desc' }] },
    { title: 'Newest', name: 'newest', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'By Property', name: 'property', by: [{ field: 'site', direction: 'asc' }] },
  ]
})
```

---

## GROQ Query Patterns

### Pull reviews for a guide page by tag
```groq
*[_type == "guestReview" && site == "bjr" && featured == true && $tag in tags] | order(date desc) [0...2] {
  pullQuote,
  reviewer,
  platform,
  rating,
  ratingOutOf,
  "propertyName": property->name
}
```

### Pull featured reviews for a property page
```groq
*[_type == "guestReview" && site == "bjr" && property._ref == $propertyId && featured == true] | order(date desc) [0...5] {
  text,
  pullQuote,
  reviewer,
  platform,
  rating,
  ratingOutOf,
  date,
  "featuredPositions": featuredOn
}
```

### Pull homepage hero quote
```groq
*[_type == "guestReview" && site == "bjr" && "homepage" in featuredOn][0] {
  pullQuote,
  reviewer
}
```

### Pull reviews for a topic across all properties
```groq
*[_type == "guestReview" && site == "bjr" && "wildlife" in tags && featured == true] | order(date desc) [0...3] {
  pullQuote,
  reviewer,
  platform,
  "propertyName": property->name
}
```

### Aggregate stats (for trust bars)
```groq
{
  "totalReviews": count(*[_type == "guestReview" && site == "bjr"]),
  "featuredCount": count(*[_type == "guestReview" && site == "bjr" && featured == true]),
  "averageRating": math::avg(*[_type == "guestReview" && site == "bjr" && ratingOutOf == 5].rating)
}
```

---

## Auto-Tagging Rules

For the import script, auto-tag based on text content:

| Tag | Keywords to match |
|-----|------------------|
| `hot-tub` | hot tub, hottub, tub |
| `sauna` | sauna |
| `cold-water` | ice barrel, cold water, cold plunge, ice bath |
| `stargazing` | star, stars, stargazing, milky way, northern lights, aurora, telescope, night sky |
| `cosy` | cosy, cozy, wood burner, log burner, fire, wood burning, stove |
| `walks` | walk, walking, hike, hiking, paps, trails, lowlandman, corryvreckan |
| `swimming` | swim, swimming, beach, sea, water, loch |
| `wildlife` | deer, eagle, seal, otter, bird, wildlife, puffin, stag |
| `views` | view, views, paps, bay, sea, sunset, sunrise, panoramic |
| `beach` | beach, sand, corran, sands, shore |
| `whisky` | whisky, distillery, dram, jura whisky, tasting |
| `food` | food, cook, kitchen, pie, restaurant, bakehouse, antlers, eat |
| `peace-quiet` | peace, peaceful, quiet, tranquil, calm, serene, silence, remote |
| `dog-friendly` | dog, dogs, puppy, pup, pet, labrador, spaniel |
| `travel` | ferry, travel, journey, calmac, cal mac, port askaig, feolin |
| `hosts` | pi, lynton, host, amba, welcome, welcoming, helpful |
| `build-story` | built, build, created, renovated, vision, dream |
| `returning` | return, back, again, next time, come back |
| `special-occasion` | honeymoon, birthday, anniversary, engagement, celebrate |
| `family` | family, children, kids, child |
| `slow-down` | slow, reset, escape, disconnect, unwind, recharge, retreat |
| `design` | design, tasteful, stylish, beautifully, furnished, interior, decorated |
| `photography` | photo, photograph, camera, picture, instagram |

**Post auto-tag:** Manual curation pass to:
1. Remove false positives (e.g. "fire" in context of "fired hot tub" vs "wood burning fire")
2. Add `featured: true` on the best 5-8 per property + 5-8 site-wide
3. Set `pullQuote` — extract the single best line from each featured review
4. Set `featuredOn` for reviews destined for specific page positions
5. Set `stayDetails` where available from platform data

---

## Import Plan

### Phase 1: BJR (315 reviews)
1. Run auto-tag script against `all-reviews.json`
2. Manual curation pass (featured, pullQuotes, featuredOn)
3. Import to Sanity as `guestReview` documents with `site: 'bjr'`

### Phase 2: PBI (when ready)
1. Export PBI reviews from platforms (Airbnb, Booking, Google)
2. Same auto-tag + curation process
3. Import with `site: 'pbi'`
4. Existing `reviewHighlights` on PBI property documents can coexist — the new `guestReview` documents add topic-based querying

### Studio Desk Structure
```
📁 Guest Reviews
  📁 BJR Reviews (site == 'bjr')
    ⭐ Featured
    All Reviews
  📁 PBI Reviews (site == 'pbi')
    ⭐ Featured
    All Reviews
```

---

## Relationship to Existing Schema

The `guestReview` document type **supplements** the existing PBI property schema fields:

| Existing Field | Purpose | Stays? |
|---------------|---------|--------|
| `property.reviewScores` | Aggregate ratings per platform | ✅ Yes — quick trust display |
| `property.reviewThemes` | Tagged theme list | ✅ Yes — property-level summary |
| `property.reviewHighlights` | Curated quotes (max 10) | ⚠️ Can be deprecated once `guestReview` is live — queries replace it |
| `property.totalReviewCount` | Sum of all reviews | ✅ Yes — or compute from `guestReview` count |

The new `guestReview` documents add:
- Topic-based querying (reviews on guide pages)
- Full review text (not just excerpts)
- Platform-specific metadata
- Cross-site capability (PBI + BJR)
- Seasonal and guest-type filtering

---

## Notes

- Reviews are public content from public platforms — no privacy concern with importing
- Google reviews have relative dates ("3 weeks ago") — approximate to month/year
- Some reviews are truncated ("... More") — import what we have, flag for manual completion if needed
- Host responses are valuable for trust — import where available
- The `featured` + `featuredOn` system prevents review overload while enabling targeted placement
