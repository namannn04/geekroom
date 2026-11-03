"use client";

import { useLenis } from "@/components/motion/SmoothScroll";
import GeekMark from "@/components/ui/GeekMark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { navLinks, site } from "@/data/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    const focusable = () => Array.from(header.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])
      .filter((element) => element.getClientRects().length > 0);
    const firstLink = header.current?.querySelector<HTMLElement>("#mobile-navigation a");
    firstLink?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, lenis]);

  return (
    <header ref={header} role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label={open ? "Navigation menu" : undefined} className="site-navbar fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border pr-2 pl-4 transition-all duration-500 ${
          scrolled || open
            ? "border-line-strong bg-ink/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" aria-label="Geek Room home" className="flex items-center gap-2.5">
          <GeekMark className="h-6 w-auto" />
          <span className="font-display text-[15px] font-bold tracking-tight uppercase">Geek Room</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative z-10 block rounded-full px-4 py-2 font-mono text-xs tracking-[0.14em] uppercase transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-paper"
                  }`}
                >
                  {l.label}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-paper"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <a
          href={site.socials.linktree}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary hidden !py-2.5 md:inline-flex"
        >
          Join community <ArrowUpRight className="size-3.5" />
        </a>

        <button
          ref={toggle}
          type="button"
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative grid size-10 place-items-center rounded-full bg-paper text-ink md:hidden"
        >
          <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
          <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={reduced ? false : { clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: reduced ? 0 : 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 -z-10 flex flex-col justify-between bg-ink px-6 pt-28 pb-10 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : i * 0.03, duration: reduced ? 0 : 0.2 }}
                >
                  <Link href={l.href} aria-current={isActive(pathname, l.href) ? "page" : undefined} className="flex items-baseline gap-4 py-2">
                    <span className="font-mono text-xs text-orange">0{i + 1}</span>
                    <span className={`display text-6xl ${isActive(pathname, l.href) ? "text-signal" : ""}`}>{l.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${site.email}`} className="font-mono text-sm text-muted">
                {site.email}
              </a>
              <a href={site.socials.linktree} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                Join community <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
