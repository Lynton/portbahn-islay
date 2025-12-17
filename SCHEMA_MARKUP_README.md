# Schema Markup System

This system auto-generates JSON-LD schema.org markup from Sanity data for SEO and AI discovery.

## Overview

The schema markup system provides structured data for:
- **SEO**: Better search engine understanding and rich snippets
- **AI Discovery**: Enhanced AI citation and extractability
- **GEO/AEO**: Location-based search optimization

## Components

### `lib/schema-markup.tsx`
Core library with schema generation functions:
- `generateSchemaMarkup()` - Main function to generate schemas
- Individual schema generators for each type
- Amenity mapping from Sanity fields to schema.org

### `components/SchemaMarkup.tsx`
React component wrapper for easy integration.

## Schema Types

### Homepage
- **Organization**: Portbahn Islay business entity
- **LocalBusiness**: Vacation rental business with geo coordinates
- **Place**: Isle of Islay location entity

### Property Pages
- **Accommodation**: Vacation rental with occupancy, amenities, geo coordinates
- **Place**: Specific property location with geo coordinates
- **Product/Offer**: Booking/pricing information

### Future Pages (Ready to Use)
- **Article**: For guide pages
- **FAQPage**: For FAQ pages
- **BreadcrumbList**: Navigation breadcrumbs

## Usage

### Property Pages
```tsx
import SchemaMarkup from '@/components/SchemaMarkup';

<SchemaMarkup
  type={['Accommodation', 'Place', 'Product']}
  data={property}
  breadcrumbs={breadcrumbs}
/>
```

### Homepage
```tsx
<SchemaMarkup
  type={['Organization', 'LocalBusiness', 'Place']}
  data={homepage}
/>
```

### Site-wide (Layout)
```tsx
<SchemaMarkup type="Organization" data={null} />
```

## Required Sanity Fields

### Property Schema
- `latitude` / `longitude` - Geo coordinates (added to schema)
- `name`, `description`, `location`, `postcode`
- `sleeps`, `bedrooms`, `bathrooms`
- `dailyRate`, `weeklyRate` - For Product/Offer schema
- `petFriendly` - For Accommodation schema
- Amenity fields: `kitchenDining`, `livingAreas`, `heatingCooling`, etc.

### Homepage Schema
- `heroImage`, `title`, `tagline`
- `latitude` / `longitude` (optional, for LocalBusiness geo)

## Amenity Mapping

The system automatically maps Sanity amenity fields to schema.org `amenityFeature`:

- `wifi` → `InternetAccess`
- `wood_stove` / `fireplace` → `Fireplace`
- `dishwasher` → `Dishwasher`
- `washing_machine` → `WashingMachine`
- `tv_cable` / `tv_antenna` → `Television`
- `bbq_grill` → `BarbecueGrills`
- `sea_views` → `OceanView`
- And more...

## GEO Coordinates

All location-based schemas include geo coordinates when available:
- Property pages: Uses `property.latitude` / `property.longitude`
- Isle of Islay Place: Default coordinates (55.7857, -6.3619)
- LocalBusiness: Uses homepage coordinates if available

## Address Formatting

All addresses follow UK/Scottish format:
- `addressLocality`: Property location or "Isle of Islay"
- `addressRegion`: "Scotland"
- `addressCountry`: "GB"
- `postalCode`: Property postcode if available

## Environment Variables

Set `NEXT_PUBLIC_SITE_URL` in `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://portbahnislay.com
```

## Future Enhancements

Ready to add:
- **AggregateRating**: When reviews are added
- **sameAs**: Social media links
- **Article**: For guide/blog pages
- **FAQPage**: For FAQ pages
- **BreadcrumbList**: Auto-generated from URL structure

## Testing

Use Google's Rich Results Test:
https://search.google.com/test/rich-results

Or Schema.org Validator:
https://validator.schema.org/

## Notes

- Schema markup is rendered in `<head>` via Next.js metadata
- Multiple schemas can be combined on a single page
- All schemas are auto-generated from Sanity data (no hardcoding)
- Missing fields are gracefully handled (undefined fields omitted)

