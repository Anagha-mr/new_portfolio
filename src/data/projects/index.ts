import type { DetailedProject, Project } from "./types";
import { projectflow } from "./projectflow";
import { roomai } from "./roomai";
import { temporalRag } from "./temporal-rag";
import { gttc } from "./gttc";
import { controlledInterface } from "./controlled-interface";

export type {
  Project,
  DetailedProject,
  ProjectDetail,
  ProjectVisual,
  ProjectSystem,
  WorkflowSystem,
  SpatialSystem,
  TimelineSystem,
  MonitoringSystem,
  GestureSystem,
  Tone,
} from "./types";

const meetrix: Project = {
  slug: "meetrix",
  title: "Meetrix",
  year: "2025",
  period: "2025",
  category: "Software",
  description: "Location optimizer.",
  stack: [],
};

export const projects: Project[] = [
  projectflow,
  roomai,
  temporalRag,
  gttc,
  controlledInterface,
  meetrix,
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Projects that have a dedicated page, in display order. */
export const detailedProjects: DetailedProject[] = projects.filter(
  (project): project is DetailedProject => project.detail !== undefined
);

export function getDetailedProject(slug: string): DetailedProject | undefined {
  return detailedProjects.find((project) => project.slug === slug);
}

/** Neighbours in display order, wrapping at both ends. */
export function getAdjacentProjects(slug: string): {
  index: number;
  total: number;
  previous: DetailedProject;
  next: DetailedProject;
} {
  const total = detailedProjects.length;
  const index = Math.max(
    0,
    detailedProjects.findIndex((project) => project.slug === slug)
  );
  return {
    index,
    total,
    previous: detailedProjects[(index - 1 + total) % total],
    next: detailedProjects[(index + 1) % total],
  };
}
