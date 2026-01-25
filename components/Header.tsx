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
              <span className="font-mono text-sm text-harbour-stone cursor-pointer group-hover:text-emerald-accent transition-colors">
                Accommodation
              </span>
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

            <Link
              href="/getting-here"
              className="font-mono text-sm text-harbour-stone hover:text-emerald-accent transition-colors"
            >
              Travel to Islay
            </Link>
            <Link
              href="/explore-islay"
              className="font-mono text-sm text-harbour-stone hover:text-emerald-accent transition-colors"
            >
              Explore Islay
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
