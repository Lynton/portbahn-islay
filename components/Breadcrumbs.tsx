import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-sea-spray">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <ol className="flex items-center space-x-2 font-mono text-sm text-harbour-stone">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-harbour-stone opacity-40">/</span>
                )}
                {isLast ? (
                  <span className="text-harbour-stone" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-emerald-accent hover:underline transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}


