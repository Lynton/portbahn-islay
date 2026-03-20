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

interface ReviewHighlight { quote: string; source: string; rating?: number; }
interface HonestFriction { issue: string; context: string; }

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

interface PageProps { params: Promise<{ slug: string }>; }

const FEATURE_LABELS: Record<string, string> = {
  dishwasher: 'Dishwasher', microwave: 'Microwave', oven: 'Oven',
  refrigerator: 'Refrigerator', toaster: 'Toaster', coffee_machine: 'Coffee machine',
  vacuum_cleaner: 'Vacuum cleaner', bbq_grill: 'BBQ grill', high_chair: "Children's high chair",
  kitchen_stove: 'Kitchen stove/range', dining_table_6: 'Dining table for 6',
  dining_table_8: 'Dining table for 8',
  open_plan: 'Open plan layout', separate_sitting: 'Separate sitting room',
  separate_dining: 'Separate dining room', conservatory: 'Conservatory',
  sea_views: 'Sea views', wifi: 'Wifi/broadband', books_games: 'Books and games',
  double_glazing: 'Double glazing',
  private_garden: 'Private garden', sea_views_outdoor: 'Sea views',
  bbq_area: 'BBQ area', play_equipment: "Children's play equipment",
  trampoline: 'Trampoline', swings: 'Swings', woodland: 'Woodland/nature area',
  ponds: 'Ponds', bird_reserves: 'Bird reserves', greenhouse: 'Greenhouse',
  garage: 'Garage', walled_garden: 'Walled garden', elevated: 'Elevated position',
};

