import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-sea-spray">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="font-serif text-6xl mb-4">
          Portbahn Islay
        </h1>
        <p className="font-mono text-base text-harbour-stone mb-12">
          Self-catering accommodation on the Isle of Islay
        </p>

        {/* Properties Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PropertyCard
            name="Portbahn House"
            location="East coast views"
            description="Spacious family house with stunning views across the Sound of Islay. Perfect for larger groups seeking comfort and tranquility."
            sleeps={8}
            bedrooms={4}
            imageUrl="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1200&fit=crop"
            href="/properties/portbahn-house"
          />
          <PropertyCard
            name="Shorefield House"
            location="Port Ellen"
            description="Coastal retreat in the heart of Port Ellen. Modern amenities meet traditional Scottish charm in this beautifully restored property."
            sleeps={6}
            bedrooms={3}
            imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=1200&fit=crop"
            href="/properties/shorefield-house"
          />
          <PropertyCard
            name="Curlew Cottage"
            location="Village location"
            description="Cosy cottage nestled in a quiet village setting. Ideal for couples or small families looking for a peaceful island escape."
            sleeps={4}
            bedrooms={2}
            imageUrl="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1200&fit=crop"
            href="/properties/curlew-cottage"
          />
        </section>
      </div>
    </main>
  );
}
