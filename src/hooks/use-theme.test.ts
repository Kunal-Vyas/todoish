import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useTheme } from "./use-theme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("should default to system theme", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("system");
  });

  it("should resolve to light when system prefers light", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolved).toBe("light");
  });

  it("should persist theme choice to localStorage", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(result.current.theme).toBe("dark");
  });

  it("should apply data-theme attribute on dark", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should remove data-theme attribute on light", () => {
    document.documentElement.setAttribute("data-theme", "dark");

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("light");
    });

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("should toggle light → dark → system → light", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("light");
    });
    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe("system");

    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe("light");
  });

  it("should load persisted theme on mount", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
