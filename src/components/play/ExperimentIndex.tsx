import Link from "next/link";
import { statusLabel, type Experiment } from "@/data/play";
import { playVisuals } from "./registry";

const pad = (n: number) => String(n).padStart(2, "0");

function ExperimentEntry({ experiment, index }: { experiment: Experiment; index: number }) {
  const { Preview } = playVisuals[experiment.visual];

  return (
    <li className="border-b border-stone/30">
      <Link
        href={`/play/${experiment.slug}`}
        className="group grid grid-cols-12 gap-x-4 gap-y-8 py-12 md:py-16"
      >
        <span className="col-span-2 pt-3 font-mono text-sm text-stone transition-colors duration-[var(--duration-fast)] group-hover:text-cobalt group-focus-visible:text-cobalt md:col-span-1">
          {pad(index)}
        </span>

        <div className="col-span-10 md:col-span-6">
          <h2 className="font-display text-6xl leading-[0.9] text-ivory group-hover:italic group-focus-visible:italic md:text-8xl">
            {experiment.title}
          </h2>
          <p className="mt-6 max-w-md text-silver">{experiment.description}</p>
          <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.1em] text-stone">
            <span>{experiment.type}</span>
            <span aria-hidden="true">·</span>
            <span>{experiment.year}</span>
            <span aria-hidden="true">·</span>
            <span>{statusLabel[experiment.status]}</span>
          </p>
        </div>

        <div className="col-span-12 md:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/40">
            <Preview className="absolute inset-0 h-full w-full p-6 opacity-70 transition-opacity duration-[var(--duration-base)] group-hover:opacity-100 group-focus-visible:opacity-100" />
          </div>
          <p className="mt-3 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-stone">
            <span>Interactive</span>
            <span className="transition-colors duration-[var(--duration-fast)] group-hover:text-ivory group-focus-visible:text-ivory">
              Open →
            </span>
          </p>
        </div>
      </Link>
    </li>
  );
}

/** Editorial list of experiments. Adding one is a data change only. */
export function ExperimentIndex({ experiments }: { experiments: Experiment[] }) {
  if (experiments.length === 0) {
    return (
      <p className="border-t border-stone/30 py-12 font-mono text-xs uppercase tracking-[0.2em] text-stone">
        Empty for now.
      </p>
    );
  }

  return (
    <ol className="border-t border-stone/30">
      {experiments.map((experiment, i) => (
        <ExperimentEntry key={experiment.id} experiment={experiment} index={i + 1} />
      ))}
    </ol>
  );
}
