import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'guestReview',
  title: 'Guest Review',
  type: 'document',
  icon: () => '⭐',
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
      description: 'One-liner extract for use as pull quote on pages. Max 150 chars.',
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
      description: 'Which property this review is for. Leave empty for site-wide reviews.'
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
      description: 'Date of review. Approximate is fine for Google reviews.'
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
          // PBI-specific tags
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
      description: 'Pi/Lynton response to the review (if any).'
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
      description: 'Optional context about the stay.'
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
    prepare({ quote, text, reviewer, platform, site, featured }: any) {
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
    { title: 'By Site', name: 'site', by: [{ field: 'site', direction: 'asc' }] },
  ]
})
