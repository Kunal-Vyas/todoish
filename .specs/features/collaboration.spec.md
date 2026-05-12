# Collaboration

Shared projects, task assignment, comments, and activity tracking for team workflows.

**Depends on:** `features/auth.spec.md`, `features/task-crud.spec.md`, `features/projects.spec.md`

---

## Acceptance Criteria

### Shared Projects

- [ ] **AC-001: Invite a user to a project.** A project owner can invite another user by email. The invitee receives a notification.
- [ ] **AC-002: Set role on invite.** The owner specifies `editor` or `viewer` when inviting.
- [ ] **AC-003: Accept invitation.** An invitee can accept, gaining access to the project at the specified role.
- [ ] **AC-004: Decline invitation.** An invitee can decline. The owner is notified.
- [ ] **AC-005: Remove a member.** An owner can remove a member from a project. The removed member loses access immediately.
- [ ] **AC-006: Change member role.** An owner can promote a viewer to editor or demote an editor to viewer.
- [ ] **AC-007: Leave a project.** A non-owner member can leave a project voluntarily.
- [ ] **AC-008: Owner cannot leave.** The project owner must transfer ownership or delete the project before leaving.
- [ ] **AC-009: Shared project appears in sidebar.** Projects shared with a user appear alongside their own projects, with a "Shared" indicator.

### Task Assignment

- [ ] **AC-010: Assign a task.** Any editor or owner can assign a task to any project member.
- [ ] **AC-011: Unassign a task.** An assigned task can be unassigned (set `assigneeId` to null).
- [ ] **AC-012: Assignee notification.** When a task is assigned, the assignee receives a notification.
- [ ] **AC-013: Filter by assignee.** Tasks can be filtered to show only those assigned to a specific person.
- [ ] **AC-014: Viewer cannot be assigned.** Assigning a task to a viewer-level member fails — viewers cannot have tasks assigned.
- [ ] **AC-015: Assignee visible on task card.** The assignee's avatar or name is displayed on the task in all views.

### Comments

- [ ] **AC-016: Add a comment to a task.** Any project member (including viewers) can comment on a task.
- [ ] **AC-017: Edit own comment.** A user can edit their own comment. Edited comments show an "(edited)" indicator.
- [ ] **AC-018: Delete own comment.** A user can delete their own comment. Project owners can delete any comment.
- [ ] **AC-019: Comment thread.** Comments display chronologically on the task detail panel.
- [ ] **AC-020: Markdown in comments.** Comments support basic Markdown (bold, italic, links, lists, code).

### Mentions

- [ ] **AC-021: Mention a project member.** Typing `@username` in a comment notifies that user.
- [ ] **AC-022: Mention autocomplete.** Typing `@` shows a dropdown of project members to select from.
- [ ] **AC-023: Mention notification.** A mentioned user receives a notification with a link to the comment.

### Activity Log

- [ ] **AC-024: Task created event.** When a task is created, an entry appears: "Alice created this task."
- [ ] **AC-025: Status change event.** "Bob moved this task from Todo to In Progress."
- [ ] **AC-026: Assignment event.** "Alice assigned this task to Bob."
- [ ] **AC-027: Comment event.** "Charlie commented on this task."
- [ ] **AC-028: Activity log is chronological.** Events appear newest-first with timestamps.
- [ ] **AC-029: Activity log is per-task.** Each task has its own activity history.
