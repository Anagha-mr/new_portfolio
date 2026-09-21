"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const onProject = pathname.startsWith("/work/");

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
    setScrolled(false);
  }

  // Project pages have ivory bands; the bar gets a backing once content scrolls under it.
  useEffect(() => {
    if (!onProject) return;
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProject]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-[var(--duration-base)] ${
        onProject && scrolled ? "bg-void/90 backdrop-blur-sm" : ""
      }`}
    >
      <div className="container-editorial flex items-center justify-between py-6">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-ivory"
        >
          Anagha MR
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {site.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`thread-underline font-mono text-xs uppercase tracking-[0.2em] ${
                      active ? "text-cherry" : "text-ivory/80 hover:text-ivory"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="font-mono text-xs uppercase tracking-[0.2em] text-ivory md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="md:hidden border-t border-stone/30 bg-void"
        >
          <ul className="container-editorial flex flex-col gap-6 py-8">
            {site.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-display text-3xl ${
                      active ? "text-cherry" : "text-ivory"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
