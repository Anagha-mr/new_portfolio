import type { DetailedProject, Tone } from "@/data/projects";
import { ProjectSection } from "./ProjectSection";
import { TONES } from "./tone";

export function ProjectOutcomes({ project, tone, index }: { project: DetailedProject; tone: Tone; index: string }) {
  const { outcomes, visual } = project.detail;
  if (!outcomes) return null;
  const t = TONES[tone];

  return (
    <ProjectSection index={index} title={outcomes.title} tone={tone} visual={visual}>
      <dl className="mt-12 flex flex-col gap-12 md:flex-row md:flex-wrap md:gap-x-32 md:gap-y-14">
        {outcomes.items.map((item) => (
          <div key={item.label} data-reveal className="flex flex-col">
            <dd className="order-1 font-display text-6xl leading-none md:text-8xl">{item.value}</dd>
            <dt className={`order-2 mt-4 font-mono text-xs uppercase tracking-[0.15em] ${t.muted}`}>
              {item.label}
            </dt>
            {item.note && <dd className={`order-3 mt-1 text-sm ${t.soft}`}>{item.note}</dd>}
          </div>
        ))}
      </dl>
    </ProjectSection>
  );
}
