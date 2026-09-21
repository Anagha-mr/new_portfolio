import type { MonitoringSystem as MonitoringData, Tone } from "@/data/projects";
import { TONES } from "@/components/projects/page/tone";

const pad = (n: number) => String(n).padStart(2, "0");

/** Signal path across the hardware / software boundary, then the eight modules it feeds. */
export function MonitoringSystem({ data, tone }: { data: MonitoringData; tone: Tone }) {
  const t = TONES[tone];
  const firstSoftware = data.path.findIndex((step) => step.side === "software");
  const moduleCount = data.modules.length + data.additionalModules;

  return (
    <div className="mt-14">
      <div data-reveal className="relative">
        <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-stone/40 md:hidden" />
        <span aria-hidden="true" className="absolute left-0 right-0 top-[5px] hidden h-px bg-stone/40 md:block" />
        <span
          aria-hidden="true"
          className="signal-x absolute top-[3px] hidden size-[5px] rounded-full bg-ivory md:block"
        />
        <span aria-hidden="true" className="signal-y absolute left-[3px] size-[5px] rounded-full bg-ivory md:hidden" />

        <ol className="grid grid-cols-1 md:grid-cols-4">
          {data.path.map((step, i) => (
            <li key={step.name} className="relative pb-12 pl-9 md:pb-0 md:pl-0 md:pr-6 md:pt-12">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1 size-[11px] border md:top-0 ${
                  step.side === "hardware" ? "border-ivory bg-ivory" : "border-ivory bg-void"
                }`}
              />
              {i === firstSoftware && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute -top-7 left-0 right-0 border-t border-dashed border-stone/60 md:-top-2 md:bottom-0 md:-left-3 md:right-auto md:border-l md:border-t-0"
                  />
                  <span className="absolute -top-[2.6rem] right-0 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cherry md:-top-6 md:left-[-0.6rem] md:right-auto">
                    {data.boundaryLabel}
                  </span>
                </>
              )}
              <p className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] ${t.muted}`}>
                {step.side} · {pad(i + 1)}
              </p>
              <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{step.name}</h3>
              {step.detail && <p className={`mt-2 max-w-[16rem] text-sm leading-relaxed ${t.soft}`}>{step.detail}</p>}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 md:mt-24">
        <p data-reveal className={`font-mono text-xs uppercase tracking-[0.2em] ${t.muted}`}>
          Integrated modules · {pad(moduleCount)}
        </p>
        <ul className={`mt-6 grid grid-cols-2 border-l border-t md:grid-cols-4 ${t.rule}`}>
          {Array.from({ length: moduleCount }, (_, i) => {
            const name = data.modules[i];
            return (
              <li
                key={i}
                data-reveal
                className={`flex min-h-28 flex-col justify-between border-b border-r p-4 md:min-h-32 md:p-5 ${t.rule}`}
              >
                <span className={`font-mono text-xs ${name ? "text-cherry" : t.muted}`}>{pad(i + 1)}</span>
                <span className={`font-display text-xl leading-tight md:text-2xl ${name ? "" : t.muted}`}>
                  {name ?? "Additional module"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
