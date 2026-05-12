# Projects

Create, read, update, delete, and archive projects. Projects are the primary grouping mechanism for tasks.

**Depends on:** `contracts/project-api.contract.md`

---

## Acceptance Criteria

### Create Project

- [ ] **AC-001: Create a project.** Given a name and color, a project is created with a unique ID and timestamps.
- [ ] **AC-002: Name is required.** Given an empty or whitespace-only name, creation fails with `PROJECT_NAME_REQUIRED`.
- [ ] **AC-003: Name is trimmed.** Leading/trailing whitespace is stripped from the name.
- [ ] **AC-004: Duplicate name rejected.** Given a project named "Work" already exists, creating another "Work" fails with `PROJECT_NAME_DUPLICATE`.
- [ ] **AC-005: Color validation.** Given an invalid hex color (e.g., "red", "#FF"), creation fails. Given a valid 6-char hex (e.g., "#3B82F6"), it succeeds.
- [ ] **AC-006: Default section created.** When a project is created, a default "Uncategorized" section is created automatically.
- [ ] **AC-007: Archived projects can share names.** An archived project named "Work" does not block a new active project named "Work".

### Read Projects

- [ ] **AC-008: List all active projects.** Returns all non-archived projects sorted by `sortOrder`.
- [ ] **AC-009: List all projects including archived.** When `includeArchived: true`, archived projects are included.
- [ ] **AC-010: Read single project.** Given a valid project ID, returns the project with its sections.
- [ ] **AC-011: Read non-existent project.** Returns `PROJECT_NOT_FOUND`.

### Update Project

- [ ] **AC-012: Rename project.** Name can be changed to a non-duplicate value.
- [ ] **AC-013: Change color.** Color can be updated to any valid hex value.
- [ ] **AC-014: Update description.** Description can be set, changed, or cleared.
- [ ] **AC-015: updatedAt changes on mutation.** After any update, `updatedAt` reflects the current timestamp.

### Archive & Delete

- [ ] **AC-016: Archive a project.** An archived project is hidden from default listings but its tasks remain.
- [ ] **AC-017: Unarchive a project.** An archived project can be restored.
- [ ] **AC-018: Tasks in archived project are not shown in default views.** Tasks belonging to an archived project do not appear in the Today, Inbox, or List views unless the project is explicitly selected.
- [ ] **AC-019: Delete a project with no tasks.** Deletion succeeds immediately.
- [ ] **AC-020: Delete a project with tasks.** Given a project with tasks, deletion fails unless `force: true` is passed. When forced, all tasks in the project are also deleted.
- [ ] **AC-021: Delete non-existent project.** Returns `PROJECT_NOT_FOUND`.

### Sections

- [ ] **AC-022: Create a section within a project.** Given a valid project, a section is created with a name and sort order.
- [ ] **AC-023: Rename a section.** Section name can be updated.
- [ ] **AC-024: Delete an empty section.** A section with no tasks can be deleted.
- [ ] **AC-025: Delete a section with tasks.** Tasks in the deleted section are moved to the project's "Uncategorized" section.
- [ ] **AC-026: Reorder sections.** Sections can be reordered by updating `sortOrder` values.
- [ ] **AC-027: Default section cannot be deleted.** The "Uncategorized" section is protected from deletion.
- [ ] **AC-028: Section belongs to a project.** Attempting to assign a task to a section that belongs to a different project fails with `SECTION_NOT_IN_PROJECT`.
