import Link from "next/link";
import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-stone/30 py-10">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="font-mono text-xs uppercase tracking-[0.2em]">
          <p className="text-ivory">{site.name}</p>
          <p className="mt-2 text-stone">{site.role}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.2em] text-stone">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="accent-underline hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">
          © {site.year}
        </p>
      </Container>
    </footer>
  );
}
