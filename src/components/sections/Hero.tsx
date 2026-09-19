import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { ThreadFallback } from "@/components/three/ThreadFallback";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      {/* Cosmic depth — the guaranteed CSS baseline. Works with WebGL off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 78% 22%, rgba(181,177,170,0.10), transparent 60%), radial-gradient(120% 90% at 20% 100%, rgba(133,14,23,0.12), transparent 55%), #080807",
        }}
      />

      {/* Thread fallback — only rendered when the 3D filament isn't. */}
      <ThreadFallback />

      {/* 3D layer — subtle enhancement only, never the only carrier of meaning.
          Renders at every breakpoint; the spatial engine's own quality tier
          scales geometry/particles/interaction down on smaller screens. */}
      <HeroCanvas className="pointer-events-none absolute inset-0" />

      <Container className="relative flex flex-1 flex-col justify-between py-32 md:py-40">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-stone">
              {site.role} · {site.program}
            </p>
            <h1 className="font-display text-[18vw] leading-[0.85] text-ivory sm:text-[14vw] md:text-[9vw]">
              ANAGHA
              <br />
              MR
            </h1>
          </div>

          <div className="col-span-12 mt-10 md:col-span-4 md:mt-2 md:text-right">
            <p className="font-display text-xl italic text-silver md:text-2xl">
              {site.heroKicker}
            </p>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-end font-mono text-xs uppercase tracking-[0.2em] text-stone">
          <span className="flex items-center gap-3">
            Scroll
            <span aria-hidden="true" className="h-8 w-px bg-stone/50" />
          </span>
        </div>
      </Container>
    </section>
  );
}
