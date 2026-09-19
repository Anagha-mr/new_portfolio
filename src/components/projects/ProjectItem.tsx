import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectItemProps = {
  project: Project;
  index: number;
};

export function ProjectItem({ project, index }: ProjectItemProps) {
  return (
    <li className="group border-b border-stone/30">
      <Link
        href={`/work/${project.slug}`}
        className="grid grid-cols-12 items-center gap-4 py-8 md:py-10"
      >
        <span className="col-span-2 font-mono text-sm text-stone md:col-span-1">
          {String(index).padStart(2, "0")}
        </span>

        <span className="col-span-10 font-display text-3xl text-ivory transition-colors duration-[var(--duration-fast)] group-hover:text-cherry sm:text-4xl md:col-span-7 md:text-5xl">
          {project.title}
        </span>

        <span className="col-span-6 mt-2 font-mono text-xs uppercase tracking-[0.1em] text-stone md:col-span-3 md:mt-0">
          {project.category}
        </span>

        <span className="col-span-6 mt-2 text-right font-mono text-xs uppercase tracking-[0.1em] text-silver md:col-span-1 md:mt-0">
          {project.year}
        </span>
      </Link>
    </li>
  );
}
