import Image from "next/image";

interface PropertyHeroProps {
  name: string;
  nickname?: string;
  heroImage: {
    url: string;
    alt?: string;
  };
}

export default function PropertyHero({
  name,
  nickname,
  heroImage,
}: PropertyHeroProps) {
  return (
    <section aria-label={`${name} hero`} className="bg-sea-spray">
      {/* Full-width hero photograph — sharp edges, no overlay, no rounded corners */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/7]">
        <Image
          src={heroImage.url}
          alt={
            heroImage.alt ||
            `${name} — holiday accommodation on the Isle of Islay, Scotland`
          }
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* 
        Property name block — BELOW the image, never overlaid.
        H1 is sculptural: big, confident, given room to breathe.
        Nickname as a mono uppercase label anchored above the H1.
      */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 md:pt-16 pb-8 md:pb-10">
        {nickname && (
          <p
            className="font-mono text-kelp-edge mb-5 md:mb-6"
            style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1.4 }}
          >
            {nickname}
          </p>
        )}
        <h1
          className="font-serif font-bold text-harbour-stone max-w-[16ch]"
          style={{
            fontSize: "clamp(2.5rem, 5vw + 1rem, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </h1>
      </div>
    </section>
  );
}
