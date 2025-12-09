import Link from 'next/link';
import Image from 'next/image';

interface PropertyCardProps {
  name: string;
  location: string;
  description: string;
  sleeps: number;
  bedrooms: number;
  imageUrl: string;
  href: string;
}

export default function PropertyCard({
  name,
  location,
  description,
  sleeps,
  bedrooms,
  imageUrl,
  href,
}: PropertyCardProps) {
  return (
    <Link href={href} className="block group">
      <article className="border border-washed-timber p-6 text-left">
        {/* Portrait image */}
        <div className="aspect-[3/4] mb-6 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={533}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property name */}
        <h2 className="font-serif text-2xl text-harbour-stone mb-2 group-hover:underline">
          {name}
        </h2>

        {/* Location */}
        <p className="font-mono text-sm mb-4" style={{ color: 'rgba(43, 44, 46, 0.6)' }}>
          {location}
        </p>

        {/* Description */}
        <p className="font-mono text-base text-harbour-stone mb-4 line-clamp-3">
          {description}
        </p>

        {/* Features list */}
        <ul className="font-mono text-sm text-harbour-stone space-y-1">
          <li>• Sleeps {sleeps}</li>
          <li>• {bedrooms} {bedrooms === 1 ? 'bedroom' : 'bedrooms'}</li>
          <li>• {location}</li>
        </ul>
      </article>
    </Link>
  );
}

