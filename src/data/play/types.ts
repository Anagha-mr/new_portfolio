/** Key into the Play registry; each maps to a stage and a static preview. */
export type ExperimentVisual = "field";

export type ExperimentStatus = "live" | "draft" | "archived";

export type ExperimentMeta = { label: string; value: string };

export type Experiment = {
  /** Stable internal identifier; survives slug or title changes. */
  id: string;
  slug: string;
  title: string;
  year: string;
  description: string;
  /** Short classification, e.g. "Interaction". */
  type: string;
  status: ExperimentStatus;
  visual: ExperimentVisual;
  /** One-line interaction hint shown beside the stage. */
  instructions?: string;
  meta?: ExperimentMeta[];
};
