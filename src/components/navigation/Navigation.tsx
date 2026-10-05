"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const home = pathname === "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
    setScrolled(false);
  }

  // The bar gets a backing once content scrolls under it; on home, only after the hero.
  useEffect(() => {
    const handleScroll = () => {
      const threshold = home ? window.innerHeight * 0.85 : 80;
      setScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-[var(--duration-base)] ${
        scrolled ? "bg-void/90 backdrop-blur-sm" : ""
      }`}
    >
      <div className="container-editorial flex items-center justify-between py-6">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-ivory transition-colors duration-[var(--duration-fast)] hover:text-silver"
        >
          Anagha MR
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {site.navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`accent-underline font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-[var(--duration-fast)] ${
                      active ? "text-cherry" : "text-ivory/80 hover:text-ivory focus-visible:text-ivory"
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
          ref={toggleRef}
          type="button"
          className="-my-3 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ivory md:hidden"
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
              const active = isActive(item.href);
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
