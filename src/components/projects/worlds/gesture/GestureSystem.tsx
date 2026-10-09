import type { GestureSystem as GestureData, Tone } from "@/data/projects";
import { TONES } from "@/components/projects/page/tone";

/** Four stages left to right, with the end-to-end latency bracketed underneath. */
export function GestureSystem({ data, tone }: { data: GestureData; tone: Tone }) {
  const t = TONES[tone];

  return (
    <div className="mt-14">
      <ol className="grid grid-cols-1 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {data.stages.map((stage, i) => (
          <li key={stage.name} data-reveal className={`relative border-t pt-6 ${t.ruleStrong}`}>
            <p className={`font-mono text-xs ${t.accent}`}>{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{stage.name}</h3>
            <p className={`mt-3 max-w-[15rem] text-sm leading-relaxed ${t.soft}`}>{stage.detail}</p>
            {i < data.stages.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute -top-[0.7rem] right-0 hidden bg-void pl-2 font-mono text-xs md:block ${t.muted}`}
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <div data-reveal className="mt-12 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em]">
        <span aria-hidden="true" className={`h-2 flex-1 border-x border-b ${t.ruleStrong}`} />
        <span className={t.soft}>
          Interaction latency <span className="text-ivory">{data.latency}</span>
        </span>
        <span aria-hidden="true" className={`h-2 flex-1 border-x border-b ${t.ruleStrong}`} />
      </div>
    </div>
  );
}
