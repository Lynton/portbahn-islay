'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    label: 'ACCOMMODATION',
    href: '/accommodation',
    dropdown: [
      { label: 'Portbahn House',      href: '/accommodation/portbahn-house' },
      { label: 'Shorefield Eco House', href: '/accommodation/shorefield-eco-house' },
      { label: 'Curlew Cottage',       href: '/accommodation/curlew-cottage' },
    ],
  },
  {
    label: 'TRAVEL',
    href: '/islay-travel',
    dropdown: [
      { label: 'Ferry to Islay',               href: '/islay-travel/ferry-to-islay' },
      { label: 'Flights to Islay',             href: '/islay-travel/flights-to-islay' },
      { label: 'Planning Your Trip',           href: '/islay-travel/planning-your-trip' },
      { label: 'Arriving on Islay',            href: '/islay-travel/arriving-on-islay' },
      { label: 'Getting Around',               href: '/islay-travel/getting-around-islay' },
      { label: 'Travelling Without a Car',     href: '/islay-travel/travelling-without-a-car' },
      { label: 'Travelling With Your Dog',     href: '/islay-travel/travelling-to-islay-with-your-dog' },
    ],
  },
  {
    label: 'EXPLORE',
    href: '/explore-islay',
    dropdown: [
      { label: 'Whisky Distilleries',     href: '/explore-islay/islay-distilleries', col: 1 },
      { label: 'Beaches',                 href: '/explore-islay/islay-beaches',      col: 1 },
      { label: 'Wildlife & Birdwatching', href: '/explore-islay/islay-wildlife',     col: 1 },
      { label: 'Walking',                 href: '/explore-islay/walking',            col: 1 },
      { label: 'Archaeology & History',   href: '/explore-islay/archaeology-history',col: 1 },
      { label: 'Islay Geology',           href: '/explore-islay/islay-geology',      col: 1 },
      { label: 'Food & Drink',            href: '/explore-islay/food-and-drink',     col: 2 },
      { label: 'Family Holidays',         href: '/explore-islay/family-holidays',    col: 2 },
      { label: 'Dog-Friendly Islay',      href: '/explore-islay/dog-friendly-islay', col: 2 },
      { label: 'Islay Villages',          href: '/explore-islay/islay-villages',     col: 2 },
      { label: 'Visit Jura',              href: '/explore-islay/visit-jura',         col: 2 },
    ],
    wide: true,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ─── DESKTOP / TABLET NAV ────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{
          height: '60px',
          background: 'var(--color-sea-spray)',
          borderBottom: '1px solid var(--color-washed-timber)',
          padding: '0 48px',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: '"The Seasons", Georgia, serif',
            fontWeight: 700,
            fontSize: '16px',
            letterSpacing: '0.01em',
            color: 'var(--color-harbour-stone)',
            flexShrink: 0,
          }}
        >
          Portbahn Islay
        </Link>

        {/* Centred nav — hidden on mobile */}
        <nav
          className="hidden md:flex"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '60px',
            alignItems: 'stretch',
          }}
        >
          <ul className="flex items-stretch" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 0 }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="group relative flex items-center">
                <Link
                  href={item.href}
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '13px',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--color-harbour-stone)',
                    opacity: isActive(item.href) ? 1 : 0.8,
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.15s',
                    height: '60px',
                    borderBottom: isActive(item.href) ? '2px solid var(--color-kelp-edge)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = isActive(item.href) ? '1' : '0.8')}
                >
                  {item.label}
                  <span style={{ fontSize: '7px', opacity: 0.4, display: 'inline-block', transition: 'transform 0.2s' }}>▾</span>
                </Link>

                {/* Dropdown */}
                <div
                  className="absolute top-full pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto"
                  style={{
                    left: item.wide ? 'auto' : '50%',
                    right: item.wide ? 0 : 'auto',
                    transform: item.wide ? 'none' : 'translateX(-50%)',
                    background: 'var(--color-sea-spray)',
                    border: '1px solid var(--color-washed-timber)',
                    borderTop: '2px solid var(--color-kelp-edge)',
                    minWidth: item.wide ? '360px' : '220px',
                    padding: '8px 0',
                    zIndex: 300,
                    transition: 'opacity 0.15s ease',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  {item.wide ? (
                    // Two-column explore dropdown
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                      {[1, 2].map((col) => (
                        <div key={col}>
                          {item.dropdown
                            .filter((d) => (d as { col?: number }).col === col)
                            .map((d) => (
                              <DropdownLink key={d.href} href={d.href} label={d.label} active={pathname === d.href} />
                            ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    item.dropdown.map((d) => (
                      <DropdownLink key={d.href} href={d.href} label={d.label} active={pathname === d.href} />
                    ))
                  )}
                  <div style={{ height: '1px', background: 'var(--color-washed-timber)', margin: '6px 12px', opacity: 0.4 }} />
                  <Link
                    href={item.href}
                    style={{
                      display: 'block',
                      padding: '7px 18px',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-kelp-edge)',
                      opacity: 0.75,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
                  >
                    View all {item.label.toLowerCase()} →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: AVAILABILITY pill + mobile hamburger */}
        <div className="flex items-center gap-4">
          {/* AVAILABILITY pill — hidden on mobile */}
          <Link
            href="/availability"
            className="hidden md:block"
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'var(--color-emerald-accent)',
              color: '#fff',
              padding: '10px 18px',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            AVAILABILITY
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            style={{ width: '36px', height: '36px' }}
          >
            <span
              style={{
                display: 'block', height: '1.5px', width: '22px',
                background: 'var(--color-harbour-stone)',
                transition: 'transform 0.2s',
                transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block', height: '1.5px', width: '22px',
                background: 'var(--color-harbour-stone)',
                opacity: mobileOpen ? 0 : 1,
                transition: 'opacity 0.15s',
              }}
            />
            <span
              style={{
                display: 'block', height: '1.5px', width: '22px',
                background: 'var(--color-harbour-stone)',
                transition: 'transform 0.2s',
                transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* ─── MOBILE MENU OVERLAY ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          style={{ background: 'rgba(43,44,46,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        ref={menuRef}
        className="fixed top-[60px] left-0 right-0 z-[100] md:hidden"
        style={{
          background: 'var(--color-sea-spray)',
          borderBottom: '1px solid var(--color-washed-timber)',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform 0.25s ease',
          maxHeight: 'calc(100vh - 60px)',
          overflowY: 'auto',
          boxShadow: mobileOpen ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <div key={item.label} style={{ borderBottom: '1px solid var(--color-washed-timber)' }}>
            <div className="flex items-center justify-between">
              <Link
                href={item.href}
                style={{
                  display: 'block',
                  flex: 1,
                  padding: '18px 24px',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '13px',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: 'var(--color-harbour-stone)',
                  fontWeight: isActive(item.href) ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                style={{
                  padding: '18px 24px',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '16px',
                  color: 'var(--color-harbour-stone)',
                  opacity: 0.5,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              >
                ▾
              </button>
            </div>

            {mobileExpanded === item.label && (
              <div style={{ background: 'var(--color-machair-sand)', padding: '4px 0 12px' }}>
                {item.dropdown.map((d) => (
                  <Link
                    key={d.href}
                    href={d.href}
                    style={{
                      display: 'block',
                      padding: '10px 32px',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '12px',
                      color: 'var(--color-harbour-stone)',
                      opacity: pathname === d.href ? 1 : 0.75,
                      fontWeight: pathname === d.href ? 600 : 400,
                    }}
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Availability CTA */}
        <div style={{ padding: '20px 24px' }}>
          <Link
            href="/availability"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '14px 24px',
              background: 'var(--color-emerald-accent)',
              color: '#fff',
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            CHECK AVAILABILITY
          </Link>
        </div>
      </div>
    </>
  );
}

function DropdownLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 18px',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '12px',
        color: active ? 'var(--color-kelp-edge)' : 'var(--color-harbour-stone)',
        background: active ? 'rgba(31,94,77,0.06)' : 'transparent',
        transition: 'background 0.1s, color 0.1s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--color-machair-sand)';
        (e.currentTarget as HTMLElement).style.color = 'var(--color-kelp-edge)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = active ? 'rgba(31,94,77,0.06)' : 'transparent';
        (e.currentTarget as HTMLElement).style.color = active ? 'var(--color-kelp-edge)' : 'var(--color-harbour-stone)';
      }}
    >
      <span>{label}</span>
      {active && (
        <span style={{ fontSize: '8px', letterSpacing: '0.06em', opacity: 0.45, textTransform: 'uppercase' }}>
          ← here
        </span>
      )}
    </Link>
  );
}
