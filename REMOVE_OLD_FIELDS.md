# Removing Old Fields from Sanity Documents

## The Problem

Your Sanity documents contain old fields that are no longer in the schema:
- `amenities`
- `excerpt`
- `focusKeyword`
- `kitchenAmenities`
- `mainImage`

These old fields can prevent documents from publishing and cause validation errors.

## Solution: Remove Old Fields

### Option 1: Manual Removal (Easiest)

1. Open Sanity Studio: `http://localhost:3001/studio` (or your dev URL)
2. Open the **Portbahn House** document
3. Scroll down to see the "Unknown fields" section
4. Delete each old field by clicking the delete/remove button
5. Save the document
6. Try publishing again

### Option 2: Automated Script (Requires API Token)

1. Get a Sanity API token:
   - Go to https://www.sanity.io/manage
   - Select your project
   - Go to API → Tokens
   - Create a new token with **Editor** permissions

2. Add token to `.env.local`:
   ```bash
   SANITY_API_TOKEN=your-token-here
   ```

3. Run the migration script:
   ```bash
   npx tsx scripts/remove-old-fields.ts
   ```

## Field Mappings

These old fields have been replaced:

| Old Field | New Field(s) |
|-----------|-------------|
| `amenities` | `kitchenDining`, `livingAreas`, `heatingCooling`, `entertainment`, `laundryFacilities`, `safetyFeatures`, `outdoorFeatures` |
| `excerpt` | `overviewIntro` or `description` |
| `focusKeyword` | `seoTitle` and `seoDescription` |
| `kitchenAmenities` | `kitchenDining` and `kitchenDiningNotes` |
| `mainImage` | `heroImage` |

## After Removal

Once the old fields are removed:
1. Verify all required fields are filled (use `npx tsx scripts/check-sanity-fields.ts`)
2. Ensure bathrooms field is set to `2`
3. Ensure all image alt texts are filled
4. Try publishing again

