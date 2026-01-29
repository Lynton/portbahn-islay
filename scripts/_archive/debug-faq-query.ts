import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function debug() {
  console.log('Testing FAQ query...\n');
  
  // Test the exact query the page uses
  const result = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      _id,
      title,
      pageSections[]{
        _key,
        sectionTitle,
        faqBlocks[]{
          _key,
          faqBlock->{
            _id,
            question,
            "hasAnswer": defined(answer),
            "answerLength": length(answer)
          }
        }
      }
    }
  `);

  console.log('Full result:');
  console.log(JSON.stringify(result, null, 2));
  
  console.log('\n\nAnalyzing FAQ blocks...');
  if (result?.pageSections) {
    result.pageSections.forEach((section: any) => {
      console.log(`\nSection: ${section.sectionTitle}`);
      console.log(`  FAQ blocks count: ${section.faqBlocks?.length || 0}`);
      if (section.faqBlocks) {
        section.faqBlocks.forEach((fb: any, idx: number) => {
          console.log(`  FAQ Block ${idx + 1}:`);
          console.log(`    _key: ${fb._key}`);
          console.log(`    faqBlock resolved: ${!!fb.faqBlock}`);
          if (fb.faqBlock) {
            console.log(`    Question: ${fb.faqBlock.question}`);
            console.log(`    Has answer: ${fb.faqBlock.hasAnswer}`);
          } else {
            console.log(`    ⚠️  Reference not resolved!`);
          }
        });
      }
    });
  }
}

debug().catch(console.error);
