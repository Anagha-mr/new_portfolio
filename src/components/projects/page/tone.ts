import type { Tone } from "@/data/projects";

export type ToneClasses = {
  surface: string;
  strong: string;
  soft: string;
  muted: string;
  rule: string;
  ruleStrong: string;
};

export const TONES: Record<Tone, ToneClasses> = {
  dark: {
    surface: "bg-void text-ivory",
    strong: "text-ivory",
    soft: "text-silver",
    muted: "text-stone",
    rule: "border-stone/30",
    ruleStrong: "border-stone/60",
  },
  ivory: {
    surface: "bg-ivory text-void",
    strong: "text-void",
    soft: "text-void/75",
    muted: "text-void/60",
    rule: "border-void/15",
    ruleStrong: "border-void/40",
  },
};

export function flipTone(tone: Tone): Tone {
  return tone === "dark" ? "ivory" : "dark";
}
