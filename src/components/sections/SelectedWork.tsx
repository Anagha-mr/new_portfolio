import { getFeaturedProjects } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectList } from "@/components/projects/ProjectList";
import { Button } from "@/components/ui/Button";
import { ThreadLayer } from "@/thread/ThreadLayer";

export function SelectedWork() {
  const featured = getFeaturedProjects();

  return (
    <section className="border-t border-stone/30 py-24 md:py-32">
      <Container>
        <SectionLabel index="01" title="Selected Work" />
        <ThreadLayer preset="work" className="mt-12">
          <ProjectList projects={featured} />
        </ThreadLayer>
        <div className="mt-12">
          <Button href="/work" variant="ghost">
            View all work →
          </Button>
        </div>
      </Container>
    </section>
  );
}
