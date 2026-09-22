import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

type AboutSectionProps = {
  index: string;
  title: string;
  children: ReactNode;
};

/** Ruled row: section label on the left, content on the right. */
export function AboutSection({ index, title, children }: AboutSectionProps) {
  return (
    <Reveal>
      <section className="grid grid-cols-1 gap-8 border-t border-stone/30 py-10 md:grid-cols-12 md:gap-x-10 md:py-14">
        <div className="md:col-span-3">
          <SectionLabel index={index} title={title} />
        </div>
        <div className="md:col-span-9">{children}</div>
      </section>
    </Reveal>
  );
}
