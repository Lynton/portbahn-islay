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
import GoogleMap from '@/components/GoogleMap';

interface ReviewHighlight {
  quote: string;
  source: string;
  rating?: number;
}

interface HonestFriction {
  issue: string;
  context: string;
}

const getProperty = cache(async (slug: string) => {
  const query = `*[_type == "property" && slug.current == $slug] | order(_id desc)[0]{
    _id, name, slug, propertyType, heroImage, images[],
    overviewIntro, description, propertyNickname, sleepingIntro,
    honestFriction[] { issue, context },
    ownerContext,
    reviewScores {
      airbnbScore, airbnbCount, airbnbBadges[],
      bookingScore, bookingCount, bookingCategory,
      googleScore, googleCount
    },
    reviewHighlights[] { quote, source, rating },
    totalReviewCount,
    sleeps, bedrooms, beds, bathrooms,
    bedroomDetails[], bathroomDetails[],
    kitchenDining[], livingAreas[], outdoorFeatures[],
    locationIntro, location, nearbyAttractions[],
    petFriendly, latitude, longitude, postcode,
    dailyRate, weeklyRate, lodgifyPropertyId, lodgifyRoomId,
    seoTitle, seoDescription, googleBusinessUrl, googlePlaceId
  }`;
  return await client.fetch(query, { slug });
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── FEATURE LABEL MAP ──────────────────────────────────────────────────────

const FEATURE_LABELS: Record<string, string> = {
  // Kitchen & Dining
  dishwasher: 'Dishwasher', microwave: 'Microwave', oven: 'Oven',
  refrigerator: 'Refrigerator', toaster: 'Toaster', coffee_machine: 'Coffee machine',
  vacuum_cleaner: 'Vacuum cleaner', bbq_grill: 'BBQ grill', high_chair: "Children's high chair",
  kitchen_stove: 'Kitchen stove/range', dining_table_6: 'Dining table for 6',
  dining_table_8: 'Dining table for 8',
  // Living Areas
  open_plan: 'Open plan layout', separate_sitting: 'Separate sitting room',
  separate_dining: 'Separate dining room', conservatory: 'Conservatory',
  sea_views: 'Sea views', wifi: 'Wifi/broadband', books_games: 'Books and games',
  double_glazing: 'Double glazing',
  // Outdoor Features
  private_garden: 'Private garden', sea_views_outdoor: 'Sea views',
  bbq_area: 'BBQ area', play_equipment: "Children's play equipment",
  trampoline: 'Trampoline', swings: 'Swings', woodland: 'Woodland/nature area',
  ponds: 'Ponds', bird_reserves: 'Bird reserves', greenhouse: 'Greenhouse',
  garage: 'Garage', walled_garden: 'Walled garden', elevated: 'Elevated position',
};

function formatFeature(val: string): string {
  return FEATURE_LABELS[val] ?? val.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

// ─── HELPER COMPONENTS ──────────────────────────────────────────────────────

function FactItem({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '4px',
      paddingRight: isLast ? 0 : '28px',
      marginRight: isLast ? 0 : '28px',
      borderRight: isLast ? 'none' : '1px solid var(--color-washed-timber)',
      paddingBottom: '4px', marginBottom: '8px',
    }}>
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)' }}>
        {label}
      </span>
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '15px', color: 'var(--color-harbour-stone)' }}>
        {value}
      </span>
    </div>
  );
}

