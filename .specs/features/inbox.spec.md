# Inbox

A catch-all list for uncategorized tasks that supports the GTD workflow of capturing first and organizing later.

**Depends on:** `features/task-crud.spec.md`, `features/projects.spec.md`

---

## Acceptance Criteria

### Inbox Behavior

- [ ] **AC-001: Inbox shows uncategorized tasks.** Tasks with no `projectId` appear in the Inbox.
- [ ] **AC-002: New tasks default to Inbox.** Creating a task without specifying a project places it in the Inbox.
- [ ] **AC-003: Quick-add from anywhere targets Inbox.** The global quick-add (shortcut `q`) creates tasks in the Inbox unless a project context is active.
- [ ] **AC-004: Inbox does not show tasks with a project.** Assigning a task to a project removes it from the Inbox.
- [ ] **AC-005: Inbox is always accessible.** The Inbox appears in the sidebar regardless of how many projects exist.

### Inbox Processing

- [ ] **AC-006: Move task to project from Inbox.** A task in the Inbox can be assigned to a project inline or via drag-and-drop.
- [ ] **AC-007: Set priority from Inbox.** Tasks can have their priority set without leaving the Inbox view.
- [ ] **AC-008: Set due date from Inbox.** Tasks can be scheduled directly from the Inbox.
- [ ] **AC-009: Bulk assign from Inbox.** Select multiple Inbox tasks and assign them all to a project in one action.

### Display

- [ ] **AC-010: Inbox task count.** The sidebar shows the number of uncategorized tasks next to "Inbox".
- [ ] **AC-011: Zero state.** When the Inbox is empty, show a message: "All caught up! Your Inbox is empty."
- [ ] **AC-012: Inbox respects sort order.** Tasks in the Inbox follow the active sort preference (default: newest first).
- [ ] **AC-013: Inbox respects filters.** Active filters apply to Inbox tasks just like any other view.
