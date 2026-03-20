'use client';

import Link from 'next/link';

const FOOTER_COLS = [
  {
    label: 'ACCOMMODATION',
    links: [
      { label: 'Portbahn House',       href: '/accommodation/portbahn-house' },
      { label: 'Shorefield Eco House', href: '/accommodation/shorefield-eco-house' },
      { label: 'Curlew Cottage',       href: '/accommodation/curlew-cottage' },
      { label: 'All Properties',       href: '/accommodation' },
    ],
  },
  {
    label: 'TRAVEL',
    links: [
      { label: 'Ferry to Islay',           href: '/islay-travel/ferry-to-islay' },
      { label: 'Flights to Islay',         href: '/islay-travel/flights-to-islay' },
      { label: 'Planning Your Trip',       href: '/islay-travel/planning-your-trip' },
      { label: 'Getting Around',           href: '/islay-travel/getting-around-islay' },
      { label: 'Travelling With Your Dog', href: '/islay-travel/travelling-to-islay-with-your-dog' },
    ],
  },
  {
    label: 'EXPLORE',
    links: [
      { label: 'Whisky Distilleries',   href: '/explore-islay/islay-distilleries' },
      { label: 'Beaches',               href: '/explore-islay/islay-beaches' },
      { label: 'Wildlife',              href: '/explore-islay/islay-wildlife' },
      { label: 'Walking',               href: '/explore-islay/walking' },
      { label: 'Food & Drink',          href: '/explore-islay/food-and-drink' },
      { label: 'Visit Jura',            href: '/explore-islay/visit-jura' },
    ],
  },
  {
    label: 'INFORMATION',
    links: [
      { label: 'Check Availability', href: '/availability' },
      { label: 'Getting Here',       href: '/getting-here' },
      { label: 'About Us',           href: '/about' },
      { label: 'Contact',            href: '/contact' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sound-of-islay">
      {/* Main footer grid */}
      <div className="max-w-[1400px] mx-auto grid items-start px-12" style={{ padding: '88px 48px 64px', gridTemplateColumns: '220px 1fr', gap: '80px' }}>

        {/* Brand column */}
        <div>
          <div className="font-serif font-bold text-sea-spray tracking-tight mb-5" style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.0 }}>
            Portbahn<br />Islay
          </div>
          <p className="font-mono text-base text-washed-timber leading-loose mb-7">
            Three self-catering<br />holiday properties.<br />Bruichladdich, Islay.
          </p>
          <div className="flex flex-col gap-2">
            {['Airbnb Superhost · Since 2017', 'Isle of Islay, Scotland'].map((cred) => (
              <span key={cred} className="font-mono text-2xs tracking-widest uppercase" style={{ color: 'rgba(255,255,250,0.45)' }}>{cred}</span>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-4 gap-10">
          {FOOTER_COLS.map((col) => (
            <div key={col.label}>
              <p className="font-mono text-sm tracking-spread uppercase mb-[18px] pb-3" style={{ color: 'rgba(255,255,250,0.6)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                {col.label}
              </p>
              <ul className="m-0 p-0" style={{ listStyle: 'none' }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-[7px] font-mono text-lg text-washed-timber transition-colors duration-200 hover:text-sea-spray">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Base bar */}
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-12 py-5 font-mono text-sm tracking-wide" style={{ borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,250,0.55)' }}>
        <span>&copy; {currentYear} Portbahn Islay. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="transition-colors duration-200 hover:text-sea-spray" style={{ color: 'rgba(255,255,250,0.5)' }}>Privacy</Link>
          <Link href="/terms" className="transition-colors duration-200 hover:text-sea-spray" style={{ color: 'rgba(255,255,250,0.5)' }}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}
