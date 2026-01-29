import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkBrokenRefs() {
  const pages = await client.fetch(`
    *[_type in ['gettingHerePage', 'exploreIslayPage']] {
      _type,
      pageSections[]{
        sectionTitle,
        faqBlocks[]{
          _key,
          'refId': faqBlock._ref,
          faqBlock->{
            _id,
            question
          }
        }
      }
    }
  `);

  console.log('Checking for broken FAQ references:\n');

  let totalBroken = 0;

  pages.forEach((page: any) => {
    console.log(`📄 ${page._type}:`);

    page.pageSections?.forEach((section: any) => {
      const brokenRefs = section.faqBlocks?.filter((fb: any) => !fb.faqBlock) || [];

      if (brokenRefs.length > 0) {
        console.log(`  ⚠️  Section "${section.sectionTitle}" has ${brokenRefs.length} broken reference(s):`);
        brokenRefs.forEach((fb: any) => {
          console.log(`     - Reference ID: ${fb.refId}`);
          totalBroken++;
        });
      }
    });
  });

  console.log(`\n📊 Total broken references: ${totalBroken}`);
}

checkBrokenRefs().catch(console.error);
