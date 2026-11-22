"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

/** Sun/moon button that switches between the dark and light themes. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const reduced = useReducedMotion();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line-strong text-paper transition-colors hover:border-paper ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduced ? false : { y: 14, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={reduced ? { opacity: 0 } : { y: -14, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
