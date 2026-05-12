import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("should render the app title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Todoish" })).toBeInTheDocument();
  });

  it("should render the theme toggle", () => {
    render(<App />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
