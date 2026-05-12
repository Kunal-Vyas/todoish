# Task API Contract

Defines the canonical data shapes and validation rules for tasks and subtasks. Every feature spec that touches tasks references this contract.

---

## Task

```typescript
interface Task {
  id: string;                    // UUID v4, immutable
  title: string;                 // 1–500 chars, required
  description: string | null;    // Markdown, max 50,000 chars
  status: "todo" | "in_progress" | "done";  // default: "todo"
  priority: "P1" | "P2" | "P3" | "P4";     // default: "P4"
  projectId: string | null;
  sectionId: string | null;
  tags: string[];                // lowercase, alphanumeric + hyphens, max 20
  assigneeId: string | null;
  startDate: string | null;      // ISO 8601 date (YYYY-MM-DD)
  dueDate: string | null;        // ISO 8601 date (YYYY-MM-DD)
  dueTime: string | null;        // "HH:mm" 24-hour
  estimatedMinutes: number | null; // positive integer, max 1440 (24h)
  recurrenceRule: string | null; // RRULE string (RFC 5545)
  parentTaskId: string | null;   // set when this is a subtask
  isPinned: boolean;             // default: false
  sortOrder: number;             // float for fractional indexing
  createdAt: string;             // ISO 8601 datetime, immutable
  updatedAt: string;             // ISO 8601 datetime
  completedAt: string | null;    // ISO 8601 datetime, set when status → "done"
  archivedAt: string | null;     // ISO 8601 datetime, set on archive
}
```

## Subtask

```typescript
interface Subtask {
  id: string;          // UUID v4
  taskId: string;      // parent task ID
  title: string;       // 1–500 chars
  isCompleted: boolean;
  sortOrder: number;   // float for fractional indexing
  createdAt: string;
  updatedAt: string;
}
```

## Validation Rules

| Field | Rule |
|-------|------|
| `title` | Required. 1–500 chars. Trimmed. |
| `description` | Max 50,000 chars. Null allowed. |
| `status` | Must be one of `todo`, `in_progress`, `done`. |
| `priority` | Must be one of `P1`, `P2`, `P3`, `P4`. |
| `tags` | Max 20 tags. Each tag: lowercase, alphanumeric + hyphens, max 32 chars. No duplicates. |
| `dueDate` | Must be a valid date. Cannot be before `startDate` if both are set. |
| `dueTime` | Must match `HH:mm` 24-hour format. Requires `dueDate` to be set. |
| `estimatedMinutes` | Positive integer, max 1440. |
| `parentTaskId` | Must reference an existing task. A parent task cannot be its own subtask (circular check). |
| `recurrenceRule` | Must be a valid RRULE string. Requires `dueDate` to be set. |

## Status Transitions

```
todo ──────→ in_progress ──────→ done
  │                                    │
  └────────────────────────────────────┘  (skip in_progress)
              │                                    │
              └──── todo ←─────────────────────────┘  (reopen)
```

- `todo → in_progress`: Always valid.
- `in_progress → done`: Always valid.
- `todo → done`: Always valid (skip in_progress).
- `done → todo`: Always valid (reopen).
- `done → in_progress`: Invalid. Must go through `todo`.

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `TASK_NOT_FOUND` | 404 | Task with given ID does not exist |
| `TASK_TITLE_REQUIRED` | 422 | Title is empty or missing |
| `TASK_TITLE_TOO_LONG` | 422 | Title exceeds 500 characters |
| `TASK_INVALID_STATUS` | 422 | Status value not in allowed set |
| `TASK_INVALID_PRIORITY` | 422 | Priority value not in allowed set |
| `TASK_INVALID_DUE_DATE` | 422 | Due date format invalid or before start date |
| `TASK_INVALID_RECURRENCE` | 422 | Recurrence rule invalid or missing due date |
| `TASK_CIRCULAR_PARENT` | 422 | Task cannot be its own ancestor |
| `TASK_PARENT_NOT_FOUND` | 404 | Referenced parent task does not exist |
| `TASK_TOO_MANY_TAGS` | 422 | Tag count exceeds 20 |
| `TASK_TAG_INVALID` | 422 | Tag contains invalid characters |
| `TASK_ARCHIVED` | 422 | Cannot mutate an archived task |

## Bulk Operations

| Operation | Input | Effect |
|-----------|-------|--------|
| `bulkSetStatus(ids, status)` | `string[]`, `TaskStatus` | Sets status on all tasks |
| `bulkSetPriority(ids, priority)` | `string[]`, `Priority` | Sets priority on all tasks |
| `bulkSetProject(ids, projectId)` | `string[]`, `string \| null` | Moves tasks to project |
| `bulkAddTag(ids, tag)` | `string[]`, `string` | Adds tag to all tasks |
| `bulkRemoveTag(ids, tag)` | `string[]`, `string` | Removes tag from all tasks |
| `bulkArchive(ids)` | `string[]` | Archives all tasks |
| `bulkDelete(ids)` | `string[]` | Permanently deletes all tasks |
