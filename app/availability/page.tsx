import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaMarkup from '@/components/SchemaMarkup';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'Availability & Pricing | Portbahn Islay',
  description: 'Check availability and pricing across all three Portbahn Islay properties in Bruichladdich. View live calendars and get instant quotes.',
};

export default function AvailabilityPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Availability', url: '/availability' },
  ];

  return (
    <>
      <SchemaMarkup
        type={['WebPage', 'BreadcrumbList']}
        data={{
          name: 'Availability & Pricing | Portbahn Islay',
          description: 'Check availability and pricing across all three Portbahn Islay properties in Bruichladdich. View live calendars and get instant quotes.',
          url: '/availability',
        }}
        breadcrumbs={breadcrumbs}
      />
      <main className="min-h-screen bg-[#FFFCF7]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white border-b border-washed-timber">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-serif text-harbour-stone mb-4">
              Availability
            </h1>
            <p className="font-mono text-harbour-stone/60 max-w-2xl">
              View availability across all three properties. Select a date to check pricing and book your stay in Bruichladdich, Isle of Islay.
            </p>
          </div>
        </div>

        <CalendarClient />

        <div className="bg-white border-t border-washed-timber">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-xl mb-2">Portbahn House</h3>
                <p className="font-mono text-sm text-harbour-stone/60">Sleeps 8 · Pet-friendly · Sea views</p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Shorefield Eco House</h3>
                <p className="font-mono text-sm text-harbour-stone/60">Sleeps 6 · Pet-friendly · Eco-house</p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Curlew Cottage</h3>
                <p className="font-mono text-sm text-harbour-stone/60">Sleeps 6 · Family-friendly · Walled garden</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