function formatFeature(val: string): string {
  return FEATURE_LABELS[val] ?? val.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

function FactItem({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 pb-1 mb-2 ${isLast ? '' : 'pr-7 mr-7 border-r border-washed-timber'}`}>
      <span className="typo-fact-label">{label}</span>
      <span className="typo-fact-value">{value}</span>
    </div>
  );
}

// Reusable review column
function ReviewColumn({ score, scoreLabel, count, highlight }: {
  score: number; scoreLabel: string; count?: number;
  highlight?: ReviewHighlight;
}) {
  return (
    <div>
      <p className="typo-score mb-2">{score.toFixed(scoreLabel === 'Airbnb' ? 2 : 1)}</p>
      <p className="typo-caption mb-8">{scoreLabel}{count ? ` · ${count} reviews` : ''}</p>
      {highlight && (
        <>
          <blockquote className="typo-review-quote">&ldquo;{highlight.quote}&rdquo;</blockquote>
          <p className="font-mono text-base text-washed-timber tracking-wide mt-4">— {highlight.source}</p>
        </>
      )}
    </div>
  );
}

// Spaces column — sleeping, kitchen, outside
function SpacesColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="typo-label pb-4 border-b border-washed-timber mb-5">{label}</p>
      <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none' }}>
        {items.map((item, i) => <li key={i} className="font-mono text-xl text-harbour-stone leading-loose">{item}</li>)}
      </ul>
    </div>
  );
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return (
      <main className="min-h-screen bg-sea-spray">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-serif text-4xl text-harbour-stone mb-4">Property not found</h1>
          <Link href="/" className="font-mono text-base text-emerald-accent hover:underline">Return to homepage</Link>
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
    property.sleeps    ? { label: 'Sleeps',    value: `${property.sleeps} guests` } : null,
    property.bedrooms  ? { label: 'Bedrooms',  value: String(property.bedrooms) }   : null,
    property.bathrooms ? { label: 'Bathrooms', value: String(property.bathrooms) }  : null,
    property.petFriendly !== undefined ? { label: 'Pets', value: property.petFriendly ? 'Welcome' : 'Not permitted' } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <SchemaMarkup type={['Accommodation', 'Place', 'Product', 'BreadcrumbList']} data={property} breadcrumbs={breadcrumbs} />

      <main className="min-h-screen bg-sea-spray pb-20 md:pb-0">

        {/* ── S1: FULL-BLEED HERO ──────────────────────────────────────── */}
        {heroImage && (
          <div className="relative overflow-hidden" style={{ height: '65vh', minHeight: '440px' }}>
            <Image src={urlFor(heroImage).width(1600).height(960).url()} alt={heroImage.alt || property.name} fill className="object-cover" style={{ objectPosition: 'center 30%' }} priority />
          </div>
        )}

        {/* ── PAGE BODY: 2-col sticky grid ─────────────────────────────── */}
        <div className="property-grid overflow-x-clip">

          {/* ── CONTENT COLUMN ───────────────────────────────────────── */}
          <div className="min-w-0">

            {/* S2: TITLE FRAME */}
            <section className="c1b-title-frame bg-sea-spray">
              <p className="typo-label mb-5">
                {[property.propertyNickname, property.location].filter(Boolean).join(' · ')}
              </p>
              <h1 className="font-serif font-bold text-harbour-stone tracking-tight" style={{ fontSize: 'clamp(4rem, 8vw, 6.75rem)', lineHeight: 0.96 }}>
                {property.name}
              </h1>
              <p className="font-mono text-lg text-washed-timber tracking-wide uppercase mt-3 mb-10">
                Self-catering holiday home{property.sleeps ? ` · Sleeping ${property.sleeps}` : ''}
              </p>
              <div className="flex flex-wrap border-t border-washed-timber pt-6 mt-8">
                {facts.map((fact, i) => <FactItem key={fact.label} label={fact.label} value={fact.value} isLast={i === facts.length - 1} />)}
              </div>
            </section>

            {/* S3: EDITORIAL SPREAD — image left, pull quote right */}
            {galleryImages.length >= 1 && (
              <section className="c1b-spread">
                <div className="c1b-spread-img">
                  <Image src={urlFor(galleryImages[0]).width(1200).height(900).url()} alt={(galleryImages[0] as any)?.alt || property.name} width={1200} height={900} className="w-full h-full object-cover" />
                </div>
                <div className="c1b-spread-text">
                  <p className="typo-label mb-8">{property.reviewHighlights?.[0]?.source ? 'Guest Review' : 'About This Home'}</p>
                  <blockquote className="typo-offset-quote mb-8">
                    {property.reviewHighlights?.[0]?.quote
                      ? `\u201c${property.reviewHighlights[0].quote}\u201d`
                      : property.overviewIntro || 'An exceptional self-catering home on the Isle of Islay.'}
                  </blockquote>
                  {property.reviewHighlights?.[0]?.source && (
                    <p className="font-mono text-base text-washed-timber tracking-wider">
                      {property.reviewHighlights[0].source}
                      {property.reviewHighlights[0].rating ? ` · ${'★'.repeat(property.reviewHighlights[0].rating)}` : ''}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* S4: FULL BLEED IMAGE + TEAL CAPTION BAR */}
            {galleryImages.length >= 2 && (
              <section>
                <div className="overflow-hidden">
                  <Image src={urlFor(galleryImages[1]).width(1400).height(900).url()} alt={(galleryImages[1] as any)?.alt || property.name} width={1400} height={900}
                    className="w-full block object-cover" style={{ height: '75vh', objectPosition: 'center 40%' }} />
                </div>
                <div className="c1b-caption-bar">
                  <span className="font-serif font-bold text-lg text-sea-spray italic">{(galleryImages[1] as any)?.alt || `${property.name} — ${property.location || 'Isle of Islay'}`}</span>
                  {property.location && <span className="typo-caption shrink-0 ml-6">{property.location}</span>}
                </div>
              </section>
            )}

            {/* S5: OVERVIEW — 3-col grid, centred body, offset quote */}
            {(property.overviewIntro || property.description || property.ownerContext) && (
              <section className="c1b-overview">
                <div className="c1b-overview-aside">
                  <p className="typo-label" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>The House</p>
                </div>
                <div>
                  {property.overviewIntro && <h2 className="typo-h2 mb-10">{property.overviewIntro}</h2>}
                  {property.description && (
                    <div className="font-mono text-3xl leading-body text-harbour-stone max-w-[620px] mb-10">
                      <PortableText value={property.description} components={portableTextComponents} />
                    </div>
                  )}
                  {property.ownerContext && (
                    <>
                      <p className="typo-kicker mb-3" style={{ letterSpacing: 'var(--tracking-caps)' }}>A note from the owners</p>
                      <p className="font-mono text-xl leading-relaxed text-washed-timber border-l-2 border-washed-timber pl-5 max-w-[560px]">{property.ownerContext}</p>
                    </>
                  )}
                </div>
                {property.reviewHighlights?.[1] && (
                  <div className="c1b-overview-offset">
                    <blockquote className="font-serif font-bold italic text-kelp-edge border-l-[3px] border-kelp-edge pl-6" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)', lineHeight: 1.3 }}>
                      &ldquo;{property.reviewHighlights[1].quote}&rdquo;
                    </blockquote>
                  </div>
                )}
              </section>
            )}

            {/* S6: GALLERY ROW */}
            {galleryImages.length >= 3 && (
              <section className="c1b-gallery-row">
                {galleryImages.slice(2, 8).map((img: any, i: number) => (
                  <div key={i} className="c1b-gallery-row-cell">
                    <Image src={urlFor(img).width(i < 3 ? 1000 : 800).height(i < 3 ? 700 : 600).url()}
                      alt={img?.alt || `${property.name} — gallery ${i + 3}`} width={i < 3 ? 1000 : 800} height={i < 3 ? 700 : 600}
                      className="w-full block object-cover" style={{ height: i < 3 ? '400px' : '300px' }} />
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
                    <p className="typo-label mb-4">The Spaces</p>
                    <h2 className="font-serif font-bold text-harbour-stone" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>Inside &amp;<br />Out</h2>
                  </div>
                  <p className="typo-body pt-5">
                    {property.sleepingIntro || [
                      property.bedrooms ? `${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}` : '',
                      property.sleeps ? `sleeping ${property.sleeps}` : '',
                      property.bathrooms ? `${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}` : '',
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
                <div className="c1b-spaces-grid">
                  {(property.bedroomDetails?.length || property.bathroomDetails?.length) && (
                    <SpacesColumn label="Sleeping" items={[...(property.bedroomDetails || []), ...(property.bathroomDetails || [])]} />
                  )}
                  {(property.kitchenDining?.length || property.livingAreas?.length) && (
                    <SpacesColumn label="Kitchen & Living" items={[...(property.kitchenDining || []), ...(property.livingAreas || [])].map(formatFeature)} />
                  )}
                  {property.outdoorFeatures?.length > 0 && (
                    <SpacesColumn label="Outside" items={property.outdoorFeatures.map(formatFeature)} />
                  )}
                </div>
              </section>
            )}

            {/* S7b: BEDROOM STRIP */}
            {galleryImages.length >= 12 && property.bedroomDetails?.length >= 1 && (
              <section className="c1b-bedroom-strip">
                {galleryImages.slice(8, 12).map((img: any, i: number) => (
                  <div key={i} className="c1b-bedroom-cell">
                    <Image src={urlFor(img).width(800).height(600).url()} alt={img?.alt || `${property.name} — bedroom ${i + 1}`}
                      width={800} height={600} className="w-full block object-cover" style={{ height: '320px' }} />
                    {property.bedroomDetails[i] && (
                      <p className="absolute bottom-0 left-0 right-0 typo-kicker px-3.5 py-2.5" style={{ background: 'rgba(15,58,74,0.78)', color: 'rgba(255,255,250,0.9)', letterSpacing: 'var(--tracking-caps)' }}>
                        {property.bedroomDetails[i]}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* S8: IMAGE PAIR */}
            {galleryImages.length >= 10 && (
              <section className="c1b-image-pair">
                <Image src={urlFor(galleryImages[8]).width(900).height(700).url()} alt={(galleryImages[8] as any)?.alt || `${property.name} — interior`} width={900} height={700} className="w-full h-full object-cover block" />
                <Image src={urlFor(galleryImages[9]).width(700).height(700).url()} alt={(galleryImages[9] as any)?.alt || `${property.name} — detail`} width={700} height={700} className="w-full h-full object-cover block" />
              </section>
            )}

            {/* S9: REVIEWS */}
            {(property.reviewScores?.airbnbScore || property.reviewScores?.bookingScore || property.reviewScores?.googleScore) && (
              <section className="c1b-reviews">
                {property.reviewScores.airbnbScore && (
                  <ReviewColumn score={property.reviewScores.airbnbScore} scoreLabel="Airbnb" count={property.reviewScores.airbnbCount} highlight={property.reviewHighlights?.[0]} />
                )}
                {property.reviewScores.bookingScore && (
                  <ReviewColumn score={property.reviewScores.bookingScore} scoreLabel="Booking.com" count={property.reviewScores.bookingCount} highlight={property.reviewHighlights?.[1]} />
                )}
                {property.reviewScores.googleScore && (
                  <ReviewColumn score={property.reviewScores.googleScore} scoreLabel="Google" count={property.reviewScores.googleCount} highlight={property.reviewHighlights?.[2]} />
                )}
              </section>
            )}

            {/* S10: LOCATION */}
            <section className="c1b-location">
              <div>
                <p className="typo-label mb-8">Where You Are</p>
                <h2 className="typo-h2 mb-8">{property.location?.split(',')[0] || 'Isle of Islay'}</h2>
                {property.locationIntro && (
                  <div className="typo-body max-w-[480px] mb-10">
                    <PortableText value={property.locationIntro} components={portableTextComponents} />
                  </div>
                )}
                {property.nearbyAttractions?.length > 0 && (
                  <ul style={{ listStyle: 'none' }}>
                    {property.nearbyAttractions.map((item: string, i: number) => {
                      const sep = item.includes(' — ') ? ' — ' : item.includes('—') ? '—' : null;
                      const parts = sep ? item.split(sep) : [item];
                      return (
                        <li key={i} className="flex justify-between items-baseline py-3 border-b border-washed-timber font-mono text-lg">
                          <span className="text-harbour-stone">{parts[0]?.trim()}</span>
                          {parts[1] && <span className="text-kelp-edge shrink-0 ml-4">{parts[1]?.trim()}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="bg-machair-sand min-h-[360px] overflow-hidden">
                {(property.latitude || property.longitude || property.postcode) ? (
                  <GoogleMap latitude={property.latitude} longitude={property.longitude} postcode={property.postcode} location={property.location} name={property.name} height="100%" />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[360px]">
                    <p className="typo-caption">Map coming soon</p>
                  </div>
                )}
              </div>
            </section>

            {/* S11: GOOD TO KNOW */}
            {property.honestFriction?.length > 0 && (
              <section className="c1b-good-to-know">
                <p className="typo-label mb-10">Good to Know</p>
                <div className="c1b-expectations-grid">
                  {property.honestFriction.slice(0, 3).map((item: HonestFriction, i: number) => (
                    <div key={i} className="border-t border-washed-timber pt-5">
                      <p className="font-serif font-bold text-2xl text-harbour-stone mb-2">{item.issue}</p>
                      <p className="font-mono text-xl leading-relaxed text-harbour-stone">{item.context}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* S12: EXPLORE ISLAY */}
            <section className="c1b-explore">
              <div className="c1b-explore-header">
                <div>
                  <p className="typo-label mb-5">While You&apos;re Here</p>
                  <h2 className="typo-h2">Explore Islay</h2>
                </div>
                <p className="typo-body">Ten distilleries, miles of deserted beach, barnacle geese, white-tailed eagles, and a whisky festival in May. We&apos;ve been here since 2017 — ask us anything.</p>
              </div>
              <div className="c1b-explore-grid">
                {[
                  { label: 'Distilleries', title: 'Ten Islay Malts', desc: 'Bruichladdich is on your doorstep. Bowmore, Laphroaig, Ardbeg and seven others are within an hour.', link: '/explore-islay/islay-distilleries', linkText: 'Distillery guide →' },
                  { label: 'Beaches', title: 'Machir Bay, Singing Sands', desc: "Portbahn Beach is five minutes' walk. Machir Bay — vast, usually empty — is 20 minutes by car.", link: '/explore-islay/islay-beaches', linkText: 'Beaches guide →' },
                  { label: 'Wildlife', title: 'Eagles, Geese & Seals', desc: 'Barnacle geese winter on the machair. White-tailed eagles nest on Jura. Otters on the loch shore.', link: '/explore-islay/islay-wildlife', linkText: 'Wildlife guide →' },
                ].map((card) => (
                  <Link key={card.label} href={card.link} className="bg-sea-spray p-8 flex flex-col gap-3 hover-card">
                    <span className="typo-kicker" style={{ letterSpacing: 'var(--tracking-caps)' }}>{card.label}</span>
                    <span className="font-serif font-bold text-[22px] text-harbour-stone">{card.title}</span>
                    <span className="font-mono text-lg leading-normal text-washed-timber">{card.desc}</span>
                    <span className="typo-cta mt-auto pt-5">{card.linkText}</span>
                  </Link>
                ))}
              </div>
            </section>

          </div>

          {/* ── STICKY SIDEBAR ───────────────────────────────────────── */}
          <div className="hidden md:block" style={{ padding: '48px 48px 0 0' }}>
            {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
              <PropertyCalendar propertySlug={property.slug.current} propertyId={property.lodgifyPropertyId}
                propertyName={property.name} sleeps={property.sleeps} weeklyRate={property.weeklyRate}
                dailyRate={property.dailyRate} minimumStay={property.minimumStay} />
            )}
          </div>

        </div>

        {/* ── MOBILE AVAILABILITY BAR ──────────────────────────────── */}
        {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
          <MobileAvailBar propertySlug={property.slug.current} propertyId={property.lodgifyPropertyId}
            propertyName={property.name} sleeps={property.sleeps} weeklyRate={property.weeklyRate}
            dailyRate={property.dailyRate} minimumStay={property.minimumStay} />
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
