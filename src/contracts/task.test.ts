import { describe, it, expect } from "vitest";
import { taskSchema, subtaskSchema, isValidStatusTransition } from "./task";

function makeValidTask(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Buy groceries",
    description: null,
    status: "todo",
    priority: "P4",
    projectId: null,
    sectionId: null,
    tags: [],
    assigneeId: null,
    startDate: null,
    dueDate: null,
    dueTime: null,
    estimatedMinutes: null,
    recurrenceRule: null,
    parentTaskId: null,
    isPinned: false,
    sortOrder: 0,
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
    completedAt: null,
    archivedAt: null,
    ...overrides,
  };
}

describe("taskSchema", () => {
  it("should validate a minimal valid task", () => {
    const result = taskSchema.safeParse(makeValidTask());
    expect(result.success).toBe(true);
  });

  it("should require a title", () => {
    const result = taskSchema.safeParse(makeValidTask({ title: "" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
    }
  });

  it("should reject title exceeding 500 characters", () => {
    const result = taskSchema.safeParse(makeValidTask({ title: "a".repeat(501) }));
    expect(result.success).toBe(false);
  });

  it("should trim whitespace from title", () => {
    const result = taskSchema.safeParse(makeValidTask({ title: "  hello  " }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("hello");
    }
  });

  it("should reject invalid status values", () => {
    const result = taskSchema.safeParse(makeValidTask({ status: "archived" }));
    expect(result.success).toBe(false);
  });

  it("should accept all valid statuses", () => {
    for (const status of ["todo", "in_progress", "done"]) {
      const result = taskSchema.safeParse(makeValidTask({ status }));
      expect(result.success).toBe(true);
    }
  });

  it("should reject invalid priority values", () => {
    const result = taskSchema.safeParse(makeValidTask({ priority: "P0" }));
    expect(result.success).toBe(false);
  });

  it("should accept all valid priorities", () => {
    for (const priority of ["P1", "P2", "P3", "P4"]) {
      const result = taskSchema.safeParse(makeValidTask({ priority }));
      expect(result.success).toBe(true);
    }
  });

  it("should reject due date before start date", () => {
    const result = taskSchema.safeParse(
      makeValidTask({ startDate: "2025-02-10", dueDate: "2025-02-05" }),
    );
    expect(result.success).toBe(false);
  });

  it("should accept due date equal to start date", () => {
    const result = taskSchema.safeParse(
      makeValidTask({ startDate: "2025-02-10", dueDate: "2025-02-10" }),
    );
    expect(result.success).toBe(true);
  });

  it("should reject dueTime without dueDate", () => {
    const result = taskSchema.safeParse(makeValidTask({ dueTime: "14:00", dueDate: null }));
    expect(result.success).toBe(false);
  });

  it("should accept dueTime with dueDate", () => {
    const result = taskSchema.safeParse(makeValidTask({ dueTime: "14:00", dueDate: "2025-02-10" }));
    expect(result.success).toBe(true);
  });

  it("should reject invalid dueTime format", () => {
    const result = taskSchema.safeParse(
      makeValidTask({ dueTime: "2:00 PM", dueDate: "2025-02-10" }),
    );
    expect(result.success).toBe(false);
  });

  it("should reject recurrenceRule without dueDate", () => {
    const result = taskSchema.safeParse(
      makeValidTask({ recurrenceRule: "FREQ=DAILY", dueDate: null }),
    );
    expect(result.success).toBe(false);
  });

  it("should reject more than 20 tags", () => {
    const tags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
    const result = taskSchema.safeParse(makeValidTask({ tags }));
    expect(result.success).toBe(false);
  });

  it("should reject duplicate tags", () => {
    const result = taskSchema.safeParse(makeValidTask({ tags: ["errand", "errand"] }));
    expect(result.success).toBe(false);
  });

  it("should reject invalid tag characters", () => {
    const result = taskSchema.safeParse(makeValidTask({ tags: ["Invalid Tag!"] }));
    expect(result.success).toBe(false);
  });

  it("should accept valid tags", () => {
    const result = taskSchema.safeParse(makeValidTask({ tags: ["errand", "phone-call"] }));
    expect(result.success).toBe(true);
  });

  it("should reject estimatedMinutes of 0", () => {
    const result = taskSchema.safeParse(makeValidTask({ estimatedMinutes: 0 }));
    expect(result.success).toBe(false);
  });

  it("should accept estimatedMinutes up to 1440", () => {
    const result = taskSchema.safeParse(makeValidTask({ estimatedMinutes: 1440 }));
    expect(result.success).toBe(true);
  });

  it("should reject estimatedMinutes above 1440", () => {
    const result = taskSchema.safeParse(makeValidTask({ estimatedMinutes: 1441 }));
    expect(result.success).toBe(false);
  });

  it("should reject non-UUID id", () => {
    const result = taskSchema.safeParse(makeValidTask({ id: "not-a-uuid" }));
    expect(result.success).toBe(false);
  });
});

describe("subtaskSchema", () => {
  it("should validate a valid subtask", () => {
    const result = subtaskSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440001",
      taskId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Call dentist",
      isCompleted: false,
      sortOrder: 0,
      createdAt: "2025-01-15T10:00:00.000Z",
      updatedAt: "2025-01-15T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should require a title", () => {
    const result = subtaskSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440001",
      taskId: "550e8400-e29b-41d4-a716-446655440000",
      title: "",
      isCompleted: false,
      sortOrder: 0,
      createdAt: "2025-01-15T10:00:00.000Z",
      updatedAt: "2025-01-15T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("isValidStatusTransition", () => {
  it("should allow todo to in_progress", () => {
    expect(isValidStatusTransition("todo", "in_progress")).toBe(true);
  });

  it("should allow todo to done", () => {
    expect(isValidStatusTransition("todo", "done")).toBe(true);
  });

  it("should allow in_progress to done", () => {
    expect(isValidStatusTransition("in_progress", "done")).toBe(true);
  });

  it("should allow done to todo (reopen)", () => {
    expect(isValidStatusTransition("done", "todo")).toBe(true);
  });

  it("should reject done to in_progress", () => {
    expect(isValidStatusTransition("done", "in_progress")).toBe(false);
  });

  it("should reject in_progress to todo", () => {
    expect(isValidStatusTransition("in_progress", "todo")).toBe(false);
  });
});
