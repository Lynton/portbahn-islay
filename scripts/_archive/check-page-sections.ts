/**
 * Check what's actually in the page sections
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function checkPages() {
  // Get Getting Here page with full section details
  const gettingHere = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      title,
      pageSections[]{
        _key,
        sectionTitle,
        sectionId,
        contentBlocks[]{
          _key,
          version,
          "blockRef": block._ref,
          "resolvedBlock": block->{blockId, title}
        },
        faqBlocks[]{
          _key,
          "faqRef": faqBlock._ref,
          "resolvedFaq": faqBlock->{question}
        }
      }
    }
  `);

  console.log('GETTING HERE PAGE');
  console.log('='.repeat(50));
  console.log(JSON.stringify(gettingHere, null, 2));

  // Get Explore Islay page
  const exploreIslay = await client.fetch(`
    *[_type == "exploreIslayPage"][0]{
      title,
      pageSections[]{
        _key,
        sectionTitle,
        sectionId,
        contentBlocks[]{
          _key,
          version,
          "blockRef": block._ref,
          "resolvedBlock": block->{blockId, title}
        },
        faqBlocks[]{
          _key,
          "faqRef": faqBlock._ref,
          "resolvedFaq": faqBlock->{question}
        }
      }
    }
  `);

  console.log('\n\nEXPLORE ISLAY PAGE');
  console.log('='.repeat(50));
  console.log(JSON.stringify(exploreIslay, null, 2));

  // Get Homepage
  const homepage = await client.fetch(`
    *[_type == "homepage"][0]{
      title,
      contentBlocks[]{
        _key,
        version,
        "blockRef": block._ref,
        "resolvedBlock": block->{blockId, title}
      },
      faqBlocks[]{
        _key,
        "faqRef": faqBlock._ref,
        "resolvedFaq": faqBlock->{question}
      }
    }
  `);

  console.log('\n\nHOMEPAGE');
  console.log('='.repeat(50));
  console.log(JSON.stringify(homepage, null, 2));
}

checkPages().catch(console.error);
