import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-harbour-stone text-sea-spray">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Properties Column */}
          <div>
            <h3 className="font-serif text-lg mb-4">Our Accommodation</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link href="/accommodation/portbahn-house" className="text-washed-timber hover:text-emerald-accent transition-colors">
                  Portbahn House
                </Link>
              </li>
              <li>
                <Link href="/accommodation/shorefield-eco-house" className="text-washed-timber hover:text-emerald-accent transition-colors">
                  Shorefield Eco House
                </Link>
              </li>
              <li>
                <Link href="/accommodation/curlew-cottage" className="text-washed-timber hover:text-emerald-accent transition-colors">
                  Curlew Cottage
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides Column */}
          <div>
            <h3 className="font-serif text-lg mb-4">Islay Guides</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link href="/availability" className="text-washed-timber hover:text-emerald-accent transition-colors">
                  Check Availability
                </Link>
              </li>
              <li>
                <Link href="/getting-here" className="text-washed-timber hover:text-emerald-accent transition-colors">
                  Travel to Islay
                </Link>
              </li>
              <li>
                <Link href="/explore-islay" className="text-washed-timber hover:text-emerald-accent transition-colors">
                  Explore Islay
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-serif text-lg mb-4">Contact</h3>
            <p className="font-mono text-sm text-washed-timber mb-2">
              Bruichladdich, Isle of Islay<br />
              Scotland PA49
            </p>
            <p className="font-mono text-sm text-washed-timber">
              Host: Pi
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-washed-timber/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm text-washed-timber">
            &copy; {currentYear} Portbahn Islay. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-mono text-sm">
            <span className="text-washed-timber">Superhost since 2017</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
