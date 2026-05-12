# Search, Filter & Sort

Search across all task fields, filter by multiple criteria, and sort by any field. These three capabilities share a spec because they compose together.

**Depends on:** `features/task-crud.spec.md`, `features/tags.spec.md`

---

## Acceptance Criteria

### Search

- [ ] **AC-001: Search by title.** Given a query, tasks whose title contains the query (case-insensitive) are returned.
- [ ] **AC-002: Search by description.** The search scans task descriptions in addition to titles.
- [ ] **AC-003: Search by project name.** Tasks in a project whose name matches the query are returned.
- [ ] **AC-004: Search by tag.** Tasks with a tag matching the query are returned.
- [ ] **AC-005: Empty query returns all tasks.** An empty or whitespace-only search returns the full task list (subject to active filters).
- [ ] **AC-006: Results are ranked by relevance.** Exact title match > title starts with query > title contains query > description match > tag match.
- [ ] **AC-007: Typo tolerance.** A query like "groceris" matches tasks with "groceries" in the title (fuzzy matching, max 1–2 character difference).
- [ ] **AC-008: Highlight matching terms.** Search results indicate which text segments matched the query.

### Filter

- [ ] **AC-009: Filter by status.** Given `status: "todo"`, only tasks with that status are shown.
- [ ] **AC-010: Filter by priority.** Given `priority: "P1"`, only P1 tasks are shown.
- [ ] **AC-011: Filter by project.** Given a `projectId`, only tasks in that project are shown.
- [ ] **AC-012: Filter by tag.** Given a tag, only tasks with that tag are shown.
- [ ] **AC-013: Filter by date range.** Given `dueDate` from X to Y, only tasks due within that range are shown.
- [ ] **AC-014: Filter by assignee.** Given an `assigneeId`, only tasks assigned to that person are shown.
- [ ] **AC-015: Combine multiple filters.** Given `status: "todo"` AND `priority: "P1"`, only tasks matching both are shown.
- [ ] **AC-016: Filters and search compose.** Given a search query and active filters, the result set satisfies both constraints.
- [ ] **AC-017: Clear individual filter.** Removing one filter reverts to the broader filter set.
- [ ] **AC-018: Clear all filters.** Reset returns to the unfiltered task list.

### Sort

- [ ] **AC-019: Sort by due date (default).** Tasks are sorted ascending by `dueDate`. Tasks without a due date sort last.
- [ ] **AC-020: Sort by priority.** Tasks sort P1 → P4 with P4 last.
- [ ] **AC-021: Sort by creation date.** Tasks sorted by `createdAt` descending (newest first) or ascending.
- [ ] **AC-022: Sort by last modified.** Tasks sorted by `updatedAt` descending or ascending.
- [ ] **AC-023: Sort alphabetically.** Tasks sorted A–Z or Z–A by title.
- [ ] **AC-024: Sort by manual order.** Tasks respect `sortOrder` field. Pinned tasks always sort first in manual mode.
- [ ] **AC-025: Toggle sort direction.** Each sort field can toggle between ascending and descending.
- [ ] **AC-026: Pinned tasks always sort first.** Regardless of the active sort field, pinned tasks appear before unpinned tasks.
- [ ] **AC-027: Sort persists per view.** The sort preference for List view does not affect Kanban or Calendar views.

### Saved Filters

- [ ] **AC-028: Save a filter combination.** A user can name and save the current search + filter state.
- [ ] **AC-029: Load a saved filter.** Selecting a saved filter applies all its criteria.
- [ ] **AC-030: Delete a saved filter.** A saved filter can be removed.
- [ ] **AC-031: Saved filters are user-scoped.** Each user has their own saved filters.
- [ ] **AC-032: Saved filter count display.** If a saved filter would return 0 results, show "0 tasks" rather than an error.
