#!/usr/bin/env tsx
/**
 * Export all properties from Sanity to individual JSON files
 * Usage: npx tsx scripts/export-properties-json.ts
 */

import { client } from '../sanity/lib/client';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'exports', 'properties');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function exportProperties() {
  console.log('📦 Fetching all properties from Sanity...\n');

  try {
    // Fetch ALL properties with ALL fields
    const query = `*[_type == "property"] | order(name asc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      propertyType,
      heroImage,
      images[],
      // Content
      overviewIntro,
      overview,
      description,
      idealFor[],
      // Entity Framing
      entityFraming {
        whatItIs,
        whatItIsNot[],
        primaryDifferentiator,
        category
      },
      // Trust Signals
      trustSignals {
        ownership,
        established,
        guestExperience,
        localCredentials[]
      },
      // Personality & Guest Experience
      propertyNickname,
      guestSuperlatives[],
      magicMoments[] {
        moment,
        frequency
      },
      perfectFor[] {
        guestType,
        why,
        reviewEvidence
      },
      honestFriction[] {
        issue,
        context
      },
      ownerContext,
      // Reviews & Social Proof
      reviewScores {
        airbnbScore,
        airbnbCount,
        airbnbBadges[],
        bookingScore,
        bookingCount,
        bookingCategory,
        googleScore,
        googleCount
      },
      reviewThemes[],
      reviewHighlights[] {
        quote,
        source,
        rating
      },
      totalReviewCount,
      // Common Questions
      commonQuestions[] {
        question,
        answer
      },
      // Details
      sleeps,
      bedrooms,
      beds,
      bathrooms,
      sleepingIntro,
      sleepingArrangements,
      bedroomDetails[],
      bathroomDetails[],
      facilitiesIntro,
      facilities[],
      kitchenDining[],
      kitchenDiningNotes[],
      livingAreas[],
      livingAreasNotes[],
      heatingCooling[],
      heatingCoolingNotes[],
      entertainment[],
      entertainmentNotes[],
      laundryFacilities[],
      safetyFeatures[],
      outdoorIntro,
      outdoorFeatures[],
      outdoorFeaturesNotes[],
      outdoorSpaces,
      parkingInfo,
      includedIntro,
      included[],
      notIncluded[],
      includedInStay[],
      // Location
      location,
      locationDetails {
        address,
        coordinates,
        nearestTown
      },
      locationIntro,
      locationDescription,
      localArea,
      nearbyAttractions[],
      whatToDoNearby[],
      gettingHereIntro,
      gettingHere,
      postcode,
      latitude,
      longitude,
      directions,
      ferryInfo,
      airportDistance,
      portDistance,
      // Policies
      petFriendly,
      petPolicyIntro,
      petPolicyDetails[],
      petPolicy {
        allowed,
        fee,
        conditions
      },
      policiesIntro,
      policies,
      checkInTime,
      checkOutTime,
      minimumStay,
      cancellationPolicy,
      paymentTerms,
      securityDeposit,
      licensingStatus,
      licenseNumber,
      licenseNotes,
      availabilityStatus,
      importantInfo[],
      // Pricing
      dailyRate,
      weeklyRate,
      // Booking Integration
      lodgifyPropertyId,
      lodgifyRoomId,
      lodgifyRoomTypeId,
      icsUrl,
      // SEO
      seoTitle,
      seoDescription,
      metaTitle,
      metaDescription,
      focusKeyword,
      ogImage,
      googleBusinessUrl,
      googlePlaceId
    }`;

    const properties = await client.fetch(query);

    if (!properties || properties.length === 0) {
      console.log('❌ No properties found in Sanity.');
      return;
    }

    console.log(`✅ Found ${properties.length} properties\n`);

    // Export each property to a separate JSON file
    let exportedCount = 0;
    let errorCount = 0;

    for (const property of properties) {
      try {
        // Create filename from slug or name
        const slug = property.slug?.current || property.slug || property.name?.toLowerCase().replace(/\s+/g, '-');
        const filename = `${slug}.json`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Write JSON file with pretty formatting
        fs.writeFileSync(
          filepath,
          JSON.stringify(property, null, 2),
          'utf-8'
        );

        console.log(`  ✓ ${property.name} → ${filename}`);
        exportedCount++;
      } catch (error) {
        console.error(`  ✗ Error exporting ${property.name}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✅ Export complete!`);
    console.log(`   Exported: ${exportedCount} properties`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount}`);
    }
    console.log(`   Output directory: ${OUTPUT_DIR}\n`);

    // Also create a summary file with all properties
    const summaryPath = path.join(OUTPUT_DIR, '_summary.json');
    const summary = {
      exportedAt: new Date().toISOString(),
      totalProperties: properties.length,
      properties: properties.map((p: any) => ({
        _id: p._id,
        name: p.name,
        slug: p.slug?.current || p.slug,
        filename: `${p.slug?.current || p.slug || p.name?.toLowerCase().replace(/\s+/g, '-')}.json`,
      })),
    };

    fs.writeFileSync(
      summaryPath,
      JSON.stringify(summary, null, 2),
      'utf-8'
    );

    console.log(`📋 Summary file created: _summary.json\n`);

  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    process.exit(1);
  }
}

// Run the export
exportProperties();
