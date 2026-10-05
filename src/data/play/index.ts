import type { Experiment, ExperimentStatus } from "./types";
import { field } from "./field";

export type { Experiment, ExperimentMeta, ExperimentStatus, ExperimentVisual } from "./types";

/** Display order; the index number is derived from position. */
export const experiments: Experiment[] = [field];

export const statusLabel: Record<ExperimentStatus, string> = {
  live: "Live",
  draft: "Draft",
  archived: "Archived",
};

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.slug === slug);
}

export function getExperimentPosition(slug: string): { index: number; total: number } {
  return {
    index: Math.max(0, experiments.findIndex((experiment) => experiment.slug === slug)),
    total: experiments.length,
  };
}
