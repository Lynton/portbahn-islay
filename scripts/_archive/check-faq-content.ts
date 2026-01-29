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

async function checkFaqContent() {
  console.log('🔍 Checking FAQ content...\n');

  const faqs = await client.fetch(`
    *[_type == "faqCanonicalBlock"] | order(blockId.current asc) {
      _id,
      blockId,
      question,
      "hasAnswer": defined(answer),
      "answerLength": length(answer),
      category
    }
  `);

  console.log(`Total FAQs: ${faqs.length}\n`);

  let emptyCount = 0;
  let withContentCount = 0;

  faqs.forEach((faq: any) => {
    const status = faq.hasAnswer ? '✅' : '❌ EMPTY';
    const answerPreview = faq.hasAnswer ? `(${faq.answerLength} blocks)` : '';

    if (!faq.hasAnswer) {
      emptyCount++;
      console.log(`${status} ${faq.question} - ${faq.blockId?.current || faq._id}`);
    } else {
      withContentCount++;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`✅ FAQs with content: ${withContentCount}`);
  console.log(`❌ FAQs with empty answers: ${emptyCount}`);
  console.log('='.repeat(60));

  // Check which empty FAQs are referenced in pages
  console.log('\n🔗 Checking which empty FAQs are referenced in pages:\n');

  const pages = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage"]] {
      _type,
      pageSections[]{
        sectionTitle,
        faqBlocks[]{
          "refId": faqBlock._ref,
          faqBlock->{
            _id,
            blockId,
            question,
            "hasAnswer": defined(answer)
          }
        }
      }
    }
  `);

  pages.forEach((page: any) => {
    console.log(`📄 ${page._type}:`);
    page.pageSections?.forEach((section: any) => {
      if (section.faqBlocks && section.faqBlocks.length > 0) {
        console.log(`  📌 ${section.sectionTitle}:`);
        section.faqBlocks.forEach((fb: any) => {
          if (fb.faqBlock) {
            const status = fb.faqBlock.hasAnswer ? '✅' : '❌ EMPTY';
            console.log(`     ${status} ${fb.faqBlock.question} (${fb.faqBlock._id})`);
          }
        });
      }
    });
    console.log();
  });
}

checkFaqContent().catch(console.error);
