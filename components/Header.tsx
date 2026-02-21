import Link from 'next/link';
import { primaryNav } from '@/lib/navigation';

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
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className="font-mono text-sm text-harbour-stone group-hover:text-emerald-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                    <div className="bg-sea-spray border border-washed-timber shadow-lg min-w-[200px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-3 font-mono text-sm text-harbour-stone hover:bg-machair-sand hover:text-emerald-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono text-sm text-harbour-stone hover:text-emerald-accent transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
