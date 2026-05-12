import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("should render the app title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Todoish" })).toBeInTheDocument();
  });

  it("should render the theme toggle", () => {
    render(<App />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("should render the quick-add input", () => {
    render(<App />);
    expect(screen.getByTestId("quick-add-input")).toBeInTheDocument();
  });

  it("should show empty state when no tasks exist", () => {
    render(<App />);
    expect(screen.getByTestId("task-list-empty")).toBeInTheDocument();
  });

  it("should add a task and show it in the list", () => {
    render(<App />);
    const input = screen.getByTestId("quick-add-input");

    fireEvent.change(input, { target: { value: "Buy groceries" } });
    const form = input.closest("form");
    if (form) fireEvent.submit(form);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.queryByTestId("task-list-empty")).not.toBeInTheDocument();
  });
});
