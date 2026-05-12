# Tags

Apply and manage free-form tags on tasks for cross-cutting organization.

**Stage:** 🟡 Stage 2 &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`

---

## Acceptance Criteria

### Add Tags

- [ ] **AC-001: Add a single tag.** Given a task, a tag can be added. The tag is stored lowercase.
- [ ] **AC-002: Add multiple tags.** Multiple tags can be added to a task in a single operation.
- [ ] **AC-003: Tags are case-insensitive.** Adding "Phone" stores as "phone". Adding "PHONE" does not create a duplicate.
- [ ] **AC-004: Duplicate tags ignored.** Adding a tag that already exists on the task is a no-op (no error, no duplicate).
- [ ] **AC-005: Tag format validation.** Tags must match `/^[a-z0-9][a-z0-9-]*$/`. Tags starting with a hyphen, containing spaces, or with special characters are rejected.
- [ ] **AC-006: Tag max length.** Individual tags cannot exceed 32 characters.
- [ ] **AC-007: Tag limit per task.** A task cannot have more than 20 tags. Adding a 21st tag fails.

### Remove Tags

- [ ] **AC-008: Remove a tag.** Given a task with tags, a specific tag can be removed.
- [ ] **AC-009: Remove non-existent tag.** Removing a tag not on the task is a no-op (no error).
- [ ] **AC-010: Remove all tags.** Clearing the tags array to `[]` is valid.

### List & Filter

- [ ] **AC-011: List all unique tags across tasks.** Given tasks across multiple projects, a distinct set of all tags can be retrieved.
- [ ] **AC-012: Filter tasks by tag.** Given a tag, return only tasks that have that tag.
- [ ] **AC-013: Filter tasks by multiple tags (AND).** Given tags `["errand", "phone"]`, return tasks that have both tags.
- [ ] **AC-014: Tag count per task.** The system can report how many tasks have each tag.

### Edge Cases

- [ ] **AC-015: Tags persist through task updates.** Updating a task title does not affect its tags.
- [ ] **AC-016: Tags are preserved on task duplication.** When a task is duplicated, all tags are copied to the new task.
- [ ] **AC-017: Bulk tag addition.** Tags can be added to multiple tasks in one operation.
- [ ] **AC-018: Bulk tag removal.** Tags can be removed from multiple tasks in one operation.
