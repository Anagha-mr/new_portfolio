type MetadataItem = {
  label: string;
  value: string;
};

type MetadataProps = {
  items: MetadataItem[];
  className?: string;
};

/** Small technical/meta readout — years, categories, stack — in Geist Mono. */
export function Metadata({ items, className = "" }: MetadataProps) {
  return (
    <dl className={`flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-[0.1em] text-stone ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex gap-2">
          <dt className="text-stone/70">{item.label}</dt>
          <dd className="text-silver">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
