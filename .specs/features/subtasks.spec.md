# Subtasks

Break tasks into checklists of subtasks with individual completion tracking.

**Stage:** 🟡 Stage 2 &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

### Create Subtasks

- [ ] **AC-001: Add a subtask to a task.** Given a valid parent task, a subtask is created with a title and appended to the parent's subtask list.
- [ ] **AC-002: Add multiple subtasks.** Multiple subtasks can be created under the same parent.
- [ ] **AC-003: Subtask title is required.** An empty or whitespace-only title fails validation.
- [ ] **AC-004: Subtask title max length.** Subtask titles are capped at 500 characters.
- [ ] **AC-005: Subtask inherits parent context.** A subtask's `taskId` references the parent task.
- [ ] **AC-006: Subtask gets a unique ID.** Each subtask has a UUID v4 independent of the parent task.
- [ ] **AC-007: Subtask sort order.** Subtasks maintain a `sortOrder` for manual reordering.

### Complete / Uncomplete Subtasks

- [ ] **AC-008: Mark subtask complete.** A subtask's `isCompleted` can be toggled to `true`.
- [ ] **AC-009: Mark subtask incomplete.** A completed subtask can be toggled back to incomplete.
- [ ] **AC-010: Parent task shows completion progress.** Given 3 of 5 subtasks completed, the parent task reports "3/5" or 60%.
- [ ] **AC-011: Completing all subtasks does not auto-complete parent.** The parent task's status is independent of subtask completion.
- [ ] **AC-012: Completing parent task does not auto-complete subtasks.** Parent status changes do not cascade to subtasks.

### Delete & Reorder

- [ ] **AC-013: Delete a subtask.** A subtask can be removed from the parent task.
- [ ] **AC-014: Delete non-existent subtask.** Removing a subtask ID not present on the parent is a no-op.
- [ ] **AC-015: Reorder subtasks.** Subtask order can be changed by updating `sortOrder` values.
- [ ] **AC-016: Deleting parent deletes all subtasks.** Cascading delete is consistent with AC-029 of task-crud.

### Edge Cases

- [ ] **AC-017: A task cannot be its own subtask.** Setting `parentTaskId` to its own ID fails with circular reference error.
- [ ] **AC-018: Subtask depth is limited to 1 level.** A subtask cannot itself have subtasks. Setting `parentTaskId` on a task that already has a `parentTaskId` fails.
- [ ] **AC-019: Subtasks are preserved on task duplication.** Cloning a task clones all its subtasks.
