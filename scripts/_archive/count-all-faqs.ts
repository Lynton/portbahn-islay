import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function countAllFaqs() {
  console.log('Counting all FAQ references across all pages...\n');

  // Get all pages with FAQ references
  const pages = await client.fetch(`
    *[_type match "*Page"]{
      _id,
      _type,
      title,
      pageSections[]{
        sectionTitle,
        faqBlocks[]{
          _key,
          "refId": faqBlock._ref
        }
      }
    }
  `);

  let totalFaqBlocks = 0;
  const pageCounts: Array<{ type: string; title: string; count: number }> = [];

  for (const page of pages) {
    const faqCount = page.pageSections?.reduce((sum: number, section: any) => {
      return sum + (section.faqBlocks?.length || 0);
    }, 0) || 0;

    if (faqCount > 0) {
      totalFaqBlocks += faqCount;
      pageCounts.push({
        type: page._type,
        title: page.title || page._type,
        count: faqCount,
      });
      console.log(`${page._type}: ${faqCount} FAQ block(s)`);
      if (page.title) {
        console.log(`  Title: ${page.title}`);
      }
    }
  }

  console.log(`\n📊 Total FAQ blocks across all pages: ${totalFaqBlocks}`);

  // Also count total FAQ documents
  const totalFaqDocs = await client.fetch(`count(*[_type == "faqCanonicalBlock"])`);
  console.log(`Total FAQ documents in Sanity: ${totalFaqDocs}`);

  if (totalFaqBlocks !== totalFaqDocs) {
    console.log(`\n⚠️  Note: FAQ blocks (${totalFaqBlocks}) vs FAQ documents (${totalFaqDocs})`);
    console.log('Some FAQs might be referenced multiple times, or some FAQs might not be referenced.');
  }
}

countAllFaqs().catch(console.error);
