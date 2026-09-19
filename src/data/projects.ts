export type Project = {
  slug: string;
  title: string;
  /** Primary display year, e.g. the year a project started. */
  year: string;
  /** Full period text for detail views, e.g. "2026–Present". */
  period: string;
  category: string;
  description: string;
  /**
   * Confirmed technologies only. Left empty where the source material
   * doesn't confirm a specific stack — do not infer or fill these in.
   */
  stack: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "projectflow",
    title: "ProjectFlow",
    year: "2026",
    period: "2026–Present",
    category: "Software / SaaS",
    description: "Multi-tenant SaaS platform for interior design studios.",
    stack: [],
    featured: true,
  },
  {
    slug: "roomai",
    title: "RoomAI",
    year: "2026",
    period: "2026–Present",
    category: "AI / Software",
    description: "AI-powered interior design application.",
    stack: [],
    featured: true,
  },
  {
    slug: "temporal-rag",
    title: "Temporal RAG",
    year: "2026",
    period: "2026",
    category: "AI / RAG",
    description:
      "News story tracker built on a temporal retrieval-augmented generation pipeline.",
    stack: ["RAG", "ChromaDB"],
    featured: true,
  },
  {
    slug: "gttc",
    title: "GTTC",
    year: "2026",
    period: "2026–Present",
    category: "Software Internship",
    description:
      "Unified security dashboard for GTTC, built across 8 integrated modules.",
    stack: ["React", "FastAPI", "FFmpeg", "HLS.js"],
    featured: true,
  },
  {
    slug: "gesture-interface",
    title: "Gesture Interface",
    year: "2025",
    period: "2025",
    category: "Computer Vision",
    description: "Gesture-based interface for human-computer interaction.",
    stack: [],
    featured: true,
  },
  {
    slug: "meetrix",
    title: "Meetrix",
    year: "2025",
    period: "2025",
    category: "Software",
    description: "Location optimizer.",
    stack: [],
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
