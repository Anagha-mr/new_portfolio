import type { ComponentType } from "react";
import type { DetailedProject, ProjectSystem, ProjectVisual, Tone } from "@/data/projects";
import { WorkflowHero } from "../worlds/workflow/WorkflowHero";
import { WorkflowSystem } from "../worlds/workflow/WorkflowSystem";
import { SpatialHero } from "../worlds/spatial/SpatialHero";
import { SpatialSystem } from "../worlds/spatial/SpatialSystem";
import { TimelineHero } from "../worlds/timeline/TimelineHero";
import { TimelineSystem } from "../worlds/timeline/TimelineSystem";
import { MonitoringHero } from "../worlds/monitoring/MonitoringHero";
import { MonitoringSystem } from "../worlds/monitoring/MonitoringSystem";
import { GestureHero } from "../worlds/gesture/GestureHero";
import { GestureSystem } from "../worlds/gesture/GestureSystem";

export type HeroProps = { project: DetailedProject; position: { index: number; total: number } };

const HEROES: Record<ProjectVisual, ComponentType<HeroProps>> = {
  workflow: WorkflowHero,
  spatial: SpatialHero,
  timeline: TimelineHero,
  monitoring: MonitoringHero,
  gesture: GestureHero,
};

export function ProjectHero(props: HeroProps) {
  const Hero = HEROES[props.project.detail.visual];
  return <Hero {...props} />;
}

/** Renders the project-specific diagram for a system payload. */
export function ProjectSystemDiagram({ system, tone }: { system: ProjectSystem; tone: Tone }) {
  switch (system.kind) {
    case "workflow":
      return <WorkflowSystem data={system} tone={tone} />;
    case "spatial":
      return <SpatialSystem data={system} tone={tone} />;
    case "timeline":
      return <TimelineSystem data={system} tone={tone} />;
    case "monitoring":
      return <MonitoringSystem data={system} tone={tone} />;
    case "gesture":
      return <GestureSystem data={system} tone={tone} />;
  }
}
