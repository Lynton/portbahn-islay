import Link from 'next/link';
import { footerNav } from '@/lib/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-harbour-stone text-sea-spray">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerNav.map((column) => (
            <div key={column.heading}>
              <h3 className="font-serif text-lg mb-4">{column.heading}</h3>
              <ul className="space-y-2 font-mono text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-washed-timber hover:text-emerald-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column — static, not nav data */}
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
