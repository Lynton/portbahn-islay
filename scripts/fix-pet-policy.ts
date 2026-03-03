import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const props = await client.fetch<Array<{ _id: string; name: string; petPolicyDetails: any[] }>>(
    `*[_type == "property"]{ _id, name, petPolicyDetails }`
  );

  for (const p of props) {
    console.log(`\n${p.name} (_id: ${p._id})`);
    if (Array.isArray(p.petPolicyDetails) && p.petPolicyDetails.length > 0) {
      const first = p.petPolicyDetails[0];
      if (typeof first === 'object' && first?._type === 'block') {
        console.log('  ⚠ petPolicyDetails has PortableText blocks — fixing...');
        const fixed: string[] = p.petPolicyDetails
          .map((b: any) => b?.children?.map((s: any) => s.text || '').join('') ?? String(b))
          .filter((s: string) => s.trim().length > 0);
        console.log('  Strings:', fixed);
        await client.patch(p._id).set({ petPolicyDetails: fixed }).commit();
        console.log('  ✓ patched');
      } else if (typeof first === 'string') {
        console.log('  ✓ already strings — no fix needed');
      } else {
        console.log('  ? unexpected:', typeof first, first);
      }
    } else {
      console.log('  petPolicyDetails empty/absent — no change');
    }
  }

  console.log('\nDone.');
}

main().catch(console.error);
