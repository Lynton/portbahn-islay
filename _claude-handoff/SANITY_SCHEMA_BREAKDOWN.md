# Sanity Schema Field Breakdown

Complete breakdown of all content types and their fields in the Portbahn Islay Sanity CMS.

---

## 📋 Table of Contents

1. [Collections](#collections)
   - [Property](#property)
   - [Beach](#beach)
   - [Distillery](#distillery)
   - [Walk](#walk)
   - [Village](#village)
   - [FAQ Item](#faq-item)

2. [Singletons](#singletons)
   - [Homepage](#homepage)
   - [About Page](#about-page)
   - [Contact Page](#contact-page)
   - [FAQ Page](#faq-page)
   - [Getting Here Page](#getting-here-page)
   - [Hub Pages](#hub-pages)
   - [Legal Pages](#legal-pages)

3. [Settings](#settings)
   - [Site Settings](#site-settings)
   - [Navigation Settings](#navigation-settings)

4. [Base Fields](#base-fields)
   - [Base Guide Fields](#base-guide-fields)
   - [Base Singleton Fields](#base-singleton-fields)

---

## Collections

### Property

**Type:** `document`  
**Groups:** Content (default), Property Details, Location & Directions, Policies & Rules, Lodgify Integration, SEO

#### Content Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Property Name |
| `slug` | slug | ✅ | URL slug (auto-generated from name, max 96 chars) |
| `propertyType` | string | ❌ | Options: House, Cottage, Apartment |
| `heroImage` | image | ❌ | Hero image with alt text (required) |
| `images` | array[image] | ❌ | Property gallery images with alt text and optional captions |
| `overviewIntro` | string | ❌ | Intro sentence (e.g., "Portbahn sleeps 8 guests...") |
| `description` | text | ❌ | Main property description (2-3 paragraphs, 6 rows) |
| `idealFor` | array[string] | ✅ | List of ideal guest types (max 5 items) |
| `commonQuestions` | array[object] | ❌ | Q&A pairs (4-6 recommended) |
| └─ `question` | string | ✅ | Natural language question |
| └─ `answer` | text | ✅ | Brief answer (max 400 chars) |

#### Property Details Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sleeps` | number | ✅ | Max Guests |
| `bedrooms` | number | ✅ | Number of Bedrooms |
| `beds` | number | ❌ | Number of Beds |
| `bathrooms` | number | ✅ | Number of Bathrooms |
| `sleepingIntro` | string | ❌ | Sleeping arrangements intro sentence |
| `bedroomDetails` | array[string] | ❌ | List of bedroom descriptions |
| `bathroomDetails` | array[string] | ❌ | List of bathroom descriptions |
| `facilitiesIntro` | string | ❌ | Facilities intro sentence |
| `kitchenDining` | array[string] | ❌ | Checkboxes: Dishwasher, Microwave, Oven, Refrigerator, Toaster, Coffee machine, Vacuum cleaner, BBQ grill, Children's high chair, Kitchen stove/range, Dining table for 6/8 |
| `kitchenDiningNotes` | array[string] | ❌ | Additional kitchen/dining notes |
| `livingAreas` | array[string] | ❌ | Checkboxes: Open plan layout, Separate sitting room, Separate dining room, Conservatory, Sea views, Wifi/broadband, Books and games, Double glazing |
| `livingAreasNotes` | array[string] | ❌ | Additional living area notes |
| `heatingCooling` | array[string] | ❌ | Checkboxes: Wood burning stove, Underfloor heating, Central heating, Oil-fired central heating, Fireplace, Double glazing, Well-insulated |
| `heatingCoolingNotes` | array[string] | ❌ | Additional heating/cooling notes |
| `entertainment` | array[string] | ❌ | Checkboxes: TV with cable/satellite, TV with antenna, DVD player, Selection of DVDs, Books and games, Wifi/broadband |
| `entertainmentNotes` | array[string] | ❌ | Additional entertainment notes |
| `laundryFacilities` | array[string] | ❌ | Checkboxes: Washing machine, Tumble dryer, Iron & ironing board, Dedicated laundry room, Airing pulley |
| `safetyFeatures` | array[string] | ❌ | Checkboxes: Carbon monoxide detector, Smoke detector, Fire extinguisher, Private access road, First aid kit |
| `outdoorIntro` | string | ❌ | Outdoor spaces intro sentence |
| `outdoorFeatures` | array[string] | ❌ | Checkboxes: Private garden, Sea views, BBQ area, Children's play equipment, Trampoline, Swings, Woodland/nature area, Ponds, Bird reserves, Greenhouse, Garage, Walled garden, Elevated position |
| `outdoorFeaturesNotes` | array[string] | ❌ | Additional outdoor feature notes |
| `parkingInfo` | string | ❌ | Parking information |
| `trustSignals` | object | ❌ | Trust & Authority signals (collapsible) |
| └─ `ownership` | string | ❌ | Ownership type (e.g., Family-owned, Locally-managed) |
| └─ `established` | string | ❌ | When property started welcoming guests |
| └─ `guestExperience` | string | ❌ | Quantifiable guest/hosting experience |
| └─ `localCredentials` | array[string] | ❌ | Awards, memberships, certifications |
| `includedIntro` | string | ❌ | What's included intro sentence |
| `included` | array[string] | ❌ | Included items list |
| `notIncluded` | array[string] | ❌ | Not included items list |

#### Location & Directions Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `locationIntro` | string | ❌ | Location & Nearby intro sentence |
| `location` | string | ✅ | Location (Town/Village) |
| `nearbyAttractions` | array[string] | ❌ | Nearby attractions & distances |
| `whatToDoNearby` | array[string] | ❌ | What to do nearby |
| `gettingHereIntro` | string | ❌ | Getting Here intro sentence |
| `postcode` | string | ❌ | Postcode |
| `latitude` | number | ❌ | Geo coordinate (min -90, max 90) |
| `longitude` | number | ❌ | Geo coordinate (min -180, max 180) |
| `directions` | text | ❌ | Directions (4 rows) |
| `ferryInfo` | text | ❌ | Ferry information (3 rows) |
| `airportDistance` | string | ❌ | Airport distance |
| `portDistance` | string | ❌ | Port distance |

#### Policies & Rules Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `petFriendly` | boolean | ❌ | Pet Friendly (default: true) |
| `petPolicyIntro` | string | ❌ | Pet Policy intro sentence |
| `petPolicyDetails` | array[string] | ❌ | Pet policy details |
| `policiesIntro` | string | ❌ | House Rules & Policies intro sentence |
| `checkInTime` | string | ❌ | Check-in Time (default: "04:00 PM") |
| `checkOutTime` | string | ❌ | Check-out Time (default: "10:00 AM") |
| `minimumStay` | number | ❌ | Minimum Stay in nights (default: 2) |
| `cancellationPolicy` | text | ❌ | Cancellation Policy (3 rows) |
| `paymentTerms` | text | ❌ | Payment Terms (2 rows) |
| `securityDeposit` | string | ❌ | Security Deposit |
| `licensingInfo` | string | ❌ | Short Term Let License Info |
| `importantInfo` | array[text] | ❌ | Important information (property-specific notes) |
| `dailyRate` | number | ❌ | Daily Rate (GBP) |
| `weeklyRate` | number | ❌ | Weekly Rate (GBP) |

#### Lodgify Integration Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lodgifyPropertyId` | number | ✅ | Lodgify Property ID |
| `lodgifyRoomId` | number | ✅ | Lodgify Room Type ID |
| `icsUrl` | url | ✅ | ICS Feed URL |

#### SEO Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `googleBusinessUrl` | url | ❌ | Google Business Profile URL |
| `googlePlaceId` | string | ❌ | Google Place ID (optional) |
| `seoTitle` | string | ❌ | SEO Title (max 60 chars) |
| `seoDescription` | text | ❌ | SEO Description (max 160 chars, 3 rows) |

**Total Fields:** 68 fields across 6 groups

---

### Beach

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Guide Fields

#### Unique Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `location` | string | ❌ | Village or area name (e.g., "Machir Bay", "Port Charlotte") |
| `coordinates` | object | ❌ | Geographic coordinates |
| └─ `latitude` | number | ❌ | Latitude (min -90, max 90) |
| └─ `longitude` | number | ❌ | Longitude (min -180, max 180) |

**Plus all Base Guide Fields** (see below)

---

### Distillery

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Guide Fields

#### Unique Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `location` | string | ❌ | Village or area name (e.g., "Bruichladdich", "Port Ellen") |
| `coordinates` | object | ❌ | Geographic coordinates |
| └─ `latitude` | number | ❌ | Latitude (min -90, max 90) |
| └─ `longitude` | number | ❌ | Longitude (min -180, max 180) |
| `toursAvailable` | boolean | ❌ | Tours Available (default: false) |
| `tourBookingUrl` | url | ❌ | Link to book distillery tours |

**Plus all Base Guide Fields** (see below)

---

### Walk

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Guide Fields

#### Unique Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `distance` | string | ❌ | Distance (e.g., "3 miles", "5km") |
| `duration` | string | ❌ | Duration (e.g., "2 hours", "Half day") |
| `difficulty` | string | ❌ | Options: Easy, Moderate, Challenging |
| `startLocation` | string | ❌ | Where the walk starts (village, car park, etc.) |
| `coordinates` | object | ❌ | Geographic coordinates |
| └─ `latitude` | number | ❌ | Latitude (min -90, max 90) |
| └─ `longitude` | number | ❌ | Longitude (min -180, max 180) |

**Plus all Base Guide Fields** (see below)

---

### Village

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Guide Fields

#### Unique Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `coordinates` | object | ❌ | Geographic coordinates |
| └─ `latitude` | number | ❌ | Latitude (min -90, max 90) |
| └─ `longitude` | number | ❌ | Longitude (min -180, max 180) |
| `population` | number | ❌ | Approximate population (optional) |
| `keyFeatures` | array[string] | ❌ | Notable features (e.g., "Ferry terminal", "Distillery", "Beach") |

**Plus all Base Guide Fields** (see below)

---

### FAQ Item

**Type:** `document`  
**Groups:** Content (default), SEO

#### Content Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | ✅ | The FAQ question (used in accordion) |
| `slug` | slug | ✅ | URL slug (auto-generated from question, max 96 chars) |
| `shortAnswer` | array[block] | ❌ | Brief answer for accordion (max 3 sentences) |
| `fullAnswer` | array[block\|image] | ❌ | Detailed answer for full article page |
| `category` | string | ✅ | Options: Before You Arrive, At the Property, Local Essentials, Troubleshooting |
| `relatedProperty` | reference | ❌ | Optional: Link to specific property if FAQ is property-specific |
| `relatedGuides` | array[reference] | ❌ | Links to related guide pages (beach, distillery, walk, village) |

#### SEO Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `seoTitle` | string | ❌ | SEO Title (max 60 chars) |
| `seoDescription` | text | ❌ | SEO Description (max 160 chars, 3 rows) |

**Total Fields:** 8 fields across 2 groups

---

## Singletons

### Homepage

**Type:** `document`  
**Groups:** Content (default), SEO

#### Content Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heroImage` | image | ✅ | Hero Image with alt text |
| `title` | string | ✅ | Title (H1 Heading) |
| `tagline` | string | ✅ | Tagline (Subtitle) |
| `introText` | array[block] | ❌ | 2-3 intro paragraphs |
| `whyStayTitle` | string | ❌ | Why Stay Section - Title |
| `whyStayText` | array[block] | ❌ | Why Stay Section - Text |
| `gettingHereTitle` | string | ❌ | Getting Here Section - Title |
| `gettingHereText` | array[block] | ❌ | Getting Here Section - Text |

#### SEO Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `seoTitle` | string | ❌ | SEO Title (max 70 chars) |
| `seoDescription` | text | ❌ | SEO Description (max 200 chars, 3 rows) |

**Total Fields:** 10 fields across 2 groups

---

### About Page

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Singleton Fields

**Fields:** All Base Singleton Fields (see below)

---

### Contact Page

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Singleton Fields

#### Additional Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ❌ | Email (validated) |
| `phone` | string | ❌ | Phone |
| `address` | text | ❌ | Address (3 rows) |

**Plus all Base Singleton Fields** (see below)

---

### FAQ Page

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Singleton Fields

**Fields:** All Base Singleton Fields (see below)

---

### Getting Here Page

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Singleton Fields

**Fields:** All Base Singleton Fields (see below)

---

### Hub Pages

All hub pages inherit Base Singleton Fields:

- **Beaches Hub Page** (`beachesHubPage`)
- **Distilleries Hub Page** (`distilleriesHubPage`)
- **Walks Hub Page** (`walksHubPage`)
- **Villages Hub Page** (`villagesHubPage`)
- **Islay Guides Index Page** (`islayGuidesIndexPage`)

**Fields:** All Base Singleton Fields (see below)

---

### Legal Pages

- **Privacy Page** (`privacyPage`)
- **Terms Page** (`termsPage`)

**Type:** `document`  
**Groups:** Content (default), SEO  
**Inherits:** Base Singleton Fields

**Fields:** All Base Singleton Fields (see below)

---

## Settings

### Site Settings

**Type:** `document`  
**Groups:** General (default), Social Media, SEO

#### General Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteName` | string | ✅ | Site Name (default: "Portbahn Islay") |
| `siteUrl` | url | ✅ | Full URL of the website |
| `logo` | image | ❌ | Logo (hotspot enabled) |

#### Social Media Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `defaultOgImage` | image | ❌ | Default image for social media sharing |
| `facebookUrl` | url | ❌ | Facebook URL |
| `instagramUrl` | url | ❌ | Instagram URL |
| `twitterUrl` | url | ❌ | Twitter/X URL |

#### SEO Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `defaultSeoTitle` | string | ❌ | Default title template for pages without custom SEO title |
| `defaultSeoDescription` | text | ❌ | Default description for pages without custom SEO description (3 rows) |

**Total Fields:** 9 fields across 3 groups

---

### Navigation Settings

**Type:** `document`  
**No Groups**

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mainNavigation` | array[object] | ❌ | Main site navigation menu items |
| └─ `label` | string | ✅ | Menu item label |
| └─ `url` | string | ✅ | Internal path or external URL |
| └─ `external` | boolean | ❌ | External Link (default: false) |
| └─ `children` | array[object] | ❌ | Sub-menu items |
| │  └─ `label` | string | ✅ | Sub-menu label |
| │  └─ `url` | string | ✅ | Sub-menu URL |
| │  └─ `external` | boolean | ❌ | External Link (default: false) |
| `footerLinks` | array[object] | ❌ | Links displayed in the footer |
| └─ `label` | string | ✅ | Link label |
| └─ `url` | string | ✅ | Link URL |
| └─ `external` | boolean | ❌ | External Link (default: false) |

**Total Fields:** 2 main fields (with nested objects)

---

## Base Fields

### Base Guide Fields

**Used by:** Beach, Distillery, Walk, Village

#### Content Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Title |
| `slug` | slug | ✅ | URL slug (auto-generated from title, max 96 chars) |
| `category` | string | ✅ | Options: Beaches, Walks, Distilleries, Villages, Food & Drink, Ferries, Travel, Local Essentials |
| `heroImage` | image | ❌ | Hero Image with alt text (required) |
| `summary` | text | ❌ | Brief summary (25-40 words, max 200 chars, 3 rows) |
| `quickFacts` | array[object] | ❌ | Key facts displayed prominently |
| └─ `label` | string | ✅ | Fact label (e.g., "Distance", "Duration") |
| └─ `value` | string | ✅ | Fact value (e.g., "3 miles", "2 hours") |
| `body` | array[block\|image] | ❌ | Main content with structured sections (H2/H3 headings, paragraphs, lists) |
| `geoMarkers` | array[string] | ❌ | Geographic entities mentioned (distillery names, beaches, villages) |
| `relatedGuides` | array[reference] | ❌ | Links to related guide pages (beach, distillery, walk, village) |
| `relatedProperties` | array[reference] | ❌ | Properties to feature in cross-link cards |

#### SEO Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `seoTitle` | string | ❌ | SEO Title (max 60 chars) |
| `seoDescription` | text | ❌ | SEO Description (max 160 chars, 3 rows) |
| `ogImage` | image | ❌ | Open Graph Image (optional, defaults to hero image) |

**Total Base Fields:** 11 fields across 2 groups

---

### Base Singleton Fields

**Used by:** About Page, Contact Page, FAQ Page, Getting Here Page, Hub Pages, Legal Pages

#### Content Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Title (H1 Heading) |
| `heroImage` | image | ❌ | Hero Image with alt text (required) |
| `content` | array[block\|image] | ❌ | Main page content |

#### SEO Group

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `seoTitle` | string | ❌ | SEO Title (max 70 chars) |
| `seoDescription` | text | ❌ | SEO Description (max 200 chars, 3 rows) |

**Total Base Fields:** 5 fields across 2 groups

---

## Summary Statistics

- **Total Content Types:** 20
  - **Collections:** 6 (Property, Beach, Distillery, Walk, Village, FAQ Item)
  - **Singletons:** 12 (Homepage, About, Contact, FAQ, Getting Here, 5 Hub Pages, 2 Legal Pages)
  - **Settings:** 2 (Site Settings, Navigation Settings)

- **Most Complex Schema:** Property (68 fields across 6 groups)
- **Simplest Schemas:** Hub Pages and Legal Pages (5 fields via Base Singleton Fields)

- **Field Types Used:**
  - String, Text, Number, Boolean, Slug, URL
  - Image (with alt text, captions)
  - Array (of strings, objects, blocks, references)
  - Object (nested fields)
  - Reference (to other documents)
  - Block (rich text content)

---

*Last Updated: 2025-12-19*


