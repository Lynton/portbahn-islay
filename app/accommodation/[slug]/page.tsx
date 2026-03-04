import { cache } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { portableTextComponents } from '@/lib/portable-text';
import PropertyCalendar from '@/components/PropertyCalendar';
import SchemaMarkup from '@/components/SchemaMarkup';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyCard from '@/components/PropertyCard';
import GoogleMap from '@/components/GoogleMap';
import GoogleReviewsClient from '@/components/GoogleReviewsClient';
import PropertyHostTrustTransfer from '@/components/PropertyHostTrustTransfer';

// TypeScript types
interface MagicMoment { moment: string; frequency?: string; }
interface PerfectFor { guestType: string; why: string; reviewEvidence?: string; }
interface HonestFriction { issue: string; context: string; }
interface ReviewHighlight { quote: string; source: string; rating?: number; }

// Cached fetches
const getProperty = cache(async (slug: string) => {
  const query = `*[_type == "property" && slug.current == $slug] | order(_id desc)[0]{
    _id, name, slug, propertyType, heroImage, images[],
    overviewIntro, description, idealFor[],
    propertyNickname, guestSuperlatives[],
    magicMoments[] { moment, frequency },
    perfectFor[] { guestType, why, reviewEvidence },
    honestFriction[] { issue, context },
    ownerContext,
    reviewScores { airbnbScore, airbnbCount, airbnbBadges[], bookingScore, bookingCount, bookingCategory, googleScore, googleCount },
    reviewThemes[], reviewHighlights[] { quote, source, rating }, totalReviewCount,
    entityFraming { whatItIs, whatItIsNot, primaryDifferentiator, category },
    commonQuestions[] { question, answer },
    trustSignals { ownership, established, guestExperience, localCredentials },
    sleeps, bedrooms, beds, bathrooms,
    sleepingIntro, bedroomDetails[], bathroomDetails[],
    facilitiesIntro, kitchenDining[], kitchenDiningNotes[], livingAreas[], livingAreasNotes[],
    heatingCooling[], heatingCoolingNotes[], entertainment[], entertainmentNotes[],
    laundryFacilities[], safetyFeatures[],
    outdoorIntro, outdoorFeatures[], outdoorFeaturesNotes[], parkingInfo,
    petFriendly, petPolicyIntro, petPolicyDetails[],
    locationIntro, location, nearbyAttractions[], whatToDoNearby[],
    gettingHereIntro, postcode, latitude, longitude, directions,
    ferryInfo, airportDistance, portDistance,
    policiesIntro, checkInTime, checkOutTime, minimumStay,
    cancellationPolicy, paymentTerms, securityDeposit,
    licensingStatus, licenseNumber, licenseNotes, availabilityStatus,
    includedIntro, included[], notIncluded[], importantInfo[],
    dailyRate, weeklyRate, lodgifyPropertyId, lodgifyRoomId, icsUrl,
    seoTitle, seoDescription, googleBusinessUrl, googlePlaceId
  }`;
  return await client.fetch(query, { slug });
});

