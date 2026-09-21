import type { Tone, WorkflowSystem as WorkflowData } from "@/data/projects";
import { TONES } from "@/components/projects/page/tone";

/** Modules grouped by function inside one tenant boundary; the header rule links the groups. */
export function WorkflowSystem({ data, tone }: { data: WorkflowData; tone: Tone }) {
  const t = TONES[tone];

  return (
    <div data-reveal className={`relative mt-14 border border-dashed ${t.ruleStrong} px-5 pb-10 pt-12 md:px-10 md:pb-12`}>
      <p
        className={`absolute -top-[0.7rem] left-5 flex items-center gap-3 bg-void px-3 font-mono text-xs uppercase tracking-[0.15em] md:left-10 ${t.soft}`}
      >
        <span aria-hidden="true" className="size-1.5 bg-cherry" />
        {data.boundary.label}
        {data.boundary.detail && <span className={t.muted}>· {data.boundary.detail}</span>}
      </p>

      <ol className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-x-10">
        {data.groups.map((group, gi) => (
          <li key={group.name}>
            <div className="flex items-center gap-4">
              <h3 className={`shrink-0 font-mono text-xs uppercase tracking-[0.2em] ${t.strong}`}>
                <span className="mr-3 text-cherry">{String(gi + 1).padStart(2, "0")}</span>
                {group.name}
              </h3>
              <span aria-hidden="true" className={`hidden h-px flex-1 border-t ${t.ruleStrong} md:block`} />
            </div>

            <ul className="relative mt-7">
              <span aria-hidden="true" className={`absolute bottom-4 left-[5px] top-4 w-px bg-stone/40`} />
              {group.modules.map((module) => (
                <li key={module.label} data-reveal className="relative flex gap-5 py-3">
                  <span
                    aria-hidden="true"
                    className={`relative mt-[0.4rem] size-[11px] shrink-0 border ${t.ruleStrong} bg-void`}
                  />
                  <span>
                    <span className="block font-display text-2xl leading-tight">{module.label}</span>
                    {module.detail && (
                      <span className={`mt-1 block font-mono text-[0.7rem] uppercase tracking-[0.1em] ${t.muted}`}>
                        {module.detail}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
