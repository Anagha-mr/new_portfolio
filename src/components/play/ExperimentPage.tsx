import { statusLabel, type Experiment } from "@/data/play";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Metadata } from "@/components/ui/Metadata";
import { InteractionHint } from "./InteractionHint";
import { playVisuals } from "./registry";

const pad = (n: number) => String(n).padStart(2, "0");

type ExperimentPageProps = {
  experiment: Experiment;
  position: { index: number; total: number };
};

/**
 * The stage fills the viewport on desktop with the caption laid over it. On
 * small screens it becomes a bounded box so the page can still be scrolled by
 * touching outside it.
 */
export function ExperimentPage({ experiment, position }: ExperimentPageProps) {
  const { Stage } = playVisuals[experiment.visual];
  const meta = [
    { label: "Year", value: experiment.year },
    { label: "Type", value: experiment.type },
    { label: "Status", value: statusLabel[experiment.status] },
    ...(experiment.meta ?? []),
  ];

  return (
    <article
      aria-labelledby="experiment-title"
      className="relative flex flex-col overflow-hidden bg-void md:h-[100svh] md:min-h-[640px]"
    >
      <div className="relative mt-36 h-[56svh] min-h-[340px] md:absolute md:inset-0 md:mt-0 md:h-auto md:min-h-0">
        <Stage label={`${experiment.title}, interactive pin bed`} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-72 bg-gradient-to-t from-void via-void/70 to-transparent md:block"
      />

      <Container className="pointer-events-none absolute inset-x-0 top-0 z-10 flex w-full items-start justify-between pt-24 md:pt-28">
        <Button href="/play" variant="ghost" className="pointer-events-auto">
          ← Play
        </Button>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
          {pad(position.index + 1)} / {pad(position.total)}
        </p>
      </Container>

      <Container className="relative z-10 w-full pt-10 pb-16 md:pointer-events-none md:mt-auto md:pt-0 md:pb-12 [@media(pointer:coarse)]:pointer-events-auto">
        <div className="grid grid-cols-12 gap-x-4 gap-y-8">
          <div className="col-span-12 md:col-span-6">
            <h1 id="experiment-title" className="font-display text-6xl leading-[0.9] text-ivory md:text-8xl">
              {experiment.title}
            </h1>
            <p className="mt-6 max-w-sm text-silver">{experiment.description}</p>
          </div>
          <div className="col-span-12 flex flex-col gap-6 self-end md:col-span-6 md:items-end">
            <InteractionHint instructions={experiment.instructions} className="text-ivory/80" />
            <Metadata items={meta} className="md:justify-end" />
          </div>
        </div>
      </Container>
    </article>
  );
}
