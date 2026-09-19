"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Minimal mount-fade, retriggered per route. Placeholder for GSAP-driven
 * transitions in a later sprint — kept as a single wrapper so swapping the
 * implementation later doesn't touch any page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [trackedPath, setTrackedPath] = useState(pathname);
  const [visible, setVisible] = useState(false);

  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    setVisible(false);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [trackedPath]);

  return (
    <div
      className={`transition-all duration-[var(--duration-slow)] ease-editorial ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
