import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Anagha MR.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-[70vh] flex-col justify-center pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <h1 className="font-display text-6xl text-ivory md:text-8xl">Contact</h1>

        {site.email ? (
          <a
            href={`mailto:${site.email}`}
            className="thread-underline mt-10 inline-block font-display text-3xl text-ivory md:text-4xl"
          >
            {site.email}
          </a>
        ) : (
          <p className="mt-10 max-w-md font-mono text-sm uppercase tracking-[0.15em] text-stone">
            Contact details coming soon.
          </p>
        )}

        {site.socials.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.15em] text-stone">
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
    </div>
  );
}
