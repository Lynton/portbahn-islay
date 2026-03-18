import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { portableTextComponents } from '@/lib/portable-text';
import PropertyCalendar from '@/components/PropertyCalendar';
import MobileAvailBar from '@/components/MobileAvailBar';
import SchemaMarkup from '@/components/SchemaMarkup';
import PropertyCard from '@/components/PropertyCard';
import GoogleMap from '@/components/GoogleMap';
import GoogleReviewsClient from '@/components/GoogleReviewsClient';
import PropertyHostTrustTransfer from '@/components/PropertyHostTrustTransfer';

// TypeScript types for AI-optimized fields
// (Types kept inline where used)

interface MagicMoment {
  moment: string;
  frequency?: string;
}

interface PerfectFor {
  guestType: string;
  why: string;
  reviewEvidence?: string;
}

interface HonestFriction {
  issue: string;
  context: string;
}

// (Types kept inline where used)

interface ReviewHighlight {
  quote: string;
  source: string;
  rating?: number;
}

// Cached fetches - dedupe calls between generateMetadata and page component
const getProperty = cache(async (slug: string) => {
  // Fetch ALL fields explicitly to ensure everything is returned
  // Try to get draft first, then fall back to published
  const query = `*[_type == "property" && slug.current == $slug] | order(_id desc)[0]{
    _id,
    name,
    slug,
    propertyType,
    heroImage,
    images[],
    overviewIntro,
    description,
    idealFor[],
    // Personality & Guest Experience
    propertyNickname,
    guestSuperlatives[],
    magicMoments[] {
      moment,
      frequency
    },
    perfectFor[] {
      guestType,
      why,
      reviewEvidence
    },
    honestFriction[] {
      issue,
      context
    },
    ownerContext,
    // Reviews & Social Proof
    reviewScores {
      airbnbScore,
      airbnbCount,
      airbnbBadges[],
      bookingScore,
      bookingCount,
      bookingCategory,
      googleScore,
      googleCount
    },
    reviewThemes[],
    reviewHighlights[] {
      quote,
      source,
      rating
    },
    totalReviewCount,
    entityFraming {
      whatItIs,
      whatItIsNot,
      primaryDifferentiator,
      category
    },
    commonQuestions[] {
      question,
      answer
    },
    trustSignals {
      ownership,
      established,
      guestExperience,
      localCredentials
    },
    sleeps,
    bedrooms,
    beds,
    bathrooms,
    sleepingIntro,
    bedroomDetails[],
    bathroomDetails[],
    facilitiesIntro,
    kitchenDining[],
    kitchenDiningNotes[],
    livingAreas[],
    livingAreasNotes[],
    heatingCooling[],
    heatingCoolingNotes[],
    entertainment[],
    entertainmentNotes[],
    laundryFacilities[],
    safetyFeatures[],
    outdoorIntro,
    outdoorFeatures[],
    outdoorFeaturesNotes[],
    parkingInfo,
    petFriendly,
    petPolicyIntro,
    petPolicyDetails[],
    locationIntro,
    location,
    nearbyAttractions[],
    whatToDoNearby[],
    gettingHereIntro,
    postcode,
    latitude,
    longitude,
    directions,
    ferryInfo,
    airportDistance,
    portDistance,
    policiesIntro,
    checkInTime,
    checkOutTime,
    minimumStay,
    cancellationPolicy,
    paymentTerms,
    securityDeposit,
    licensingStatus,
    licenseNumber,
    licenseNotes,
    availabilityStatus,
    includedIntro,
    included[],
    notIncluded[],
    importantInfo[],
    dailyRate,
    weeklyRate,
    lodgifyPropertyId,
    lodgifyRoomId,
    icsUrl,
    seoTitle,
    seoDescription,
    googleBusinessUrl,
    googlePlaceId
  }`;

  return await client.fetch(query, { slug });
});

