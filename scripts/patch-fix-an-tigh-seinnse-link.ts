/**
 * Surgical fix: add An Tigh Seinnse Google Maps link to food-drink-islay block.
 * The block already has the heading, we just need to add a link in the paragraph body.
 */
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const generateKey = () => Math.random().toString(36).substring(2, 11);
const AN_TIGH_MAPS = 'https://maps.app.goo.gl/Ec4m6CxY1YW1DJJ28';

async function main() {
  const doc: any = await client.fetch(
    `*[_id == 'canonical-block-food-drink-islay'][0]{ _id, fullContent }`,
    {}
  );
  if (!doc) { console.error('Not found'); return; }

  const blocks: any[] = doc.fullContent;
  let foundHeading = false;
  let patched = false;
  const newBlocks: any[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Find the h3 heading with An Tigh Seinnse
    if (
      block._type === 'block' &&
      block.style === 'h3' &&
      block.children?.some((c: any) => c.text?.includes('An Tigh Seinnse'))
    ) {
      foundHeading = true;
      newBlocks.push(block); // keep heading as-is
      continue;
    }

    // The paragraph immediately after the heading — add the link to its first sentence
    if (foundHeading && !patched && block._type === 'block' && block.style === 'normal') {
      const firstChild = block.children?.[0];
      if (firstChild && typeof firstChild.text === 'string' && firstChild.text.startsWith('Traditional')) {
        const linkKey = generateKey();
        const rest = firstChild.text; // keep original paragraph text, just prepend linked name

        const newChildren: any[] = [
          { _key: generateKey(), _type: 'span', marks: [linkKey], text: 'An Tigh Seinnse' },
          { _key: generateKey(), _type: 'span', marks: [], text: ' — ' + rest },
          ...block.children.slice(1),
        ];

        newBlocks.push({
          ...block,
          markDefs: [{ _key: linkKey, _type: 'link', href: AN_TIGH_MAPS }, ...(block.markDefs || [])],
          children: newChildren,
        });
        patched = true;
        foundHeading = false;
        continue;
      }
    }

    newBlocks.push(block);
  }

  if (!patched) {
    console.error('Could not find target paragraph. Nothing patched.');
    return;
  }

  await client.patch('canonical-block-food-drink-islay').set({ fullContent: newBlocks }).commit();
  console.log('✅ food-drink-islay — An Tigh Seinnse link applied');
}

main().catch(err => { console.error(err); process.exit(1); });
