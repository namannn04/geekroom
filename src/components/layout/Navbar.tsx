"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { navLinks, site } from "@/data/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
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
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border pr-2 pl-4 transition-all duration-500 ${
          scrolled || open
            ? "border-line-strong bg-ink/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" aria-label="Geek Room home" className="flex items-center gap-2.5">
          <Image src="/images/brand/logo.png" alt="" width={36} height={31} priority className="h-7 w-auto" />
          <span className="font-display text-[15px] font-bold tracking-tight uppercase">Geek Room</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
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
          href={site.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary hidden !py-2.5 md:inline-flex"
        >
          Join community <ArrowUpRight className="size-3.5" />
        </a>

        <button
          type="button"
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
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="grid-paper fixed inset-0 -z-10 flex flex-col justify-between bg-ink px-6 pt-28 pb-10 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <Link href={l.href} className="flex items-baseline gap-4 py-2">
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
              <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                Join community <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
