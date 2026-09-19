import type { Metadata } from "next";
import { education } from "@/data/education";
import { skills } from "@/data/skills";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Metadata as MetaRow } from "@/components/ui/Metadata";

export const metadata: Metadata = {
  title: "About",
  description: "Anagha MR — Computer Science, AI/ML, and the systems behind The Red Thread.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <h1 className="font-display text-6xl text-ivory md:text-8xl">About</h1>

        <p className="mt-12 max-w-2xl font-display text-2xl leading-snug text-ivory md:text-3xl">
          Final-year Computer Science student specialising in AI/ML, building
          software, computer vision, and IoT/security systems.
        </p>

        <div className="mt-20">
          <SectionLabel index="01" title="Education" />
          <div className="mt-8 space-y-8">
            {education.map((entry) => (
              <div key={entry.institution} className="border-b border-stone/30 pb-8">
                <MetaRow
                  items={[
                    { label: "Period", value: entry.period },
                    ...(entry.detail ? [{ label: "CGPA", value: entry.detail.replace("CGPA: ", "") }] : []),
                  ]}
                />
                <p className="mt-3 text-lg text-ivory">{entry.degree}</p>
                <p className="text-stone">{entry.institution}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionLabel index="02" title="Skills" />
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {skills.map((group) => (
              <div key={group.category}>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-stone">
                  {group.category}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-ivory/90">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
