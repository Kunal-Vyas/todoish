# Priorities

Assign and change priority levels on tasks. Priorities are the primary signal for task importance.

**Stage:** 🟢 MVP &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

- [ ] **AC-001: Default priority is P4.** A new task with no explicit priority is assigned `P4` (lowest).
- [ ] **AC-002: All four levels are assignable.** A task can be set to `P1`, `P2`, `P3`, or `P4`.
- [ ] **AC-003: Priority change emits update event.** Changing a task's priority triggers the same update path as any other field mutation.
- [ ] **AC-004: Priority persists across sessions.** After setting a priority and reloading, the value is preserved.
- [ ] **AC-005: Invalid priority rejected.** Setting priority to a value outside `P1`–`P4` (e.g., `P0`, `P5`, `"high"`) fails with `TASK_INVALID_PRIORITY`.
- [ ] **AC-006: Priority can be set during task creation.** A task can be created with any valid priority.
- [ ] **AC-007: Priority is independently mutable.** Changing priority does not affect any other task field.
- [ ] **AC-008: Subtasks inherit parent priority on creation.** When creating a subtask without specifying priority, it defaults to the parent task's priority.
- [ ] **AC-009: All four levels display distinct visual treatment.** P1–P4 each have a unique color or icon for at-a-glance scanning.
