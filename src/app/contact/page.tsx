import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Anagha MR.",
};

const displayHref = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const rowClass =
  "flex flex-col gap-1 border-t border-stone/30 py-5 sm:flex-row sm:items-baseline sm:gap-8";
const labelClass = "font-mono text-xs uppercase tracking-[0.2em] text-stone sm:w-32 sm:shrink-0";
const linkClass = "group accent-underline w-fit break-words text-lg text-ivory";

export default function ContactPage() {
  const channels = [
    { label: "Email", href: `mailto:${site.email}`, text: site.email, external: false },
    ...site.socials.map((social) => ({
      label: social.label,
      href: social.href,
      text: displayHref(social.href),
      external: true,
    })),
  ];

  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col justify-center pt-32 pb-24 md:pt-40 md:pb-32">
      <Container className="w-full">
        <h1 className="font-display text-5xl leading-none text-ivory sm:text-6xl md:text-8xl">
          Get in touch.
        </h1>

        <ul className="mt-16 max-w-3xl md:mt-24">
          {channels.map((channel) => (
            <li key={channel.href} className={rowClass}>
              <span className={labelClass}>{channel.label}</span>
              <a
                href={channel.href}
                className={linkClass}
                {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {channel.text}
                {channel.external && <span className="sr-only"> (opens in a new tab)</span>}
                {channel.external && (
                  <span
                    aria-hidden="true"
                    className="ml-2 text-stone transition-colors duration-[var(--duration-fast)] group-hover:text-cherry group-focus-visible:text-cherry"
                  >
                    ↗
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
