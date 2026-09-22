import type { Metadata } from "next";
import Link from "next/link";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { skillAreas } from "@/data/skills";
import { involvement } from "@/data/involvement";
import { Container } from "@/components/layout/Container";
import { AboutSection } from "@/components/about/AboutSection";
import { Metadata as MetaRow } from "@/components/ui/Metadata";

export const metadata: Metadata = {
  title: "About",
  description:
    "Final-year Computer Science student at RNS Institute of Technology focused on AI/ML, computer vision, and applied systems.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">About</p>
          <h1 className="mt-6 max-w-[26ch] text-balance font-display text-4xl leading-[1.08] text-ivory sm:text-5xl md:mt-8 md:text-6xl lg:text-7xl">
            Computer Science undergraduate focused on AI/ML.
          </h1>
          <div className="mt-10 md:mt-14 md:grid md:grid-cols-12 md:gap-x-10">
            <p className="max-w-xl text-lg leading-relaxed text-silver md:col-span-7 md:col-start-4">
              A final-year Computer Science student specialising in AI/ML. Work
              spans software systems, computer vision, IoT/security systems ,full-stack product
              development and AIML.
            </p>
          </div>
        </header>

        <div className="mt-24 md:mt-32">
          <AboutSection index="01" title="Education">
            {education.map((entry) => (
              <div key={entry.institution}>
                <h3 className="text-balance font-display text-3xl text-ivory md:text-4xl">{entry.degree}</h3>
                <p className="mt-2 text-stone">{entry.institution}</p>
                <MetaRow
                  className="mt-5"
                  items={[
                    { label: "Period", value: entry.period },
                    ...(entry.detail
                      ? [{ label: "CGPA", value: entry.detail.replace("CGPA: ", "") }]
                      : []),
                  ]}
                />
              </div>
            ))}
          </AboutSection>

          <AboutSection index="02" title="Experience">
            {experience.map((role) => (
              <article key={role.organization}>
                <h3 className="text-balance font-display text-3xl text-ivory md:text-4xl">{role.role}</h3>
                <p className="mt-2 text-stone">{role.organization}</p>
                <MetaRow className="mt-5" items={[{ label: "Period", value: role.period }]} />
                <p className="mt-8 max-w-xl leading-relaxed text-silver">
                  {role.overview ?? role.summary}
                </p>
                {role.project && (
                  <Link
                    href={`/work/${role.project}`}
                    className="thread-underline mt-6 inline-block font-mono text-xs uppercase tracking-[0.2em] text-ivory"
                  >
                    Project page →
                  </Link>
                )}
              </article>
            ))}
          </AboutSection>

          <AboutSection index="03" title="Skills">
            <dl className="space-y-6">
              {skillAreas.map((group) => (
                <div
                  key={group.category}
                  className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[9rem_1fr]"
                >
                  <dt className="pt-1 font-mono text-xs uppercase tracking-[0.15em] text-stone">
                    {group.category}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-ivory/90">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </AboutSection>

          <AboutSection index="04" title="Involvement">
            <ul className="space-y-5">
              {involvement.map((item) => (
                <li key={item.role} className="flex flex-col sm:flex-row sm:gap-6">
                  <span className="text-ivory sm:w-72 sm:shrink-0">{item.role}</span>
                  <span className="text-stone">{item.organization}</span>
                </li>
              ))}
            </ul>
          </AboutSection>
        </div>
      </Container>
    </div>
  );
}
