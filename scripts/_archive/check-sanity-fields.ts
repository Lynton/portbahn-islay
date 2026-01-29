import { createClient } from 'next-sanity';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local manually
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('⚠️  Could not load .env.local, using existing environment variables');
  }
}

loadEnvFile();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
  console.error('💡 Make sure .env.local exists with NEXT_PUBLIC_SANITY_PROJECT_ID');
  process.exit(1);
}

// Create a Sanity client for server-side queries
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Optional, but needed for drafts
});

// Required fields based on the schema
const REQUIRED_FIELDS = [
  { name: 'name', title: 'Property Name', group: 'content' },
  { name: 'slug', title: 'Slug', group: 'content' },
  { name: 'sleeps', title: 'Max Guests', group: 'details' },
  { name: 'bedrooms', title: 'Number of Bedrooms', group: 'details' },
  { name: 'bathrooms', title: 'Number of Bathrooms', group: 'details' },
  { name: 'location', title: 'Location (Town/Village)', group: 'location' },
  { name: 'lodgifyPropertyId', title: 'Lodgify Property ID', group: 'lodgify' },
  { name: 'lodgifyRoomId', title: 'Lodgify Room Type ID', group: 'lodgify' },
  { name: 'icsUrl', title: 'ICS Feed URL', group: 'lodgify' },
];

// Fields that need nested checks
const NESTED_REQUIRED_FIELDS = [
  { path: 'heroImage.alt', title: 'Hero Image Alt Text', group: 'content' },
];

async function checkPropertyFields() {
  try {
    // Query all property documents (including drafts)
    const query = `*[_type == "property"] | order(_updatedAt desc) {
      _id,
      _rev,
      name,
      slug,
      sleeps,
      bedrooms,
      bathrooms,
      location,
      lodgifyPropertyId,
      lodgifyRoomId,
      icsUrl,
      heroImage {
        asset,
        alt
      },
      images[] {
        asset,
        alt
      }
    }`;

    // Also check for drafts
    const draftsQuery = `*[_type == "property" && !defined(_id)] | order(_updatedAt desc) {
      _id,
      _rev,
      name,
      slug,
      sleeps,
      bedrooms,
      bathrooms,
      location,
      lodgifyPropertyId,
      lodgifyRoomId,
      icsUrl,
      heroImage {
        asset,
        alt
      },
      images[] {
        asset,
        alt
      }
    }`;

    const properties = await client.fetch(query);

    if (properties.length === 0) {
      console.log('❌ No properties found in Sanity database.');
      return;
    }

    console.log(`\n📋 Found ${properties.length} property document(s):\n`);

    properties.forEach((property: any, index: number) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Property ${index + 1}: ${property.name || '(No name)'}`);
      console.log(`ID: ${property._id}`);
      console.log(`${'='.repeat(60)}\n`);

      const missingFields: string[] = [];
      const emptyFields: string[] = [];

      // Check basic required fields
      REQUIRED_FIELDS.forEach((field) => {
        const value = property[field.name];
        if (value === undefined || value === null) {
          missingFields.push(`${field.title} (${field.name})`);
        } else if (field.name === 'slug' && (!value.current || value.current === '')) {
          emptyFields.push(`${field.title} (${field.name}.current)`);
        } else if (typeof value === 'string' && value.trim() === '') {
          emptyFields.push(`${field.title} (${field.name})`);
        } else if (typeof value === 'number' && (isNaN(value) || value === 0)) {
          emptyFields.push(`${field.title} (${field.name}) - value is 0 or invalid`);
        }
      });

      // Check hero image alt text
      if (property.heroImage) {
        if (!property.heroImage.alt || property.heroImage.alt.trim() === '') {
          missingFields.push('Hero Image Alt Text (heroImage.alt)');
        }
      } else {
        // Hero image itself is optional, but if missing, we note it
        console.log('⚠️  Hero Image: Not set (optional, but recommended)');
      }

      // Check property images alt text
      if (property.images && property.images.length > 0) {
        property.images.forEach((img: any, imgIndex: number) => {
          if (!img.alt || img.alt.trim() === '') {
            missingFields.push(`Property Image #${imgIndex + 1} Alt Text (images[${imgIndex}].alt)`);
          }
        });
      }

      // Display results
      if (missingFields.length === 0 && emptyFields.length === 0) {
        console.log('✅ All required fields are present and have values!\n');
        console.log('Field values:');
        REQUIRED_FIELDS.forEach((field) => {
          const value = property[field.name];
          if (field.name === 'slug') {
            console.log(`  • ${field.title}: ${value?.current || '(empty)'}`);
          } else {
            console.log(`  • ${field.title}: ${value}`);
          }
        });
        if (property.heroImage) {
          console.log(`  • Hero Image Alt: ${property.heroImage.alt || '(empty)'}`);
        }
        if (property.images && property.images.length > 0) {
          console.log(`  • Property Images: ${property.images.length} image(s)`);
          property.images.forEach((img: any, idx: number) => {
            console.log(`    - Image ${idx + 1} Alt: ${img.alt || '(empty)'}`);
          });
        }
      } else {
        console.log('❌ Missing or empty required fields:\n');
        if (missingFields.length > 0) {
          console.log('Missing fields:');
          missingFields.forEach((field) => {
            console.log(`  ❌ ${field}`);
          });
        }
        if (emptyFields.length > 0) {
          console.log('\nEmpty fields (present but empty):');
          emptyFields.forEach((field) => {
            console.log(`  ⚠️  ${field}`);
          });
        }
      }
    });

    console.log(`\n${'='.repeat(60)}\n`);
  } catch (error: any) {
    console.error('❌ Error querying Sanity:', error.message);
    if (error.message.includes('projectId')) {
      console.error('\n💡 Make sure NEXT_PUBLIC_SANITY_PROJECT_ID is set in your .env.local file');
    }
    if (error.message.includes('token') || error.message.includes('unauthorized')) {
      console.error('\n💡 You may need SANITY_API_TOKEN in your .env.local to access drafts');
    }
    process.exit(1);
  }
}

// Run the check
checkPropertyFields();

