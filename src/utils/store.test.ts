import { describe, it, expect, beforeEach } from "vitest";
import { load, save } from "./store";
import type { Task } from "../contracts/task";
import type { Project } from "../contracts/project";

function makeTask(id: string, title: string): Task {
  return {
    id,
    title,
    description: null,
    status: "todo" as const,
    priority: "P4" as const,
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
  };
}

function makeProject(id: string, name: string): Project {
  return {
    id,
    name,
    color: "#3B82F6",
    description: null,
    isArchived: false,
    sortOrder: 0,
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
  };
}

describe("store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return empty defaults when nothing is stored", () => {
    const data = load();
    expect(data.tasks).toEqual([]);
    expect(data.projects).toEqual([]);
  });

  it("should round-trip tasks", () => {
    const tasks = [makeTask("t1", "Buy groceries"), makeTask("t2", "Call dentist")];
    save({ tasks, projects: [] });

    const data = load();
    expect(data.tasks).toHaveLength(2);
    expect(data.tasks[0]?.title).toBe("Buy groceries");
    expect(data.tasks[1]?.title).toBe("Call dentist");
  });

  it("should round-trip projects", () => {
    const projects = [makeProject("p1", "Work"), makeProject("p2", "Personal")];
    save({ tasks: [], projects });

    const data = load();
    expect(data.projects).toHaveLength(2);
    expect(data.projects[0]?.name).toBe("Work");
    expect(data.projects[1]?.name).toBe("Personal");
  });

  it("should round-trip both tasks and projects together", () => {
    const tasks = [makeTask("t1", "Buy groceries")];
    const projects = [makeProject("p1", "Work")];
    save({ tasks, projects });

    const data = load();
    expect(data.tasks).toHaveLength(1);
    expect(data.projects).toHaveLength(1);
  });

  it("should overwrite existing data on save", () => {
    save({ tasks: [makeTask("t1", "First")], projects: [] });
    save({ tasks: [makeTask("t2", "Second")], projects: [] });

    const data = load();
    expect(data.tasks).toHaveLength(1);
    expect(data.tasks[0]?.title).toBe("Second");
  });

  it("should handle corrupted data gracefully", () => {
    localStorage.setItem("todoish_tasks", "not-valid-json");
    const data = load();
    expect(data.tasks).toEqual([]);
  });
});
