"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Opacity-only fade on client-side route changes. The first load renders
 * visible so server HTML is readable before hydration, and no transform is
 * applied, so fixed and sticky descendants keep the viewport as their frame.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [trackedPath, setTrackedPath] = useState(pathname);
  const [visible, setVisible] = useState(true);

  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    setVisible(false);
  }

  useEffect(() => {
    if (visible) return;
    // Two frames so the hidden state is painted before the fade starts.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <div
      className={
        visible ? "opacity-100 transition-opacity duration-[var(--duration-base)] ease-editorial" : "opacity-0"
      }
    >
      {children}
    </div>
  );
}
