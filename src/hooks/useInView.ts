"use client";

import { useEffect, useState, type RefObject } from "react";

/** Tracks whether an element intersects the viewport, so loops can pause off-screen. */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
