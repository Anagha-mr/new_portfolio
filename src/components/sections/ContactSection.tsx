import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export function ContactSection() {
  return (
    <section className="border-t border-stone/30 py-24 md:py-32">
      <Container>
        <SectionLabel index="04" title="Contact" />

        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl font-display text-3xl text-ivory md:text-4xl">
            {site.email ? (
              <a href={`mailto:${site.email}`} className="thread-underline">
                {site.email}
              </a>
            ) : (
              "Get in touch."
            )}
          </p>

          <Button href="/contact">Contact →</Button>
        </div>

        {site.socials.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.15em] text-stone">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} className="thread-underline hover:text-ivory">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
