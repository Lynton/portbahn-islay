'use client';

import dynamic from 'next/dynamic';

// GoogleReviews fetches via useEffect (client-side only). Wrapped here so that
// the dynamic(ssr:false) call lives in a Client Component as required by Next.js.
// Phase 2: convert GoogleReviews to a server-side fetch when property page is redesigned.
const GoogleReviews = dynamic(() => import('@/components/GoogleReviews'), {
  ssr: false,
  loading: () => null,
});

interface Props {
  googleBusinessUrl?: string;
  googlePlaceId?: string;
  propertyName: string;
}

export default function GoogleReviewsClient(props: Props) {
  return <GoogleReviews {...props} />;
}
