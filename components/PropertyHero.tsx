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
    <section aria-label={`${name} hero`}>
      {/* Hero image — full-width, sharp edges, no overlay */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden">
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

      {/* Property name block — below the image, not overlaid */}
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        {nickname && (
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-kelp-edge mb-4">
            {nickname}
          </p>
        )}
        <h1 className="font-serif font-bold text-harbour-stone text-[2.5rem] leading-[1.08] md:text-[4rem] lg:text-[5rem] md:leading-[1.05] max-w-[18ch]">
          {name}
        </h1>
      </div>
    </section>
  );
}
