import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Metadata } from "@/components/ui/Metadata";

export function CapabilitiesSection() {
  return (
    <section className="border-t border-stone/30 py-24 md:py-32">
      <Container>
        <SectionLabel index="02" title="Experience / Capabilities" />

        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            {experience.map((role) => (
              <article key={role.organization}>
                <Metadata
                  items={[
                    { label: "Role", value: role.role },
                    { label: "Period", value: role.period },
                  ]}
                />
                <h3 className="mt-4 font-display text-2xl text-ivory md:text-3xl">
                  {role.organization}
                </h3>
                <p className="mt-3 max-w-lg text-stone">{role.summary}</p>
                <ul className="mt-6 space-y-2 text-sm text-silver">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="text-cobalt">
                        —
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="md:col-span-5">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {skills.map((group) => (
                <div key={group.category}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
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
        </div>
      </Container>
    </section>
  );
}
