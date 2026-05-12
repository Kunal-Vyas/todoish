# Pinned Tasks

Pin important tasks to the top of any view so they never get lost in the list.

**Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

- [ ] **AC-001: Pin a task.** Setting `isPinned: true` marks the task as pinned.
- [ ] **AC-002: Unpin a task.** Setting `isPinned: false` removes the pin.
- [ ] **AC-003: Default is unpinned.** New tasks have `isPinned: false`.
- [ ] **AC-004: Pinned tasks sort first.** In any view, pinned tasks appear before unpinned tasks regardless of the active sort order.
- [ ] **AC-005: Multiple pinned tasks.** When multiple tasks are pinned, they are sorted among themselves by the active sort criterion (e.g., pinned tasks sorted by due date, then unpinned tasks sorted by due date).
- [ ] **AC-006: Pinning is view-independent.** A task pinned in List view is also pinned in Kanban, Calendar, and all other views.
- [ ] **AC-007: Pin toggle is immediate.** No confirmation dialog needed for pin/unpin.
- [ ] **AC-008: Pinned status persists.** Pinned state survives page reloads and syncs across devices.
- [ ] **AC-009: Archived tasks cannot be pinned.** Pinning an archived task fails with `TASK_ARCHIVED`.
- [ ] **AC-010: Completing a task does not unpin it.** A completed pinned task remains pinned until explicitly unpinned.
