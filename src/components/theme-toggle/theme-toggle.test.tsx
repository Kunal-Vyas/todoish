import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("should render a button with accessible label", () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label");
  });

  it("should cycle theme on click", () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");

    // Default is "system", so label shows next = "Light mode"
    expect(button).toHaveAttribute("aria-label", "Light mode");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "Dark mode");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "System mode");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "Light mode");
  });

  it("should show correct label in light mode", () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);
    expect(screen.getByTestId("theme-toggle")).toHaveAttribute("aria-label", "Dark mode");
  });

  it("should show correct label in dark mode", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    expect(screen.getByTestId("theme-toggle")).toHaveAttribute("aria-label", "System mode");
  });
});
