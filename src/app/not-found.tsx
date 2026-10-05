import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col justify-center">
      <Container className="w-full">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cherry">404</p>
        <h1 className="mt-4 font-display text-6xl text-ivory md:text-8xl">
          Page not found.
        </h1>
        <Link href="/" className="accent-underline mt-10 inline-block font-mono text-xs uppercase tracking-[0.2em] text-ivory transition-colors duration-[var(--duration-fast)] hover:text-silver">
          Back home →
        </Link>
      </Container>
    </div>
  );
}
