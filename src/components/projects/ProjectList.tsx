import type { Project } from "@/data/projects";
import { ProjectItem } from "./ProjectItem";

type ProjectListProps = {
  projects: Project[];
};

/** Editorial project index — deliberately not a card grid. */
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="border-t border-stone/30">
      {projects.map((project, i) => (
        <ProjectItem key={project.slug} project={project} index={i + 1} />
      ))}
    </ul>
  );
}
