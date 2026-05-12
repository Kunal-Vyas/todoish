# Recurring Tasks

Tasks that automatically regenerate on a schedule. Complete one instance and the next appears.

**Stage:** 🟠 Stage 3 &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

### Recurrence Setup

- [ ] **AC-001: Set daily recurrence.** Given a task with `dueDate: "2025-02-01"` and `recurrenceRule: "FREQ=DAILY"`, the task is marked as recurring.
- [ ] **AC-002: Set weekly recurrence.** `recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,WE,FR"` repeats every Monday, Wednesday, and Friday.
- [ ] **AC-003: Set monthly recurrence.** `recurrenceRule: "FREQ=MONTHLY;BYMONTHDAY=15"` repeats on the 15th of each month.
- [ ] **AC-004: Set custom interval.** `recurrenceRule: "FREQ=WEEKLY;INTERVAL=2"` repeats every 2 weeks.
- [ ] **AC-005: Recurrence requires due date.** Setting a `recurrenceRule` without a `dueDate` fails with `TASK_INVALID_RECURRENCE`.
- [ ] **AC-006: Invalid RRULE rejected.** An unparseable or invalid RRULE string fails with `TASK_INVALID_RECURRENCE`.
- [ ] **AC-007: Remove recurrence.** Setting `recurrenceRule` to null makes the task non-recurring. The current instance is unaffected.

### Next Instance Generation

- [ ] **AC-008: Completing a recurring task generates the next instance.** When a recurring task's status changes to `done`, a new task is created with `dueDate` advanced per the rule.
- [ ] **AC-009: Next instance preserves all fields.** Title, description, priority, project, tags, estimated minutes — all copied to the next instance except status (reset to `todo`) and dates.
- [ ] **AC-010: Next instance does not copy subtask completion.** Subtasks are copied with all `isCompleted: false`.
- [ ] **AC-011: Next instance has a new ID.** The generated task is a new entity, not a mutation of the completed one.
- [ ] **AC-012: Daily recurrence advances by 1 day.** Completing a daily task with `dueDate: "2025-02-01"` generates next with `dueDate: "2025-02-02"`.
- [ ] **AC-013: Weekly recurrence advances to next matching day.** Completing a MWF task on Monday generates the next instance for Wednesday.
- [ ] **AC-014: Monthly recurrence advances to next month.** Completing a monthly task on the 15th generates the next instance for the 15th of the following month.

### Edge Cases

- [ ] **AC-015: Completing the last instance of a count-limited recurrence.** `recurrenceRule: "FREQ=DAILY;COUNT=3"` — after the 3rd completion, no new instance is generated.
- [ ] **AC-016: Recurrence with end date.** `recurrenceRule: "FREQ=WEEKLY;UNTIL=2025-12-31"` — no instances generated beyond the UNTIL date.
- [ ] **AC-017: Leap year handling.** Monthly recurrence on the 29th skips February in non-leap years; generates on Feb 28 instead.
- [ ] **AC-018: DST handling.** Daily recurrence around DST transitions does not shift by an hour — `dueDate` remains the same calendar day.
- [ ] **AC-019: Only one active instance at a time.** A recurring task has only one non-completed instance. Completing it generates the next.
- [ ] **AC-020: Reopening a completed recurring task.** Changing status from `done` back to `todo` does not undo the generated next instance — both now exist.
