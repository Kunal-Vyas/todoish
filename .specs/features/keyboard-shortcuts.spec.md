# Keyboard Shortcuts

Every primary action is accessible via keyboard. Shortcuts are discoverable, remappable, and consistent.

**Stage:** 🟢 MVP &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`

> **MVP scope:** Core shortcuts (AC-001 to AC-006), Undo/Redo (AC-017, AC-018), Escape (AC-004). Editing shortcuts (AC-007 to AC-014), view switching (AC-015, AC-016), and discoverability (AC-019 to AC-021) are Stage 2.

---

## Acceptance Criteria

### Core Shortcuts

- [ ] **AC-001: Quick-add.** Pressing `q` opens the quick-add input. Focus moves to the input field.
- [ ] **AC-002: Search focus.** Pressing `/` or `f` moves focus to the search bar.
- [ ] **AC-003: Submit.** `Ctrl/Cmd + Enter` submits the current form or inline edit.
- [ ] **AC-004: Escape.** `Esc` closes any open modal, clears focus, or cancels the current inline edit.
- [ ] **AC-005: Navigate tasks.** `↑` and `↓` move focus between tasks in the current view.
- [ ] **AC-006: Select task.** `Enter` or `Space` on a focused task opens it or toggles selection (configurable).

### Editing Shortcuts

- [ ] **AC-007: Edit task.** Pressing `e` on a selected task opens inline edit mode.
- [ ] **AC-008: Delete task.** `Delete` or `Backspace` on a selected task deletes it after confirmation.
- [ ] **AC-009: Duplicate task.** `Ctrl/Cmd + D` duplicates the selected task.
- [ ] **AC-010: Toggle complete.** `Space` on a focused task (not in edit mode) toggles its completion status.
- [ ] **AC-011: Set priority.** Pressing `p` then `1`–`4` sets the priority on the selected task.
- [ ] **AC-012: Set status.** Pressing `s` then `t`/`i`/`d` sets status to todo/in_progress/done.
- [ ] **AC-013: Set due date.** Pressing `d` opens a date picker on the selected task.
- [ ] **AC-014: Add label.** Pressing `l` opens the tag input on the selected task.

### View Switching

- [ ] **AC-015: Switch views.** `1`–`5` switch between List, Kanban, Calendar, Today, and Projects views.
- [ ] **AC-016: View shortcut is configurable.** Users can remap which number maps to which view.

### Undo / Redo

- [ ] **AC-017: Undo.** `Ctrl/Cmd + Z` undoes the last operation.
- [ ] **AC-018: Redo.** `Ctrl/Cmd + Shift + Z` redoes the last undone operation.

### Discoverability

- [ ] **AC-019: Shortcut help dialog.** Pressing `?` or `Ctrl/Cmd + /` opens a keyboard shortcut reference overlay.
- [ ] **AC-020: Shortcut hints in UI.** Hovering over buttons shows the associated shortcut in a tooltip.
- [ ] **AC-021: Shortcuts do not conflict with browser defaults.** In an input field, `Ctrl+Z` performs browser undo, not app undo. App shortcuts only fire when no input is focused.

### Edge Cases

- [ ] **AC-022: Shortcuts disabled during modal.** When a confirmation modal is open, only `Enter` (confirm), `Esc` (cancel), and `Tab` (navigate) are active.
- [ ] **AC-023: No action when no task selected.** Pressing `e`, `Delete`, or `Space` with no task selected does nothing (no error).
- [ ] **AC-024: Multi-key shortcuts are forgiving.** Pressing `p` then `1` works even with a short delay between keystrokes (within 1 second).
