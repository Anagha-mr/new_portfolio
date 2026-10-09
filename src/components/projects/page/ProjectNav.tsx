import Link from "next/link";
import { getAdjacentProjects } from "@/data/projects";
import { Container } from "@/components/layout/Container";

const pad = (n: number) => String(n).padStart(2, "0");

const titleClass =
  "mt-3 font-display text-3xl leading-tight transition-colors duration-[var(--duration-fast)] group-hover:text-cobalt group-focus-visible:text-cobalt md:text-5xl";

/** Previous / next in display order, wrapping at the ends, with a route back to the index. */
export function ProjectNav({ slug }: { slug: string }) {
  const { index, total, previous, next } = getAdjacentProjects(slug);

  return (
    <nav aria-label="Project navigation" className="border-t border-stone/30 bg-void py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <Link
            href={`/work/${previous.slug}`}
            className="group col-span-1 md:col-span-4"
            aria-label={`Previous project: ${previous.title}`}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
              ← {pad(((index - 1 + total) % total) + 1)} · {previous.year}
            </p>
            <p className={titleClass}>{previous.title}</p>
          </Link>

          <div className="order-last col-span-2 md:order-none md:col-span-4 md:text-center">
            <Link
              href="/work"
              className="accent-underline font-mono text-xs uppercase tracking-[0.2em] text-stone hover:text-ivory"
            >
              All work
            </Link>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">
              {pad(index + 1)} / {pad(total)}
            </p>
          </div>

          <Link
            href={`/work/${next.slug}`}
            className="group col-span-1 text-right md:col-span-4"
            aria-label={`Next project: ${next.title}`}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
              {pad(((index + 1) % total) + 1)} · {next.year} →
            </p>
            <p className={titleClass}>{next.title}</p>
          </Link>
        </div>
      </Container>
    </nav>
  );
}
