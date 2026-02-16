import React from 'react';
import Link from 'next/link';

interface TrustTransferProps {
  reviews: Array<{
    quote: string;
    rating?: number;
    source: string;
  }>;
  totalReviewCount: number;
}

export default function PropertyHostTrustTransfer({
  reviews,
  totalReviewCount
}: TrustTransferProps) {
  // Only show for properties with zero reviews
  if (totalReviewCount > 0 || !reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="my-12 py-8 border-t border-gray-200">
      <h2 className="font-serif text-3xl text-harbour-stone mb-4">About Your Hosts</h2>

      <div className="mb-8">
        <p className="font-mono text-base text-harbour-stone leading-relaxed mb-4">
          Curlew Cottage is managed by <strong>Pi and Lynton</strong>, who also own
          and manage Portbahn House and Shorefield on Islay. As{' '}
          <strong>Airbnb Superhosts with a 4.97/5 rating across 380+ reviews</strong>,
          they bring years of hospitality experience to this property.
        </p>
        <p className="font-mono text-base text-harbour-stone leading-relaxed">
          This is the owner&apos;s personal retreat, carefully maintained and now being
          shared with guests for the first time in 2026. You can expect the same high
          standards of cleanliness, thoughtful equipment, and responsive hosting that
          have earned Pi and Lynton consistently outstanding reviews.
        </p>
      </div>

      <h3 className="font-serif text-2xl text-harbour-stone mb-6">
        Some Reviews from Our Neighbouring Properties
      </h3>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <blockquote key={index} className="border-l-4 border-emerald-accent pl-6 py-3">
            <p className="font-mono text-base text-harbour-stone italic mb-2">
              &ldquo;{review.quote}&rdquo;
            </p>
            <footer className="flex items-center gap-3">
              <p className="font-mono text-sm text-harbour-stone opacity-60">
                — {review.source}
              </p>
              {review.rating && (
                <span className="font-mono text-sm text-emerald-accent">
                  {review.rating}/5
                </span>
              )}
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
        <Link
          href="/accommodation/portbahn-house"
          className="text-emerald-accent hover:underline font-mono text-sm"
        >
          Read more reviews from Portbahn House →
        </Link>
        <Link
          href="/accommodation/shorefield"
          className="text-emerald-accent hover:underline font-mono text-sm"
        >
          Read more reviews from Shorefield →
        </Link>
      </div>
    </section>
  );
}
