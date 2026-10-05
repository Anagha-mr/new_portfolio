import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experiments, getExperiment, getExperimentPosition } from "@/data/play";
import { ExperimentPage } from "@/components/play/ExperimentPage";

type ExperimentRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return experiments.map((experiment) => ({ slug: experiment.slug }));
}

export async function generateMetadata({ params }: ExperimentRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  if (!experiment) return {};

  return {
    title: `${experiment.title} — Play`,
    description: experiment.description,
    openGraph: { title: experiment.title, description: experiment.description },
  };
}

export default async function ExperimentRoute({ params }: ExperimentRouteProps) {
  const { slug } = await params;
  const experiment = getExperiment(slug);

  if (!experiment) notFound();

  return <ExperimentPage experiment={experiment} position={getExperimentPosition(slug)} />;
}
