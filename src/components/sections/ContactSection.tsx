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
          <p className="max-w-xl break-words font-display text-3xl text-ivory md:text-4xl">
            <a href={`mailto:${site.email}`} className="accent-underline">
              {site.email}
            </a>
          </p>

          <Button href="/contact">Contact →</Button>
        </div>

        <ul className="mt-10 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.2em] text-stone">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="accent-underline transition-colors duration-[var(--duration-fast)] hover:text-ivory"
              >
                {social.label} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