// Fetch Block 25 (dog-friendly-properties) teaserContent for dog-friendly properties
const getDogFriendlyBlock = cache(async () => {
  const query = `*[_type == "canonicalBlock" && blockId.current == "dog-friendly-properties"][0]{
    title,
    teaserContent,
    canonicalHome
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
});

const getAllProperties = cache(async (excludeSlug?: string) => {
  // Build query conditionally to exclude current property
  const query = excludeSlug
    ? `*[_type == "property" && slug.current != $excludeSlug] | order(name asc){
        _id,
        name,
        slug,
        location,
        "description": pt::text(description),
        sleeps,
        bedrooms,
        heroImage
      }`
    : `*[_type == "property"] | order(name asc){
        _id,
        name,
        slug,
        location,
        "description": pt::text(description),
        sleeps,
        bedrooms,
        heroImage
      }`;

  return excludeSlug
    ? await client.fetch(query, { excludeSlug })
    : await client.fetch(query);
});

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────

function ArrayField({ items, className = '' }: { items: string[] | undefined; className?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className={`list-disc list-inside space-y-1 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="font-mono text-base text-harbour-stone">{item}</li>
      ))}
    </ul>
  );
}

function CheckboxArray({ items, className = '' }: { items: string[] | undefined; className?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, idx) => (
        <span
          key={idx}
          style={{
            padding: '5px 12px',
            background: 'var(--color-machair-sand)',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.04em',
            color: 'var(--color-harbour-stone)',
          }}
        >
          {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ))}
    </div>
  );
}

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      paddingRight: '28px',
      marginRight: '28px',
      borderRight: '1px solid var(--color-washed-timber)',
      paddingBottom: '4px',
    }}>
      <p style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '10px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--color-kelp-edge)',
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '15px',
        color: 'var(--color-harbour-stone)',
      }}>
        {value}
      </p>
    </div>
  );
}

function SectionHeading({ label, title }: { label?: string; title: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <p style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-kelp-edge)',
          marginBottom: '8px',
        }}>
          {label}
        </p>
      )}
      <h2 style={{
        fontFamily: '"The Seasons", Georgia, serif',
        fontWeight: 700,
        fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        color: 'var(--color-harbour-stone)',
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
    </div>
  );
}

