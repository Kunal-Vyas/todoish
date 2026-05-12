# Undo / Redo

Undo the last operation and redo an undone operation. Works across all mutating actions.

**Depends on:** `features/task-crud.spec.md`, `features/bulk-operations.spec.md`

---

## Acceptance Criteria

### Undo

- [ ] **AC-001: Undo task creation.** Creating a task then undoing removes the task as if it was never created.
- [ ] **AC-002: Undo task update.** Changing a task's title then undoing reverts to the previous title.
- [ ] **AC-003: Undo task deletion.** Deleting a task then undoing restores it with all fields, subtasks, and tags intact.
- [ ] **AC-004: Undo status change.** Changing status from `todo` to `done` then undoing reverts to `todo`. `completedAt` reverts.
- [ ] **AC-005: Undo subtask completion.** Completing a subtask then undoing reverts it to incomplete.
- [ ] **AC-006: Undo bulk operation.** A bulk status change on 5 tasks is undone in a single undo step, reverting all 5.
- [ ] **AC-007: Undo project creation.** Creating a project then undoing removes it.
- [ ] **AC-008: Undo section deletion.** Deleting a section then undoing restores it with its tasks.
- [ ] **AC-009: Undo tag changes.** Adding/removing tags then undoing reverts the tag list.

### Redo

- [ ] **AC-010: Redo after undo.** Undoing then redoing re-applies the undone change.
- [ ] **AC-011: Redo unavailable after new action.** After undoing task A deletion, then editing task B, redo is no longer available (the undo branch is discarded).
- [ ] **AC-012: Multiple redos.** Undoing 3 operations then redoing 2 restores the first 2 undone operations.

### Stack Management

- [ ] **AC-013: Undo stack has a limit.** The undo history holds a maximum of 100 entries. The oldest entry is evicted when the limit is exceeded.
- [ ] **AC-014: Undo stack is per-user, per-session.** Undo history does not persist across page reloads.
- [ ] **AC-015: Undo unavailable with empty stack.** When there are no operations to undo, the undo action is disabled.
- [ ] **AC-016: Undo toast with action.** After an undoable action, a toast appears: "Task archived. [Undo]" — clicking Undo performs the undo.

### Edge Cases

- [ ] **AC-017: Undo after sync conflict.** If a task is edited remotely while a local undo is pending, the undo still applies cleanly (last-write-wins).
- [ ] **AC-018: Undo is not collaborative.** Undoing an action does not generate a sync event for other users — it is treated as a new local mutation.
