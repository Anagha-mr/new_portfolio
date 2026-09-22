import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Play",
  description: "A sketchbook for small experiments.",
};

export default function PlayPage() {
  return (
    <div className="flex min-h-[70vh] flex-col justify-center pt-32 pb-24 md:pt-40 md:pb-32">
      <Container className="w-full">
        <h1 className="font-display text-6xl text-ivory md:text-8xl">Play</h1>
        <p className="mt-8 max-w-lg font-mono text-sm uppercase tracking-[0.15em] text-stone">
          Nothing here yet.
        </p>
      </Container>
    </div>
  );
}
