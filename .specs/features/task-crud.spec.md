# Task CRUD

Create, read, update, and delete tasks. This is the foundational feature — nearly every other feature builds on it.

**Depends on:** `contracts/task-api.contract.md`

---

## Acceptance Criteria

### Create Task

- [ ] **AC-001: Create a minimal task.** Given a user provides only a title, a task is created with sensible defaults (`status: "todo"`, `priority: "P4"`, empty tags, no dates).
- [ ] **AC-002: Create a fully-populated task.** Given a user provides title, description, priority, project, tags, start date, due date, due time, and estimated minutes, the task is created with all fields intact.
- [ ] **AC-003: Title is required.** Given a user submits an empty or whitespace-only title, the creation fails with `TASK_TITLE_REQUIRED` and no task is persisted.
- [ ] **AC-004: Title is trimmed.** Given a user submits a title with leading/trailing whitespace, the whitespace is stripped before persistence.
- [ ] **AC-005: Title max length.** Given a user submits a title longer than 500 characters, creation fails with `TASK_TITLE_TOO_LONG`.
- [ ] **AC-006: Due date cannot precede start date.** Given a user sets `startDate: 2025-02-10` and `dueDate: 2025-02-05`, creation fails with `TASK_INVALID_DUE_DATE`.
- [ ] **AC-007: Due time requires due date.** Given a user sets `dueTime: "14:00"` without a `dueDate`, creation fails with `TASK_INVALID_DUE_DATE`.
- [ ] **AC-008: Tag validation.** Given a user submits a tag with uppercase or special characters, the tag is rejected with `TASK_TAG_INVALID`.
- [ ] **AC-009: Tag limit.** Given a user submits more than 20 tags, creation fails with `TASK_TOO_MANY_TAGS`.
- [ ] **AC-010: Duplicate tags are deduplicated.** Given a user submits `["errand", "errand"]`, only one `errand` tag is stored.
- [ ] **AC-011: Created task has an ID.** A newly created task is assigned a unique UUID v4.

### Read Task

- [ ] **AC-012: Read a single task by ID.** Given a valid task ID, the full task object is returned.
- [ ] **AC-013: Read non-existent task.** Given an invalid or non-existent ID, the read fails with `TASK_NOT_FOUND`.
- [ ] **AC-014: Archived tasks are readable.** Archived tasks can still be read individually by ID (archive does not mean delete).

### Update Task

- [ ] **AC-015: Update title.** Given a valid task, the title can be updated to a new value.
- [ ] **AC-016: Update description.** Given a valid task, the description can be set, changed, or cleared (set to null).
- [ ] **AC-017: Update priority.** Given a valid task, priority can be changed to any of `P1`–`P4`.
- [ ] **AC-018: Update status.** Given a valid task, status can be changed following the state machine (`todo → in_progress → done`, `done → todo`).
- [ ] **AC-019: Invalid status transition.** Given a task with status `done`, changing to `in_progress` fails with `TASK_INVALID_STATUS`.
- [ ] **AC-020: Update project.** Given a valid task, `projectId` can be set or cleared.
- [ ] **AC-021: Clear optional fields.** Given a task with `dueDate`, `startDate`, `dueTime`, or `estimatedMinutes` set, each can be individually cleared to null.
- [ ] **AC-022: updatedAt changes on mutation.** After any update, `updatedAt` reflects the current timestamp.
- [ ] **AC-023: completedAt set on completion.** When status transitions to `done`, `completedAt` is set to the current timestamp.
- [ ] **AC-024: completedAt cleared on reopen.** When status transitions from `done` back to `todo`, `completedAt` is set to null.
- [ ] **AC-025: Update archived task fails.** Given an archived task, any mutation except unarchive fails with `TASK_ARCHIVED`.
- [ ] **AC-026: Cannot set parentTaskId with circular reference.** Given task A, setting its `parentTaskId` to task B where B's ancestor is A fails with `TASK_CIRCULAR_PARENT`.

### Delete Task

- [ ] **AC-027: Delete a task.** Given a valid task ID, the task is permanently removed.
- [ ] **AC-028: Delete non-existent task.** Given an invalid ID, delete fails with `TASK_NOT_FOUND`.
- [ ] **AC-029: Deleting a parent task deletes its subtasks.** When a task with subtasks is deleted, all subtasks are also deleted.
- [ ] **AC-030: Deleted tasks cannot be read.** After deletion, reading the task ID returns `TASK_NOT_FOUND`.

### Edge Cases

- [ ] **AC-031: Empty string description is normalized to null.** An empty string description is stored as null.
- [ ] **AC-032: estimatedMinutes at boundary.** `0` fails validation. `1440` (24 hours) is valid. `1441` fails.
- [ ] **AC-033: Concurrent updates produce consistent state.** Two simultaneous updates to the same task each see the latest state.
