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

  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMobileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ─── DESKTOP / TABLET NAV ────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[60px] bg-sea-spray border-b border-washed-timber px-12">

        {/* Wordmark */}
        <Link href="/" className="font-serif font-bold text-3xl text-harbour-stone tracking-normal shrink-0">
          Portbahn Islay
        </Link>

        {/* Centred nav — hidden on mobile */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-[60px] items-stretch">
          <ul className="flex items-stretch m-0 p-0" style={{ listStyle: 'none' }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="group relative flex items-center">
                <Link
                  href={item.href}
                  className="font-mono text-lg tracking-widest uppercase text-harbour-stone flex items-center gap-1 whitespace-nowrap h-[60px] px-4 transition-opacity duration-150"
                  style={{
                    opacity: isActive(item.href) ? 1 : 0.8,
                    borderBottom: isActive(item.href) ? '2px solid var(--color-kelp-edge)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = isActive(item.href) ? '1' : '0.8')}
                >
                  {item.label}
                  <span className="text-[7px] opacity-40 inline-block transition-transform duration-200">▾</span>
                </Link>

                {/* Dropdown */}
                <div
                  className="absolute top-full pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto bg-sea-spray border border-washed-timber border-t-2 border-t-kelp-edge z-[300] transition-opacity duration-150"
                  style={{
                    left: item.wide ? 'auto' : '50%',
                    right: item.wide ? 0 : 'auto',
                    transform: item.wide ? 'none' : 'translateX(-50%)',
                    minWidth: item.wide ? '360px' : '220px',
                    padding: '8px 0',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  {item.wide ? (
                    <div className="grid grid-cols-2">
                      {[1, 2].map((col) => (
                        <div key={col}>
                          {item.dropdown.filter((d) => (d as { col?: number }).col === col).map((d) => (
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
                  <div className="h-px bg-washed-timber mx-3 my-1.5 opacity-40" />
                  <Link
                    href={item.href}
                    className="block py-1.5 px-[18px] font-mono text-sm tracking-widest uppercase text-kelp-edge opacity-75 hover-link"
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
          <Link href="/availability" className="hidden md:block typo-btn whitespace-nowrap" style={{ padding: '10px 18px', fontSize: 'var(--text-sm)' }}>
            AVAILABILITY
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2 w-9 h-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="block h-[1.5px] w-[22px] bg-harbour-stone transition-transform duration-200" style={{ transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
            <span className="block h-[1.5px] w-[22px] bg-harbour-stone transition-opacity duration-150" style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block h-[1.5px] w-[22px] bg-harbour-stone transition-transform duration-200" style={{ transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* ─── MOBILE MENU OVERLAY ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] md:hidden" style={{ background: 'rgba(43,44,46,0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setMobileOpen(false)} />
      )}
      <div
        ref={menuRef}
        className="fixed top-[60px] left-0 right-0 z-[100] md:hidden bg-sea-spray border-b border-washed-timber overflow-y-auto transition-transform duration-250"
        style={{
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-110%)',
          maxHeight: 'calc(100vh - 60px)',
          boxShadow: mobileOpen ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="border-b border-washed-timber">
            <div className="flex items-center justify-between">
              <Link href={item.href}
                className={`block flex-1 py-[18px] px-6 font-mono text-lg tracking-widest uppercase text-harbour-stone ${isActive(item.href) ? 'font-semibold' : ''}`}>
                {item.label}
              </Link>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                className="py-[18px] px-6 font-mono text-3xl text-harbour-stone opacity-50 bg-transparent border-none cursor-pointer transition-transform duration-200"
                style={{ transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'none' }}
              >
                ▾
              </button>
            </div>

            {mobileExpanded === item.label && (
              <div className="bg-machair-sand py-1 pb-3">
                {item.dropdown.map((d) => (
                  <Link key={d.href} href={d.href}
                    className={`block py-2.5 px-8 font-mono text-md text-harbour-stone ${pathname === d.href ? 'opacity-100 font-semibold' : 'opacity-75'}`}>
                    {d.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="p-5 px-6">
          <Link href="/availability" className="typo-btn block text-center w-full" style={{ padding: '14px 24px', fontSize: 'var(--text-base)' }}>
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
      className={`flex items-center justify-between py-2 px-[18px] font-mono text-md transition-colors duration-100 ${active ? 'text-kelp-edge' : 'text-harbour-stone'} hover:bg-machair-sand hover:text-kelp-edge`}
      style={{ background: active ? 'rgba(31,94,77,0.06)' : undefined }}
    >
      <span>{label}</span>
      {active && <span className="text-2xs tracking-wide opacity-45 uppercase">← here</span>}
    </Link>
  );
}
