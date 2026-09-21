import type { DetailedProject, Tone } from "@/data/projects";
import { ProjectSection } from "./ProjectSection";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectFeatures } from "./ProjectFeatures";
import { ProjectOutcomes } from "./ProjectOutcomes";
import { ProjectTechnology } from "./ProjectTechnology";
import { ProjectNav } from "./ProjectNav";
import { ProjectHero, ProjectSystemDiagram } from "./worlds";
import { TONES, flipTone } from "./tone";

const pad = (n: number) => String(n).padStart(2, "0");

type ProjectPageProps = { project: DetailedProject; position: { index: number; total: number } };

/**
 * Shared structure: hero, overview and role, technical system, then the optional
 * features and outcomes, technology and navigation. Bands alternate dark / ivory.
 */
export function ProjectPage({ project, position }: ProjectPageProps) {
  const { detail } = project;
  const { system } = detail;

  const overviewTone: Tone = flipTone(system.tone);
  const featuresTone = flipTone(system.tone);
  const outcomesTone = flipTone(detail.features ? featuresTone : system.tone);
  const technologyTone = flipTone(detail.outcomes ? outcomesTone : detail.features ? featuresTone : system.tone);

  // Section numbers: overview and system are always 01 and 02.
  const featuresIndex = 3;
  const outcomesIndex = featuresIndex + (detail.features ? 1 : 0);
  const technologyIndex = outcomesIndex + (detail.outcomes ? 1 : 0);

  return (
    <article>
      <ProjectHero project={project} position={position} />
      <ProjectOverview project={project} tone={overviewTone} index="01" />
      <ProjectSection index="02" title={system.title} tone={system.tone} visual={detail.visual}>
        {system.caption && (
          <p data-reveal className={`mt-6 max-w-md ${TONES[system.tone].soft}`}>
            {system.caption}
          </p>
        )}
        <ProjectSystemDiagram system={system.data} tone={system.tone} />
      </ProjectSection>
      <ProjectFeatures project={project} tone={featuresTone} index={pad(featuresIndex)} />
      <ProjectOutcomes project={project} tone={outcomesTone} index={pad(outcomesIndex)} />
      <ProjectTechnology project={project} tone={technologyTone} index={pad(technologyIndex)} />
      <ProjectNav slug={project.slug} />
    </article>
  );
}
