# Notifications & Reminders

Push notifications, email reminders, and in-app alerts for task deadlines, assignments, and activity.

**Depends on:** `features/task-crud.spec.md`, `features/collaboration.spec.md`

---

## Acceptance Criteria

### Reminders

- [ ] **AC-001: Set a reminder on a task.** A task with a `dueDate` can have a reminder set for X minutes/hours/days before the due time.
- [ ] **AC-002: Default reminder lead time.** If no lead time is specified, the default is 30 minutes before the due time for timed tasks, or 9 AM on the due date for date-only tasks.
- [ ] **AC-003: Cancel a reminder.** A set reminder can be cancelled without affecting the task.
- [ ] **AC-004: Reminder fires at correct time.** A reminder set for "15 minutes before" a 2:00 PM task fires at 1:45 PM.
- [ ] **AC-005: Reminder does not fire for completed tasks.** If a task is completed before the reminder fires, the reminder is cancelled.
- [ ] **AC-006: Reminder for recurring tasks.** Completing a recurring task that has a reminder schedules a reminder for the next instance.

### Push Notifications

- [ ] **AC-007: Browser push permission.** The app requests notification permission. If denied, push reminders are disabled.
- [ ] **AC-008: Push notification content.** A push notification includes the task title and due time (e.g., "Call dentist at 2:00 PM").
- [ ] **AC-009: Click push notification.** Clicking a push notification opens the app and navigates to the relevant task.
- [ ] **AC-010: Service worker delivers notification.** Push notifications work even when the app tab is closed (via service worker).

### Email Reminders

- [ ] **AC-011: Email reminder sent.** If push is unavailable, an email reminder is sent to the user's verified email.
- [ ] **AC-012: Email content.** The email includes task title, due date/time, and a link to the task in the web app.
- [ ] **AC-013: Email preferences.** A user can opt out of email reminders while keeping push enabled.

### In-App Alerts

- [ ] **AC-014: Assignment toast.** When a task is assigned to the current user, an in-app toast appears: "Alice assigned you: Call dentist".
- [ ] **AC-015: Mention toast.** When the current user is @mentioned in a comment, a toast appears with a preview.
- [ ] **AC-016: Sync error toast.** A failure to sync shows: "Unable to sync. Changes saved locally."
- [ ] **AC-017: Toast auto-dismiss.** Non-critical toasts dismiss after 5 seconds. Error toasts persist until dismissed.

### Notification Preferences

- [ ] **AC-018: Per-channel opt-out.** A user can disable push while keeping email, or vice versa.
- [ ] **AC-019: Quiet hours.** A user can set a time window (e.g., 10 PM – 7 AM) during which push notifications are suppressed.
- [ ] **AC-020: Digest mode.** Instead of individual reminders, a user can opt for a daily digest email summarizing upcoming tasks.
