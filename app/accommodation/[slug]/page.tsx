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
import PropertyGallery from '@/components/PropertyGallery';

interface MagicMoment { moment: string; frequency?: string; }
interface PerfectFor { guestType: string; why: string; reviewEvidence?: string; }
interface HonestFriction { issue: string; context: string; }
interface ReviewHighlight { quote: string; source: string; rating?: number; }

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
        _id, name, slug, location, overviewIntro, sleeps, bedrooms, heroImage
      }`
    : `*[_type == "property"] | order(name asc){
        _id, name, slug, location, overviewIntro, sleeps, bedrooms, heroImage
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
    { name: 'Home', url: '/' },
    { name: 'Accommodation', url: '/accommodation' },
    { name: property.name, url: `/accommodation/${slug}` },
  ];

  // Build gallery data for the client component
  const galleryData = galleryImages.map((img: any, i: number) => ({
    url: urlFor(img).width(1400).height(940).url(),
    thumb: urlFor(img).width(200).height(134).url(),
    alt: img?.alt || `${property.name} — ${i + 1}`,
    caption: img?.caption || undefined,
  }));

  // Inline images to weave through content sections
  const inlineImg = (index: number, aspect: string = 'aspect-[3/2]') => {
    const img = galleryImages[index];
    if (!img) return null;
    return (
      <figure className={`${aspect} relative overflow-hidden my-16`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlFor(img).width(1200).height(800).url()}
          alt={(img as any)?.alt || `${property.name}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {(img as any)?.caption && (
          <figcaption className="absolute bottom-0 left-0 right-0 bg-harbour-stone/70 px-6 py-3">
            <p className="font-mono text-xs text-sea-spray">{(img as any).caption}</p>
          </figcaption>
        )}
      </figure>
    );
  };

  return (
    <>
      <SchemaMarkup
        type={['Accommodation', 'Place', 'Product', 'BreadcrumbList']}
        data={property}
        breadcrumbs={breadcrumbs}
      />
      <main className="min-h-screen bg-sea-spray">

        {/* ═══════════════════════════════════════════════════════
            CHAPTER 1 — ARRIVAL
            Full-bleed hero, then vast whitespace with sculptural title
        ═══════════════════════════════════════════════════════ */}
        {heroImage && (
          <section className="w-full">
            <div className="aspect-[4/3] md:aspect-[21/9] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(heroImage).width(1920).height(820).url()}
                alt={heroImage.alt || `${property.name} — holiday accommodation on the Isle of Islay`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </section>
        )}

        {/* Title block — extreme whitespace, sculptural type */}
        <section className="bg-sea-spray">
          <div className="px-6 md:px-16 lg:px-24 pt-20 md:pt-32 pb-6">
            {property.propertyNickname && (
              <p className="font-mono text-kelp-edge mb-6" style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                {property.propertyNickname}
              </p>
            )}
            <h1
              className="font-serif font-bold text-harbour-stone"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
            >
              {property.name}
            </h1>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            MAIN CONTENT + STICKY CALENDAR RAIL
            Two-column from this point: wide content left, narrow calendar right
        ═══════════════════════════════════════════════════════ */}
        <div className="lg:flex lg:items-start">

          {/* ── Content column ── */}
          <div className="flex-1 min-w-0">

            {/* Quick facts + location line */}
            <section className="bg-sea-spray">
              <div className="px-6 md:px-16 lg:px-24 pt-6 pb-20 md:pb-32">
                {property.location && (
                  <p className="font-mono text-harbour-stone/50 mb-10" style={{ fontSize: '13px' }}>{property.location}</p>
                )}
                <dl className="flex flex-wrap gap-x-12 gap-y-4">
                  {[
                    property.sleeps && { label: 'Sleeps', value: String(property.sleeps) },
                    property.bedrooms && { label: 'Bedrooms', value: String(property.bedrooms) },
                    property.bathrooms && { label: 'Bathrooms', value: String(property.bathrooms) },
                    property.petFriendly && { label: 'Pets', value: 'Welcome' },
                  ].filter(Boolean).map((fact: any, i: number) => (
                    <div key={i} className={i > 0 ? 'border-l border-washed-timber pl-12' : ''}>
                      <dt className="font-mono text-kelp-edge" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{fact.label}</dt>
                      <dd className="font-mono text-harbour-stone text-lg mt-1">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <Breadcrumbs items={breadcrumbs} />

            {/* ═══════════════════════════════════════════════════
                CHAPTER 2 — THE STORY
                Warm sand band. Asymmetric text with inline image.
            ═══════════════════════════════════════════════════ */}
            {(property.overviewIntro || property.description) && (
              <section className="bg-machair-sand">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">

                  {property.overviewIntro && (
                    <h2
                      className="font-serif font-bold text-harbour-stone max-w-[18ch] mb-20"
                      style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}
                    >
                      {property.overviewIntro}
                    </h2>
                  )}

                  <div className="max-w-[680px]">
                    {property.description && (
                      <div className="font-mono text-harbour-stone leading-relaxed [&>p]:mb-6 [&>p]:max-w-[62ch]" style={{ fontSize: '15px' }}>
                        <PortableText value={property.description} components={portableTextComponents} />
                      </div>
                    )}

                    {property.entityFraming?.whatItIs && (
                      <p className="font-mono text-harbour-stone/70 mt-10 pt-8 border-t border-washed-timber max-w-[62ch]" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                        {property.entityFraming.whatItIs}
                      </p>
                    )}
                  </div>

                  {/* Inline image from gallery — woven into the narrative */}
                  {inlineImg(1, 'aspect-[16/10]')}

                  {/* Pull quote */}
                  {property.reviewHighlights?.[0] && (
                    <blockquote className="mt-8 max-w-[540px] ml-auto mr-0">
                      <p className="font-serif font-bold italic text-harbour-stone" style={{ fontSize: 'clamp(1.3rem, 2vw, 1.75rem)', lineHeight: 1.25 }}>
                        {'\u201C'}{property.reviewHighlights[0].quote}{'\u201D'}
                      </p>
                      <footer className="font-mono text-kelp-edge mt-4" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        {property.reviewHighlights[0].source}
                      </footer>
                    </blockquote>
                  )}

                  {/* Owner note */}
                  {property.ownerContext && (
                    <div className="mt-20 pt-12 border-t border-washed-timber max-w-[580px]">
                      <p className="font-mono text-kelp-edge mb-5" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                        A note from the owners
                      </p>
                      <p className="font-mono text-harbour-stone/80 max-w-[55ch]" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                        {property.ownerContext}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 3 — GALLERY
                Art gallery: large featured image + thumbnail strip
            ═══════════════════════════════════════════════════ */}
            {galleryData.length > 0 && (
              <section className="bg-harbour-stone" id="gallery">
                <div className="px-6 md:px-16 lg:px-24 py-20 md:py-28">
                  <p className="font-mono text-sea-spray/40 mb-8" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    Gallery
                  </p>
                  <PropertyGallery images={galleryData} propertyName={property.name} />
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 4 — WHAT GUESTS SAY
                Dark reverse band for social proof weight
            ═══════════════════════════════════════════════════ */}
            {(property.reviewScores || property.reviewHighlights?.length || property.guestSuperlatives?.length) && (
              <section className="bg-harbour-stone text-sea-spray">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-sea-spray/40 mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    What guests say
                  </p>

                  {/* Score typography — oversized numbers */}
                  {property.reviewScores && (
                    <div className="flex flex-wrap gap-16 md:gap-24 mb-20">
                      {[
                        property.reviewScores.airbnbScore && { platform: 'Airbnb', score: property.reviewScores.airbnbScore, count: property.reviewScores.airbnbCount },
                        property.reviewScores.bookingScore && { platform: 'Booking.com', score: property.reviewScores.bookingScore, count: property.reviewScores.bookingCount },
                        property.reviewScores.googleScore && { platform: 'Google', score: property.reviewScores.googleScore, count: property.reviewScores.googleCount },
                      ].filter(Boolean).map((item: any, i: number) => (
                        <div key={i}>
                          <p className="font-mono text-sea-spray/40" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{item.platform}</p>
                          <p className="font-serif font-bold text-sea-spray" style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: 1 }}>
                            {item.score.toFixed(1)}
                          </p>
                          {item.count && <p className="font-mono text-sea-spray/30 mt-1" style={{ fontSize: '12px' }}>{item.count} reviews</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Guest superlatives */}
                  {property.guestSuperlatives && property.guestSuperlatives.length > 0 && (
                    <div className="mb-16">
                      {property.guestSuperlatives.map((quote: string, i: number) => (
                        <p key={i} className="font-serif font-bold italic text-sea-spray/90 mb-4" style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', lineHeight: 1.3 }}>
                          &quot;{quote}&quot;
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Review quotes — two column */}
                  {property.reviewHighlights && property.reviewHighlights.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                      {property.reviewHighlights.slice(1, 5).map((h: ReviewHighlight, i: number) => (
                        <blockquote key={i} className="border-l border-sea-spray/15 pl-6">
                          <p className="font-serif font-bold italic text-sea-spray/80" style={{ fontSize: '16px', lineHeight: 1.4 }}>
                            {h.quote}
                          </p>
                          <footer className="font-mono text-sea-spray/30 mt-3" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            {h.source}
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
              <div className="px-6 md:px-16 lg:px-24 py-12">
                <GoogleReviewsClient
                  googleBusinessUrl={property.googleBusinessUrl}
                  googlePlaceId={property.googlePlaceId}
                  propertyName={property.name}
                />
              </div>
            )}

            {/* Inline image between chapters */}
            {galleryImages.length > 2 && (
              <div className="px-6 md:px-16 lg:px-24">
                {inlineImg(2, 'aspect-[21/9]')}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 5 — THE SPACES
                Editorial prose, not lists. Two-column on desktop.
            ═══════════════════════════════════════════════════ */}
            {(property.sleepingIntro || property.bedroomDetails?.length || property.facilitiesIntro || property.kitchenDining?.length) && (
              <section className="bg-machair-sand">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    The Spaces
                  </p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-20" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                    Inside {'&'} out
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-20">
                    {/* Sleeping */}
                    {(property.sleepingIntro || property.bedroomDetails?.length) && (
                      <div>
                        <h3 className="font-mono text-kelp-edge mb-6" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sleeping</h3>
                        {property.sleepingIntro && (
                          <p className="font-mono text-harbour-stone mb-6" style={{ fontSize: '15px', lineHeight: 1.7, maxWidth: '55ch' }}>{property.sleepingIntro}</p>
                        )}
                        {property.bedroomDetails?.map((d: string, i: number) => (
                          <p key={i} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                        ))}
                        {property.bathroomDetails?.map((d: string, i: number) => (
                          <p key={`b-${i}`} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                        ))}
                      </div>
                    )}

                    {/* Kitchen + Living */}
                    {(property.kitchenDining?.length || property.livingAreas?.length) && (
                      <div>
                        <h3 className="font-mono text-kelp-edge mb-6" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Kitchen {'&'} Living</h3>
                        {property.facilitiesIntro && (
                          <p className="font-mono text-harbour-stone mb-6" style={{ fontSize: '15px', lineHeight: 1.7, maxWidth: '55ch' }}>{property.facilitiesIntro}</p>
                        )}
                        {property.kitchenDining?.map((d: string, i: number) => (
                          <p key={i} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                        ))}
                        {property.livingAreas?.map((d: string, i: number) => (
                          <p key={`l-${i}`} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                        ))}
                      </div>
                    )}

                    {/* Outdoors */}
                    {(property.outdoorIntro || property.outdoorFeatures?.length) && (
                      <div>
                        <h3 className="font-mono text-kelp-edge mb-6" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Outdoors</h3>
                        {property.outdoorIntro && (
                          <p className="font-mono text-harbour-stone mb-6" style={{ fontSize: '15px', lineHeight: 1.7, maxWidth: '55ch' }}>{property.outdoorIntro}</p>
                        )}
                        {property.outdoorFeatures?.map((d: string, i: number) => (
                          <p key={i} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                        ))}
                        {property.parkingInfo && (
                          <p className="font-mono text-harbour-stone/70 mt-6" style={{ fontSize: '14px', lineHeight: 1.6 }}>{property.parkingInfo}</p>
                        )}
                      </div>
                    )}

                    {/* Comforts */}
                    {(property.heatingCooling?.length || property.entertainment?.length) && (
                      <div>
                        <h3 className="font-mono text-kelp-edge mb-6" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Comforts</h3>
                        {[...(property.heatingCooling || []), ...(property.entertainment || []), ...(property.laundryFacilities || [])].map((d: string, i: number) => (
                          <p key={i} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Inline image */}
            {galleryImages.length > 3 && (
              <div className="px-6 md:px-16 lg:px-24 bg-sea-spray">
                {inlineImg(3, 'aspect-[3/2]')}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 6 — MAGIC MOMENTS + PERFECT FOR
            ═══════════════════════════════════════════════════ */}
            {(property.magicMoments?.length || property.perfectFor?.length) && (
              <section className="bg-sea-spray">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    The Experience
                  </p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-20" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                    What it feels like to stay
                  </h2>

                  <div className="flex flex-col lg:flex-row lg:gap-24">
                    {/* Magic moments */}
                    {property.magicMoments && property.magicMoments.length > 0 && (
                      <div className="flex-1 mb-16 lg:mb-0">
                        <p className="font-mono text-kelp-edge mb-8" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Moments worth waiting for</p>
                        {property.magicMoments.map((m: MagicMoment, i: number) => (
                          <div key={i} className="border-l-2 border-kelp-edge pl-6 mb-8">
                            <p className="font-mono text-harbour-stone" style={{ fontSize: '15px', lineHeight: 1.6 }}>{m.moment}</p>
                            {m.frequency && <p className="font-mono text-harbour-stone/40 mt-1" style={{ fontSize: '12px' }}>{m.frequency}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Perfect for */}
                    {property.perfectFor && property.perfectFor.length > 0 && (
                      <div className="lg:w-[340px] flex-shrink-0">
                        <p className="font-mono text-kelp-edge mb-8" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Perfect for</p>
                        {property.perfectFor.map((p: PerfectFor, i: number) => (
                          <div key={i} className="mb-8">
                            <h3 className="font-serif font-bold text-harbour-stone text-lg mb-2">{p.guestType}</h3>
                            <p className="font-mono text-harbour-stone/70" style={{ fontSize: '14px', lineHeight: 1.6 }}>{p.why}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 7 — BEFORE YOU BOOK
                Honest friction, included, policies — grouped clean
            ═══════════════════════════════════════════════════ */}
            {(property.honestFriction?.length || property.included?.length || property.checkInTime || property.dailyRate) && (
              <section className="bg-machair-sand">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    Practicalities
                  </p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-20" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                    Before you book
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-16">
                    {/* Pricing */}
                    {(property.dailyRate || property.weeklyRate) && (
                      <div>
                        <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Pricing</p>
                        {property.dailyRate && (
                          <p className="font-serif font-bold text-harbour-stone" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
                            {'£'}{property.dailyRate}<span className="font-mono text-harbour-stone/40 ml-2" style={{ fontSize: '13px' }}>/ night</span>
                          </p>
                        )}
                        {property.weeklyRate && (
                          <p className="font-mono text-harbour-stone/60 mt-2" style={{ fontSize: '14px' }}>{'£'}{property.weeklyRate} / week</p>
                        )}
                      </div>
                    )}

                    {/* Times */}
                    {(property.checkInTime || property.checkOutTime) && (
                      <div>
                        <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Times</p>
                        <dl className="flex flex-col gap-3">
                          {property.checkInTime && <div><dt className="font-mono text-harbour-stone/40" style={{ fontSize: '12px' }}>Check-in</dt><dd className="font-mono text-harbour-stone" style={{ fontSize: '14px' }}>{property.checkInTime}</dd></div>}
                          {property.checkOutTime && <div><dt className="font-mono text-harbour-stone/40" style={{ fontSize: '12px' }}>Check-out</dt><dd className="font-mono text-harbour-stone" style={{ fontSize: '14px' }}>{property.checkOutTime}</dd></div>}
                          {property.minimumStay && <div><dt className="font-mono text-harbour-stone/40" style={{ fontSize: '12px' }}>Minimum stay</dt><dd className="font-mono text-harbour-stone" style={{ fontSize: '14px' }}>{property.minimumStay} nights</dd></div>}
                        </dl>
                      </div>
                    )}

                    {/* Policies */}
                    {(property.cancellationPolicy || property.paymentTerms) && (
                      <div>
                        <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Policies</p>
                        {property.cancellationPolicy && <p className="font-mono text-harbour-stone/80 mb-3 whitespace-pre-line" style={{ fontSize: '14px', lineHeight: 1.6 }}>{property.cancellationPolicy}</p>}
                        {property.paymentTerms && <p className="font-mono text-harbour-stone/80 mb-3 whitespace-pre-line" style={{ fontSize: '14px', lineHeight: 1.6 }}>{property.paymentTerms}</p>}
                        {property.licenseNumber && <p className="font-mono text-harbour-stone/30 mt-4" style={{ fontSize: '12px' }}>License: {property.licenseNumber}</p>}
                      </div>
                    )}
                  </div>

                  {/* Honest friction */}
                  {property.honestFriction && property.honestFriction.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-washed-timber">
                      <p className="font-mono text-kelp-edge mb-8" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Things to know</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {property.honestFriction.map((f: HonestFriction, i: number) => (
                          <div key={i}>
                            <p className="font-mono font-semibold text-harbour-stone mb-1" style={{ fontSize: '14px' }}>{f.issue}</p>
                            <p className="font-mono text-harbour-stone/60" style={{ fontSize: '14px', lineHeight: 1.6 }}>{f.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Included / Not included */}
                  {(property.included?.length || property.notIncluded?.length) && (
                    <div className="mt-16 pt-12 border-t border-washed-timber grid grid-cols-1 md:grid-cols-2 gap-12">
                      {property.included?.length > 0 && (
                        <div>
                          <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Included</p>
                          {property.included.map((d: string, i: number) => (
                            <p key={i} className="font-mono text-harbour-stone/80 border-l-2 border-kelp-edge pl-5 mb-3" style={{ fontSize: '14px', lineHeight: 1.5 }}>{d}</p>
                          ))}
                        </div>
                      )}
                      {property.notIncluded?.length > 0 && (
                        <div>
                          <p className="font-mono text-harbour-stone/40 mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Not included</p>
                          {property.notIncluded.map((d: string, i: number) => (
                            <p key={i} className="font-mono text-harbour-stone/40 pl-5 mb-3" style={{ fontSize: '14px', lineHeight: 1.5 }}>{d}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 8 — FAQ
            ═══════════════════════════════════════════════════ */}
            {property.commonQuestions?.length > 0 && (
              <section className="bg-sea-spray" id="common-questions">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>FAQ</p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-16" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                    Common Questions
                  </h2>
                  <div className="max-w-[720px]">
                    {property.commonQuestions.map((qa: { question: string; answer: string }, i: number) => (
                      <div key={i} className="py-8 border-b border-washed-timber">
                        <h3 className="font-serif font-bold text-harbour-stone text-lg mb-3">{qa.question}</h3>
                        <p className="font-mono text-harbour-stone/80" style={{ fontSize: '14px', lineHeight: 1.7 }}>{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════
                CHAPTER 9 — LOCATION
            ═══════════════════════════════════════════════════ */}
            {(property.locationIntro || property.latitude) && (
              <section className="bg-machair-sand">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Location</p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-16" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                    Finding {property.name}
                  </h2>

                  <div className="flex flex-col lg:flex-row lg:gap-20">
                    {(property.latitude || property.postcode) && (
                      <div className="flex-1 min-w-0 mb-12 lg:mb-0">
                        <GoogleMap latitude={property.latitude} longitude={property.longitude} postcode={property.postcode} location={property.location} name={property.name} height="420px" />
                      </div>
                    )}
                    <div className="lg:w-[340px] flex-shrink-0">
                      {property.gettingHereIntro && <p className="font-mono text-harbour-stone mb-6" style={{ fontSize: '15px', lineHeight: 1.7 }}>{property.gettingHereIntro}</p>}
                      {property.postcode && <p className="font-mono text-harbour-stone mb-4" style={{ fontSize: '14px' }}><span className="text-kelp-edge">Postcode</span> — {property.postcode}</p>}
                      {property.directions && <p className="font-mono text-harbour-stone/80 mb-6 whitespace-pre-line" style={{ fontSize: '14px', lineHeight: 1.6 }}>{property.directions}</p>}
                      {property.ferryInfo && (
                        <div className="pt-6 border-t border-washed-timber">
                          <p className="font-mono text-kelp-edge mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Ferry</p>
                          <p className="font-mono text-harbour-stone/80 whitespace-pre-line" style={{ fontSize: '14px', lineHeight: 1.6 }}>{property.ferryInfo}</p>
                        </div>
                      )}
                      <div className="flex gap-12 mt-8 pt-6 border-t border-washed-timber">
                        {property.airportDistance && <div><p className="font-mono text-kelp-edge mb-1" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Airport</p><p className="font-mono text-harbour-stone" style={{ fontSize: '14px' }}>{property.airportDistance}</p></div>}
                        {property.portDistance && <div><p className="font-mono text-kelp-edge mb-1" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Port</p><p className="font-mono text-harbour-stone" style={{ fontSize: '14px' }}>{property.portDistance}</p></div>}
                      </div>
                      {property.nearbyAttractions?.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-washed-timber">
                          <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Nearby</p>
                          {property.nearbyAttractions.map((a: string, i: number) => <p key={i} className="font-mono text-harbour-stone/80 mb-2" style={{ fontSize: '14px' }}>{a}</p>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Pet policy */}
            {(property.petFriendly || property.petPolicyIntro) && (
              <section className="bg-sea-spray">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36 max-w-[720px]">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    {property.petFriendly ? 'Dogs welcome' : 'Pet policy'}
                  </p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-10" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.1 }}>
                    Bringing your dog to Islay
                  </h2>
                  {dogFriendlyBlock?.teaserContent?.length > 0 && (
                    <div className="font-mono text-harbour-stone/80 [&>p]:mb-4 mb-6" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                      <PortableText value={dogFriendlyBlock.teaserContent} components={portableTextComponents} />
                    </div>
                  )}
                  {property.petPolicyIntro && <p className="font-mono text-harbour-stone/80 mb-4" style={{ fontSize: '14px', lineHeight: 1.7 }}>{property.petPolicyIntro}</p>}
                  {property.petPolicyDetails?.map((d: string, i: number) => (
                    <p key={i} className="font-mono text-harbour-stone/80 border-l-2 border-washed-timber pl-5 mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Trust transfer */}
            <div className="px-6 md:px-16 lg:px-24 py-12">
              <PropertyHostTrustTransfer reviews={property.reviewHighlights || []} totalReviewCount={property.totalReviewCount || 0} />
            </div>

            {/* ═══════════════════════════════════════════════════
                CHAPTER 10 — OUR OTHER PLACES + EXPLORE ISLAY
            ═══════════════════════════════════════════════════ */}
            {otherProperties.length > 0 && (
              <section className="bg-sea-spray">
                <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                  <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Also available</p>
                  <h2 className="font-serif font-bold text-harbour-stone mb-16" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                    Our other places
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherProperties.map((p: any) => {
                      const imageUrl = p.heroImage ? urlFor(p.heroImage).width(800).height(1200).url() : '';
                      return (
                        <PropertyCard
                          key={p._id}
                          name={p.name}
                          location={p.location || ''}
                          description={p.overviewIntro || p.name}
                          sleeps={p.sleeps || 0}
                          bedrooms={p.bedrooms || 0}
                          imageUrl={imageUrl}
                          href={`/accommodation/${p.slug?.current || p.slug || ''}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Explore Islay links */}
            <section className="bg-machair-sand">
              <div className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
                <p className="font-mono text-kelp-edge mb-4" style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>While you&apos;re here</p>
                <h2 className="font-serif font-bold text-harbour-stone mb-16" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                  Explore Islay
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-8">
                  {[
                    { href: '/explore-islay/islay-distilleries', label: 'Whisky Distilleries', desc: 'All 10, including Bruichladdich nearby' },
                    { href: '/explore-islay/islay-beaches', label: 'Beaches', desc: 'Portbahn Beach, Machir Bay, Singing Sands' },
                    { href: '/explore-islay/islay-wildlife', label: 'Wildlife & Nature', desc: 'Eagles, seals, barnacle geese, RSPB reserves' },
                    { href: '/explore-islay/food-and-drink', label: 'Food & Drink', desc: 'Restaurants, distillery cafes, local seafood' },
                    { href: '/explore-islay/visit-jura', label: 'Visiting Jura', desc: "Day trips to Islay's wilder neighbour" },
                    { href: '/islay-travel', label: 'Getting to Islay', desc: 'Ferry from Kennacraig, flights from Glasgow' },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="group block">
                      <p className="font-serif font-bold text-lg text-harbour-stone group-hover:text-kelp-edge transition-colors">{link.label}</p>
                      <p className="font-mono text-harbour-stone/40 mt-1" style={{ fontSize: '12px' }}>{link.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

          </div>
          {/* ── end content column ── */}

          {/* ── Sticky Calendar Rail ── */}
          {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
            <aside className="hidden lg:block lg:w-[360px] xl:w-[380px] flex-shrink-0 border-l border-washed-timber">
              <div className="sticky top-0 h-screen overflow-y-auto p-8">
                <PropertyCalendar
                  propertySlug={property.slug.current}
                  propertyId={property.lodgifyPropertyId}
                  propertyName={property.name}
                  sleeps={property.sleeps}
                />
              </div>
            </aside>
          )}

          {/* Mobile calendar — below hero, before content on small screens */}
        </div>

        {/* Mobile calendar (shown below content on mobile since it's hidden in the sidebar) */}
        {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
          <div className="lg:hidden px-6 py-12 bg-machair-sand">
            <PropertyCalendar
              propertySlug={property.slug.current}
              propertyId={property.lodgifyPropertyId}
              propertyName={property.name}
              sleeps={property.sleeps}
            />
          </div>
        )}

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
