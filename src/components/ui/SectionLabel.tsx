type SectionLabelProps = {
  index: string;
  title: string;
};

/** Numbered mono label used atop each major editorial section. */
export function SectionLabel({ index, title }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-stone">
      <span className="text-cherry">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-stone/40" />
      <h2 className="text-ivory">{title}</h2>
    </div>
  );
}
