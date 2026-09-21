import { education } from "@/data/education";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Metadata } from "@/components/ui/Metadata";
import { Button } from "@/components/ui/Button";
import { ThreadLayer } from "@/thread/ThreadLayer";

export function AboutSnapshot() {
  return (
    <section className="border-t border-stone/30 py-24 md:py-32">
      <Container>
        <SectionLabel index="03" title="About" />

        <ThreadLayer preset="about" className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="max-w-2xl font-display text-2xl leading-snug text-ivory md:text-3xl">
              Computer Science undergraduate focused on AI/ML, computer vision,
              and applied systems work.
            </p>

            {education.map((entry) => (
              <div key={entry.institution} className="mt-8">
                <Metadata
                  items={[
                    { label: "Period", value: entry.period },
                    ...(entry.detail ? [{ label: "CGPA", value: entry.detail.replace("CGPA: ", "") }] : []),
                  ]}
                />
                <p className="mt-3 text-ivory">{entry.degree}</p>
                <p className="text-stone">{entry.institution}</p>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 md:text-right">
            <Button href="/about" variant="ghost">
              More about me →
            </Button>
          </div>
        </ThreadLayer>
      </Container>
    </section>
  );
}
