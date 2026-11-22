"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";

export const THEME_KEY = "gr-theme";

/**
 * Runs in <head> before first paint so a saved light theme never flashes dark.
 * Dark is the brand default; a saved choice wins.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})()`;

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

/** "r,g,b" of the foreground colour for the current theme, for canvas and tween colours */
export const paperRgb = (theme: Theme) => (theme === "light" ? "20,22,19" : "238,236,230");

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Pick up whatever the head script applied
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private mode or storage disabled: the toggle still works for this visit
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
