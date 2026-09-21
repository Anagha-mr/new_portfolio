import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Importing this module anywhere registers ScrollTrigger exactly once.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
