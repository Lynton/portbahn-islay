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
            <Link
              href="/getting-here"
              className="font-mono text-sm text-harbour-stone hover:text-emerald-accent transition-colors"
            >
              Getting Here
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
