// sanity/schemas/documents/siteEntity.ts
// Source: cw/pbi/ENTITY-SCHEMA-SPEC.md

import { defineType, defineField } from 'sanity'

export const siteEntity = defineType({
  name: 'siteEntity',
  title: 'Site Entity',
  type: 'document',
  fields: [

    // ─── Core Identity ───────────────────────────────────────────────
    defineField({
      name: 'entityId',
      title: 'Entity ID',
      type: 'slug',
      description: 'Unique kebab-case identifier. Never change after creation.',
      validation: Rule => Rule.required(),
      options: { source: 'name' },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Canonical name — exactly as it appears in all content.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Distillery', value: 'distillery' },
          { title: 'Restaurant', value: 'restaurant' },
          { title: 'Café / Shop', value: 'cafe' },
          { title: 'Beach', value: 'beach' },
          { title: 'Nature Reserve', value: 'nature-reserve' },
          { title: 'Heritage / Archaeological Site', value: 'heritage' },
          { title: 'Walking Route', value: 'route' },
          { title: 'Activity / Tour', value: 'activity' },
          { title: 'Attraction', value: 'attraction' },
          { title: 'Village', value: 'village' },
          { title: 'Transport', value: 'transport' },
          { title: 'Event', value: 'event' },
          { title: 'Accommodation', value: 'accommodation' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'schemaOrgType',
      title: 'Schema.org Type',
      type: 'string',
      description: 'Maps to JSON-LD @type. Examples: LocalBusiness, Restaurant, Beach, TouristAttraction, NaturalFeature, Event.',
    }),
    defineField({
      name: 'island',
      title: 'Island',
      type: 'string',
      options: {
        list: [
          { title: 'Islay', value: 'islay' },
          { title: 'Jura', value: 'jura' },
          { title: 'Mainland', value: 'mainland' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'islay',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Seasonal', value: 'seasonal' },
          { title: 'Temporarily Closed', value: 'temporary' },
          { title: 'Permanently Closed', value: 'closed' },
        ],
      },
      initialValue: 'active',
    }),

    // ─── Ecosystem ───────────────────────────────────────────────────
    defineField({
      name: 'canonicalExternalUrl',
      title: 'Canonical External URL',
      type: 'url',
      description: 'If full content for this entity lives on another site in the ecosystem (e.g. IoJ for Jura attractions), set this URL. EntityCard will show brief info + "Full details →" link. Prevents content duplication and builds authority on the canonical site.',
    }),
    defineField({
      name: 'ecosystemSite',
      title: 'Canonical Ecosystem Site',
      type: 'string',
      options: {
        list: [
          { title: 'Portbahn Islay (PBI)', value: 'pbi' },
          { title: 'Bothan Jura Retreat (BJR)', value: 'bjr' },
          { title: 'Isle of Jura (IoJ)', value: 'ioj' },
          { title: 'External', value: 'external' },
        ],
      },
      description: 'Which site in the ecosystem holds the canonical content for this entity. Defaults to PBI.',
      initialValue: 'pbi',
    }),

    // ─── Descriptions ────────────────────────────────────────────────
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: '1–2 sentences. Machine-readable. Entity–Predicate–Object structure. No brand voice — factual only.',
    }),
    defineField({
      name: 'editorialNote',
      title: 'Editorial Note',
      type: 'text',
      rows: 4,
      description: 'Optional. Pi/Lynton voice fragment — a recommendation or characterisation. Plain text, not PortableText.',
    }),
    defineField({
      name: 'importantNote',
      title: 'Important Note',
      type: 'string',
      description: 'Safety warnings, restrictions, or critical guest info. E.g. "Not safe for swimming — strong currents."',
    }),

    // ─── Location ────────────────────────────────────────────────────
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({ name: 'address', title: 'Address', type: 'string' }),
        defineField({ name: 'village', title: 'Village / Area', type: 'string' }),
        defineField({ name: 'postcode', title: 'Postcode', type: 'string' }),
        defineField({
          name: 'coordinates',
          title: 'Coordinates',
          type: 'geopoint',
          description: 'Lat/lng — used for map rendering and schema markup.',
        }),
        defineField({ name: 'googlePlaceId', title: 'Google Place ID', type: 'string' }),
        defineField({ name: 'googleMapsUrl', title: 'Google Maps URL', type: 'url' }),
        defineField({
          name: 'distanceFromBruichladdich',
          title: 'Distance from Bruichladdich',
          type: 'string',
          description: 'Human-readable. E.g. "5-minute walk", "15-minute drive", "20-minute drive".',
        }),
      ],
    }),

    // ─── Contact ─────────────────────────────────────────────────────
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'website', title: 'Website', type: 'url' }),
        defineField({ name: 'bookingUrl', title: 'Booking URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram Handle', type: 'string', description: 'Handle only — no @ prefix.' }),
        defineField({ name: 'facebook', title: 'Facebook Page Name', type: 'string' }),
      ],
    }),

    // ─── Opening Hours ───────────────────────────────────────────────
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Days Label', type: 'string', description: 'E.g. "Thursday–Saturday" or "Monday–Saturday".' }),
          defineField({ name: 'opens', title: 'Opens', type: 'string', description: '24h format. E.g. "10:00".' }),
          defineField({ name: 'closes', title: 'Closes', type: 'string', description: '24h format. E.g. "15:00".' }),
          defineField({ name: 'notes', title: 'Notes', type: 'string', description: 'E.g. "Lunch last orders 14:30". Optional.' }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'opens' },
          prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({ title, subtitle: `Opens ${subtitle}` }),
        },
      }],
    }),

    // ─── Attributes (sparse — populate only what applies) ────────────
    defineField({
      name: 'attributes',
      title: 'Attributes',
      type: 'object',
      fields: [
        // Beaches
        defineField({ name: 'safeForSwimming', title: 'Safe for Swimming', type: 'boolean', description: 'Beaches only.' }),
        // All
        defineField({ name: 'requiresBooking', title: 'Booking Required', type: 'boolean' }),
        defineField({ name: 'bookingAdvice', title: 'Booking Advice', type: 'string' }),
        defineField({ name: 'priceRange', title: 'Price Range', type: 'string', description: 'E.g. "£", "££", "£££".' }),
        defineField({ name: 'familyFriendly', title: 'Family Friendly', type: 'boolean' }),
        // Distilleries
        defineField({
          name: 'peatLevel',
          title: 'Peat Level',
          type: 'string',
          options: { list: ['heavily-peated', 'medium-peated', 'lightly-peated', 'unpeated', 'mixed'] },
          description: 'Distilleries only.',
        }),
        defineField({ name: 'yearFounded', title: 'Year Founded', type: 'number', description: 'Distilleries only.' }),
        defineField({ name: 'yearReopened', title: 'Year Reopened', type: 'number', description: 'Port Ellen: 2024.' }),
        defineField({ name: 'hasCafe', title: 'Has Café / Restaurant', type: 'boolean', description: 'Distilleries with on-site food.' }),
        // Events
        defineField({ name: 'eventMonth', title: 'Event Month', type: 'string', description: 'Events only. E.g. "May".' }),
        defineField({ name: 'eventDuration', title: 'Event Duration', type: 'string', description: 'E.g. "~10 days".' }),
        // Routes
        defineField({ name: 'distanceKm', title: 'Distance (km)', type: 'number', description: 'Walking routes only.' }),
        defineField({ name: 'distanceMiles', title: 'Distance (miles)', type: 'number', description: 'Walking routes only.' }),
        defineField({ name: 'durationMinutes', title: 'Duration (minutes)', type: 'number', description: 'Approximate. Walking routes only.' }),
        defineField({
          name: 'difficulty',
          title: 'Difficulty',
          type: 'string',
          options: { list: ['easy', 'moderate', 'strenuous'] },
          description: 'Walking routes only.',
        }),
        defineField({ name: 'circular', title: 'Circular Route', type: 'boolean', description: 'Walking routes only.' }),
        defineField({ name: 'accessibilityNotes', title: 'Accessibility Notes', type: 'string', description: 'E.g. "Flat tarmac, suitable for all abilities including pushchairs."' }),
        defineField({ name: 'startPointParking', title: 'Start Point / Parking', type: 'string', description: 'Postcode or grid reference + brief description. E.g. "PA42 7AU — car park at end of Oa road."' }),
        defineField({ name: 'routeHighlights', title: 'Route Highlights', type: 'text', description: 'Key waypoints, views, or features. Plain text.' }),
        // Heritage
        defineField({ name: 'heritagePeriod', title: 'Heritage Period', type: 'string', description: 'Heritage sites only. E.g. "Iron Age", "12th–16th century", "World War I".' }),
        defineField({ name: 'accessRestrictions', title: 'Access Restrictions', type: 'string', description: 'E.g. "Private property — viewable from public track only" (Barnhill). Or visitor centre hours.' }),
      ],
    }),

    // ─── Tags ────────────────────────────────────────────────────────
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'For filtering on guide pages and map components. E.g. family-friendly, whisky, wildlife, swimming, restaurant.',
      options: { layout: 'tags' },
    }),

    // ─── Media ───────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ]}],
    }),

    // ─── Relations ───────────────────────────────────────────────────
    defineField({
      name: 'relatedEntities',
      title: 'Related Entities',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'siteEntity' }] }],
      description: 'Cluster relations — e.g. Ardbeg → Lagavulin → Laphroaig → Port Ellen for south coast cluster.',
    }),
    defineField({
      name: 'guidePages',
      title: 'Appears On Guide Pages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guidePage' }] }],
      description: 'Which guide pages feature this entity. Used for filtering and reverse-lookup.',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'images.0',
    },
    prepare: ({ title, subtitle, media }: { title: string; subtitle: string; media: any }) => ({
      title,
      subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : 'Entity',
      media,
    }),
  },
})

export default siteEntity
