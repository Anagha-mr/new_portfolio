type SectionLabelProps = {
  index: string;
  title: string;
  /** Use on ivory surfaces. */
  tone?: "dark" | "ivory";
};

export function SectionLabel({ index, title, tone = "dark" }: SectionLabelProps) {
  const ivory = tone === "ivory";

  return (
    <div
      className={`flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] ${
        ivory ? "text-void/60" : "text-stone"
      }`}
    >
      <span className={ivory ? "text-deep-cobalt" : "text-cobalt"}>{index}</span>
      <span aria-hidden="true" className={`h-px w-8 ${ivory ? "bg-void/30" : "bg-stone/40"}`} />
      <h2 className={ivory ? "text-void" : "text-ivory"}>{title}</h2>
    </div>
  );
}
