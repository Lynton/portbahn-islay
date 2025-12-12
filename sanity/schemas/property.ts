import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'details', title: 'Property Details' },
    { name: 'location', title: 'Location & Directions' },
    { name: 'policies', title: 'Policies & Rules' },
    { name: 'lodgify', title: 'Lodgify Integration' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ========== BASIC INFO ==========
    defineField({
      name: 'name',
      title: 'Property Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'House', value: 'house' },
          { title: 'Cottage', value: 'cottage' },
          { title: 'Apartment', value: 'apartment' },
        ],
      },
    }),

    // ========== IMAGES ==========
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Property Images',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/*',
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Describe the image for SEO and accessibility',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (optional)',
              description: 'Visible text displayed with the image (optional)',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),

    // ========== PROPERTY OVERVIEW (AI Block 1) ==========
    defineField({
      name: 'overviewIntro',
      title: 'Property Overview - Intro Sentence',
      type: 'string',
      group: 'content',
      description: 'e.g., "Portbahn sleeps 8 guests in 3 bedrooms on the shores of Loch Indaal, Isle of Islay."',
    }),
    defineField({
      name: 'description',
      title: 'Property Description',
      type: 'text',
      group: 'content',
      rows: 6,
      description: 'Main property description (2-3 paragraphs)',
    }),

    // ========== CAPACITY & LAYOUT (AI Block 2) ==========
    defineField({
      name: 'sleeps',
      title: 'Max Guests',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required(),
      description: 'Maximum number of guests the property can accommodate',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Number of Bedrooms',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beds',
      title: 'Number of Beds',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Number of Bathrooms',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sleepingIntro',
      title: 'Sleeping Arrangements - Intro Sentence',
      type: 'string',
      group: 'details',
      description: 'e.g., "Three bedrooms accommodate up to 8 guests across the ground floor."',
    }),
    defineField({
      name: 'bedroomDetails',
      title: 'Bedroom Details',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'List each bedroom, e.g., "Master bedroom with ensuite (sleeps 3) - Superking and single bed"',
    }),
    defineField({
      name: 'bathroomDetails',
      title: 'Bathroom Details',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'List bathrooms, e.g., "2 bathrooms (one en-suite and one family bathroom)"',
    }),

    // ========== ACCOMMODATION FACILITIES (AI Block 3) ==========
    defineField({
      name: 'facilitiesIntro',
      title: 'Accommodation Facilities - Intro Sentence',
      type: 'string',
      group: 'details',
      description: 'e.g., "Modern open-plan living with sea views and full amenities."',
    }),
    
    // Kitchen & Dining - Checkboxes
    defineField({
      name: 'kitchenDining',
      title: 'Kitchen & Dining',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dishwasher', value: 'dishwasher' },
          { title: 'Microwave', value: 'microwave' },
          { title: 'Oven', value: 'oven' },
          { title: 'Refrigerator', value: 'refrigerator' },
          { title: 'Toaster', value: 'toaster' },
          { title: 'Coffee machine', value: 'coffee_machine' },
          { title: 'Vacuum cleaner', value: 'vacuum_cleaner' },
          { title: 'BBQ grill', value: 'bbq_grill' },
          { title: "Children's high chair", value: 'high_chair' },
          { title: 'Kitchen stove/range', value: 'kitchen_stove' },
          { title: 'Dining table for 6', value: 'dining_table_6' },
          { title: 'Dining table for 8', value: 'dining_table_8' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'kitchenDiningNotes',
      title: 'Kitchen & Dining - Additional Notes',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Add unique or descriptive details not covered by checkboxes',
    }),
    
    // Living Areas - Checkboxes
    defineField({
      name: 'livingAreas',
      title: 'Living Areas',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Open plan layout', value: 'open_plan' },
          { title: 'Separate sitting room', value: 'separate_sitting' },
          { title: 'Separate dining room', value: 'separate_dining' },
          { title: 'Conservatory', value: 'conservatory' },
          { title: 'Sea views', value: 'sea_views' },
          { title: 'Wifi/broadband', value: 'wifi' },
          { title: 'Books and games', value: 'books_games' },
          { title: 'Double glazing', value: 'double_glazing' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'livingAreasNotes',
      title: 'Living Areas - Additional Notes',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Add unique features like "Owners\' antiques and paintings"',
    }),
    
    // Heating & Cooling - Checkboxes
    defineField({
      name: 'heatingCooling',
      title: 'Heating & Cooling',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Wood burning stove', value: 'wood_stove' },
          { title: 'Underfloor heating', value: 'underfloor_heating' },
          { title: 'Central heating', value: 'central_heating' },
          { title: 'Oil-fired central heating', value: 'oil_heating' },
          { title: 'Fireplace', value: 'fireplace' },
          { title: 'Double glazing', value: 'double_glazing_heat' },
          { title: 'Well-insulated', value: 'well_insulated' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'heatingCoolingNotes',
      title: 'Heating & Cooling - Additional Notes',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Add unique features like "Eco-house with solar power"',
    }),
    
    // Entertainment - Checkboxes
    defineField({
      name: 'entertainment',
      title: 'Entertainment',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'TV with cable/satellite', value: 'tv_cable' },
          { title: 'TV with antenna', value: 'tv_antenna' },
          { title: 'DVD player', value: 'dvd_player' },
          { title: 'Selection of DVDs', value: 'dvd_collection' },
          { title: 'Books and games', value: 'books_games_ent' },
          { title: 'Wifi/broadband', value: 'wifi_ent' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'entertainmentNotes',
      title: 'Entertainment - Additional Notes',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Add unique features',
    }),
    
    // Laundry - Checkboxes
    defineField({
      name: 'laundryFacilities',
      title: 'Laundry Facilities',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Washing machine', value: 'washing_machine' },
          { title: 'Tumble dryer', value: 'tumble_dryer' },
          { title: 'Iron & ironing board', value: 'iron_board' },
          { title: 'Dedicated laundry room', value: 'laundry_room' },
          { title: 'Airing pulley', value: 'airing_pulley' },
        ],
        layout: 'grid',
      },
    }),
    
    // Safety - Checkboxes
    defineField({
      name: 'safetyFeatures',
      title: 'Safety Features',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Carbon monoxide detector', value: 'co_detector' },
          { title: 'Smoke detector', value: 'smoke_detector' },
          { title: 'Fire extinguisher', value: 'fire_extinguisher' },
          { title: 'Private access road', value: 'private_access' },
          { title: 'First aid kit', value: 'first_aid' },
        ],
        layout: 'grid',
      },
    }),

    // ========== OUTDOOR SPACES (AI Block 4) ==========
    defineField({
      name: 'outdoorIntro',
      title: 'Outdoor Spaces - Intro Sentence',
      type: 'string',
      group: 'details',
      description: 'e.g., "Private mature garden with sea views and parking."',
    }),
    defineField({
      name: 'outdoorFeatures',
      title: 'Outdoor Features',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Private garden', value: 'private_garden' },
          { title: 'Sea views', value: 'sea_views_outdoor' },
          { title: 'BBQ area', value: 'bbq_area' },
          { title: "Children's play equipment", value: 'play_equipment' },
          { title: 'Trampoline', value: 'trampoline' },
          { title: 'Swings', value: 'swings' },
          { title: 'Woodland/nature area', value: 'woodland' },
          { title: 'Ponds', value: 'ponds' },
          { title: 'Bird reserves', value: 'bird_reserves' },
          { title: 'Greenhouse', value: 'greenhouse' },
          { title: 'Garage', value: 'garage' },
          { title: 'Walled garden', value: 'walled_garden' },
          { title: 'Elevated position', value: 'elevated' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'outdoorFeaturesNotes',
      title: 'Outdoor Features - Additional Notes',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Add unique outdoor features',
    }),
    defineField({
      name: 'parkingInfo',
      title: 'Parking Information',
      type: 'string',
      group: 'details',
      description: 'e.g., "Ample parking for several cars" or "2 dedicated parking spaces"',
    }),

    // ========== PET POLICY (AI Block 5) ==========
    defineField({
      name: 'petFriendly',
      title: 'Pet Friendly',
      type: 'boolean',
      group: 'policies',
      initialValue: true,
    }),
    defineField({
      name: 'petPolicyIntro',
      title: 'Pet Policy - Intro Sentence',
      type: 'string',
      group: 'policies',
      description: 'e.g., "Dogs welcome at £15 per dog per stay."',
    }),
    defineField({
      name: 'petPolicyDetails',
      title: 'Pet Policy Details',
      type: 'array',
      group: 'policies',
      of: [{ type: 'string' }],
    }),

    // ========== LOCATION & NEARBY (AI Block 6) ==========
    defineField({
      name: 'locationIntro',
      title: 'Location & Nearby - Intro Sentence',
      type: 'string',
      group: 'location',
      description: 'e.g., "Shoreline location between Bruichladdich and Port Charlotte."',
    }),
    defineField({
      name: 'location',
      title: 'Location (Town/Village)',
      type: 'string',
      group: 'location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nearbyAttractions',
      title: 'Nearby Attractions & Distances',
      type: 'array',
      group: 'location',
      of: [{ type: 'string' }],
      description: 'e.g., "Bruichladdich Distillery - 10 min walk"',
    }),
    defineField({
      name: 'whatToDoNearby',
      title: 'What To Do Nearby',
      type: 'array',
      group: 'location',
      of: [{ type: 'string' }],
    }),

    // ========== GETTING HERE (AI Block 7) ==========
    defineField({
      name: 'gettingHereIntro',
      title: 'Getting Here - Intro Sentence',
      type: 'string',
      group: 'location',
      description: 'e.g., "Located on Loch Indaal shoreline, 30 minutes from ferry ports."',
    }),
    defineField({
      name: 'postcode',
      title: 'Postcode',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'directions',
      title: 'Directions',
      type: 'text',
      group: 'location',
      rows: 4,
    }),
    defineField({
      name: 'ferryInfo',
      title: 'Ferry Information',
      type: 'text',
      group: 'location',
      rows: 3,
    }),
    defineField({
      name: 'airportDistance',
      title: 'Airport Distance',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'portDistance',
      title: 'Port Distance',
      type: 'string',
      group: 'location',
    }),

    // ========== HOUSE RULES & POLICIES (AI Block 8) ==========
    defineField({
      name: 'policiesIntro',
      title: 'House Rules & Policies - Intro Sentence',
      type: 'string',
      group: 'policies',
      description: 'e.g., "Check-in 4pm, checkout 10am. Cancellation policy applies."',
    }),
    defineField({
      name: 'checkInTime',
      title: 'Check-in Time',
      type: 'string',
      group: 'policies',
      initialValue: '04:00 PM',
    }),
    defineField({
      name: 'checkOutTime',
      title: 'Check-out Time',
      type: 'string',
      group: 'policies',
      initialValue: '10:00 AM',
    }),
    defineField({
      name: 'minimumStay',
      title: 'Minimum Stay (nights)',
      type: 'number',
      group: 'policies',
      initialValue: 2,
    }),
    defineField({
      name: 'cancellationPolicy',
      title: 'Cancellation Policy',
      type: 'text',
      group: 'policies',
      rows: 3,
    }),
    defineField({
      name: 'paymentTerms',
      title: 'Payment Terms',
      type: 'text',
      group: 'policies',
      rows: 2,
    }),
    defineField({
      name: 'securityDeposit',
      title: 'Security Deposit',
      type: 'string',
      group: 'policies',
    }),
    defineField({
      name: 'licensingInfo',
      title: 'Short Term Let License Info',
      type: 'string',
      group: 'policies',
    }),

    // ========== WHAT'S INCLUDED (AI Block 9) ==========
    defineField({
      name: 'includedIntro',
      title: "What's Included - Intro Sentence",
      type: 'string',
      group: 'details',
      description: 'e.g., "Linen, towels, and essentials provided for your stay."',
    }),
    defineField({
      name: 'included',
      title: 'Included Items',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'notIncluded',
      title: 'Not Included',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
    }),

    // ========== IMPORTANT INFORMATION (AI Block 10) ==========
    defineField({
      name: 'importantInfo',
      title: 'Important Information',
      type: 'array',
      group: 'policies',
      of: [{ type: 'text' }],
      description: 'Ring doorbell notice, ferry booking responsibility, property-specific notes',
    }),

    // ========== PRICING ==========
    defineField({
      name: 'dailyRate',
      title: 'Daily Rate (GBP)',
      type: 'number',
      group: 'policies',
    }),
    defineField({
      name: 'weeklyRate',
      title: 'Weekly Rate (GBP)',
      type: 'number',
      group: 'policies',
    }),

    // ========== LODGIFY INTEGRATION ==========
    defineField({
      name: 'lodgifyPropertyId',
      title: 'Lodgify Property ID',
      type: 'number',
      group: 'lodgify',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lodgifyRoomId',
      title: 'Lodgify Room Type ID',
      type: 'number',
      group: 'lodgify',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icsUrl',
      title: 'ICS Feed URL',
      type: 'url',
      group: 'lodgify',
      validation: (Rule) => Rule.required(),
    }),

    // ========== SEO ==========
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Optimized title for search engines (max 60 characters). If empty, property name will be used.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Brief description for search results (max 160 characters)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      media: 'heroImage',
    },
  },
});