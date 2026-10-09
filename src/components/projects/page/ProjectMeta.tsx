import type { DetailedProject } from "@/data/projects";

/** Category, period and status as small technical metadata. */
export function ProjectMeta({ project, className = "" }: { project: DetailedProject; className?: string }) {
  const { status } = project.detail;
  const ongoing = status.label === "Ongoing";

  return (
    <dl
      className={`flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] ${className}`}
    >
      <div className="flex gap-2">
        <dt className="text-stone/70">Category</dt>
        <dd className="text-silver">{project.category}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-stone/70">Period</dt>
        <dd className="text-silver">{project.period}</dd>
      </div>
      <div className="flex items-center gap-2">
        <dt className="text-stone/70">Status</dt>
        <dd className="flex items-center gap-2 text-silver">
          {ongoing && <span aria-hidden="true" className="size-1.5 rounded-full bg-cobalt" />}
          {status.label}
          {status.note && <span className="text-stone">· {status.note}</span>}
        </dd>
      </div>
    </dl>
  );
}
