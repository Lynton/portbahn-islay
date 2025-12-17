# Geo Data Status for Schema Markup

## ✅ Schema Setup Complete

### Property Schema
- ✅ `latitude` field added (number, -90 to 90)
- ✅ `longitude` field added (number, -180 to 180)
- ✅ Fields are in the "Location & Directions" group
- ✅ Query includes latitude/longitude in property fetch

### Schema Markup Implementation
- ✅ **Accommodation schema**: Includes geo coordinates when `property.latitude` and `property.longitude` are set
- ✅ **Place schema (property)**: Includes geo coordinates when available
- ✅ **Place schema (Isle of Islay)**: Default coordinates set (55.7857, -6.3619)
- ✅ **LocalBusiness schema**: Can include geo if homepage has coordinates

## Current Status

### ✅ What's Working
1. **Isle of Islay Place Schema**: Always includes geo coordinates
   - Latitude: 55.7857
   - Longitude: -6.3619
   - Used on homepage for Place schema

2. **Property Schemas**: Will include geo when coordinates are added
   - Accommodation schema checks: `property.latitude && property.longitude`
   - Place schema checks: `property.latitude && property.longitude`
   - Gracefully omits geo if not set (no errors)

### ⚠️ What Needs to Be Done

**Properties need geo coordinates added in Sanity Studio:**

1. Open each property in Sanity Studio
2. Go to "Location & Directions" tab
3. Fill in:
   - **Latitude** (e.g., 55.7857 for Bruichladdich area)
   - **Longitude** (e.g., -6.3619 for Bruichladdich area)

**Example coordinates for Islay properties:**
- **Bruichladdich area**: ~55.7857, -6.3619
- **Port Charlotte area**: ~55.7400, -6.3800
- **Bowmore area**: ~55.7567, -6.2900

You can find exact coordinates using:
- Google Maps (right-click → coordinates)
- What3Words
- OS Maps

## How It Works

### When Geo Coordinates Are Set
```json
{
  "@type": "Accommodation",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 55.7857,
    "longitude": -6.3619
  }
}
```

### When Geo Coordinates Are Missing
```json
{
  "@type": "Accommodation",
  // geo field is omitted (not included)
}
```

## Verification

To verify geo data is working:

1. **Add coordinates to a property in Sanity**
2. **View page source** on the property page
3. **Search for** `"@type": "GeoCoordinates"` in the JSON-LD
4. **Test with Google Rich Results**: https://search.google.com/test/rich-results

## Next Steps

1. ✅ Schema fields are ready
2. ✅ Schema markup code is ready
3. ⏳ **Add coordinates to properties in Sanity Studio**
4. ⏳ Test with Google Rich Results Test
5. ⏳ Verify geo data appears in search results

## Notes

- Geo coordinates are **optional** - schema will work without them
- Isle of Islay Place schema **always** has coordinates (default)
- Property-specific geo is **only included when set** in Sanity
- Coordinates use decimal degrees format (not degrees/minutes/seconds)

