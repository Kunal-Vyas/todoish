import type { Task, TaskStatus } from "../../contracts/task";

/* ═══════════════════════════════════════════════
   Input Types
   ═══════════════════════════════════════════════ */

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: Task["priority"];
  projectId?: string | null;
  tags?: string[];
  startDate?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  estimatedMinutes?: number | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Task["priority"];
  projectId?: string | null;
  tags?: string[];
  startDate?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  estimatedMinutes?: number | null;
}

/* ═══════════════════════════════════════════════
   Error Types
   ═══════════════════════════════════════════════ */

export type TaskErrorCode =
  | "TASK_NOT_FOUND"
  | "TASK_TITLE_REQUIRED"
  | "TASK_TITLE_TOO_LONG"
  | "TASK_INVALID_STATUS"
  | "TASK_INVALID_PRIORITY"
  | "TASK_INVALID_DUE_DATE"
  | "TASK_INVALID_RECURRENCE"
  | "TASK_CIRCULAR_PARENT"
  | "TASK_PARENT_NOT_FOUND"
  | "TASK_TOO_MANY_TAGS"
  | "TASK_TAG_INVALID"
  | "TASK_ARCHIVED"
  | "TASK_VALIDATION_FAILED";

export interface TaskError {
  code: TaskErrorCode;
  message: string;
}

/* ═══════════════════════════════════════════════
   Result Type
   ═══════════════════════════════════════════════ */

export type TaskResult<T> = { success: true; data: T } | { success: false; error: TaskError };

export function success<T>(data: T): TaskResult<T> {
  return { success: true, data };
}

export function failure(code: TaskErrorCode, message: string): TaskResult<never> {
  return { success: false, error: { code, message } };
}
