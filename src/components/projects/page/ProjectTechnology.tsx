import type { DetailedProject, Tone } from "@/data/projects";
import { ProjectSection } from "./ProjectSection";
import { TONES } from "./tone";

export function ProjectTechnology({ project, tone, index }: { project: DetailedProject; tone: Tone; index: string }) {
  const { technology, visual } = project.detail;
  const t = TONES[tone];

  return (
    <ProjectSection index={index} title="Technology" tone={tone} visual={visual}>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:grid-cols-5">
        {technology.map((group) => (
          <div key={group.group} data-reveal>
            <h3 className={`font-mono text-xs uppercase tracking-[0.2em] ${t.muted}`}>{group.group}</h3>
            <ul className="mt-4 space-y-1.5">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ProjectSection>
  );
}
