import type { Metadata } from "next";
import { experiments } from "@/data/play";
import { Container } from "@/components/layout/Container";
import { ExperimentIndex } from "@/components/play/ExperimentIndex";

export const metadata: Metadata = {
  title: "Play",
  description: "Small experiments and visual systems by Anagha MR.",
};

const count = experiments.length;

export default function PlayPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <header className="grid grid-cols-12 gap-x-4 gap-y-8 pb-16 md:pb-24">
          <h1 className="col-span-12 font-display text-6xl text-ivory md:col-span-7 md:text-8xl">Play</h1>
          <div className="col-span-12 self-end md:col-span-5">
            <p className="max-w-sm text-silver">
              Small experiments, visual systems, and things worth breaking.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-stone">
              Sketchbook — {String(count).padStart(2, "0")} {count === 1 ? "entry" : "entries"}
            </p>
          </div>
        </header>
        <ExperimentIndex experiments={experiments} />
      </Container>
    </div>
  );
}
