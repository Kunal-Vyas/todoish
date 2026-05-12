import { load, save } from "../../utils/store";
import { isValidStatusTransition } from "../../contracts/task";
import type { Task } from "../../contracts/task";
import type { CreateTaskInput, UpdateTaskInput, TaskResult } from "./task.contracts";
import { success, failure } from "./task.contracts";
import { validateCreateInput, validateUpdateInput } from "./task.validation";

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */

function now(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return crypto.randomUUID();
}

function getAllTasks(): Task[] {
  return load().tasks;
}

function persistTasks(tasks: Task[]): void {
  const data = load();
  save({ ...data, tasks });
}

/* ═══════════════════════════════════════════════
   Create
   ═══════════════════════════════════════════════ */

export function createTask(input: CreateTaskInput): TaskResult<Task> {
  const validated = validateCreateInput(input);
  if (!validated.success) return validated;

  const { title } = validated.data;

  // Deduplicate tags
  const tags = [...new Set(input.tags?.map((t) => t.toLowerCase()) ?? [])];

  const task: Task = {
    id: generateId(),
    title: title.trim(),
    description: input.description && input.description.trim() ? input.description : null,
    status: "todo",
    priority: input.priority ?? "P4",
    projectId: input.projectId ?? null,
    sectionId: null,
    tags,
    assigneeId: null,
    startDate: input.startDate ?? null,
    dueDate: input.dueDate ?? null,
    dueTime: input.dueTime ?? null,
    estimatedMinutes: input.estimatedMinutes ?? null,
    recurrenceRule: null,
    parentTaskId: null,
    isPinned: false,
    sortOrder: 0,
    createdAt: now(),
    updatedAt: now(),
    completedAt: null,
    archivedAt: null,
  };

  const tasks = getAllTasks();
  tasks.push(task);
  persistTasks(tasks);

  return success(task);
}

/* ═══════════════════════════════════════════════
   Read
   ═══════════════════════════════════════════════ */

export function getTask(id: string): TaskResult<Task> {
  const tasks = getAllTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return failure("TASK_NOT_FOUND", `Task with id "${id}" not found`);
  }
  return success(task);
}

export function listTasks(): Task[] {
  return getAllTasks();
}

/* ═══════════════════════════════════════════════
   Update
   ═══════════════════════════════════════════════ */

export function updateTask(id: string, input: UpdateTaskInput): TaskResult<Task> {
  const tasks = getAllTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return failure("TASK_NOT_FOUND", `Task with id "${id}" not found`);
  }

  const task = tasks[index];
  if (!task) {
    return failure("TASK_NOT_FOUND", `Task with id "${id}" not found`);
  }

  // Archived tasks cannot be modified
  if (task.archivedAt) {
    return failure("TASK_ARCHIVED", "Cannot modify an archived task");
  }

  const validated = validateUpdateInput(input);
  if (!validated.success) return validated;

  const {
    title,
    description,
    status,
    priority,
    projectId,
    tags,
    startDate,
    dueDate,
    dueTime,
    estimatedMinutes,
  } = validated.data;

  // Validate status transition
  if (status !== undefined && status !== task.status) {
    if (!isValidStatusTransition(task.status, status)) {
      return failure(
        "TASK_INVALID_STATUS",
        `Cannot transition from "${task.status}" to "${status}"`,
      );
    }
  }

  const wasDone = task.status === "done";
  const becomesDone = status === "done";
  const reopenedFromDone = wasDone && status !== undefined && status !== "done";

  // Apply updates
  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) {
    task.description = description && description.trim() ? description : null;
  }
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (projectId !== undefined) task.projectId = projectId;
  if (tags !== undefined) {
    task.tags = [...new Set(tags.map((t) => t.toLowerCase()))];
  }
  if (startDate !== undefined) task.startDate = startDate;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (dueTime !== undefined) task.dueTime = dueTime;
  if (estimatedMinutes !== undefined) task.estimatedMinutes = estimatedMinutes;

  // Set completedAt when becoming done
  if (becomesDone && !wasDone) {
    task.completedAt = now();
  }

  // Clear completedAt when reopening
  if (reopenedFromDone) {
    task.completedAt = null;
  }

  task.updatedAt = now();

  tasks[index] = task;
  persistTasks(tasks);

  return success(task);
}

/* ═══════════════════════════════════════════════
   Delete
   ═══════════════════════════════════════════════ */

export function deleteTask(id: string): TaskResult<void> {
  const tasks = getAllTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return failure("TASK_NOT_FOUND", `Task with id "${id}" not found`);
  }

  // Remove the task and its subtasks (tasks whose parentTaskId matches)
  const idsToRemove = new Set<string>();
  idsToRemove.add(id);
  for (const t of tasks) {
    if (t.parentTaskId === id) {
      idsToRemove.add(t.id);
    }
  }

  const filtered = tasks.filter((t) => !idsToRemove.has(t.id));
  persistTasks(filtered);

  return success(undefined);
}
