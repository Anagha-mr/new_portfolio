import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectItemProps = {
  project: Project;
  index: number;
};

const rowClass = "grid grid-cols-12 items-center gap-4 py-8 md:py-10";

export function ProjectItem({ project, index }: ProjectItemProps) {
  const linked = project.detail !== undefined;

  const content = (
    <>
      <span className="col-span-2 font-mono text-sm text-stone md:col-span-1">
        {String(index).padStart(2, "0")}
      </span>

      <span
        className={`col-span-10 font-display text-3xl transition-colors duration-[var(--duration-fast)] sm:text-4xl md:col-span-7 md:text-5xl ${
          linked ? "text-ivory group-hover:text-cobalt group-focus-visible:text-cobalt" : "text-stone"
        }`}
      >
        {project.title}
      </span>

      <span className="col-span-6 col-start-3 mt-2 font-mono text-xs uppercase tracking-[0.1em] text-stone md:col-span-3 md:col-start-auto md:mt-0">
        {project.category}
      </span>

      <span className="col-span-4 mt-2 text-right font-mono text-xs uppercase tracking-[0.1em] text-silver md:col-span-1 md:mt-0">
        {project.year}
      </span>

      {linked && (
        // The whole row is already the link; this only labels it on hover / focus.
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-2 font-mono text-[10px] uppercase tracking-[0.2em] text-silver opacity-0 transition-opacity duration-[var(--duration-base)] group-hover:opacity-100 group-focus-visible:opacity-100 md:bottom-3"
        >
          View project →
        </span>
      )}
    </>
  );

  return (
    <li className="border-b border-stone/30">
      {linked ? (
        <Link href={`/work/${project.slug}`} className={`group relative ${rowClass}`}>
          {content}
        </Link>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}
