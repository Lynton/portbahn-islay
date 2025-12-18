'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

interface GoogleReviewsProps {
  googleBusinessUrl?: string;
  googlePlaceId?: string;
  propertyName: string;
}

export default function GoogleReviews({ googleBusinessUrl, googlePlaceId, propertyName }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch reviews from API
  useEffect(() => {
    if (!googleBusinessUrl && !googlePlaceId) {
      setLoading(false);
      return;
    }

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params
        const params = new URLSearchParams();
        if (googleBusinessUrl) {
          params.append('url', googleBusinessUrl);
        }
        if (googlePlaceId) {
          params.append('placeId', googlePlaceId);
        }
        
        const response = await fetch(`/api/google-reviews?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Failed to fetch reviews';
          const suggestion = errorData.suggestion || '';
          throw new Error(
            errorMessage + (suggestion ? `\n\n${suggestion}` : '') + 
            (googleBusinessUrl ? `\n\nURL: ${googleBusinessUrl}` : '')
          );
        }
        
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err: any) {
        console.error('Error fetching Google reviews:', err);
        setError(err.message || 'Failed to load reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [googleBusinessUrl, googlePlaceId]);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  if (loading) {
    return (
      <section className="mb-12 bg-[#F3F1E7] rounded-lg p-8 border border-[#C8C6BF]">
        <h2 className="font-serif text-3xl text-harbour-stone mb-4">Guest Reviews</h2>
        <p className="font-mono text-base text-harbour-stone opacity-60">Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12 bg-[#F3F1E7] rounded-lg p-8 border border-[#C8C6BF]">
        <h2 className="font-serif text-3xl text-harbour-stone mb-4">Guest Reviews</h2>
        <p className="font-mono text-sm text-harbour-stone opacity-60">
          {error}
          {googleBusinessUrl && (
            <span className="block mt-2">
              <Link
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-accent hover:underline"
              >
                View reviews on Google →
              </Link>
            </span>
          )}
        </p>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    if (googleBusinessUrl) {
      return (
        <section className="mb-12 bg-[#F3F1E7] rounded-lg p-8 border border-[#C8C6BF]">
          <h2 className="font-serif text-3xl text-harbour-stone mb-4">Guest Reviews</h2>
          <p className="font-mono text-base text-harbour-stone opacity-60 mb-4">
            No reviews available yet.
          </p>
          <Link
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-accent hover:underline"
          >
            View on Google →
          </Link>
        </section>
      );
    }
    return null;
  }

  const currentReview = reviews[currentIndex];

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    } catch {
      return null;
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="mb-12 bg-[#F3F1E7] rounded-lg p-8 border border-[#C8C6BF]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl text-harbour-stone">Guest Reviews</h2>
        {googleBusinessUrl && (
          <Link
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-accent hover:underline"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            View on Google →
          </Link>
        )}
      </div>

      {/* Review Quote */}
      <div
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <blockquote className="border-l-4 border-emerald-accent pl-6 py-4">
          {renderStars(currentReview.rating)}
          <p className="font-serif text-xl text-harbour-stone mb-4 italic">
            "{currentReview.text}"
          </p>
          <footer className="font-mono text-base text-harbour-stone">
            <cite className="not-italic font-semibold">{currentReview.author}</cite>
            {formatDate(currentReview.date) && (
              <span className="text-harbour-stone opacity-60 ml-2">
                • {formatDate(currentReview.date)}
              </span>
            )}
          </footer>
        </blockquote>
      </div>

      {/* Navigation Dots */}
      {reviews.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
              setIsAutoPlaying(false);
            }}
            className="font-mono text-sm text-harbour-stone hover:text-emerald-accent transition-colors"
            aria-label="Previous review"
          >
            ←
          </button>
          
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-emerald-accent w-8'
                    : 'bg-[#C8C6BF] hover:bg-harbour-stone'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentIndex((prev) => (prev + 1) % reviews.length);
              setIsAutoPlaying(false);
            }}
            className="font-mono text-sm text-harbour-stone hover:text-emerald-accent transition-colors"
            aria-label="Next review"
          >
            →
          </button>
        </div>
      )}

      {/* Review Counter */}
      {reviews.length > 1 && (
        <p className="text-center font-mono text-sm text-harbour-stone opacity-60 mt-4">
          Review {currentIndex + 1} of {reviews.length}
        </p>
      )}
    </section>
  );
}

