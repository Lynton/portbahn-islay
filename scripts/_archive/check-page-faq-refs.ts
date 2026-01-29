import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkRefs() {
  const result = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      pageSections[]{
        sectionTitle,
        faqBlocks[]{
          _key,
          "refId": faqBlock._ref
        }
      }
    }
  `);

  console.log('Getting Here Page FAQ References:\n');
  result.pageSections?.forEach((section: any) => {
    console.log(`\n${section.sectionTitle}:`);
    section.faqBlocks?.forEach((fb: any) => {
      console.log(`  - ${fb.refId}`);
    });
  });

  // Now check if these refs exist
  console.log('\n\nChecking if references exist in Sanity:\n');

  const allRefs = result.pageSections
    ?.flatMap((s: any) => s.faqBlocks || [])
    .map((fb: any) => fb.refId)
    .filter(Boolean);

  for (const ref of allRefs) {
    const exists = await client.fetch(`*[_id == $ref][0]{_id, question}`, { ref });
    if (exists) {
      console.log(`✅ ${ref} -> "${exists.question}"`);
    } else {
      console.log(`❌ ${ref} -> NOT FOUND`);
    }
  }
}

checkRefs();
