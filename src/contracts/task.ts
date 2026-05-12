import { z } from "zod";

/* ═══════════════════════════════════════════════
   Subtypes
   ═══════════════════════════════════════════════ */

const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
const prioritySchema = z.enum(["P1", "P2", "P3", "P4"]);
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be ISO 8601 date (YYYY-MM-DD)");
const isoDatetimeSchema = z.string().datetime({ message: "Must be ISO 8601 datetime" });
const dueTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be 24-hour time (HH:mm)")
  .nullable();
const tagSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "Tags must be lowercase alphanumeric with hyphens");
const uuidSchema = z.string().uuid();

/* ═══════════════════════════════════════════════
   Subtask Schema
   ═══════════════════════════════════════════════ */

export const subtaskSchema = z.object({
  id: uuidSchema,
  taskId: uuidSchema,
  title: z.string().min(1).max(500).trim(),
  isCompleted: z.boolean(),
  sortOrder: z.number(),
  createdAt: isoDatetimeSchema,
  updatedAt: isoDatetimeSchema,
});

export type Subtask = z.infer<typeof subtaskSchema>;

/* ═══════════════════════════════════════════════
   Task Schema
   ═══════════════════════════════════════════════ */

export const taskSchema = z
  .object({
    id: uuidSchema,
    title: z.string().min(1).max(500).trim(),
    description: z.string().max(50000).nullable(),
    status: taskStatusSchema,
    priority: prioritySchema,
    projectId: uuidSchema.nullable(),
    sectionId: uuidSchema.nullable(),
    tags: z
      .array(tagSchema)
      .max(20)
      .refine((tags) => new Set(tags).size === tags.length, {
        message: "Tags must be unique",
      }),
    assigneeId: uuidSchema.nullable(),
    startDate: isoDateSchema.nullable(),
    dueDate: isoDateSchema.nullable(),
    dueTime: dueTimeSchema,
    estimatedMinutes: z.number().int().positive().max(1440).nullable(),
    recurrenceRule: z.string().nullable(),
    parentTaskId: uuidSchema.nullable(),
    isPinned: z.boolean(),
    sortOrder: z.number(),
    createdAt: isoDatetimeSchema,
    updatedAt: isoDatetimeSchema,
    completedAt: isoDatetimeSchema.nullable(),
    archivedAt: isoDatetimeSchema.nullable(),
  })
  .refine(
    (data) => {
      if (data.dueDate && data.startDate) {
        return data.dueDate >= data.startDate;
      }
      return true;
    },
    { message: "Due date cannot be before start date", path: ["dueDate"] },
  )
  .refine(
    (data) => {
      if (data.dueTime && !data.dueDate) {
        return false;
      }
      return true;
    },
    { message: "Due time requires a due date", path: ["dueTime"] },
  )
  .refine(
    (data) => {
      if (data.recurrenceRule && !data.dueDate) {
        return false;
      }
      return true;
    },
    { message: "Recurrence rule requires a due date", path: ["recurrenceRule"] },
  );

export type Task = z.infer<typeof taskSchema>;

/* ═══════════════════════════════════════════════
   Status Transition Validation
   ═══════════════════════════════════════════════ */

export type TaskStatus = z.infer<typeof taskStatusSchema>;

const validTransitions: Record<TaskStatus, TaskStatus[]> = {
  todo: ["in_progress", "done"],
  in_progress: ["done"],
  done: ["todo"],
};

export function isValidStatusTransition(from: TaskStatus, to: TaskStatus): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}
