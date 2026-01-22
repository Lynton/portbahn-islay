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

// Create a Sanity client with write access
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for mutations
});

// Old fields to remove
const OLD_FIELDS_TO_REMOVE = [
  'amenities',
  'excerpt',
  'focusKeyword',
  'kitchenAmenities',
  'mainImage',
];

async function removeOldFields() {
  try {
    if (!process.env.SANITY_API_TOKEN) {
      console.error('❌ Error: SANITY_API_TOKEN is required to remove fields');
      console.error('💡 Add SANITY_API_TOKEN to your .env.local file');
      console.error('💡 You can get a token from: https://www.sanity.io/manage');
      process.exit(1);
    }

    // Query all property documents
    const query = `*[_type == "property"] {
      _id,
      _rev,
      name,
      amenities,
      excerpt,
      focusKeyword,
      kitchenAmenities,
      mainImage
    }`;

    const properties = await client.fetch(query);

    if (properties.length === 0) {
      console.log('❌ No properties found in Sanity database.');
      return;
    }

    console.log(`\n📋 Found ${properties.length} property document(s)\n`);
    console.log('🔍 Checking for old fields to remove...\n');

    let updatedCount = 0;

    for (const property of properties) {
      const fieldsToRemove: string[] = [];
      
      // Check which old fields exist
      OLD_FIELDS_TO_REMOVE.forEach((field) => {
        if (property[field] !== undefined && property[field] !== null) {
          fieldsToRemove.push(field);
        }
      });

      if (fieldsToRemove.length === 0) {
        console.log(`✅ ${property.name || property._id}: No old fields found`);
        continue;
      }

      console.log(`\n📝 ${property.name || property._id}:`);
      console.log(`   Removing fields: ${fieldsToRemove.join(', ')}`);

      try {
        // Build patch operations to unset each field
        const patches = fieldsToRemove.map((field) => ({
          unset: [field],
        }));

        // Apply all patches
        for (const patch of patches) {
          await client
            .patch(property._id)
            .unset(patch.unset)
            .commit();
        }

        console.log(`   ✅ Successfully removed old fields`);
        updatedCount++;
      } catch (error: any) {
        console.error(`   ❌ Error removing fields: ${error.message}`);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Migration complete!`);
    console.log(`   Updated ${updatedCount} of ${properties.length} document(s)`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('token') || error.message.includes('unauthorized')) {
      console.error('\n💡 Make sure SANITY_API_TOKEN is set correctly in .env.local');
      console.error('💡 The token needs write permissions');
    }
    process.exit(1);
  }
}

// Run the migration
console.log('🚀 Starting migration to remove old fields...\n');
removeOldFields();


