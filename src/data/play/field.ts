import type { Experiment } from "./types";

export const field: Experiment = {
  id: "pin-field",
  slug: "field",
  title: "Field",
  year: "2026",
  description: "A lil something to satisfy your adhd.",
  type: "Interaction",
  status: "live",
  visual: "field",
  instructions: "Press and drag. Let go.",
  meta: [
    { label: "Medium", value: "WebGL" },
    { label: "Model", value: "Coupled springs" },
    { label: "Input", value: "Pointer · Touch · Keys" },
  ],
};
