"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { useThreadAnchor } from "@/thread/ThreadLayer";

type ProjectItemProps = {
  project: Project;
  index: number;
};

const rowClass = "grid grid-cols-12 items-center gap-4 py-8 md:py-10";

export function ProjectItem({ project, index }: ProjectItemProps) {
  const { attach, ...handlers } = useThreadAnchor(project.slug);
  const linked = project.detail !== undefined;

  const content = (
    <>
      <span className="col-span-2 font-mono text-sm text-stone md:col-span-1">
        {String(index).padStart(2, "0")}
      </span>

      <span
        className={`col-span-10 font-display text-3xl transition-colors duration-[var(--duration-fast)] sm:text-4xl md:col-span-7 md:text-5xl ${
          linked ? "text-ivory group-hover:text-cherry group-focus-visible:text-cherry" : "text-stone"
        }`}
      >
        {project.title}
      </span>

      <span className="col-span-6 mt-2 font-mono text-xs uppercase tracking-[0.1em] text-stone md:col-span-3 md:mt-0">
        {project.category}
      </span>

      <span className="col-span-6 mt-2 text-right font-mono text-xs uppercase tracking-[0.1em] text-silver md:col-span-1 md:mt-0">
        {project.year}
      </span>
    </>
  );

  return (
    <li ref={attach} {...(linked ? handlers : {})} className="border-b border-stone/30">
      {linked ? (
        <Link href={`/work/${project.slug}`} className={`group ${rowClass}`}>
          {content}
        </Link>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}
