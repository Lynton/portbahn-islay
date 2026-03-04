interface QuickFactsStripProps {
  sleeps: number;
  bedrooms: number;
  bathrooms: number;
  petsWelcome?: boolean;
  walkToDistillery?: string;
}

interface FactItem {
  label: string;
  value: string;
}

export default function QuickFactsStrip({
  sleeps,
  bedrooms,
  bathrooms,
  petsWelcome,
  walkToDistillery,
}: QuickFactsStripProps) {
  const facts: FactItem[] = [
    { label: "Sleeps", value: String(sleeps) },
    { label: "Bedrooms", value: String(bedrooms) },
    { label: "Bathrooms", value: String(bathrooms) },
  ];

  if (petsWelcome) {
    facts.push({ label: "Pets", value: "Welcome" });
  }

  if (walkToDistillery) {
    facts.push({ label: "Walk to distillery", value: walkToDistillery });
  }

  return (
    <section
      aria-label="Property quick facts"
      className="bg-machair-sand px-6 md:px-12 lg:px-20 py-8"
    >
      <dl className="grid grid-cols-2 gap-y-6 gap-x-8 md:flex md:items-baseline md:gap-0">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={`
              md:flex md:flex-col md:items-start
              ${index > 0 ? "md:border-l md:border-washed-timber md:pl-8 md:ml-8" : ""}
            `}
          >
            <dt className="font-mono text-xs tracking-[0.15em] uppercase text-kelp-edge">
              {fact.label}
            </dt>
            <dd className="font-mono text-base text-harbour-stone mt-1">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
