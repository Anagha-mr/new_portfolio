import type { ComponentType } from "react";
import type { ExperimentVisual } from "@/data/play";
import { FieldStage } from "./field/FieldStage";
import { FieldFallback } from "./field/FieldFallback";

export type StageProps = {
  /** Accessible name for the interactive surface. */
  label: string;
};

export type PreviewProps = { className?: string };

type PlayVisual = {
  /** Fills its positioned parent; owns input, WebGL gating and fallback. */
  Stage: ComponentType<StageProps>;
  /** Static, server-renderable drawing for the index. */
  Preview: ComponentType<PreviewProps>;
};

/** Adding an experiment: a data entry plus one line here. */
export const playVisuals: Record<ExperimentVisual, PlayVisual> = {
  field: { Stage: FieldStage, Preview: FieldFallback },
};
