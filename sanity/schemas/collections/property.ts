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
    { name: 'personality', title: '👥 Personality & Guest Experience' },
    { name: 'reviews', title: '⭐ Reviews & Social Proof' },
    { name: 'lodgify', title: 'Lodgify Integration' },
    { name: 'ai-search', title: 'AI & Search Optimization' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ========== BASIC INFO ==========
    defineField({
      name: 'name',
      title: 'Property Name',
      type: 'string',
      group: 'content',
      description: `Official property name - use consistently everywhere.

🔴 CRITICAL: Primary entity identifier for AI systems.

✓ DO: "Portbahn House"

✗ DON'T: Variations like "The Portbahn" or "Portbahn Holiday Home"`,
      
      validation: (Rule) => Rule.required(),
      placeholder: 'Portbahn House'
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
      description: `Opening sentence with property name + key facts.

🟢 HELPFUL: Sets context for main description.

✓ DO: "Portbahn sleeps 8 guests in 3 bedrooms on the shores of Loch Indaal, Isle of Islay"
✗ DON'T: "Welcome to an amazing property"`,
      
      placeholder: 'Portbahn sleeps 8 guests in 3 bedrooms on the shores of Loch Indaal'
    }),
    defineField({
      name: 'description',
      title: 'Property Description',
      type: 'text',
      group: 'content',
      rows: 6,
      description: `Main property description (2-4 paragraphs).

🔴 CRITICAL: Include specific features, location benefits, unique attributes.

✓ DO: "Modern house with private beach access and views to Paps of Jura"

✗ DON'T: "Stunning property in unique setting with unforgettable experiences"`,
    }),
    defineField({
      name: 'idealFor',
      title: 'Ideal For',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: `Guest types this property suits (3-5 items).

🟡 OPTIONAL: Helps match user intent queries.

✓ DO: "Families with children", "Dog owners", "Remote workers"

✗ DON'T: "People who love great places"`,
      
      validation: (Rule) => Rule.max(5)
    }),
    defineField({
      name: 'commonQuestions',
      title: 'Common Questions',
      type: 'array',
      group: 'content',
      description: `Property-specific Q&As in natural language (3-6 recommended).

🟡 OPTIONAL: Captures how users actually search.

✓ DO: "Does Portbahn House have WiFi?" / "Yes, reliable WiFi throughout"
✗ DON'T: "What facilities?" (duplicates facility list)`,
      
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'string',
              title: 'Question',
              placeholder: 'Does Portbahn House have WiFi?',
              description: 'Natural language question matching how users search',
              validation: (Rule) => Rule.required()
                .min(10).error('Question too short')
                .custom(q => {
                  if (!q || typeof q !== 'string') return true
                  if (!q.trim().endsWith('?')) return 'Question must end with ?'
                  if (q.trim().split(/\s+/).length < 4) return 'Question must be at least 4 words'
                  return true
                })
            },
            {
              name: 'answer',
              type: 'text',
              title: 'Answer',
              rows: 3,
              placeholder: 'Yes, reliable WiFi is available throughout the property',
              description: 'Concise answer (2-5 sentences, under 600 chars)',
              validation: (Rule) => Rule.required()
                .max(600).warning('Keep under 600 characters for optimal display')
            }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer'
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: subtitle ? subtitle.substring(0, 60) + '...' : ''
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule
        .min(3).warning('Recommend 3-6 questions for optimal coverage')
        .max(6).warning('More than 6 reduces scannability')
    }),
    defineField({
      name: 'faqCrossLinks',
      title: 'FAQ Cross-Links',
      type: 'array',
      group: 'content',
      description: 'Links to related property FAQs (e.g., "See logistics questions at Portbahn House")',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              type: 'string',
              title: 'Link Text',
              description: 'e.g., "Questions about check-in times, bedding options, or general policies?"',
            },
            {
              name: 'property',
              type: 'reference',
              title: 'Link to Property',
              to: [{ type: 'property' }],
            },
          ],
          preview: {
            select: {
              title: 'text',
              propertyName: 'property.name',
            },
            prepare({ title, propertyName }) {
              return {
                title: title || 'Cross-link',
                subtitle: propertyName ? `→ ${propertyName}` : '',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'faqBlocks',
      title: 'FAQ Canonical Blocks',
      type: 'array',
      group: 'content',
      description: 'Add FAQ canonical blocks to this property. Use property-specific or property-general categories.',
      of: [{ type: 'faqBlockReference' }],
    }),

    // ========== PERSONALITY & GUEST EXPERIENCE ==========
    defineField({
      name: 'propertyNickname',
      title: 'Property Nickname',
      type: 'string',
      description: 'Optional internal nickname that captures property personality (e.g., "The View House", "The Character House"). Used for editorial reference and potential subtle branding.',
      group: 'personality',
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: 'guestSuperlatives',
      title: 'Guest Superlatives',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short, powerful quotes from reviews that capture what guests say most often. Include source/date. Import from Enhanced Brief. Examples: "Better than the pictures", "One of my favorite stays in Scotland".',
      group: 'personality',
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'magicMoments',
      title: 'Magic Moments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'moment',
              title: 'Moment Description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required().max(200),
            },
            {
              name: 'frequency',
              title: 'Frequency Note',
              type: 'string',
              description: 'Optional note about how often mentioned (e.g., "15+ reviews", "Most common arrival ritual")',
            },
          ],
          preview: {
            select: {
              title: 'moment',
              subtitle: 'frequency',
            },
          },
        },
      ],
      description: 'Experiential patterns mentioned 5+ times in reviews. Real moments guests repeatedly describe. Import from Enhanced Brief.',
      group: 'personality',
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'perfectFor',
      title: 'Perfect For',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'guestType',
              title: 'Guest Type',
              type: 'string',
              description: 'e.g., "Whisky enthusiasts", "Families with young children"',
              validation: (Rule) => Rule.required().max(100),
            },
            {
              name: 'why',
              title: 'Why Perfect For Them',
              type: 'text',
              rows: 3,
              description: 'Concise explanation (2-3 sentences)',
              validation: (Rule) => Rule.required().max(300),
            },
            {
              name: 'reviewEvidence',
              title: 'Review Evidence',
              type: 'string',
              description: 'Optional percentage/count (e.g., "40% of reviews mention whisky tours")',
            },
          ],
          preview: {
            select: {
              title: 'guestType',
              subtitle: 'reviewEvidence',
            },
          },
        },
      ],
      description: 'Guest types that consistently love this property, backed by review evidence. Import from Enhanced Brief.',
      group: 'personality',
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'honestFriction',
      title: 'Honest Friction',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'issue',
              title: 'Issue',
              type: 'string',
              description: 'Brief description of limitation (e.g., "Small twin bedroom")',
              validation: (Rule) => Rule.required().max(100),
            },
            {
              name: 'context',
              title: 'Context',
              type: 'text',
              rows: 2,
              description: 'Why it exists, who it matters for, why it might not matter',
              validation: (Rule) => Rule.required().max(300),
            },
          ],
          preview: {
            select: {
              title: 'issue',
            },
          },
        },
      ],
      description: 'Transparent acknowledgment of repeated friction points from reviews. Builds trust through honesty. Import from Enhanced Brief.',
      group: 'personality',
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'ownerContext',
      title: 'Owner Context',
      type: 'text',
      rows: 4,
      description: 'Optional background on property owner/history that explains the character (e.g., Shorefield: bird watchers, painters, world travelers). Only fill if adds meaningful personality dimension.',
      group: 'personality',
    }),

    // ========== REVIEWS & SOCIAL PROOF ==========
    defineField({
      name: 'reviewScores',
      title: 'Review Scores',
      type: 'object',
      description: 'Aggregate review data from all platforms. Import from review platform exports.',
      group: 'reviews',
      fields: [
        {
          name: 'airbnbScore',
          title: 'Airbnb Score',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5).precision(2),
        },
        {
          name: 'airbnbCount',
          title: 'Airbnb Review Count',
          type: 'number',
          validation: (Rule) => Rule.min(0).integer(),
        },
        {
          name: 'airbnbBadges',
          title: 'Airbnb Badges',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Guest Favourite', value: 'guest-favourite' },
              { title: 'Top 10% of Homes', value: 'top-10-percent' },
              { title: 'Superhost', value: 'superhost' },
            ],
          },
        },
        {
          name: 'bookingScore',
          title: 'Booking.com Score',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
        },
        {
          name: 'bookingCount',
          title: 'Booking.com Review Count',
          type: 'number',
          validation: (Rule) => Rule.min(0).integer(),
        },
        {
          name: 'bookingCategory',
          title: 'Booking.com Category',
          type: 'string',
          options: {
            list: [
              { title: 'Exceptional (9.0+)', value: 'exceptional' },
              { title: 'Superb (8.0-8.9)', value: 'superb' },
              { title: 'Very Good (7.0-7.9)', value: 'very-good' },
            ],
          },
        },
        {
          name: 'googleScore',
          title: 'Google Score',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        },
        {
          name: 'googleCount',
          title: 'Google Review Count',
          type: 'number',
          validation: (Rule) => Rule.min(0).integer(),
        },
      ],
    }),
    defineField({
      name: 'reviewThemes',
      title: 'Review Themes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Select 3-7 themes that appear most frequently in reviews. Helps AI understand property strengths.',
      group: 'reviews',
      options: {
        list: [
          { title: 'Stunning Views', value: 'stunning-views' },
          { title: 'Immaculate Cleanliness', value: 'immaculate-cleanliness' },
          { title: 'Thoughtful Amenities', value: 'thoughtful-amenities' },
          { title: 'Perfect Location', value: 'perfect-location' },
          { title: 'Character & Charm', value: 'character-charm' },
          { title: 'Family Friendly', value: 'family-friendly' },
          { title: 'Cozy Atmosphere', value: 'cozy-atmosphere' },
          { title: 'Well Equipped', value: 'well-equipped' },
          { title: 'Responsive Host', value: 'responsive-host' },
          { title: 'Great for Groups', value: 'great-for-groups' },
          { title: 'Peaceful & Quiet', value: 'peaceful-quiet' },
          { title: 'Dog Friendly', value: 'dog-friendly' },
        ],
      },
      validation: (Rule) => Rule.max(7).custom((themes, context) => {
        const doc = context.document as any;
        const highlights = doc?.reviewHighlights;

        if (themes && themes.length > 0 && (!highlights || highlights.length === 0)) {
          return 'Add review highlights to support selected themes';
        }
        return true;
      }),
    }),
    defineField({
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
              rows: 2,
              description: 'Short excerpt (1-2 sentences max)',
              validation: (Rule) => Rule.required().max(250),
            },
            {
              name: 'source',
              title: 'Source',
              type: 'string',
              description: 'Platform and date (e.g., "Airbnb, December 2024")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'rating',
              title: 'Rating',
              type: 'number',
              description: 'Optional rating from this review',
            },
          ],
          preview: {
            select: {
              title: 'quote',
              subtitle: 'source',
            },
          },
        },
      ],
      description: 'Curated selection of best review quotes. Choose diverse themes. Import from review working files.',
      group: 'reviews',
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'totalReviewCount',
      title: 'Total Review Count',
      type: 'number',
      description: 'Sum of all reviews across platforms. Used for trust signals.',
      group: 'reviews',
      validation: (Rule) => Rule.min(0).integer().custom((total, context) => {
        const doc = context.document as any;
        const scores = doc?.reviewScores;

        if (!scores) return true;

        const sum = (scores.airbnbCount || 0) +
                    (scores.bookingCount || 0) +
                    (scores.googleCount || 0);

        if (total && total !== sum) {
          return `Total should be ${sum} (Airbnb: ${scores.airbnbCount || 0} + Booking: ${scores.bookingCount || 0} + Google: ${scores.googleCount || 0})`;
        }
        return true;
      }),
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
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      group: 'location',
      description: 'Geo coordinate for schema markup (e.g., 55.7857)',
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      group: 'location',
      description: 'Geo coordinate for schema markup (e.g., -6.3619)',
      validation: (Rule) => Rule.min(-180).max(180),
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
      name: 'licensingStatus',
      title: 'Licensing Status',
      type: 'string',
      description: 'Current STL licensing status. Affects availability status and CTA on frontend.',
      group: 'policies',
      options: {
        list: [
          { title: 'Approved', value: 'approved' },
          { title: 'Pending - Bookable', value: 'pending-bookable' },
          { title: 'Pending - Enquiries Only', value: 'pending-enquiries' },
          { title: 'Coming Soon', value: 'coming-soon' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'licenseNumber',
      title: 'License Number',
      type: 'string',
      description: 'STL license number (required for display on site). Format: AR#####F (e.g., AR01981F)',
      group: 'policies',
      placeholder: 'AR01981F',
      validation: (Rule) => Rule.required().regex(
        /^AR\d{5}F$/,
        { name: 'license-format', invert: false }
      ).error('License number must be in Argyll & Bute format: AR#####F (e.g., AR01981F)'),
    }),
    defineField({
      name: 'licenseNotes',
      title: 'License Notes',
      type: 'text',
      rows: 2,
      description: 'Optional internal notes about licensing status, application date, etc.',
      group: 'policies',
    }),
    defineField({
      name: 'availabilityStatus',
      title: 'Availability Status',
      type: 'string',
      description: 'Current booking availability. Determines CTA on frontend (Book Now vs Enquire vs Coming Soon).',
      group: 'policies',
      options: {
        list: [
          { title: 'Bookable', value: 'bookable' },
          { title: 'Enquiries Only', value: 'enquiries' },
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Unavailable', value: 'unavailable' },
        ],
      },
      validation: (Rule) => Rule.required(),
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

    // ========== GOOGLE BUSINESS REVIEWS ==========
    defineField({
      name: 'googleBusinessUrl',
      title: 'Google Business Profile URL',
      type: 'url',
      group: 'seo',
      description: 'Link to the property\'s Google Business Profile. Reviews will be fetched automatically from Google. If URL extraction fails, you can also add the place_id manually below.',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false,
      }),
    }),
    defineField({
      name: 'googlePlaceId',
      title: 'Google Place ID (Optional)',
      type: 'string',
      group: 'seo',
      description: 'Manually enter the Google Place ID if URL extraction fails. Find it in the URL after "!1s" or "place_id=". Example: ChIJ...',
    }),

    // ========== AI & SEARCH OPTIMIZATION ==========
    defineField({
      name: 'entityFraming',
      title: 'Entity Framing',
      type: 'object',
      group: 'ai-search',
      description: `Define what this property IS (and is NOT) for AI systems.

🔴 CRITICAL: Helps AI correctly categorize and cite this property.

✓ DO: Be factual, specific, boring

✗ DON'T: Use marketing language or vague adjectives`,
      
      options: {
        collapsible: true,
        collapsed: true
      },
      
      fields: [
        {
          name: 'whatItIs',
          type: 'string',
          title: 'What It Is',
          description: `One factual sentence: [Category] + [Location] + [Capacity]

✓ DO: "A 3-bedroom self-catering holiday home in Bruichladdich, Isle of Islay, sleeping 8 guests"
✗ DON'T: "A stunning coastal retreat"`,
          
          placeholder: 'A 3-bedroom self-catering holiday home in Bruichladdich, Isle of Islay, sleeping 8 guests',
          validation: (Rule) => Rule.max(150).warning('Keep to one factual sentence')
        },
        {
          name: 'whatItIsNot',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'What It Is NOT',
          description: `Prevent common misconceptions (max 3).

✓ DO: "Not a hotel", "Not suitable for events"

✗ DON'T: "Not for everyone"`,
          
          validation: (Rule) => Rule.max(3)
        },
        {
          name: 'primaryDifferentiator',
          type: 'string',
          title: 'Primary Differentiator',
          description: `ONE unique factual characteristic.

✓ DO: "Only Bruichladdich property with children's play equipment and 10-minute walk to distillery"
✗ DON'T: "Truly unique property with stunning location"`,
          
          placeholder: 'One unique factual characteristic that sets this property apart',
          validation: (Rule) => Rule.max(150)
        },
        {
          name: 'category',
          type: 'string',
          title: 'Primary Category',
          description: `Main property type for search categorization.

✓ DO: "Self-catering holiday home", "Holiday cottage"

✗ DON'T: "Vacation rental", "Accommodation" (too generic)`,
          
          options: {
            list: [
              { title: 'Self-catering holiday home', value: 'self-catering-home' },
              { title: 'Holiday cottage', value: 'holiday-cottage' },
              { title: 'Holiday lodge', value: 'holiday-lodge' },
              { title: 'Coastal cabin', value: 'coastal-cabin' }
            ]
          }
        }
      ]
    }),

    defineField({
      name: 'trustSignals',
      title: 'Trust Signals',
      type: 'object',
      group: 'ai-search',
      description: `Credibility information for AI systems.

🟡 OPTIONAL: Adds authority signals to search results.

✓ DO: Use quantifiable facts ("Since 2015", "500+ guests")

✗ DON'T: Use vague claims ("Highly experienced", "Very popular")`,
      
      options: {
        collapsible: true,
        collapsed: true
      },
      
      fields: [
        {
          name: 'ownership',
          type: 'string',
          title: 'Ownership Type',
          placeholder: 'Family-owned',
          description: 'How property is owned/managed'
        },
        {
          name: 'established',
          type: 'string',
          title: 'Established',
          placeholder: 'Welcoming guests since 2015',
          description: 'When started hosting guests'
        },
        {
          name: 'guestExperience',
          type: 'string',
          title: 'Guest Experience',
          placeholder: '500+ guests welcomed',
          description: 'Quantifiable hosting experience'
        },
        {
          name: 'localCredentials',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Credentials',
          description: 'Awards, memberships, certifications (e.g., VisitScotland approved). Keep to most relevant 3-5 credentials.',
          validation: (Rule) => Rule.max(5).warning('Keep to most relevant 3-5 credentials')
        }
      ]
    }),

    // ========== SEO ==========
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: `Page title for search results (optional - auto-generated if blank).

🔴 CRITICAL: Appears in search results and AI answers.

✓ DO: "Portbahn House - 8-Guest Holiday Home, Bruichladdich, Islay"

✗ DON'T: "Book Your Perfect Island Escape Today!"`,
      
      placeholder: 'Portbahn House - Holiday Home, Bruichladdich, Isle of Islay',
      validation: (Rule) => Rule.max(255).warning('Optimal: 50-60 chars for Google, up to 255 for AI search')
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: `Meta description for search results (optional - auto-generated if blank).

🔴 CRITICAL: Appears in search snippets and AI summaries.

✓ DO: "3-bedroom holiday home in Bruichladdich, sleeping 8. Private beach access, sea views, dog-friendly. 10-minute walk to distillery"

✗ DON'T: "Amazing property! Book now for unforgettable memories!"`,
      
      placeholder: '3-bedroom holiday home in Bruichladdich, sleeping 8. Private beach access, sea views, dog-friendly',
      validation: (Rule) => Rule.max(320).warning('Optimal: 120-160 chars for Google, up to 320 for AI search')
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
