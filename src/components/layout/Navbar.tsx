"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/site";

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-bg/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-[92px] items-center justify-between md:h-[120px]">
        <Link href="/" aria-label="Geek Room home" className="shrink-0">
          <Image
            src="/images/brand/logo.png"
            alt="Geek Room"
            width={88}
            height={76}
            priority
            className="h-12 w-auto md:h-[60px]"
          />
        </Link>

        <ul className="hidden items-center gap-1 rounded-md bg-surface-2 p-1.5 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`btn-bebas block rounded px-4 py-2 transition-colors ${
                  isActive(pathname, l.href) ? "text-fg" : "text-subtle hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact-us"
          className="gradient-border btn-bebas hidden rounded-md px-9 py-3 text-base transition-transform hover:scale-[1.03] md:inline-block"
        >
          Contact Us
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="rounded-md bg-surface-2 p-2.5 md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-x flex flex-col gap-2 pb-6">
              {[...navLinks, { label: "Contact Us", href: "/contact-us" }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`btn-bebas block rounded-md border border-line px-4 py-3 text-base ${
                      isActive(pathname, l.href) ? "bg-fg text-bg" : "text-fg"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