const getDogFriendlyBlock = cache(async () => {
  const query = `*[_type == "canonicalBlock" && blockId.current == "dog-friendly-properties"][0]{
    title, teaserContent, canonicalHome
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
});

const getAllProperties = cache(async (excludeSlug?: string) => {
  const query = excludeSlug
    ? `*[_type == "property" && slug.current != $excludeSlug] | order(name asc){
        _id, name, slug, location, "description": pt::text(description), sleeps, bedrooms, heroImage
      }`
    : `*[_type == "property"] | order(name asc){
        _id, name, slug, location, "description": pt::text(description), sleeps, bedrooms, heroImage
      }`;
  return await client.fetch(query, excludeSlug ? { excludeSlug } : {});
});

type PageProps = { params: Promise<{ slug: string }> };

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return (
      <main className="min-h-screen bg-sea-spray flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-harbour-stone">Property Not Found</h1>
          <Link href="/accommodation" className="font-mono text-sm text-kelp-edge mt-4 inline-block">
            View all accommodation
          </Link>
        </div>
      </main>
    );
  }

  const dogFriendlyBlock = property.petFriendly ? await getDogFriendlyBlock() : null;
  const otherProperties = await getAllProperties(slug);
  const galleryImages = property.images || [];
  const heroImage = property.heroImage;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Accommodation', href: '/accommodation' },
    { label: property.name, href: `/accommodation/${slug}` },
  ];

  // Extract distillery walk time
  const distilleryWalk = (() => {
    const match = property.nearbyAttractions?.find((a: string) =>
      a.toLowerCase().includes('distillery')
    );
    if (!match) return undefined;
    const timeMatch = match.match(/(\d+)\s*min/i);
    return timeMatch ? `${timeMatch[1]} min walk` : undefined;
  })();

  return (
    <>
      <SchemaMarkup
        type={['Accommodation', 'Place', 'Product', 'BreadcrumbList']}
        data={property}
        breadcrumbs={breadcrumbs}
      />
      <main className="min-h-screen bg-sea-spray">

        {/* ═══════════════════════════════════════════════════
            SECTION 1 — HERO IMAGE (full-bleed, editorial)
        ═══════════════════════════════════════════════════ */}
        {heroImage && (
          <section className="w-full">
            <div className="aspect-[4/3] md:aspect-[16/7] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(heroImage).width(1920).height(960).url()}
                alt={heroImage.alt || `${property.name} — holiday accommodation on the Isle of Islay`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — TITLE + CALENDAR ABOVE THE FOLD
            Two-column: Name/facts left, calendar right
        ═══════════════════════════════════════════════════ */}
        <section className="bg-sea-spray">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 pt-12 pb-16 md:pt-16 md:pb-20">
            <div className="flex flex-col lg:flex-row lg:gap-16">

              {/* Left — Title + Quick Facts */}
              <div className="flex-1 min-w-0">
                {property.propertyNickname && (
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-kelp-edge mb-4">
                    {property.propertyNickname}
                  </p>
                )}
                <h1
                  className="font-serif font-bold text-harbour-stone leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                >
                  {property.name}
                </h1>
                {property.location && (
                  <p className="font-mono text-sm text-harbour-stone/60 mt-3">{property.location}</p>
                )}

                {/* Quick Facts — structured dl for AEO */}
                <dl className="mt-8 grid grid-cols-2 md:flex md:flex-wrap gap-x-8 gap-y-4">
                  {property.sleeps && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-kelp-edge">Sleeps</dt>
                      <dd className="font-mono text-lg text-harbour-stone">{property.sleeps}</dd>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-kelp-edge">Bedrooms</dt>
                      <dd className="font-mono text-lg text-harbour-stone">{property.bedrooms}</dd>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-kelp-edge">Bathrooms</dt>
                      <dd className="font-mono text-lg text-harbour-stone">{property.bathrooms}</dd>
                    </div>
                  )}
                  {property.petFriendly && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-kelp-edge">Pets</dt>
                      <dd className="font-mono text-lg text-harbour-stone">Welcome</dd>
                    </div>
                  )}
                  {distilleryWalk && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-kelp-edge">Distillery</dt>
                      <dd className="font-mono text-lg text-harbour-stone">{distilleryWalk}</dd>
                    </div>
                  )}
                </dl>

                {/* Trust signals — subtle credibility */}
                {(property.trustSignals?.established || property.trustSignals?.ownership) && (
                  <p className="font-mono text-xs text-harbour-stone/50 mt-6">
                    {[property.trustSignals.established, property.trustSignals.ownership, property.trustSignals.guestExperience]
                      .filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              {/* Right — Calendar (immediately visible) */}
              <div className="mt-10 lg:mt-0 lg:w-[380px] flex-shrink-0">
                {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
                  <div className="lg:sticky lg:top-8">
                    <PropertyCalendar
                      propertySlug={property.slug.current}
                      propertyId={property.lodgifyPropertyId}
                      propertyName={property.name}
                      sleeps={property.sleeps}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Breadcrumbs items={breadcrumbs} />

        {/* ═══════════════════════════════════════════════════
            SECTION 3 — THE STORY (editorial overview spread)
            Asymmetric: body left, pull quote right
        ═══════════════════════════════════════════════════ */}
        {(property.overviewIntro || property.description || property.ownerContext) && (
          <section className="bg-machair-sand">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-32">

              {property.overviewIntro && (
                <h2
                  className="font-serif font-bold text-harbour-stone mb-16 max-w-[20ch]"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
                >
                  {property.overviewIntro}
                </h2>
              )}

              <div className="flex flex-col lg:flex-row lg:gap-20">
                {/* Body text — capped reading width */}
                <div className="flex-1 min-w-0 max-w-[720px]">
                  {property.description && (
                    <div className="font-mono text-base text-harbour-stone leading-relaxed [&>p]:mb-6 [&>p]:max-w-[65ch]">
                      <PortableText value={property.description} components={portableTextComponents} />
                    </div>
                  )}

                  {/* Entity framing — editorial definition */}
                  {property.entityFraming?.whatItIs && (
                    <p className="font-mono text-base text-harbour-stone leading-relaxed mt-8 pt-8 border-t border-washed-timber max-w-[65ch]">
                      {property.entityFraming.whatItIs}
                    </p>
                  )}
                </div>

                {/* Pull quote — offset right column */}
                {property.reviewHighlights?.[0] && (
                  <aside className="lg:w-[280px] flex-shrink-0 mt-12 lg:mt-8">
                    <blockquote className="border-l-2 border-kelp-edge pl-6">
                      <p className="font-serif font-bold italic text-harbour-stone text-xl leading-snug">
                        {property.reviewHighlights[0].quote}
                      </p>
                      <footer className="font-mono text-xs text-harbour-stone/60 uppercase tracking-[0.15em] mt-4">
                        {property.reviewHighlights[0].source}
                      </footer>
                    </blockquote>
                  </aside>
                )}
              </div>

              {/* Owner note */}
              {property.ownerContext && (
                <div className="mt-16 pt-12 border-t border-washed-timber max-w-[720px]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                    A note from the owners
                  </p>
                  <p className="font-mono text-sm text-harbour-stone leading-relaxed max-w-[65ch]">
                    {property.ownerContext}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 4 — GALLERY SPREAD
            Magazine-style: alternating sizes, editorial rhythm
        ═══════════════════════════════════════════════════ */}
        {galleryImages.length > 0 && (
          <section className="bg-sea-spray">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-10">
                Gallery
              </p>
              {/* Bento-style: first image large, then 2-up, then full-width, repeating */}
              <div className="flex flex-col gap-4">
                {galleryImages.map((image: unknown, index: number) => {
                  const isFullWidth = index === 0 || index % 3 === 0;
                  if (isFullWidth) {
                    return (
                      <div key={index} className="aspect-[16/9] relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={urlFor(image as any).width(1400).height(788).url()}
                          alt={(image as any)?.alt || `${property.name} — ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {(image as any)?.caption && (
                          <p className="absolute bottom-0 left-0 bg-harbour-stone/80 text-sea-spray font-mono text-xs px-4 py-2">
                            {(image as any).caption}
                          </p>
                        )}
                      </div>
                    );
                  }
                  // Pair images in 2-up layout
                  if (index % 3 === 1) {
                    const nextImage = galleryImages[index + 1] as any;
                    return (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={urlFor(image as any).width(700).height(525).url()}
                            alt={(image as any)?.alt || `${property.name} — ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        {nextImage && (
                          <div className="aspect-[4/3] relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={urlFor(nextImage).width(700).height(525).url()}
                              alt={nextImage?.alt || `${property.name} — ${index + 2}`}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                  // Skip index%3===2 as it's handled by the pair above
                  return null;
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 5 — GUEST EXPERIENCE (magazine feature)
            Full-width sand band with editorial layout
        ═══════════════════════════════════════════════════ */}
        {(property.guestSuperlatives?.length || property.magicMoments?.length || property.perfectFor?.length) && (
          <section className="bg-machair-sand">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                Guest Experience
              </p>
              <h2
                className="font-serif font-bold text-harbour-stone mb-16 max-w-[20ch]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                What it feels like to stay
              </h2>

              <div className="flex flex-col lg:flex-row lg:gap-20">
                {/* Left column — superlatives and magic moments */}
                <div className="flex-1 min-w-0 max-w-[720px]">
                  {/* Guest Superlatives */}
                  {property.guestSuperlatives && property.guestSuperlatives.length > 0 && (
                    <div className="mb-12">
                      {property.guestSuperlatives.map((quote: string, i: number) => (
                        <p key={i} className="font-serif font-bold italic text-harbour-stone text-xl leading-snug mb-6">
                          &quot;{quote}&quot;
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Magic Moments */}
                  {property.magicMoments && property.magicMoments.length > 0 && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-6">
                        Moments worth waiting for
                      </p>
                      <div className="flex flex-col gap-6">
                        {property.magicMoments.map((moment: MagicMoment, i: number) => (
                          <div key={i} className="border-l-2 border-kelp-edge pl-6">
                            <p className="font-mono text-base text-harbour-stone">{moment.moment}</p>
                            {moment.frequency && (
                              <p className="font-mono text-xs text-harbour-stone/50 mt-1">{moment.frequency}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column — Perfect For */}
                {property.perfectFor && property.perfectFor.length > 0 && (
                  <aside className="lg:w-[320px] flex-shrink-0 mt-12 lg:mt-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-6">
                      Perfect for
                    </p>
                    <div className="flex flex-col gap-8">
                      {property.perfectFor.map((item: PerfectFor, i: number) => (
                        <div key={i}>
                          <h3 className="font-serif font-bold text-lg text-harbour-stone mb-2">{item.guestType}</h3>
                          <p className="font-mono text-sm text-harbour-stone leading-relaxed">{item.why}</p>
                        </div>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 6 — REVIEWS (social proof strip)
        ═══════════════════════════════════════════════════ */}
        {(property.reviewScores || property.reviewHighlights?.length) && (
          <section className="bg-harbour-stone text-sea-spray">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">

              {/* Score cards — large typography */}
              {property.reviewScores && (
                <div className="flex flex-wrap gap-12 md:gap-20 mb-16">
                  {property.reviewScores.airbnbScore && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sea-spray/50 mb-2">Airbnb</p>
                      <p className="font-serif font-bold text-sea-spray" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
                        {property.reviewScores.airbnbScore.toFixed(1)}
                      </p>
                      {property.reviewScores.airbnbCount && (
                        <p className="font-mono text-xs text-sea-spray/50 mt-1">{property.reviewScores.airbnbCount} reviews</p>
                      )}
                    </div>
                  )}
                  {property.reviewScores.bookingScore && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sea-spray/50 mb-2">Booking.com</p>
                      <p className="font-serif font-bold text-sea-spray" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
                        {property.reviewScores.bookingScore.toFixed(1)}
                      </p>
                      {property.reviewScores.bookingCount && (
                        <p className="font-mono text-xs text-sea-spray/50 mt-1">{property.reviewScores.bookingCount} reviews</p>
                      )}
                    </div>
                  )}
                  {property.reviewScores.googleScore && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sea-spray/50 mb-2">Google</p>
                      <p className="font-serif font-bold text-sea-spray" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
                        {property.reviewScores.googleScore.toFixed(1)}
                      </p>
                      {property.reviewScores.googleCount && (
                        <p className="font-mono text-xs text-sea-spray/50 mt-1">{property.reviewScores.googleCount} reviews</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Review highlights — editorial quotes */}
              {property.reviewHighlights && property.reviewHighlights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {property.reviewHighlights.slice(0, 4).map((highlight: ReviewHighlight, i: number) => (
                    <blockquote key={i} className="border-l border-sea-spray/20 pl-6">
                      <p className="font-serif font-bold italic text-sea-spray text-lg leading-snug">
                        {highlight.quote}
                      </p>
                      <footer className="font-mono text-xs text-sea-spray/50 uppercase tracking-[0.15em] mt-3">
                        {highlight.source}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Google Reviews */}
        {(property.googleBusinessUrl || property.googlePlaceId) && (
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-12">
            <GoogleReviewsClient
              googleBusinessUrl={property.googleBusinessUrl}
              googlePlaceId={property.googlePlaceId}
              propertyName={property.name}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 7 — THE SPACES (sleeping, facilities, outdoor)
            Two-column editorial: grouped, not bullet soup
        ═══════════════════════════════════════════════════ */}
        {(property.sleepingIntro || property.bedroomDetails?.length || property.facilitiesIntro || property.kitchenDining?.length || property.outdoorIntro || property.outdoorFeatures?.length) && (
          <section className="bg-sea-spray">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                The Spaces
              </p>
              <h2
                className="font-serif font-bold text-harbour-stone mb-16 max-w-[20ch]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                Inside {'&'} out
              </h2>

              {/* Two-column editorial grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16">

                {/* Sleeping */}
                {(property.sleepingIntro || property.bedroomDetails?.length) && (
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                      Sleeping Arrangements
                    </h3>
                    {property.sleepingIntro && (
                      <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-4">{property.sleepingIntro}</p>
                    )}
                    {property.bedroomDetails?.map((detail: string, i: number) => (
                      <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {detail}
                      </p>
                    ))}
                    {property.bathroomDetails?.map((detail: string, i: number) => (
                      <p key={`bath-${i}`} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {detail}
                      </p>
                    ))}
                  </div>
                )}

                {/* Kitchen & Living */}
                {(property.kitchenDining?.length || property.livingAreas?.length) && (
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                      Kitchen {'&'} Living
                    </h3>
                    {property.facilitiesIntro && (
                      <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-4">{property.facilitiesIntro}</p>
                    )}
                    {property.kitchenDining?.map((item: string, i: number) => (
                      <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {item}
                      </p>
                    ))}
                    {property.livingAreas?.map((item: string, i: number) => (
                      <p key={`living-${i}`} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {item}
                      </p>
                    ))}
                  </div>
                )}

                {/* Outdoor */}
                {(property.outdoorIntro || property.outdoorFeatures?.length) && (
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                      Outdoors
                    </h3>
                    {property.outdoorIntro && (
                      <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-4">{property.outdoorIntro}</p>
                    )}
                    {property.outdoorFeatures?.map((item: string, i: number) => (
                      <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {item}
                      </p>
                    ))}
                    {property.parkingInfo && (
                      <p className="font-mono text-sm text-harbour-stone leading-relaxed mt-4">{property.parkingInfo}</p>
                    )}
                  </div>
                )}

                {/* Heating, Entertainment, Laundry */}
                {(property.heatingCooling?.length || property.entertainment?.length || property.laundryFacilities?.length) && (
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                      Comforts {'&'} Utilities
                    </h3>
                    {property.heatingCooling?.map((item: string, i: number) => (
                      <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {item}
                      </p>
                    ))}
                    {property.entertainment?.map((item: string, i: number) => (
                      <p key={`ent-${i}`} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {item}
                      </p>
                    ))}
                    {property.laundryFacilities?.map((item: string, i: number) => (
                      <p key={`laundry-${i}`} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 8 — THINGS TO KNOW (honest, grouped)
            Alternating sand/white bands continue
        ═══════════════════════════════════════════════════ */}
        {(property.honestFriction?.length || property.includedIntro || property.included?.length || property.importantInfo?.length) && (
          <section className="bg-machair-sand">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                Good to know
              </p>
              <h2
                className="font-serif font-bold text-harbour-stone mb-16 max-w-[20ch]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                Before you book
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                {/* Honest friction */}
                {property.honestFriction && property.honestFriction.length > 0 && (
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-6">
                      Things to know
                    </h3>
                    {property.honestFriction.map((friction: HonestFriction, i: number) => (
                      <div key={i} className="mb-6">
                        <p className="font-mono text-sm font-semibold text-harbour-stone mb-1">{friction.issue}</p>
                        <p className="font-mono text-sm text-harbour-stone/70 leading-relaxed">{friction.context}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Included / Not included */}
                {(property.included?.length || property.notIncluded?.length) && (
                  <div>
                    {property.included && property.included.length > 0 && (
                      <div className="mb-8">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">Included</h3>
                        {property.included.map((item: string, i: number) => (
                          <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-kelp-edge pl-4 mb-2">
                            {item}
                          </p>
                        ))}
                      </div>
                    )}
                    {property.notIncluded && property.notIncluded.length > 0 && (
                      <div>
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-harbour-stone/50 mb-4">Not included</h3>
                        {property.notIncluded.map((item: string, i: number) => (
                          <p key={i} className="font-mono text-sm text-harbour-stone/50 leading-relaxed pl-4 mb-2">
                            {item}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Important info */}
                {property.importantInfo && property.importantInfo.length > 0 && (
                  <div className="lg:col-span-2">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">Important</h3>
                    {property.importantInfo.map((info: string, i: number) => (
                      <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed mb-2">{info}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 9 — COMMON QUESTIONS (FAQ)
        ═══════════════════════════════════════════════════ */}
        {property.commonQuestions && property.commonQuestions.length > 0 && (
          <section id="common-questions" className="bg-sea-spray">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                FAQ
              </p>
              <h2
                className="font-serif font-bold text-harbour-stone mb-16"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                Common Questions
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
                {property.commonQuestions.map((qa: { question: string; answer: string }, i: number) => (
                  <div key={i}>
                    <h3 className="font-serif font-bold text-lg text-harbour-stone mb-2">{qa.question}</h3>
                    <p className="font-mono text-sm text-harbour-stone leading-relaxed">{qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 10 — LOCATION (map + getting here)
        ═══════════════════════════════════════════════════ */}
        {(property.locationIntro || property.latitude || property.nearbyAttractions?.length) && (
          <section className="bg-machair-sand">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                Location
              </p>
              <h2
                className="font-serif font-bold text-harbour-stone mb-16 max-w-[20ch]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                Finding {property.name}
              </h2>

              <div className="flex flex-col lg:flex-row lg:gap-20">
                {/* Map */}
                {(property.latitude || property.longitude || property.postcode) && (
                  <div className="flex-1 min-w-0 mb-12 lg:mb-0">
                    <GoogleMap
                      latitude={property.latitude}
                      longitude={property.longitude}
                      postcode={property.postcode}
                      location={property.location}
                      name={property.name}
                      height="400px"
                    />
                  </div>
                )}

                {/* Getting here details */}
                <div className="lg:w-[360px] flex-shrink-0">
                  {property.gettingHereIntro && (
                    <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-6">{property.gettingHereIntro}</p>
                  )}
                  {property.postcode && (
                    <p className="font-mono text-sm text-harbour-stone mb-4">
                      <span className="text-kelp-edge">Postcode</span> — {property.postcode}
                    </p>
                  )}
                  {property.directions && (
                    <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-4 whitespace-pre-line">{property.directions}</p>
                  )}
                  {property.ferryInfo && (
                    <div className="pt-4 border-t border-washed-timber mt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-2">Ferry</p>
                      <p className="font-mono text-sm text-harbour-stone leading-relaxed whitespace-pre-line">{property.ferryInfo}</p>
                    </div>
                  )}
                  <div className="flex gap-8 mt-6 pt-4 border-t border-washed-timber">
                    {property.airportDistance && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-1">Airport</p>
                        <p className="font-mono text-sm text-harbour-stone">{property.airportDistance}</p>
                      </div>
                    )}
                    {property.portDistance && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-1">Port</p>
                        <p className="font-mono text-sm text-harbour-stone">{property.portDistance}</p>
                      </div>
                    )}
                  </div>

                  {/* Nearby attractions */}
                  {property.nearbyAttractions && property.nearbyAttractions.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-washed-timber">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">Nearby</p>
                      {property.nearbyAttractions.map((attraction: string, i: number) => (
                        <p key={i} className="font-mono text-sm text-harbour-stone mb-2">{attraction}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 11 — PET POLICY (if applicable)
        ═══════════════════════════════════════════════════ */}
        {(property.petFriendly || property.petPolicyIntro) && (
          <section className="bg-sea-spray">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <div className="max-w-[720px]">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                  {property.petFriendly ? 'Dogs welcome' : 'Pet policy'}
                </p>
                <h2
                  className="font-serif font-bold text-harbour-stone mb-8"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
                >
                  Bringing your dog to Islay
                </h2>
                {dogFriendlyBlock?.teaserContent && dogFriendlyBlock.teaserContent.length > 0 && (
                  <div className="font-mono text-sm text-harbour-stone leading-relaxed [&>p]:mb-4 [&>p]:max-w-[65ch] mb-6">
                    <PortableText value={dogFriendlyBlock.teaserContent} components={portableTextComponents} />
                  </div>
                )}
                {property.petPolicyIntro && (
                  <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-4">{property.petPolicyIntro}</p>
                )}
                {property.petPolicyDetails?.map((detail: string, i: number) => (
                  <p key={i} className="font-mono text-sm text-harbour-stone leading-relaxed border-l border-washed-timber pl-4 mb-3">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 12 — HOUSE RULES + PRICING (compact)
        ═══════════════════════════════════════════════════ */}
        {(property.checkInTime || property.cancellationPolicy || property.dailyRate) && (
          <section className="bg-machair-sand">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-12">

                {/* Pricing */}
                {(property.dailyRate || property.weeklyRate) && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">Pricing</p>
                    {property.dailyRate && (
                      <p className="font-serif font-bold text-harbour-stone mb-1" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
                        {'£'}{property.dailyRate}
                        <span className="font-mono text-sm text-harbour-stone/50 ml-2">/ night</span>
                      </p>
                    )}
                    {property.weeklyRate && (
                      <p className="font-mono text-sm text-harbour-stone/70 mt-2">
                        {'£'}{property.weeklyRate} / week
                      </p>
                    )}
                  </div>
                )}

                {/* Check in/out */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">Times</p>
                  <dl className="flex flex-col gap-3">
                    {property.checkInTime && (
                      <div>
                        <dt className="font-mono text-xs text-harbour-stone/50">Check-in</dt>
                        <dd className="font-mono text-sm text-harbour-stone">{property.checkInTime}</dd>
                      </div>
                    )}
                    {property.checkOutTime && (
                      <div>
                        <dt className="font-mono text-xs text-harbour-stone/50">Check-out</dt>
                        <dd className="font-mono text-sm text-harbour-stone">{property.checkOutTime}</dd>
                      </div>
                    )}
                    {property.minimumStay && (
                      <div>
                        <dt className="font-mono text-xs text-harbour-stone/50">Minimum stay</dt>
                        <dd className="font-mono text-sm text-harbour-stone">{property.minimumStay} {property.minimumStay === 1 ? 'night' : 'nights'}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Policies */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">Policies</p>
                  {property.cancellationPolicy && (
                    <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-3 whitespace-pre-line">{property.cancellationPolicy}</p>
                  )}
                  {property.paymentTerms && (
                    <p className="font-mono text-sm text-harbour-stone leading-relaxed mb-3 whitespace-pre-line">{property.paymentTerms}</p>
                  )}
                  {property.securityDeposit && (
                    <p className="font-mono text-sm text-harbour-stone/70 mt-2">{property.securityDeposit}</p>
                  )}
                  {property.licenseNumber && (
                    <p className="font-mono text-xs text-harbour-stone/40 mt-4">License: {property.licenseNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trust Transfer */}
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-12">
          <PropertyHostTrustTransfer
            reviews={property.reviewHighlights || []}
            totalReviewCount={property.totalReviewCount || 0}
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 13 — OTHER PROPERTIES + EXPLORE ISLAY
        ═══════════════════════════════════════════════════ */}
        {otherProperties.length > 0 && (
          <section className="bg-sea-spray">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
                Also available
              </p>
              <h2
                className="font-serif font-bold text-harbour-stone mb-12"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                Our other places
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProperties.map((p: any) => {
                  const imageUrl = p.heroImage ? urlFor(p.heroImage).width(800).height(1200).url() : '';
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
            </div>
          </section>
        )}

        {/* Explore Islay links */}
        <section className="bg-machair-sand">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-kelp-edge mb-4">
              While you&apos;re here
            </p>
            <h2
              className="font-serif font-bold text-harbour-stone mb-12"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
            >
              Explore Islay
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
              {[
                { href: '/explore-islay/islay-distilleries', label: 'Whisky Distilleries', desc: 'All 10, including Bruichladdich nearby' },
                { href: '/explore-islay/islay-beaches', label: 'Beaches', desc: 'Portbahn Beach, Machir Bay, Singing Sands' },
                { href: '/explore-islay/islay-wildlife', label: 'Wildlife & Nature', desc: 'Eagles, seals, barnacle geese, RSPB reserves' },
                { href: '/explore-islay/food-and-drink', label: 'Food & Drink', desc: 'Restaurants, distillery cafes, local seafood' },
                { href: '/explore-islay/visit-jura', label: 'Visiting Jura', desc: 'Day trips to Islay\'s wilder neighbour' },
                { href: '/islay-travel', label: 'Getting to Islay', desc: 'Ferry from Kennacraig, flights from Glasgow' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="group block">
                  <p className="font-serif font-bold text-lg text-harbour-stone group-hover:text-kelp-edge transition-colors">
                    {link.label}
                  </p>
                  <p className="font-mono text-xs text-harbour-stone/50 mt-1">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: 'Property not found' };
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
