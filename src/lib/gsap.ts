import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollListener } from "./scrollSync";

// Importing this module anywhere registers ScrollTrigger exactly once and
// hooks it to Lenis's scroll events.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  setScrollListener(() => ScrollTrigger.update());
}

export { gsap, ScrollTrigger };
