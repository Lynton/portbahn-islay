import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-sea-spray border-b border-washed-timber">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Site Name */}
          <Link href="/" className="font-serif text-xl text-harbour-stone hover:text-emerald-accent transition-colors">
            Portbahn Islay
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Accommodation Dropdown */}
            <div className="relative group">
              <Link
                href="/accommodation"
                className="font-mono text-sm text-harbour-stone group-hover:text-emerald-accent transition-colors"
              >
                Accommodation
              </Link>
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-sea-spray border border-washed-timber shadow-lg min-w-[200px]">
                  <Link
                    href="/accommodation/portbahn-house"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Portbahn House
                  </Link>
                  <Link
                    href="/accommodation/shorefield-eco-house"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Shorefield Eco House
                  </Link>
                  <Link
                    href="/accommodation/curlew-cottage"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Curlew Cottage
                  </Link>
                </div>
              </div>
            </div>

            {/* Travel to Islay Dropdown */}
            <div className="relative group">
              <Link
                href="/getting-here"
                className="font-mono text-sm text-harbour-stone group-hover:text-emerald-accent transition-colors"
              >
                Travel to Islay
              </Link>
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-sea-spray border border-washed-timber shadow-lg min-w-[200px]">
                  <Link
                    href="/guides/ferry-to-islay"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Ferry to Islay
                  </Link>
                  <Link
                    href="/guides/flights-to-islay"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Flights to Islay
                  </Link>
                  <Link
                    href="/guides/planning-your-trip"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Planning Your Trip
                  </Link>
                </div>
              </div>
            </div>

            {/* Explore Islay Dropdown */}
            <div className="relative group">
              <Link
                href="/explore-islay"
                className="font-mono text-sm text-harbour-stone group-hover:text-emerald-accent transition-colors"
              >
                Explore Islay
              </Link>
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-sea-spray border border-washed-timber shadow-lg min-w-[200px]">
                  <Link
                    href="/guides/islay-distilleries"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Whisky Distilleries
                  </Link>
                  <Link
                    href="/guides/islay-beaches"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Beaches
                  </Link>
                  <Link
                    href="/guides/islay-wildlife"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Wildlife & Birdwatching
                  </Link>
                  <Link
                    href="/guides/family-holidays"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Family Holidays
                  </Link>
                  <Link
                    href="/guides/food-and-drink"
                    className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                  >
                    Food & Drink
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
