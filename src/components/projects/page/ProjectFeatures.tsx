import type { DetailedProject, Tone } from "@/data/projects";
import { ProjectSection } from "./ProjectSection";
import { TONES } from "./tone";

export function ProjectFeatures({ project, tone, index }: { project: DetailedProject; tone: Tone; index: string }) {
  const { features, visual } = project.detail;
  if (!features) return null;
  const t = TONES[tone];

  return (
    <ProjectSection index={index} title={features.title} tone={tone} visual={visual}>
      <ul className={`mt-12 border-t ${t.rule}`}>
        {features.items.map((item, i) => (
          <li
            key={item.label}
            data-reveal
            className={`grid grid-cols-12 gap-x-4 gap-y-3 border-b ${t.rule} py-7 md:py-9`}
          >
            <span className={`col-span-2 font-mono text-xs md:col-span-1 md:pt-2 ${t.muted}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="col-span-10 font-display text-2xl md:col-span-5 md:text-4xl">{item.label}</h3>
            {item.detail && (
              <p className={`col-span-10 col-start-3 leading-relaxed md:col-span-5 md:col-start-8 md:pt-2 ${t.soft}`}>
                {item.detail}
              </p>
            )}
          </li>
        ))}
      </ul>
    </ProjectSection>
  );
}