// ─── PAGE COMPONENT ────────────────────────────────────────────────────────

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return (
      <main className="min-h-screen bg-sea-spray">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-serif text-4xl text-harbour-stone mb-4">Property not found</h1>
          <Link href="/" className="font-mono text-base text-emerald-accent hover:underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  const galleryImages = property.images || [];
  const heroImage = property.heroImage;

  const otherProperties = await getAllProperties(property.slug?.current || property.slug);
  const dogFriendlyBlock = property.petFriendly ? await getDogFriendlyBlock() : null;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Accommodation', url: '/accommodation' },
    { name: property.name, url: `/accommodation/${property.slug?.current || property.slug}` },
  ];

  const sectionDivider: React.CSSProperties = {
    paddingTop: '44px',
    borderTop: '1px solid var(--color-washed-timber)',
    marginBottom: '44px',
  };

  return (
    <>
      <SchemaMarkup
        type={['Accommodation', 'Place', 'Product', 'BreadcrumbList']}
        data={property}
        breadcrumbs={breadcrumbs}
      />

      {/* Mobile bottom padding to clear fixed availability bar */}
      <main className="min-h-screen bg-sea-spray pb-20 md:pb-0">

        {/* ── FULL-BLEED HERO ──────────────────────────────────────── */}
        {heroImage && (
          <div className="w-full relative overflow-hidden" style={{ height: '65vh', maxHeight: '700px' }}>
            <Image
              src={urlFor(heroImage).width(1600).height(960).url()}
              alt={heroImage.alt || property.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* ── TWO-COLUMN GRID ─────────────────────────────────────── */}
        <div
          className="property-grid overflow-x-clip"
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}
        >

          {/* ── LEFT CONTENT COLUMN ─────────────────────────────── */}
          <div style={{ minWidth: 0, paddingBottom: '80px' }}>

            {/* TITLE FRAME */}
            <div style={{ paddingTop: '64px', paddingBottom: '56px', marginBottom: '40px' }}>
              {/* Property type label */}
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-kelp-edge)',
                marginBottom: '20px',
              }}>
                {property.propertyNickname || 'Self-Catering Holiday Home'}
              </p>
              <h1 style={{
                fontFamily: '"The Seasons", Georgia, serif',
                fontWeight: 700,
                fontSize: 'clamp(4rem, 8vw, 6.75rem)',
                color: 'var(--color-harbour-stone)',
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}>
                {property.name}
              </h1>
              {/* Location meta */}
              {property.location && (
                <p style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '13px',
                  color: 'var(--color-washed-timber)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '40px',
                }}>
                  {property.location} · Isle of Islay
                </p>
              )}
              {/* Facts strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid var(--color-washed-timber)', paddingTop: '24px' }}>
                {property.sleeps && <FactItem label="Sleeps" value={String(property.sleeps)} />}
                {property.bedrooms && <FactItem label="Bedrooms" value={String(property.bedrooms)} />}
                {property.beds && <FactItem label="Beds" value={String(property.beds)} />}
                {property.bathrooms && <FactItem label="Bathrooms" value={String(property.bathrooms)} />}
                {property.petFriendly !== undefined && (
                  <FactItem label="Pets" value={property.petFriendly ? 'Welcome' : 'Not permitted'} />
                )}
              </div>
            </div>

            {/* OVERVIEW */}
            {(property.overviewIntro || property.description || property.entityFraming?.whatItIs || property.idealFor?.length) && (
              <div style={{ marginBottom: '44px' }}>
                {property.overviewIntro && (
                  <p style={{
                    fontFamily: '"The Seasons", Georgia, serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
                    color: 'var(--color-harbour-stone)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    marginBottom: '24px',
                  }}>
                    {property.overviewIntro}
                  </p>
                )}

                {property.description && (
                  <div style={{ marginBottom: '24px' }}>
                    <PortableText value={property.description} components={portableTextComponents} />
                  </div>
                )}

                {property.entityFraming?.whatItIs && (
                  <div style={{
                    borderLeft: '3px solid var(--color-kelp-edge)',
                    paddingLeft: '20px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    marginBottom: '20px',
                  }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '15px', color: 'var(--color-harbour-stone)', lineHeight: 1.6 }}>
                      {property.entityFraming.whatItIs}
                    </p>
                    {property.entityFraming.primaryDifferentiator && (
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', opacity: 0.7, marginTop: '8px', lineHeight: 1.6 }}>
                        {property.entityFraming.primaryDifferentiator}
                      </p>
                    )}
                  </div>
                )}

                {(property.trustSignals?.established || property.trustSignals?.ownership || property.trustSignals?.guestExperience) && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.55, lineHeight: 1.8 }}>
                    {[property.trustSignals.established, property.trustSignals.ownership, property.trustSignals.guestExperience]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}

                {property.idealFor && property.idealFor.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '10px' }}>
                      Ideal for
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {property.idealFor.map((item: string, index: number) => (
                        <span key={index} style={{
                          padding: '5px 12px',
                          background: 'var(--color-machair-sand)',
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '11px',
                          color: 'var(--color-harbour-stone)',
                          letterSpacing: '0.03em',
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GALLERY — FIRST PAIR */}
            {galleryImages.length >= 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '6px', marginBottom: '44px' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <Image
                    src={urlFor(galleryImages[0]).width(900).height(675).url()}
                    alt={(galleryImages[0] as any)?.alt || `${property.name} — 1`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <Image
                    src={urlFor(galleryImages[1]).width(600).height(800).url()}
                    alt={(galleryImages[1] as any)?.alt || `${property.name} — 2`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* SLEEPING & BEDROOMS */}
            {(property.sleepingIntro || property.bedroomDetails?.length || property.bathroomDetails?.length) && (
              <section style={sectionDivider}>
                <SectionHeading label="Rooms" title="Sleeping Arrangements" />
                {property.sleepingIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '20px' }}>
                    {property.sleepingIntro}
                  </p>
                )}
                {property.bedroomDetails && property.bedroomDetails.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Bedrooms</p>
                    <ArrayField items={property.bedroomDetails} />
                  </div>
                )}
                {property.bathroomDetails && property.bathroomDetails.length > 0 && (
                  <div>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Bathrooms</p>
                    <ArrayField items={property.bathroomDetails} />
                  </div>
                )}
              </section>
            )}

            {/* FACILITIES */}
            {(property.facilitiesIntro || property.kitchenDining?.length || property.livingAreas?.length ||
              property.heatingCooling?.length || property.entertainment?.length || property.laundryFacilities?.length ||
              property.safetyFeatures?.length) && (
              <section style={sectionDivider}>
                <SectionHeading label="Inside" title="Facilities" />
                {property.facilitiesIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '24px' }}>
                    {property.facilitiesIntro}
                  </p>
                )}

                {[
                  { label: 'Kitchen & Dining', items: property.kitchenDining, notes: property.kitchenDiningNotes },
                  { label: 'Living Areas', items: property.livingAreas, notes: property.livingAreasNotes },
                  { label: 'Heating & Cooling', items: property.heatingCooling, notes: property.heatingCoolingNotes },
                  { label: 'Entertainment', items: property.entertainment, notes: property.entertainmentNotes },
                  { label: 'Laundry', items: property.laundryFacilities, notes: undefined },
                  { label: 'Safety Features', items: property.safetyFeatures, notes: undefined },
                ].map(({ label, items, notes }) => items && items.length > 0 && (
                  <div key={label} style={{ marginBottom: '20px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>{label}</p>
                    <CheckboxArray items={items} />
                    {notes && notes.length > 0 && <ArrayField items={notes} className="mt-3" />}
                  </div>
                ))}
              </section>
            )}

            {/* OUTDOOR */}
            {(property.outdoorIntro || property.outdoorFeatures?.length || property.parkingInfo) && (
              <section style={sectionDivider}>
                <SectionHeading label="Outside" title="Outdoor Spaces" />
                {property.outdoorIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '16px' }}>
                    {property.outdoorIntro}
                  </p>
                )}
                {property.outdoorFeatures && property.outdoorFeatures.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <CheckboxArray items={property.outdoorFeatures} />
                    {property.outdoorFeaturesNotes && property.outdoorFeaturesNotes.length > 0 && (
                      <ArrayField items={property.outdoorFeaturesNotes} className="mt-3" />
                    )}
                  </div>
                )}
                {property.parkingInfo && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginTop: '12px' }}>
                    {property.parkingInfo}
                  </p>
                )}
              </section>
            )}

            {/* GALLERY — SECOND PAIR */}
            {galleryImages.length >= 4 && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '6px', margin: '44px 0' }}>
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <Image
                    src={urlFor(galleryImages[2]).width(600).height(800).url()}
                    alt={(galleryImages[2] as any)?.alt || `${property.name} — 3`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <Image
                    src={urlFor(galleryImages[3]).width(900).height(675).url()}
                    alt={(galleryImages[3] as any)?.alt || `${property.name} — 4`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* WHAT'S INCLUDED */}
            {(property.includedIntro || property.included?.length || property.notIncluded?.length) && (
              <section style={sectionDivider}>
                <SectionHeading label="What you get" title="What&apos;s Included" />
                {property.includedIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '16px' }}>
                    {property.includedIntro}
                  </p>
                )}
                {property.included && property.included.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <ArrayField items={property.included} />
                  </div>
                )}
                {property.notIncluded && property.notIncluded.length > 0 && (
                  <div>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px', marginTop: '16px' }}>Not included</p>
                    <ArrayField items={property.notIncluded} />
                  </div>
                )}
              </section>
            )}

            {/* GUEST EXPERIENCE / PERSONALITY */}
            {(property.propertyNickname || property.guestSuperlatives?.length || property.magicMoments?.length ||
              property.perfectFor?.length || property.honestFriction?.length || property.ownerContext) && (
              <section style={sectionDivider}>
                <SectionHeading label="Your stay" title="Guest Experience" />

                {property.propertyNickname && (
                  <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-harbour-stone)', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.3 }}>
                    {property.propertyNickname}
                  </p>
                )}

                {property.guestSuperlatives && property.guestSuperlatives.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '12px' }}>What guests say</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {property.guestSuperlatives.map((quote: string, i: number) => (
                        <p key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', fontStyle: 'italic', borderLeft: '3px solid var(--color-kelp-edge)', paddingLeft: '16px', paddingTop: '4px', paddingBottom: '4px', lineHeight: 1.6 }}>
                          &quot;{quote}&quot;
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {property.magicMoments && property.magicMoments.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '12px' }}>Magic moments</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {property.magicMoments.map((moment: MagicMoment, i: number) => (
                        <div key={i} style={{ borderLeft: '1px solid var(--color-washed-timber)', paddingLeft: '16px', paddingTop: '4px', paddingBottom: '4px' }}>
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.6 }}>{moment.moment}</p>
                          {moment.frequency && (
                            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.55, marginTop: '4px' }}>{moment.frequency}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.perfectFor && property.perfectFor.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '12px' }}>Perfect for</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {property.perfectFor.map((item: PerfectFor, i: number) => (
                        <div key={i} style={{ borderLeft: '3px solid var(--color-kelp-edge)', paddingLeft: '16px', paddingTop: '6px', paddingBottom: '6px' }}>
                          <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '1rem', color: 'var(--color-harbour-stone)', marginBottom: '4px' }}>{item.guestType}</p>
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.6, marginBottom: '4px' }}>{item.why}</p>
                          {item.reviewEvidence && (
                            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.55, lineHeight: 1.5 }}>{item.reviewEvidence}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.honestFriction && property.honestFriction.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '12px' }}>Things to know</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {property.honestFriction.map((friction: HonestFriction, i: number) => (
                        <div key={i} style={{ background: 'var(--color-machair-sand)', padding: '14px 16px' }}>
                          <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '1rem', color: 'var(--color-harbour-stone)', marginBottom: '6px' }}>{friction.issue}</p>
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.6 }}>{friction.context}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.ownerContext && (
                  <div>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '12px' }}>From the owners</p>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                      {property.ownerContext}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* HOST TRUST TRANSFER */}
            <PropertyHostTrustTransfer
              reviews={property.reviewHighlights || []}
              totalReviewCount={property.totalReviewCount || 0}
            />

            {/* REVIEWS — teal panel */}
            {(property.reviewScores || property.reviewThemes?.length || property.reviewHighlights?.length) && (
              <section style={{
                background: 'var(--color-sound-of-islay)',
                padding: '40px 32px',
                marginBottom: '0',
                marginTop: '44px',
              }}>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(241,236,228,0.55)', marginBottom: '8px' }}>
                  Guest reviews
                </p>
                <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: 'var(--color-machair-sand)', lineHeight: 1.1, marginBottom: '28px' }}>
                  What Guests Say
                </h2>

                {property.reviewScores && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px', marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(241,236,228,0.15)' }}>
                    {property.reviewScores.airbnbScore && (
                      <div>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(241,236,228,0.5)', marginBottom: '6px' }}>Airbnb</p>
                        <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '2.25rem', color: 'var(--color-machair-sand)', lineHeight: 1 }}>
                          {property.reviewScores.airbnbScore.toFixed(1)}
                          <span style={{ fontSize: '1rem', color: 'rgba(241,236,228,0.5)' }}>/5</span>
                        </p>
                        {property.reviewScores.airbnbCount && (
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(241,236,228,0.5)', marginTop: '4px' }}>
                            {property.reviewScores.airbnbCount} reviews
                          </p>
                        )}
                        {property.reviewScores.airbnbBadges && property.reviewScores.airbnbBadges.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                            {property.reviewScores.airbnbBadges.map((badge: string, i: number) => (
                              <span key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.06em', color: 'var(--color-machair-sand)', border: '1px solid rgba(241,236,228,0.3)', padding: '3px 7px', textTransform: 'uppercase' }}>
                                {badge.replace(/-/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {property.reviewScores.bookingScore && (
                      <div>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(241,236,228,0.5)', marginBottom: '6px' }}>Booking.com</p>
                        <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '2.25rem', color: 'var(--color-machair-sand)', lineHeight: 1 }}>
                          {property.reviewScores.bookingScore.toFixed(1)}
                          <span style={{ fontSize: '1rem', color: 'rgba(241,236,228,0.5)' }}>/10</span>
                        </p>
                        {property.reviewScores.bookingCount && (
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(241,236,228,0.5)', marginTop: '4px' }}>
                            {property.reviewScores.bookingCount} reviews
                          </p>
                        )}
                        {property.reviewScores.bookingCategory && (
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(199,228,210,0.8)', marginTop: '4px', textTransform: 'capitalize' }}>
                            {property.reviewScores.bookingCategory.replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>
                    )}
                    {property.reviewScores.googleScore && (
                      <div>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(241,236,228,0.5)', marginBottom: '6px' }}>Google</p>
                        <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '2.25rem', color: 'var(--color-machair-sand)', lineHeight: 1 }}>
                          {property.reviewScores.googleScore.toFixed(1)}
                          <span style={{ fontSize: '1rem', color: 'rgba(241,236,228,0.5)' }}>/5</span>
                        </p>
                        {property.reviewScores.googleCount && (
                          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(241,236,228,0.5)', marginTop: '4px' }}>
                            {property.reviewScores.googleCount} reviews
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {property.reviewThemes && property.reviewThemes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                    {property.reviewThemes.map((theme: string, i: number) => (
                      <span key={i} style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        color: 'var(--color-machair-sand)',
                        border: '1px solid rgba(241,236,228,0.25)',
                        padding: '5px 10px',
                        textTransform: 'uppercase',
                      }}>
                        {theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                )}

                {property.reviewHighlights && property.reviewHighlights.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {property.reviewHighlights.map((highlight: ReviewHighlight, i: number) => (
                      <div key={i} style={{ borderLeft: '2px solid rgba(241,236,228,0.2)', paddingLeft: '16px' }}>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-machair-sand)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '8px' }}>
                          &quot;{highlight.quote}&quot;
                        </p>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(241,236,228,0.5)' }}>
                          — {highlight.source}
                          {highlight.rating && <span style={{ marginLeft: '10px', color: 'rgba(199,228,210,0.7)' }}>{highlight.rating}/5</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {property.totalReviewCount && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(241,236,228,0.4)', marginTop: '24px', letterSpacing: '0.04em' }}>
                    {property.totalReviewCount} verified reviews across all platforms
                  </p>
                )}
              </section>
            )}

            {/* GOOGLE REVIEWS */}
            {(property.googleBusinessUrl || property.googlePlaceId) && (
              <div style={{ marginTop: '44px' }}>
                <GoogleReviewsClient
                  googleBusinessUrl={property.googleBusinessUrl}
                  googlePlaceId={property.googlePlaceId}
                  propertyName={property.name}
                />
              </div>
            )}

            {/* LOCATION */}
            {(property.locationIntro || property.nearbyAttractions?.length || property.whatToDoNearby?.length) && (
              <section style={sectionDivider}>
                <SectionHeading label="Where you are" title="Location" />
                {property.locationIntro && (
                  <div style={{ marginBottom: '20px' }}>
                    <PortableText value={property.locationIntro} components={portableTextComponents} />
                  </div>
                )}
                {property.nearbyAttractions && property.nearbyAttractions.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '10px' }}>What&apos;s nearby</p>
                    <ArrayField items={property.nearbyAttractions} />
                  </div>
                )}
                {property.whatToDoNearby && property.whatToDoNearby.length > 0 && (
                  <div>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '10px' }}>What to do nearby</p>
                    <ArrayField items={property.whatToDoNearby} />
                  </div>
                )}
              </section>
            )}

            {/* GETTING HERE */}
            {(property.gettingHereIntro || property.postcode || property.directions ||
              property.ferryInfo || property.airportDistance || property.portDistance ||
              property.latitude || property.longitude || property.location) && (
              <section style={sectionDivider}>
                <SectionHeading label="Travel" title="Getting Here" />
                {property.gettingHereIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '20px' }}>
                    {property.gettingHereIntro}
                  </p>
                )}

                {(property.latitude || property.longitude || property.postcode || property.location) && (
                  <div style={{ marginBottom: '24px' }}>
                    <GoogleMap
                      latitude={property.latitude}
                      longitude={property.longitude}
                      postcode={property.postcode}
                      location={property.location}
                      name={property.name}
                      height="420px"
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65 }}>
                  {property.postcode && (
                    <p><span style={{ opacity: 0.55 }}>Postcode —</span> {property.postcode}</p>
                  )}
                  {property.airportDistance && (
                    <p><span style={{ opacity: 0.55 }}>Airport —</span> {property.airportDistance}</p>
                  )}
                  {property.portDistance && (
                    <p><span style={{ opacity: 0.55 }}>Ferry port —</span> {property.portDistance}</p>
                  )}
                </div>

                {property.directions && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Directions</p>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                      {property.directions}
                    </div>
                  </div>
                )}
                {property.ferryInfo && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Ferry information</p>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                      {property.ferryInfo}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* PET POLICY */}
            {(property.petFriendly !== undefined || property.petPolicyIntro || property.petPolicyDetails?.length) && (
              <section style={sectionDivider}>
                <SectionHeading label="Bringing a dog?" title="Pet Policy" />
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '16px' }}>
                  <span style={{ opacity: 0.55 }}>Pet friendly —</span> {property.petFriendly ? 'Yes, pets are welcome.' : 'We do not accept pets.'}
                </p>
                {dogFriendlyBlock?.teaserContent && dogFriendlyBlock.teaserContent.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <PortableText value={dogFriendlyBlock.teaserContent} components={portableTextComponents} />
                  </div>
                )}
                {property.petPolicyIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '12px' }}>
                    {property.petPolicyIntro}
                  </p>
                )}
                {property.petPolicyDetails && property.petPolicyDetails.length > 0 && (
                  <ArrayField items={property.petPolicyDetails} />
                )}
              </section>
            )}

            {/* HOUSE RULES & POLICIES */}
            {(property.policiesIntro || property.checkInTime || property.checkOutTime || property.minimumStay ||
              property.cancellationPolicy || property.paymentTerms || property.securityDeposit ||
              property.licensingStatus || property.licenseNumber || property.licenseNotes ||
              property.availabilityStatus || property.importantInfo?.length) && (
              <section style={sectionDivider}>
                <SectionHeading label="Good to know" title="House Rules" />
                {property.policiesIntro && (
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginBottom: '20px' }}>
                    {property.policiesIntro}
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65 }}>
                  {property.checkInTime && (
                    <p><span style={{ opacity: 0.55 }}>Check-in —</span> {property.checkInTime}</p>
                  )}
                  {property.checkOutTime && (
                    <p><span style={{ opacity: 0.55 }}>Check-out —</span> {property.checkOutTime}</p>
                  )}
                  {property.minimumStay && (
                    <p><span style={{ opacity: 0.55 }}>Minimum stay —</span> {property.minimumStay} {property.minimumStay === 1 ? 'night' : 'nights'}</p>
                  )}
                  {property.availabilityStatus && (
                    <p>
                      <span style={{ opacity: 0.55 }}>Status —</span>{' '}
                      <span style={{ color: property.availabilityStatus === 'bookable' ? 'var(--color-kelp-edge)' : 'inherit' }}>
                        {property.availabilityStatus === 'bookable' && 'Bookable'}
                        {property.availabilityStatus === 'enquiries' && 'Enquiries Only'}
                        {property.availabilityStatus === 'coming-soon' && 'Coming Soon'}
                        {property.availabilityStatus === 'unavailable' && 'Unavailable'}
                      </span>
                    </p>
                  )}
                  {property.securityDeposit && (
                    <p><span style={{ opacity: 0.55 }}>Security deposit —</span> {property.securityDeposit}</p>
                  )}
                </div>
                {property.cancellationPolicy && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Cancellation policy</p>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{property.cancellationPolicy}</div>
                  </div>
                )}
                {property.paymentTerms && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Payment terms</p>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{property.paymentTerms}</div>
                  </div>
                )}
                {(property.licensingStatus || property.licenseNumber) && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Short term let licence</p>
                    {property.licensingStatus && (
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.65 }}>
                        {property.licensingStatus === 'approved' && 'Approved'}
                        {property.licensingStatus === 'pending-bookable' && 'Pending — Bookable'}
                        {property.licensingStatus === 'pending-enquiries' && 'Pending — Enquiries Only'}
                        {property.licensingStatus === 'coming-soon' && 'Coming Soon'}
                      </p>
                    )}
                    {property.licenseNumber && (
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, marginTop: '4px' }}>Licence: {property.licenseNumber}</p>
                    )}
                    {property.licenseNotes && (
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.6, marginTop: '8px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{property.licenseNotes}</p>
                    )}
                  </div>
                )}
                {property.importantInfo && property.importantInfo.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '8px' }}>Important information</p>
                    {property.importantInfo.map((info: string, idx: number) => (
                      <div key={idx} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', lineHeight: 1.65, whiteSpace: 'pre-line', marginBottom: '8px' }}>{info}</div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* COMMON QUESTIONS */}
            {property.commonQuestions && property.commonQuestions.length > 0 && (
              <section id="common-questions" style={sectionDivider}>
                <SectionHeading label="FAQ" title={`Common Questions About ${property.name}`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {property.commonQuestions.map((qa: { question: string; answer: string }, index: number) => (
                    <div key={index} style={{ borderLeft: '3px solid var(--color-kelp-edge)', paddingLeft: '20px', paddingTop: '4px', paddingBottom: '4px' }}>
                      <h3 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-harbour-stone)', marginBottom: '8px', lineHeight: 1.2 }}>
                        {qa.question}
                      </h3>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', lineHeight: 1.65 }}>
                        {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>

                {property.faqCrossLinks && property.faqCrossLinks.length > 0 && (
                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-washed-timber)' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.6 }}>
                      {property.faqCrossLinks.map((link: { text: string; property: { slug: { current: string } } }, i: number) => (
                        <span key={i}>
                          {i > 0 && ' · '}
                          <Link
                            href={`/accommodation/${link.property?.slug?.current}#common-questions`}
                            style={{ color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                          >
                            {link.text}
                          </Link>
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* GALLERY — REMAINING IMAGES */}
            {galleryImages.length > 4 && (
              <section style={sectionDivider}>
                <SectionHeading label="Photography" title="Gallery" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {galleryImages.slice(4).map((image: unknown, index: number) => (
                    <div key={index} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                      <Image
                        src={urlFor(image as any).width(800).height(600).url()}
                        alt={(image as any)?.alt || `${property.name} — ${index + 5}`}
                        fill
                        className="object-cover"
                      />
                      {(image as any)?.caption && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(43,44,46,0.65)', color: 'var(--color-sea-spray)', fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', padding: '8px 12px' }}>
                          {(image as any).caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* OTHER ACCOMMODATION */}
            {otherProperties.length > 0 && (
              <section style={{ ...sectionDivider, marginTop: '60px' }}>
                <SectionHeading label="Also on Islay" title="Our Other Accommodation" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {otherProperties.map((otherProperty: unknown) => {
                    const p = otherProperty as any;
                    const imageUrl = p.heroImage
                      ? urlFor(p.heroImage).width(800).height(1200).url()
                      : '';
                    return (
                      <PropertyCard
                        key={p._id}
                        name={p.name}
                        location={p.location}
                        description={p.description}
                        sleeps={p.sleeps}
                        bedrooms={p.bedrooms}
                        imageUrl={imageUrl}
                        href={`/accommodation/${p.slug?.current || p.slug}`}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* EXPLORE ISLAY LINKS */}
            <section style={{ ...sectionDivider, marginTop: '40px' }}>
              <SectionHeading label="Discover" title="Explore Islay" />
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: '/explore-islay/islay-distilleries', text: 'Whisky Distilleries — all 10, including Bruichladdich a 5-minute walk away' },
                  { href: '/explore-islay/islay-beaches', text: 'Beaches — Portbahn Beach, Machir Bay, Singing Sands and more' },
                  { href: '/explore-islay/islay-wildlife', text: 'Wildlife & Nature — barnacle geese, eagles, seals, RSPB reserves' },
                  { href: '/explore-islay/food-and-drink', text: 'Food & Drink — restaurants, distillery cafés, local seafood' },
                  { href: '/explore-islay/visit-jura', text: 'Visiting Jura — day trips and longer stays on Islay\'s wilder neighbour' },
                  { href: '/islay-travel', text: 'Getting to Islay — ferry from Kennacraig, flights from Glasgow' },
                ].map(({ href, text }) => (
                  <li key={href} style={{ listStyle: 'none' }}>
                    <Link
                      href={href}
                      className="hover-fade"
                      style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '3px', lineHeight: 1.6 }}
                    >
                      {text} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

          </div>
          {/* END LEFT CONTENT COLUMN */}

          {/* ── RIGHT STICKY SIDEBAR ─────────────────────────────── */}
          <div className="hidden md:block" style={{ paddingTop: '48px' }}>
            {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
              <PropertyCalendar
                propertySlug={property.slug.current}
                propertyId={property.lodgifyPropertyId}
                propertyName={property.name}
                sleeps={property.sleeps}
                weeklyRate={property.weeklyRate}
                dailyRate={property.dailyRate}
                minimumStay={property.minimumStay}
              />
            )}
          </div>
          {/* END STICKY SIDEBAR */}

        </div>
        {/* END TWO-COLUMN GRID */}

        {/* ── MOBILE AVAILABILITY BAR ─────────────────────────── */}
        {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
          <MobileAvailBar
            propertySlug={property.slug.current}
            propertyId={property.lodgifyPropertyId}
            propertyName={property.name}
            sleeps={property.sleeps}
            weeklyRate={property.weeklyRate}
            dailyRate={property.dailyRate}
            minimumStay={property.minimumStay}
          />
        )}

      </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return {
      title: 'Property not found',
    };
  }

  return {
    title: property.seoTitle || property.name,
    description: property.seoDescription || property.overviewIntro,
    openGraph: {
      title: property.seoTitle || property.name,
      description: property.seoDescription || property.overviewIntro,
      images: property.heroImage ? [urlFor(property.heroImage).width(1200).height(630).url()] : [],
    },
  };
}
