/**
 * patch-distillery-hours.ts
 *
 * Patches siteEntity documents for all 10 Islay distilleries with:
 *   - openingHours[]  (visitor centre + café/bar — seasonal entries)
 *   - contact.email
 *   - contact.phone   (only where not already set)
 *   - attributes.hasCafe
 *   - attributes.requiresBooking  (Port Ellen)
 *
 * Source: cw/_intake/Islay Distillery Visitor Information - Islay Distillery Visitor Information (1).csv
 *
 * Run: node_modules/.bin/tsx scripts/patch-distillery-hours.ts
 */

import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production',
  apiVersion: '2025-02-25',
  useCdn:    false,
  token:     process.env.SANITY_API_TOKEN,
});

// ─── Types ─────────────────────────────────────────────────────────────────────

type HoursEntry = {
  label:  string;
  opens:  string;
  closes: string;
  notes?: string;
};

type DistilleryPatch = {
  entityId:           string;
  email?:             string;
  phone?:             string;   // only used if coordinate patch didn't supply one
  hasCafe:            boolean;
  requiresBooking?:   boolean;
  openingHours:       HoursEntry[];
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const distilleries: DistilleryPatch[] = [

  {
    entityId: 'bruichladdich-distillery',
    email:    'mary.mcgregor@bruichladdich.com',
    hasCafe:  false,
    openingHours: [
      { label: 'Mar–Oct (daily)',     opens: '09:45', closes: '17:30' },
      { label: 'Nov–Feb (Tue–Sun)',   opens: '09:45', closes: '17:00' },
    ],
  },

  {
    entityId: 'ardbeg-distillery',
    email:    'distillery@ardbeg.com',
    hasCafe:  true,
    openingHours: [
      { label: 'Apr–Oct (daily)',     opens: '09:30', closes: '17:00' },
      { label: 'Nov–Mar (Mon–Fri)',   opens: '10:00', closes: '17:00' },
      { label: 'Old Kiln Café (Mon–Fri)', opens: '10:00', closes: '15:30', notes: 'Lunch last orders 15:30' },
    ],
  },

  {
    entityId: 'lagavulin-distillery',
    hasCafe:  true,
    openingHours: [
      { label: 'Mar–Oct (daily)',     opens: '10:00', closes: '17:00' },
      { label: 'Nov–Feb (Mon–Sat)',   opens: '10:00', closes: '16:00' },
      { label: 'Bar (daily)',         opens: '10:30', closes: '16:15', notes: 'Last orders 45 min before close' },
    ],
  },

  {
    entityId: 'laphroaig-distillery',
    email:    'tourbookings@laphroaig.com',
    hasCafe:  true,
    openingHours: [
      { label: 'Mar–Dec (daily)',     opens: '09:45', closes: '17:00' },
      { label: 'Jan–Feb (Mon–Fri)',   opens: '09:45', closes: '16:30' },
      { label: 'Lounge',             opens: '09:45', closes: '17:00', notes: 'Open during distillery hours' },
    ],
  },

  {
    entityId: 'port-ellen-distillery',
    hasCafe:          false,
    requiresBooking:  true,
    openingHours: [
      { label: 'By appointment only', opens: '10:00', closes: '17:00', notes: 'Monthly open days from June 2024. Online booking only.' },
    ],
  },

  {
    entityId: 'bowmore-distillery',
    email:    'MBD.BowmoreDistillery@BeamSuntory.com',
    hasCafe:  true,
    openingHours: [
      { label: 'Mon–Sat',            opens: '09:30', closes: '17:00' },
      { label: 'Sunday',             opens: '00:00', closes: '00:00', notes: 'Closed' },
      { label: 'Tasting Bar (Mon–Sat)', opens: '11:00', closes: '16:30' },
    ],
  },

  {
    entityId: 'kilchoman-distillery',
    email:    'tours@kilchomandistillery.com',
    hasCafe:  true,
    openingHours: [
      { label: 'Daily',              opens: '10:00', closes: '17:00' },
      { label: 'Café (daily)',       opens: '10:00', closes: '16:30', notes: 'Lunch 12:00–15:30' },
    ],
  },

  {
    entityId: 'bunnahabhain-distillery',
    hasCafe:  false,
    openingHours: [
      { label: 'Daily',              opens: '10:00', closes: '17:00', notes: 'Tasting flights available in shop. No café.' },
    ],
  },

  {
    entityId: 'caol-ila-distillery',
    hasCafe:  true,
    openingHours: [
      { label: 'Mar–Nov (daily)',    opens: '10:00', closes: '17:00' },
      { label: 'Dec–Feb (Mon–Sat)', opens: '10:00', closes: '16:00' },
      { label: 'Bar (daily)',        opens: '10:00', closes: '16:45', notes: 'Last orders 45 min before close' },
    ],
  },

  {
    entityId: 'ardnahoe-distillery',
    hasCafe:  true,
    openingHours: [
      { label: 'Mar–Oct (daily)',    opens: '09:30', closes: '17:00' },
      { label: 'Nov–Feb (Tue–Sat)', opens: '10:00', closes: '16:00', notes: 'Check current timetable' },
      { label: 'Café (summer)',      opens: '09:30', closes: '16:30' },
      { label: 'Café (winter)',      opens: '10:00', closes: '15:30' },
    ],
  },

];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== patch-distillery-hours.ts ===\n');

  let patched = 0;
  let failed  = 0;

  for (const d of distilleries) {
    const docId = `siteEntity.${d.entityId}`;

    const patchOps: Record<string, any> = {
      openingHours:        d.openingHours,
      'attributes.hasCafe': d.hasCafe,
    };

    if (d.email)            patchOps['contact.email']               = d.email;
    if (d.phone)            patchOps['contact.phone']               = d.phone;
    if (d.requiresBooking)  patchOps['attributes.requiresBooking']  = true;

    try {
      await client.patch(docId).set(patchOps).commit();
      const fields = Object.keys(patchOps).join(', ');
      console.log(`  ✓ ${d.entityId} → ${fields}`);
      patched++;
    } catch (err: any) {
      console.error(`  ✗ ${d.entityId}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Patched: ${patched}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`\nVerify in Studio: Site Entities → any distillery → Opening Hours + Attributes`);
}

run().catch(console.error);
