import type { ReactNode } from "react";
import type { ProjectVisual, Tone } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup } from "./RevealGroup";
import { TONES } from "./tone";

type ProjectSectionProps = {
  index: string;
  title: string;
  tone: Tone;
  visual: ProjectVisual;
  children: ReactNode;
  className?: string;
};

/** Toned band with a numbered label; children marked `data-reveal` animate in with the project's motion. */
export function ProjectSection({ index, title, tone, visual, children, className = "" }: ProjectSectionProps) {
  const t = TONES[tone];

  return (
    <section className={`border-t ${t.rule} ${t.surface} py-20 md:py-28`}>
      <Container>
        <RevealGroup visual={visual} className={className}>
          <div data-reveal>
            <SectionLabel index={index} title={title} tone={tone} />
          </div>
          {children}
        </RevealGroup>
      </Container>
    </section>
  );
}
