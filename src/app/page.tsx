import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { AboutSnapshot } from "@/components/sections/AboutSnapshot";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <IntroSection />
      <SelectedWork />
      <CapabilitiesSection />
      <AboutSnapshot />
      <ContactSection />
    </>
  );
}
