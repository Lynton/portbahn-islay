# Sanity Property Schema - Required Fields Checklist

Use this checklist to verify all required fields are filled before publishing.

## ✅ Content Group

- [ ] **Property Name** (`name`) - Required
- [ ] **Slug** (`slug`) - Required (auto-generated from name, but must be set)
- [ ] **Hero Image** - Required
  - [ ] Hero Image uploaded
  - [ ] **Hero Image Alt Text** (`heroImage.alt`) - Required
- [ ] **Property Images** - If images are added:
  - [ ] **Alt Text for each image** (`images[].alt`) - Required for each image

## ✅ Property Details Group

- [ ] **Max Guests** (`sleeps`) - Required (number)
- [ ] **Number of Bedrooms** (`bedrooms`) - Required (number)
- [ ] **Number of Bathrooms** (`bathrooms`) - Required (number) ✅ You mentioned this is "2"
- [ ] Number of Beds (`beds`) - Optional

## ✅ Location & Directions Group

- [ ] **Location (Town/Village)** (`location`) - Required (string)

## ✅ Lodgify Integration Group

- [ ] **Lodgify Property ID** (`lodgifyPropertyId`) - Required (number)
- [ ] **Lodgify Room Type ID** (`lodgifyRoomId`) - Required (number)
- [ ] **ICS Feed URL** (`icsUrl`) - Required (valid URL)

---

## Quick Reference: All Required Fields

1. `name` - Property Name
2. `slug` - Slug
3. `heroImage.alt` - Hero Image Alt Text ✅
4. `images[].alt` - Property Images Alt Text (for each image) ✅
5. `sleeps` - Max Guests
6. `bedrooms` - Number of Bedrooms
7. `bathrooms` - Number of Bathrooms ✅ (You have "2")
8. `location` - Location (Town/Village)
9. `lodgifyPropertyId` - Lodgify Property ID
10. `lodgifyRoomId` - Lodgify Room Type ID
11. `icsUrl` - ICS Feed URL

---

## Common Issues

- **Slug not set**: Even if auto-generated, you may need to click "Generate" or manually set it
- **Image alt text**: Make sure ALL images (hero + gallery) have alt text filled in
- **Lodgify fields**: Check the "Lodgify Integration" tab - all three fields must be filled
- **Location field**: Check the "Location & Directions" tab - the "Location (Town/Village)" field is required

---

## How to Check in Sanity Studio

1. Open your property document
2. Look for red error indicators (⚠️) next to field labels
3. Check each tab/group:
   - **Content** tab
   - **Property Details** tab
   - **Location & Directions** tab
   - **Lodgify Integration** tab
4. The publish button will show validation errors if fields are missing

