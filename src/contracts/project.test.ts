import { describe, it, expect } from "vitest";
import { projectSchema, sectionSchema } from "./project";

function makeValidProject(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Website Redesign",
    color: "#3B82F6",
    description: null,
    isArchived: false,
    sortOrder: 0,
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
    ...overrides,
  };
}

function makeValidSection(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440001",
    projectId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Backlog",
    sortOrder: 0,
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
    ...overrides,
  };
}

describe("projectSchema", () => {
  it("should validate a valid project", () => {
    const result = projectSchema.safeParse(makeValidProject());
    expect(result.success).toBe(true);
  });

  it("should require a name", () => {
    const result = projectSchema.safeParse(makeValidProject({ name: "" }));
    expect(result.success).toBe(false);
  });

  it("should trim whitespace from name", () => {
    const result = projectSchema.safeParse(makeValidProject({ name: "  Work  " }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Work");
    }
  });

  it("should reject name exceeding 120 characters", () => {
    const result = projectSchema.safeParse(makeValidProject({ name: "a".repeat(121) }));
    expect(result.success).toBe(false);
  });

  it("should reject invalid hex colors", () => {
    const invalidColors = ["red", "#FF", "#GGGGGG", "3B82F6", "#3b82f"];
    for (const color of invalidColors) {
      const result = projectSchema.safeParse(makeValidProject({ color }));
      expect(result.success).toBe(false);
    }
  });

  it("should accept valid hex colors", () => {
    const validColors = ["#3B82F6", "#ffffff", "#000000", "#aBcDeF"];
    for (const color of validColors) {
      const result = projectSchema.safeParse(makeValidProject({ color }));
      expect(result.success).toBe(true);
    }
  });

  it("should reject description exceeding 5000 characters", () => {
    const result = projectSchema.safeParse(makeValidProject({ description: "a".repeat(5001) }));
    expect(result.success).toBe(false);
  });

  it("should accept null description", () => {
    const result = projectSchema.safeParse(makeValidProject({ description: null }));
    expect(result.success).toBe(true);
  });
});

describe("sectionSchema", () => {
  it("should validate a valid section", () => {
    const result = sectionSchema.safeParse(makeValidSection());
    expect(result.success).toBe(true);
  });

  it("should require a name", () => {
    const result = sectionSchema.safeParse(makeValidSection({ name: "" }));
    expect(result.success).toBe(false);
  });

  it("should require a projectId", () => {
    const result = sectionSchema.safeParse(makeValidSection({ projectId: "not-a-uuid" }));
    expect(result.success).toBe(false);
  });
});
