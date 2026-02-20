'use client';

import dynamic from 'next/dynamic';

const MultiPropertyCalendar = dynamic(
  () => import('@/components/MultiPropertyCalendar'),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 text-center font-mono text-harbour-stone/60">
        Loading calendar...
      </div>
    ),
  }
);

export default function CalendarClient() {
  return <MultiPropertyCalendar />;
}
