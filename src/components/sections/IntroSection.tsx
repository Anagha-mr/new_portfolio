import { Container } from "@/components/layout/Container";

export function IntroSection() {
  return (
    <section className="border-t border-stone/30 py-24 md:py-32">
      <Container>
        <p className="max-w-3xl font-display text-3xl leading-snug text-ivory sm:text-4xl md:text-5xl">
          Final-year Computer Science student specialising in AI/ML — building
          software, computer vision, and IoT/security systems.
        </p>
      </Container>
    </section>
  );
}
