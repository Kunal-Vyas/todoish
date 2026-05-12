# Calendar View

View tasks on a monthly, weekly, or daily calendar. Drag tasks to reschedule.

**Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

### Calendar Layout

- [ ] **AC-001: Month view shows current month.** The calendar defaults to the current month with tasks displayed on their due dates.
- [ ] **AC-002: Week view.** A 7-day column layout showing tasks for the selected week.
- [ ] **AC-003: Day view.** A single-day timeline showing tasks with due times in chronological order.
- [ ] **AC-004: Navigate months/weeks.** Previous/Next buttons move the calendar forward and backward.
- [ ] **AC-005: Today button.** Returns the calendar to the current date.
- [ ] **AC-006: Tasks without due dates are hidden.** Tasks with no `dueDate` do not appear on the calendar.
- [ ] **AC-007: Overdue tasks highlighted.** Tasks with a past due date and `status != "done"` have a distinct visual (red border or badge).

### Task Rendering

- [ ] **AC-008: Task appears on its due date.** A task with `dueDate: "2025-02-14"` appears on February 14.
- [ ] **AC-009: Recurring task shows only next instance.** A daily recurring task shows only on the next occurrence, not every day into the future.
- [ ] **AC-010: Task with due time shows time label.** A task with `dueTime: "14:00"` displays "2:00 PM" on its card.
- [ ] **AC-011: Priority color indicator.** Each calendar entry shows the task's priority color.
- [ ] **AC-012: Multi-day tasks.** Tasks with both `startDate` and `dueDate` spanning multiple days render as a range bar across those days.

### Drag & Drop

- [ ] **AC-013: Drag task to a different date.** Dragging a task from Feb 14 to Feb 17 updates `dueDate` to "2025-02-17".
- [ ] **AC-014: Drag to create a task.** Clicking an empty date cell opens quick-add with that date pre-filled.
- [ ] **AC-015: Drag from month view to another month.** Dragging across month boundaries works correctly.

### Edge Cases

- [ ] **AC-016: Many tasks on one day.** When a day has more tasks than fit, a "+N more" indicator appears.
- [ ] **AC-017: Tasks crossing DST boundaries.** Tasks due near daylight saving time transitions are not shifted.
- [ ] **AC-018: February 29 handling.** Recurring tasks set to repeat on the 29th of each month skip non-leap years.
