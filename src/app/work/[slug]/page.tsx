import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { Metadata as MetaRow } from "@/components/ui/Metadata";
import { Button } from "@/components/ui/Button";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <MetaRow
          items={[
            { label: "Category", value: project.category },
            { label: "Period", value: project.period },
          ]}
        />
        <h1 className="mt-6 font-display text-6xl text-ivory md:text-8xl">
          {project.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-silver">{project.description}</p>

        {project.stack.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-stone">Stack</p>
            <p className="mt-2 text-ivory">{project.stack.join(" · ")}</p>
          </div>
        )}

        <p className="mt-16 max-w-lg font-mono text-xs uppercase tracking-[0.15em] text-stone">
          Full case study coming soon.
        </p>

        <div className="mt-10">
          <Button href="/work" variant="ghost">
            ← Back to work
          </Button>
        </div>
      </Container>
    </div>
  );
}
