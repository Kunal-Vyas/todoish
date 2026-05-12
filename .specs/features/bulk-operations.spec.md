# Bulk Operations

Select and mutate multiple tasks in a single action.

**Stage:** 🟡 Stage 2 &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

### Selection

- [ ] **AC-001: Select individual tasks.** Clicking a checkbox or using a selection shortcut adds a task to the selection set.
- [ ] **AC-002: Deselect a task.** Clicking a selected task's checkbox removes it from the selection.
- [ ] **AC-003: Select all visible.** A "Select All" action selects every task in the current view/filter.
- [ ] **AC-004: Deselect all.** A "Clear Selection" action resets the selection set to empty.
- [ ] **AC-005: Selection persists across view changes.** Switching from List to Kanban view retains the selection (if the tasks exist in both views).
- [ ] **AC-006: Selection count displayed.** The UI shows "N tasks selected" with a bulk action toolbar.

### Bulk Mutations

- [ ] **AC-007: Bulk set status.** Given 5 selected tasks, setting status to `"done"` updates all 5. Each task's `completedAt` is set.
- [ ] **AC-008: Bulk set priority.** Given 3 selected tasks, setting priority to `"P1"` updates all 3.
- [ ] **AC-009: Bulk move to project.** Given 4 selected tasks, setting `projectId` moves all 4 to that project.
- [ ] **AC-010: Bulk add tag.** Adding a tag to 6 selected tasks adds the tag to each (no-op for tasks that already have it).
- [ ] **AC-011: Bulk remove tag.** Removing a tag from selected tasks removes it from each.
- [ ] **AC-012: Bulk set due date.** Setting a due date on selected tasks applies the same date to all.
- [ ] **AC-013: Bulk archive.** Archiving selected tasks sets `archivedAt` on each.
- [ ] **AC-014: Bulk delete.** Deleting selected tasks permanently removes them all after confirmation.

### Error Handling

- [ ] **AC-015: Partial failure.** If one of 5 tasks fails validation during a bulk operation (e.g., archived), the other 4 still succeed.
- [ ] **AC-016: Error reporting.** After a bulk operation with partial failures, the response indicates which tasks succeeded and which failed with reasons.
- [ ] **AC-017: All-or-nothing option.** A `transactional: true` flag on bulk operations rolls back all changes if any individual operation fails.

### Edge Cases

- [ ] **AC-018: Empty selection.** Executing a bulk operation with no tasks selected is a no-op (no error, no mutation).
- [ ] **AC-019: Maximum selection.** Selecting more than 500 tasks shows a warning "Are you sure you want to modify 500+ tasks?"
- [ ] **AC-020: Undo bulk operation.** Undoing after a bulk operation reverts all tasks to their previous state in a single undo step.
