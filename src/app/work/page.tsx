import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { ProjectList } from "@/components/projects/ProjectList";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected software, AI/ML, and systems projects by Anagha MR.",
};

export default function WorkPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <h1 className="font-display text-6xl text-ivory md:text-8xl">Work</h1>
        <div className="mt-16">
          <ProjectList projects={projects} />
        </div>
      </Container>
    </div>
  );
}
