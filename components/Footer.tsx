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
    <footer style={{ background: 'var(--color-sound-of-islay)' }}>
      {/* Main footer grid */}
      <div
        style={{
          padding: '88px 48px 64px',
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '80px',
          alignItems: 'start',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              fontFamily: '"The Seasons", Georgia, serif',
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 52px)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: 'var(--color-sea-spray)',
              marginBottom: '20px',
            }}
          >
            Portbahn
            <br />
            Islay
          </div>
          <p
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              lineHeight: 1.8,
              color: 'var(--color-washed-timber)',
              marginBottom: '28px',
            }}
          >
            Three self-catering
            <br />
            holiday properties.
            <br />
            Bruichladdich, Islay.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Airbnb Superhost · Since 2017',
              'Isle of Islay, Scotland',
            ].map((cred) => (
              <span
                key={cred}
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '8px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,250,0.3)',
                }}
              >
                {cred}
              </span>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
          }}
        >
          {FOOTER_COLS.map((col) => (
            <div key={col.label}>
              <p
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,250,0.45)',
                  marginBottom: '18px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {col.label}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '13px',
                        color: 'var(--color-washed-timber)',
                        display: 'block',
                        padding: '7px 0',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-sea-spray)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-washed-timber)')}
                    >
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
      <div
        style={{
          padding: '20px 48px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '10px',
          color: 'rgba(255,255,250,0.4)',
          letterSpacing: '0.05em',
        }}
      >
        <span>&copy; {currentYear} Portbahn Islay. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link
            href="/privacy"
            style={{ color: 'rgba(255,255,250,0.3)', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-sea-spray)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,250,0.3)')}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            style={{ color: 'rgba(255,255,250,0.3)', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-sea-spray)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,250,0.3)')}
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
