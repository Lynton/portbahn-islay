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

async function test() {
  // Test the exact query the page uses
  const result = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      pageSections[]{
        sectionTitle,
        faqBlocks[0..1]{
          _key,
          faqBlock->{
            _id,
            question,
            "hasAnswer": defined(answer)
          }
        }
      }
    }
  `);

  console.log('Page data with dereferenced FAQs:');
  console.log(JSON.stringify(result, null, 2));
}

test();
