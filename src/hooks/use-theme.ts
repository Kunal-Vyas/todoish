import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "system";
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(resolved: ResolvedTheme): void {
  if (resolved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function subscribeToSystemChanges(callback: () => void): () => void {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const listeners = new Set<() => void>();

function setTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(resolveTheme(theme));
  listeners.forEach((fn) => fn());
}

function getSnapshot(): Theme {
  return getStoredTheme();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const resolved = resolveTheme(theme);

  const toggle = useCallback(() => {
    const next: Record<Theme, Theme> = {
      light: "dark",
      dark: "system",
      system: "light",
    };
    setTheme(next[theme]);
  }, [theme]);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (theme !== "system") return;
    return subscribeToSystemChanges(() => {
      applyTheme(getSystemTheme());
      listeners.forEach((fn) => fn());
    });
  }, [theme]);

  return { theme, resolved, setTheme, toggle } as const;
}
