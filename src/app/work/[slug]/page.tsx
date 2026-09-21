import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { detailedProjects, getAdjacentProjects, getDetailedProject } from "@/data/projects";
import { ProjectPage } from "@/components/projects/page/ProjectPage";

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return detailedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getDetailedProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const { slug } = await params;
  const project = getDetailedProject(slug);

  if (!project) notFound();

  const { index, total } = getAdjacentProjects(slug);

  return <ProjectPage project={project} position={{ index, total }} />;
}