// ─── PAGE COMPONENT ─────────────────────────────────────────────────────────

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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Accommodation', url: '/accommodation' },
    { name: property.name, url: `/accommodation/${property.slug?.current || property.slug}` },
  ];

  const facts = [
    property.sleeps        ? { label: 'Sleeps',    value: `${property.sleeps} guests` } : null,
    property.bedrooms      ? { label: 'Bedrooms',  value: String(property.bedrooms) }   : null,
    property.bathrooms     ? { label: 'Bathrooms', value: String(property.bathrooms) }  : null,
    property.petFriendly !== undefined
      ? { label: 'Pets', value: property.petFriendly ? 'Welcome' : 'Not permitted' }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <SchemaMarkup
        type={['Accommodation', 'Place', 'Product', 'BreadcrumbList']}
        data={property}
        breadcrumbs={breadcrumbs}
      />

      <main className="min-h-screen bg-sea-spray pb-20 md:pb-0">

        {/* ── S1: FULL-BLEED HERO ──────────────────────────────────────── */}
        {heroImage && (
          <div style={{ height: '65vh', minHeight: '440px', position: 'relative', overflow: 'hidden' }}>
            <Image
              src={urlFor(heroImage).width(1600).height(960).url()}
              alt={heroImage.alt || property.name}
              fill
              className="object-cover"
              style={{ objectPosition: 'center 30%' }}
              priority
            />
          </div>
        )}

        {/* ── PAGE BODY: 2-col sticky grid ─────────────────────────────── */}
        <div className="property-grid overflow-x-clip">

          {/* ── CONTENT COLUMN ───────────────────────────────────────── */}
          <div style={{ minWidth: 0 }}>

            {/* S2: TITLE FRAME */}
            <section className="c1b-title-frame" style={{ background: 'var(--color-sea-spray)' }}>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '20px' }}>
                {[property.propertyNickname, property.location].filter(Boolean).join(' \u00b7 ')}
              </p>
              <h1 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(4rem, 8vw, 6.75rem)', lineHeight: 0.96, color: 'var(--color-harbour-stone)', letterSpacing: '-0.02em' }}>
                {property.name}
              </h1>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-washed-timber)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '12px', marginBottom: '40px' }}>
                Self-catering holiday home{property.sleeps ? ` \u00b7 Sleeping ${property.sleeps}` : ''}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid var(--color-washed-timber)', paddingTop: '24px', marginTop: '32px' }}>
                {facts.map((fact, i) => (
                  <FactItem key={fact.label} label={fact.label} value={fact.value} isLast={i === facts.length - 1} />
                ))}
              </div>
            </section>

            {/* S3: EDITORIAL SPREAD — image left, pull quote right */}
            {galleryImages.length >= 1 && (
              <section className="c1b-spread">
                <div className="c1b-spread-img">
                  <Image
                    src={urlFor(galleryImages[0]).width(1200).height(900).url()}
                    alt={(galleryImages[0] as any)?.alt || property.name}
                    width={1200}
                    height={900}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="c1b-spread-text">
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '32px' }}>
                    {property.reviewHighlights?.[0]?.source ? 'Guest Review' : 'About This Home'}
                  </p>
                  <blockquote style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.625rem, 3vw, 2.375rem)', lineHeight: 1.2, color: 'var(--color-harbour-stone)', marginBottom: '32px' }}>
                    {property.reviewHighlights?.[0]?.quote
                      ? `\u201c${property.reviewHighlights[0].quote}\u201d`
                      : property.overviewIntro || `An exceptional self-catering home on the Isle of Islay.`
                    }
                  </blockquote>
                  {property.reviewHighlights?.[0]?.source && (
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-washed-timber)', letterSpacing: '0.08em' }}>
                      {property.reviewHighlights[0].source}
                      {property.reviewHighlights[0].rating ? ` \u00b7 ${'★'.repeat(property.reviewHighlights[0].rating)}` : ''}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* S4: FULL BLEED IMAGE + TEAL CAPTION BAR */}
            {galleryImages.length >= 2 && (
              <section>
                <div style={{ overflow: 'hidden' }}>
                  <Image
                    src={urlFor(galleryImages[1]).width(1400).height(900).url()}
                    alt={(galleryImages[1] as any)?.alt || property.name}
                    width={1400}
                    height={900}
                    style={{ width: '100%', height: '75vh', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }}
                  />
                </div>
                <div className="c1b-caption-bar">
                  <span style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '18px', color: 'var(--color-sea-spray)', fontStyle: 'italic' }}>
                    {(galleryImages[1] as any)?.alt || `${property.name} — ${property.location || 'Isle of Islay'}`}
                  </span>
                  {property.location && (
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: 'var(--color-washed-timber)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0, marginLeft: '24px' }}>
                      {property.location}
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* S5: OVERVIEW — 3-col grid, centred body, offset quote */}
            {(property.overviewIntro || property.description || property.ownerContext) && (
              <section className="c1b-overview">
                {/* Vertical label */}
                <div className="c1b-overview-aside">
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                    The House
                  </p>
                </div>
                {/* Main body */}
                <div>
                  {property.overviewIntro && (
                    <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', lineHeight: 1.1, color: 'var(--color-harbour-stone)', marginBottom: '40px' }}>
                      {property.overviewIntro}
                    </h2>
                  )}
                  {property.description && (
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px', lineHeight: 1.65, color: 'var(--color-harbour-stone)', maxWidth: '620px', marginBottom: '40px' }}>
                      <PortableText value={property.description} components={portableTextComponents} />
                    </div>
                  )}
                  {property.ownerContext && (
                    <>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '12px' }}>
                        A note from the owners
                      </p>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-washed-timber)', borderLeft: '2px solid var(--color-washed-timber)', paddingLeft: '20px', maxWidth: '560px' }}>
                        {property.ownerContext}
                      </p>
                    </>
                  )}
                </div>
                {/* Offset blockquote */}
                {property.reviewHighlights?.[1] && (
                  <div className="c1b-overview-offset">
                    <blockquote style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)', lineHeight: 1.3, fontStyle: 'italic', color: 'var(--color-kelp-edge)', borderLeft: '3px solid var(--color-kelp-edge)', paddingLeft: '24px' }}>
                      &ldquo;{property.reviewHighlights[1].quote}&rdquo;
                    </blockquote>
                  </div>
                )}
              </section>
            )}

            {/* S6: GALLERY ROW — 2 rows of 3 */}
            {galleryImages.length >= 3 && (
              <section className="c1b-gallery-row">
                {galleryImages.slice(2, 8).map((img: any, i: number) => (
                  <div key={i} className="c1b-gallery-row-cell">
                    <Image
                      src={urlFor(img).width(i < 3 ? 1000 : 800).height(i < 3 ? 700 : 600).url()}
                      alt={img?.alt || `${property.name} — gallery ${i + 3}`}
                      width={i < 3 ? 1000 : 800}
                      height={i < 3 ? 700 : 600}
                      style={{ width: '100%', height: i < 3 ? '400px' : '300px', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ))}
              </section>
            )}

            {/* S7: THE SPACES */}
            {(property.bedroomDetails?.length || property.bathroomDetails?.length ||
              property.kitchenDining?.length || property.livingAreas?.length ||
              property.outdoorFeatures?.length) && (
              <section className="c1b-spaces">
                <div className="c1b-spaces-header">
                  <div>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '16px' }}>
                      The Spaces
                    </p>
                    <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, color: 'var(--color-harbour-stone)' }}>
                      Inside &amp;<br />Out
                    </h2>
                  </div>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '15px', lineHeight: 1.6, color: 'var(--color-harbour-stone)', paddingTop: '20px' }}>
                    {property.sleepingIntro || (
                      [
                        property.bedrooms ? `${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}` : '',
                        property.sleeps ? `sleeping ${property.sleeps}` : '',
                        property.bathrooms ? `${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}` : '',
                      ].filter(Boolean).join(', ')
                    )}
                  </p>
                </div>
                <div className="c1b-spaces-grid">
                  {(property.bedroomDetails?.length || property.bathroomDetails?.length) && (
                    <div>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', paddingBottom: '16px', borderBottom: '1px solid var(--color-washed-timber)', marginBottom: '20px' }}>
                        Sleeping
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[...(property.bedroomDetails || []), ...(property.bathroomDetails || [])].map((item: string, i: number) => (
                          <li key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', lineHeight: 1.4, color: 'var(--color-harbour-stone)' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(property.kitchenDining?.length || property.livingAreas?.length) && (
                    <div>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', paddingBottom: '16px', borderBottom: '1px solid var(--color-washed-timber)', marginBottom: '20px' }}>
                        Kitchen &amp; Living
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[...(property.kitchenDining || []), ...(property.livingAreas || [])].map((item: string, i: number) => (
                          <li key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', lineHeight: 1.4, color: 'var(--color-harbour-stone)' }}>{formatFeature(item)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {property.outdoorFeatures?.length > 0 && (
                    <div>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', paddingBottom: '16px', borderBottom: '1px solid var(--color-washed-timber)', marginBottom: '20px' }}>
                        Outside
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {property.outdoorFeatures.map((item: string, i: number) => (
                          <li key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', lineHeight: 1.4, color: 'var(--color-harbour-stone)' }}>{formatFeature(item)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* S7b: BEDROOM STRIP — 4 cells with labels */}
            {galleryImages.length >= 12 && property.bedroomDetails?.length >= 1 && (
              <section className="c1b-bedroom-strip">
                {galleryImages.slice(8, 12).map((img: any, i: number) => (
                  <div key={i} className="c1b-bedroom-cell">
                    <Image
                      src={urlFor(img).width(800).height(600).url()}
                      alt={img?.alt || `${property.name} — bedroom ${i + 1}`}
                      width={800}
                      height={600}
                      style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                    />
                    {property.bedroomDetails[i] && (
                      <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(15,58,74,0.78)', fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,250,0.9)', padding: '10px 14px' }}>
                        {property.bedroomDetails[i]}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* S8: IMAGE PAIR — 3fr 2fr, 65vh */}
            {galleryImages.length >= 10 && (
              <section className="c1b-image-pair">
                <Image
                  src={urlFor(galleryImages[8]).width(900).height(700).url()}
                  alt={(galleryImages[8] as any)?.alt || `${property.name} — interior`}
                  width={900}
                  height={700}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <Image
                  src={urlFor(galleryImages[9]).width(700).height(700).url()}
                  alt={(galleryImages[9] as any)?.alt || `${property.name} — detail`}
                  width={700}
                  height={700}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </section>
            )}

            {/* S9: REVIEWS — teal, 3-col, large score numbers */}
            {(property.reviewScores?.airbnbScore || property.reviewScores?.bookingScore || property.reviewScores?.googleScore) && (
              <section className="c1b-reviews">
                {property.reviewScores.airbnbScore && (
                  <div>
                    <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '72px', lineHeight: 1, color: 'var(--color-sea-spray)', marginBottom: '8px' }}>
                      {property.reviewScores.airbnbScore.toFixed(2)}
                    </p>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-washed-timber)', marginBottom: '32px' }}>
                      Airbnb{property.reviewScores.airbnbCount ? ` \u00b7 ${property.reviewScores.airbnbCount} reviews` : ''}
                    </p>
                    {property.reviewHighlights?.[0] && (
                      <>
                        <blockquote style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '19px', lineHeight: 1.45, fontStyle: 'italic', color: 'var(--color-sea-spray)' }}>
                          &ldquo;{property.reviewHighlights[0].quote}&rdquo;
                        </blockquote>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-washed-timber)', marginTop: '16px', letterSpacing: '0.06em' }}>
                          — {property.reviewHighlights[0].source}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {property.reviewScores.bookingScore && (
                  <div>
                    <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '72px', lineHeight: 1, color: 'var(--color-sea-spray)', marginBottom: '8px' }}>
                      {property.reviewScores.bookingScore.toFixed(1)}
                    </p>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-washed-timber)', marginBottom: '32px' }}>
                      Booking.com{property.reviewScores.bookingCount ? ` \u00b7 ${property.reviewScores.bookingCount} reviews` : ''}
                    </p>
                    {property.reviewHighlights?.[1] && (
                      <>
                        <blockquote style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '19px', lineHeight: 1.45, fontStyle: 'italic', color: 'var(--color-sea-spray)' }}>
                          &ldquo;{property.reviewHighlights[1].quote}&rdquo;
                        </blockquote>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-washed-timber)', marginTop: '16px', letterSpacing: '0.06em' }}>
                          — {property.reviewHighlights[1].source}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {property.reviewScores.googleScore && (
                  <div>
                    <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '72px', lineHeight: 1, color: 'var(--color-sea-spray)', marginBottom: '8px' }}>
                      {property.reviewScores.googleScore.toFixed(1)}
                    </p>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-washed-timber)', marginBottom: '32px' }}>
                      Google{property.reviewScores.googleCount ? ` \u00b7 ${property.reviewScores.googleCount} reviews` : ''}
                    </p>
                    {property.reviewHighlights?.[2] && (
                      <>
                        <blockquote style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '19px', lineHeight: 1.45, fontStyle: 'italic', color: 'var(--color-sea-spray)' }}>
                          &ldquo;{property.reviewHighlights[2].quote}&rdquo;
                        </blockquote>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-washed-timber)', marginTop: '16px', letterSpacing: '0.06em' }}>
                          — {property.reviewHighlights[2].source}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* S10: LOCATION */}
            <section className="c1b-location">
              <div>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '32px' }}>
                  Where You Are
                </p>
                <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', lineHeight: 1.1, color: 'var(--color-harbour-stone)', marginBottom: '32px' }}>
                  {property.location?.split(',')[0] || 'Isle of Islay'}
                </h2>
                {property.locationIntro && (
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '15px', lineHeight: 1.65, maxWidth: '480px', marginBottom: '40px' }}>
                    <PortableText value={property.locationIntro} components={portableTextComponents} />
                  </div>
                )}
                {property.nearbyAttractions?.length > 0 && (
                  <ul style={{ listStyle: 'none' }}>
                    {property.nearbyAttractions.map((item: string, i: number) => {
                      const sep = item.includes(' — ') ? ' — ' : item.includes('—') ? '—' : null;
                      const parts = sep ? item.split(sep) : [item];
                      return (
                        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid var(--color-washed-timber)', fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px' }}>
                          <span style={{ color: 'var(--color-harbour-stone)' }}>{parts[0]?.trim()}</span>
                          {parts[1] && <span style={{ color: 'var(--color-kelp-edge)', flexShrink: 0, marginLeft: '16px' }}>{parts[1]?.trim()}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div style={{ background: 'var(--color-machair-sand)', minHeight: '360px', overflow: 'hidden' }}>
                {(property.latitude || property.longitude || property.postcode) ? (
                  <GoogleMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    postcode={property.postcode}
                    location={property.location}
                    name={property.name}
                    height="100%"
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '360px' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-washed-timber)' }}>
                      Map coming soon
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* S11: GOOD TO KNOW */}
            {property.honestFriction?.length > 0 && (
              <section className="c1b-good-to-know">
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '40px' }}>
                  Good to Know
                </p>
                <div className="c1b-expectations-grid">
                  {property.honestFriction.slice(0, 3).map((item: HonestFriction, i: number) => (
                    <div key={i} style={{ borderTop: '1px solid var(--color-washed-timber)', paddingTop: '20px' }}>
                      <p style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '15px', color: 'var(--color-harbour-stone)', marginBottom: '8px' }}>
                        {item.issue}
                      </p>
                      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-harbour-stone)' }}>
                        {item.context}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* S12: EXPLORE ISLAY */}
            <section className="c1b-explore">
              <div className="c1b-explore-header">
                <div>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '20px' }}>
                    While You&apos;re Here
                  </p>
                  <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', lineHeight: 1.1, color: 'var(--color-harbour-stone)' }}>
                    Explore Islay
                  </h2>
                </div>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '15px', lineHeight: 1.6, color: 'var(--color-harbour-stone)' }}>
                  Ten distilleries, miles of deserted beach, barnacle geese, white-tailed eagles, and a whisky festival in May. We&apos;ve been here since 2017 — ask us anything.
                </p>
              </div>
              <div className="c1b-explore-grid">
                {[
                  {
                    label: 'Distilleries',
                    title: 'Ten Islay Malts',
                    desc: 'Bruichladdich is on your doorstep. Bowmore, Laphroaig, Ardbeg and seven others are within an hour.',
                    link: '/explore-islay/islay-distilleries',
                    linkText: 'Distillery guide →',
                  },
                  {
                    label: 'Beaches',
                    title: 'Machir Bay, Singing Sands',
                    desc: "Portbahn Beach is five minutes' walk. Machir Bay — vast, usually empty — is 20 minutes by car.",
                    link: '/explore-islay/islay-beaches',
                    linkText: 'Beaches guide →',
                  },
                  {
                    label: 'Wildlife',
                    title: 'Eagles, Geese & Seals',
                    desc: 'Barnacle geese winter on the machair. White-tailed eagles nest on Jura. Otters on the loch shore.',
                    link: '/explore-islay/islay-wildlife',
                    linkText: 'Wildlife guide →',
                  },
                ].map((card) => (
                  <Link key={card.label} href={card.link} style={{ background: 'var(--color-sea-spray)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none' }} className="hover-card">
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)' }}>
                      {card.label}
                    </span>
                    <span style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '22px', color: 'var(--color-harbour-stone)' }}>
                      {card.title}
                    </span>
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', lineHeight: 1.5, color: 'var(--color-washed-timber)' }}>
                      {card.desc}
                    </span>
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-kelp-edge)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 'auto', paddingTop: '20px' }}>
                      {card.linkText}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

          </div>
          {/* END CONTENT COLUMN */}

          {/* ── STICKY SIDEBAR ───────────────────────────────────────── */}
          <div className="hidden md:block" style={{ padding: '48px 48px 0 0' }}>
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
        {/* END PAGE BODY */}

        {/* ── MOBILE AVAILABILITY BAR ──────────────────────────────── */}
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
    return { title: 'Property not found' };
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
