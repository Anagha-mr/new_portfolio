export type ProjectVisual = "workflow" | "spatial" | "timeline" | "monitoring" | "gesture";

export type Tone = "dark" | "ivory";

export type ProjectStatus = {
  label: string;
  /** Short qualifier shown next to the label, e.g. "In development". */
  note?: string;
};

export type Labelled = { label: string; detail?: string };

export type TechGroup = { group: string; items: string[] };

export type Outcome = { value: string; label: string; note?: string };

export type ProjectLink = { label: string; href: string };

/** Project-specific diagram payloads; each is rendered by its own visual world. */
export type WorkflowSystem = {
  kind: "workflow";
  /** Label on the shared boundary that every module sits inside. */
  boundary: Labelled;
  groups: { name: string; modules: Labelled[] }[];
};

export type SpatialSystem = {
  kind: "spatial";
  stages: { name: string; model: string; detail: string }[];
};

export type TimelineSystem = {
  kind: "timeline";
  periods: string[];
  steps: { name: string; detail: string }[];
};

export type MonitoringSystem = {
  kind: "monitoring";
  /** Signal path, hardware side first. */
  path: { name: string; side: "hardware" | "software"; detail?: string }[];
  boundaryLabel: string;
  modules: string[];
  /** Modules that exist but were not individually named in the source. */
  additionalModules: number;
};

export type GestureSystem = {
  kind: "gesture";
  stages: { name: string; detail: string }[];
  latency: string;
};

export type ProjectSystem =
  | WorkflowSystem
  | SpatialSystem
  | TimelineSystem
  | MonitoringSystem
  | GestureSystem;

export type ProjectDetail = {
  visual: ProjectVisual;
  status: ProjectStatus;
  overview: string[];
  role: { summary: string; contributions: string[] };
  system: {
    title: string;
    caption?: string;
    tone: Tone;
    data: ProjectSystem;
  };
  features?: { title: string; items: Labelled[] };
  outcomes?: { title: string; items: Outcome[] };
  technology: TechGroup[];
  links?: ProjectLink[];
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  /** Full period for detail views, e.g. "2026–Present". */
  period: string;
  category: string;
  description: string;
  /** Confirmed technologies only; empty where the stack isn't confirmed. */
  stack: string[];
  featured?: boolean;
  /** Present only for projects with a dedicated page. */
  detail?: ProjectDetail;
};

export type DetailedProject = Project & { detail: ProjectDetail };
