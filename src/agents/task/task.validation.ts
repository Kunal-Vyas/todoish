import { taskSchema } from "../../contracts/task";
import type { CreateTaskInput, UpdateTaskInput, TaskResult, TaskError } from "./task.contracts";
import { failure } from "./task.contracts";

export function validateCreateInput(input: CreateTaskInput): TaskResult<CreateTaskInput> {
  if (!input.title || input.title.trim().length === 0) {
    return failure("TASK_TITLE_REQUIRED", "Title is required");
  }

  if (input.title.length > 500) {
    return failure("TASK_TITLE_TOO_LONG", "Title must be 500 characters or fewer");
  }

  if (input.tags && input.tags.length > 20) {
    return failure("TASK_TOO_MANY_TAGS", "A task cannot have more than 20 tags");
  }

  if (input.tags) {
    const tagRegex = /^[a-z0-9][a-z0-9-]*$/;
    for (const tag of input.tags) {
      if (!tagRegex.test(tag)) {
        return failure(
          "TASK_TAG_INVALID",
          `Invalid tag: "${tag}". Tags must be lowercase alphanumeric with hyphens.`,
        );
      }
    }
  }

  if (input.dueDate && input.startDate && input.dueDate < input.startDate) {
    return failure("TASK_INVALID_DUE_DATE", "Due date cannot be before start date");
  }

  if (input.dueTime && !input.dueDate) {
    return failure("TASK_INVALID_DUE_DATE", "Due time requires a due date");
  }

  return { success: true, data: { ...input, title: input.title.trim() } };
}

export function validateUpdateInput(input: UpdateTaskInput): TaskResult<UpdateTaskInput> {
  if (input.title !== undefined) {
    if (input.title.trim().length === 0) {
      return failure("TASK_TITLE_REQUIRED", "Title is required");
    }
    if (input.title.length > 500) {
      return failure("TASK_TITLE_TOO_LONG", "Title must be 500 characters or fewer");
    }
  }

  if (input.tags && input.tags.length > 20) {
    return failure("TASK_TOO_MANY_TAGS", "A task cannot have more than 20 tags");
  }

  if (input.tags) {
    const tagRegex = /^[a-z0-9][a-z0-9-]*$/;
    for (const tag of input.tags) {
      if (!tagRegex.test(tag)) {
        return failure(
          "TASK_TAG_INVALID",
          `Invalid tag: "${tag}". Tags must be lowercase alphanumeric with hyphens.`,
        );
      }
    }
  }

  return { success: true, data: input };
}

export function validateFullTask(task: unknown): TaskResult<unknown> {
  const result = taskSchema.safeParse(task);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const message = firstIssue?.message ?? "Validation failed";
    const code = mapZodErrorToCode(firstIssue);
    return failure(code, message);
  }
  return { success: true, data: result.data };
}

function mapZodErrorToCode(
  issue: { path: (string | number)[]; message: string } | undefined,
): TaskError["code"] {
  if (!issue) return "TASK_VALIDATION_FAILED";
  const path = issue.path[0];
  switch (path) {
    case "title":
      return "TASK_TITLE_REQUIRED";
    case "status":
      return "TASK_INVALID_STATUS";
    case "priority":
      return "TASK_INVALID_PRIORITY";
    case "dueDate":
      return "TASK_INVALID_DUE_DATE";
    case "tags":
      return "TASK_TAG_INVALID";
    default:
      return "TASK_VALIDATION_FAILED";
  }
}
