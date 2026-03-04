'use client';

import { useState, useCallback } from 'react';

interface GalleryImage {
  url: string;
  thumb: string;
  alt: string;
  caption?: string;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
  propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images.length) return null;

  const active = images[activeIndex];

  return (
    <div>
      {/* Featured image — large, cinematic */}
      <div className="relative aspect-[16/10] overflow-hidden bg-harbour-stone/50 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={active.alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Navigation arrows — appear on hover */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-harbour-stone/60 text-sea-spray opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous image"
        >
          <span className="font-mono text-lg">{'\u2190'}</span>
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-harbour-stone/60 text-sea-spray opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next image"
        >
          <span className="font-mono text-lg">{'\u2192'}</span>
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-harbour-stone/60 px-3 py-1">
          <p className="font-mono text-sea-spray" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
            {activeIndex + 1} / {images.length}
          </p>
        </div>

        {/* Caption */}
        {active.caption && (
          <div className="absolute bottom-0 left-0 right-16 bg-harbour-stone/60 px-6 py-3">
            <p className="font-mono text-sea-spray" style={{ fontSize: '12px' }}>{active.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-20 h-14 relative overflow-hidden transition-opacity ${
              i === activeIndex ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            }`}
            aria-label={`View image ${i + 1} of ${images.length}: ${img.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.thumb}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {i === activeIndex && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sea-spray" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
