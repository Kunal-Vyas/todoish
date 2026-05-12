# Kanban Board

Visual workflow management with drag-and-drop tasks across status columns.

**Stage:** 🟡 Stage 2 &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`, `features/projects.spec.md`

---

## Acceptance Criteria

### Board Layout

- [ ] **AC-001: Default columns.** A new board shows three columns: Todo, In Progress, Done.
- [ ] **AC-002: Tasks appear in correct column.** A task with `status: "todo"` appears in the Todo column; `"in_progress"` in In Progress; `"done"` in Done.
- [ ] **AC-003: Column task count.** Each column header shows the number of tasks it contains.
- [ ] **AC-004: Empty column state.** A column with no tasks shows a placeholder ("No tasks yet — drag tasks here").
- [ ] **AC-005: Board is project-scoped.** Each project has its own board showing only that project's tasks.

### Drag & Drop

- [ ] **AC-006: Drag task to another column.** Dragging a task from Todo to In Progress updates its status to `"in_progress"`.
- [ ] **AC-007: Drag task from Done to Todo.** Status changes to `"todo"` and `completedAt` is cleared.
- [ ] **AC-008: Reorder within a column.** Dragging a task vertically within the same column updates `sortOrder` without changing status.
- [ ] **AC-009: Drag to empty column.** Dropping a task into an empty column works correctly.
- [ ] **AC-010: Drag is undoable.** The drag operation can be undone (via Ctrl+Z or undo button).
- [ ] **AC-011: Invalid drop target.** Dropping a task outside any column reverts it to its original position.

### Custom Columns

- [ ] **AC-012: Add a custom column.** A user can create additional columns beyond the three defaults (e.g., "Review", "Blocked"). Each maps to a section in the project.
- [ ] **AC-013: Rename a column.** Column names can be edited.
- [ ] **AC-014: Delete a custom column.** Default columns (Todo, In Progress, Done) cannot be deleted. Custom columns can be deleted, moving their tasks to Uncategorized.
- [ ] **AC-015: Reorder columns.** Columns can be reordered left-to-right.

### Board Behavior

- [ ] **AC-016: Pinned tasks stay at top of column.** Within each column, pinned tasks appear above unpinned tasks.
- [ ] **AC-017: Subtask progress visible.** A task card in the board shows "2/5" if it has subtask progress.
- [ ] **AC-018: Priority color indicator.** Each card shows a color strip matching its priority.
- [ ] **AC-019: Board respects filters.** If a filter is active, only matching tasks appear on the board.
- [ ] **AC-020: Quick-add from board.** A "+" button at the bottom of each column creates a new task in that status.
