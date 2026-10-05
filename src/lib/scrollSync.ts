// Lets Lenis drive ScrollTrigger without the global smooth-scroll layer
// importing GSAP: `lib/gsap` registers here when a page actually loads it.
let onScroll: (() => void) | null = null;

export function setScrollListener(listener: () => void) {
  onScroll = listener;
}

export function notifyScroll() {
  onScroll?.();
}
