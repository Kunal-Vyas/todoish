import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTask, getTask, listTasks, updateTask, deleteTask } from "./task.agent";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createTask", () => {
  it("should create a task with only a title and sensible defaults", () => {
    const result = createTask({ title: "Buy groceries" });
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.title).toBe("Buy groceries");
    expect(result.data.status).toBe("todo");
    expect(result.data.priority).toBe("P4");
    expect(result.data.tags).toEqual([]);
    expect(result.data.dueDate).toBeNull();
    expect(result.data.id).toBeDefined();
    expect(result.data.createdAt).toBeDefined();
  });

  it("should create a fully-populated task", () => {
    const result = createTask({
      title: "Plan event",
      description: "Venue and catering",
      priority: "P1",
      tags: ["errand", "phone"],
      startDate: "2025-06-01",
      dueDate: "2025-06-15",
      dueTime: "14:00",
      estimatedMinutes: 120,
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.description).toBe("Venue and catering");
    expect(result.data.priority).toBe("P1");
    expect(result.data.tags).toEqual(["errand", "phone"]);
    expect(result.data.startDate).toBe("2025-06-01");
    expect(result.data.dueDate).toBe("2025-06-15");
    expect(result.data.dueTime).toBe("14:00");
    expect(result.data.estimatedMinutes).toBe(120);
  });

  it("should fail with empty title", () => {
    const result = createTask({ title: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_TITLE_REQUIRED");
  });

  it("should fail with whitespace-only title", () => {
    const result = createTask({ title: "   " });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_TITLE_REQUIRED");
  });

  it("should trim whitespace from title", () => {
    const result = createTask({ title: "  hello  " });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe("hello");
  });

  it("should fail with title exceeding 500 characters", () => {
    const result = createTask({ title: "a".repeat(501) });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_TITLE_TOO_LONG");
  });

  it("should deduplicate tags", () => {
    const result = createTask({ title: "Test", tags: ["errand", "errand"] });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.tags).toEqual(["errand"]);
  });

  it("should reject uppercase tags", () => {
    const result = createTask({ title: "Test", tags: ["ERRAND"] });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_TAG_INVALID");
  });

  it("should fail with more than 20 tags", () => {
    const result = createTask({
      title: "Test",
      tags: Array.from({ length: 21 }, (_, i) => `tag${i}`),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_TOO_MANY_TAGS");
  });

  it("should fail due date before start date", () => {
    const result = createTask({
      title: "Test",
      startDate: "2025-02-10",
      dueDate: "2025-02-05",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_INVALID_DUE_DATE");
  });

  it("should fail dueTime without dueDate", () => {
    const result = createTask({ title: "Test", dueTime: "14:00" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_INVALID_DUE_DATE");
  });

  it("should persist created task", () => {
    createTask({ title: "Persist me" });
    const all = listTasks();
    expect(all).toHaveLength(1);
    expect(all[0]?.title).toBe("Persist me");
  });
});

describe("getTask", () => {
  it("should return a task by ID", () => {
    const created = createTask({ title: "Find me" });
    if (!created.success) return;
    const result = getTask(created.data.id);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe("Find me");
  });

  it("should return TASK_NOT_FOUND for non-existent ID", () => {
    const result = getTask("nonexistent-id");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_NOT_FOUND");
  });
});

describe("listTasks", () => {
  it("should return all tasks", () => {
    createTask({ title: "Task 1" });
    createTask({ title: "Task 2" });
    expect(listTasks()).toHaveLength(2);
  });

  it("should return empty array when no tasks exist", () => {
    expect(listTasks()).toEqual([]);
  });
});

describe("updateTask", () => {
  it("should update the title", () => {
    const created = createTask({ title: "Original" });
    if (!created.success) return;
    vi.advanceTimersByTime(1000);
    const result = updateTask(created.data.id, { title: "Updated" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe("Updated");
  });

  it("should update the description", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { description: "New desc" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.description).toBe("New desc");
  });

  it("should clear the description with null", () => {
    const created = createTask({ title: "Test", description: "Has desc" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { description: null });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.description).toBeNull();
  });

  it("should normalize empty string description to null", () => {
    const created = createTask({ title: "Test", description: "Has desc" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { description: "" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.description).toBeNull();
  });

  it("should update priority", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { priority: "P1" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.priority).toBe("P1");
  });

  it("should transition status todo to in_progress", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { status: "in_progress" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.status).toBe("in_progress");
  });

  it("should transition status todo to done", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { status: "done" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.status).toBe("done");
    expect(result.data.completedAt).toBeDefined();
  });

  it("should set completedAt when becoming done", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    const result = updateTask(created.data.id, { status: "done" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.completedAt).not.toBeNull();
  });

  it("should clear completedAt when reopening", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    updateTask(created.data.id, { status: "done" });
    const result = updateTask(created.data.id, { status: "todo" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.completedAt).toBeNull();
  });

  it("should reject done to in_progress transition", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    updateTask(created.data.id, { status: "done" });
    const result = updateTask(created.data.id, { status: "in_progress" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_INVALID_STATUS");
  });

  it("should update updatedAt on mutation", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    vi.advanceTimersByTime(5000);
    const result = updateTask(created.data.id, { title: "Changed" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    // updatedAt should be 5 seconds newer
    const createdTime = new Date(created.data.updatedAt).getTime();
    const updatedTime = new Date(result.data.updatedAt).getTime();
    expect(updatedTime).toBeGreaterThan(createdTime);
  });

  it("should reject update on archived task", () => {
    const created = createTask({ title: "Test" });
    if (!created.success) return;
    const tasks = JSON.parse(localStorage.getItem("todoish_tasks") ?? "[]");
    tasks[0].archivedAt = "2025-01-15T10:00:00.000Z";
    localStorage.setItem("todoish_tasks", JSON.stringify(tasks));

    const result = updateTask(created.data.id, { title: "Changed" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_ARCHIVED");
  });

  it("should return TASK_NOT_FOUND for non-existent ID", () => {
    const result = updateTask("nonexistent", { title: "Nope" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_NOT_FOUND");
  });
});

describe("deleteTask", () => {
  it("should delete a task", () => {
    const created = createTask({ title: "Delete me" });
    if (!created.success) return;
    const result = deleteTask(created.data.id);
    expect(result.success).toBe(true);
    expect(listTasks()).toHaveLength(0);
  });

  it("should return TASK_NOT_FOUND for non-existent ID", () => {
    const result = deleteTask("nonexistent");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_NOT_FOUND");
  });

  it("should delete subtasks when parent is deleted", () => {
    const parent = createTask({ title: "Parent" });
    if (!parent.success) return;

    const tasks = JSON.parse(localStorage.getItem("todoish_tasks") ?? "[]");
    tasks.push({
      ...tasks[0],
      id: "child-id",
      parentTaskId: parent.data.id,
      title: "Child subtask",
    });
    localStorage.setItem("todoish_tasks", JSON.stringify(tasks));

    expect(listTasks()).toHaveLength(2);
    const result = deleteTask(parent.data.id);
    expect(result.success).toBe(true);
    expect(listTasks()).toHaveLength(0);
  });

  it("should make deleted task unreadable", () => {
    const created = createTask({ title: "Gone" });
    if (!created.success) return;
    deleteTask(created.data.id);
    const result = getTask(created.data.id);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("TASK_NOT_FOUND");
  });
});
