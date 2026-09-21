import type { DetailedProject, Tone } from "@/data/projects";
import { ProjectSection } from "./ProjectSection";
import { TONES } from "./tone";

const NUMBERED = new Set(["workflow", "monitoring"]);

export function ProjectOverview({ project, tone, index }: { project: DetailedProject; tone: Tone; index: string }) {
  const { overview, role, links, visual } = project.detail;
  const t = TONES[tone];
  const [lead, ...rest] = overview;
  const numbered = NUMBERED.has(visual);

  return (
    <ProjectSection index={index} title="Overview" tone={tone} visual={visual}>
      <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p data-reveal className="font-display text-3xl leading-[1.15] md:text-[2.75rem]">
            {lead}
          </p>
          {rest.map((paragraph) => (
            <p key={paragraph} data-reveal className={`mt-8 max-w-xl leading-relaxed ${t.soft}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <p data-reveal className={`font-mono text-xs uppercase tracking-[0.2em] ${t.muted}`}>
            Role
          </p>
          <p data-reveal className="mt-4 leading-relaxed">
            {role.summary}
          </p>
          <ul className={`mt-8 space-y-3 text-sm ${t.soft}`}>
            {role.contributions.map((item, i) => (
              <li key={item} data-reveal className="flex gap-4">
                <span
                  aria-hidden="true"
                  className={`shrink-0 pt-px font-mono text-xs ${numbered ? t.muted : "text-cherry"}`}
                >
                  {numbered ? String(i + 1).padStart(2, "0") : "—"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {links && links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.15em]">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="thread-underline" target="_blank" rel="noreferrer">
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProjectSection>
  );
}
