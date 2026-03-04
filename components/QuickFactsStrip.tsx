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
    <section aria-label="Property quick facts" className="bg-machair-sand">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 md:py-10">
        <dl className="grid grid-cols-2 gap-y-6 gap-x-8 md:flex md:flex-row md:items-baseline">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`flex flex-col${
                i > 0
                  ? " md:border-l md:border-washed-timber md:pl-8 md:ml-8"
                  : ""
              }`}
            >
              <dt
                className="font-mono text-kelp-edge"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                }}
              >
                {fact.label}
              </dt>
              <dd
                className="font-mono text-harbour-stone mt-1"
                style={{ fontSize: "16px", lineHeight: 1.5 }}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
