'use client';

import dynamic from 'next/dynamic';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaMarkup from '@/components/SchemaMarkup';

// Dynamic import for large calendar component (753 lines, 30-50KB)
// Improves initial page load by deferring calendar bundle
const MultiPropertyCalendar = dynamic(
  () => import('@/components/MultiPropertyCalendar'),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 text-center font-mono text-harbour-stone/60">
        Loading calendar...
      </div>
    )
  }
);

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
          name: 'Availability',
          description: 'View availability across all Portbahn Islay properties and select dates to check pricing.',
          url: '/availability',
        }}
        breadcrumbs={breadcrumbs}
      />
      <main className="min-h-screen bg-[#FFFCF7]">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

      {/* Page header */}
      <div className="bg-white border-b border-[#E8E7D5]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#312F32] mb-4">
            Availability
          </h1>
          <p className="font-mono text-[#C8C6BF] max-w-2xl">
            View availability across all three properties. Select a date to check pricing and book your stay in Bruichladdich, Isle of Islay.
          </p>
        </div>
      </div>

      {/* Calendar */}
      <MultiPropertyCalendar />

      {/* Property info section */}
      <div className="bg-white border-t border-[#E8E7D5]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-2">Portbahn House</h3>
              <p className="font-mono text-sm text-[#C8C6BF]">Sleeps 8 • Pet-friendly • Sea views</p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-2">Shorefield House</h3>
              <p className="font-mono text-sm text-[#C8C6BF]">Sleeps 6 • Pet-friendly • Eco-house</p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-2">Curlew Cottage</h3>
              <p className="font-mono text-sm text-[#C8C6BF]">Sleeps 6 • Family-friendly • Quiet location</p>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
