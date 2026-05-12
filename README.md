# Todoish

A lightweight, fast todo app for capturing tasks, organizing projects, and shipping work. Natural language input, offline-first sync, Kanban boards, and real-time collaboration — all in a clean, keyboard-driven interface.

---

## Features

### Tasks

- **Quick Add** — Type a single line and go. Natural language parsing picks up dates, priorities, and projects automatically (`"Buy groceries tomorrow #personal !high"`).
- **Subtasks & Checklists** — Break work into steps with per-item completion. Parent tasks show aggregate progress.
- **Recurring Tasks** — Repeat daily, weekly, monthly, or on a custom schedule. The next instance generates automatically on completion.
- **Rich Descriptions** — Markdown notes on every task for links, code snippets, and context.
- **Start & Due Dates** — Set a start date (when work begins) and a due date (deadline). Tasks hidden until their start date keep your list uncluttered.
- **Due Time** — Attach a specific time for time-sensitive tasks.
- **Time Estimates & Tracking** — Estimate effort and log actual time with a start/stop timer. View reports by task, project, or date range.
- **Bulk Actions** — Select multiple tasks to complete, archive, reassign, or delete in one operation.

### Organization

- **Projects** — Group tasks into projects with custom colors for visual scanning.
- **Sections** — Divide projects into columns like Backlog, In Progress, and Done.
- **Tags** — Apply cross-cutting labels (`@phone`, `@waiting`, `@errand`) independent of project structure.
- **Priorities** — Five levels from P0 (Critical) to P4 (Lowest), color-coded and sortable.
- **Pinned Tasks** — Pin high-priority items to the top of any view.
- **Smart Lists** — Saved filters that auto-populate (e.g., "Overdue P0 tasks", "Assigned to me this week").

### Search, Sort & Filter

- **Full-Text Search** — Searches titles, descriptions, projects, and tags. Results highlight matching terms.
- **Sort** — By due date, priority, created, modified, alpha, or manual drag-and-drop order.
- **Filter** — By project, priority, status, date range, tags, or assignee. Stack multiple filters.
- **Saved Filters** — Name and save filter combinations for one-click recall.

### Views

- **List** — Classic linear list with grouping, sorting, and compact/expanded modes.
- **Kanban Board** — Drag tasks across status columns. Columns are fully customizable.
- **Calendar** — Monthly, weekly, and daily layouts. Drag to reschedule.
- **Today / Upcoming** — What's due today, tomorrow, or this week. Overdue items pinned at the top.
- **Inbox** — Catch-all for uncategorized tasks. Process later using GTD-style workflow.
- **Project Drill-Down** — Focus on a single project with progress bar and team view.

### Productivity

- **Notifications** — Push, email, or desktop reminders with configurable lead time.
- **Undo / Redo** — Full history for add, edit, delete, move, and complete actions.
- **Drag & Drop** — Reorder tasks manually. Order persists across sessions.
- **Duplicate & Templates** — Clone a task with all subtasks and tags intact. Save project structures as reusable templates.
- **Focus Mode** — Show one task at a time. Everything else fades away.
- **Stats Dashboard** — Tasks completed per day/week, streaks, time tracked, and peak productivity hours.

### Collaboration

- **Shared Projects** — Invite teammates as Viewer, Editor, or Owner.
- **Task Assignment** — Assign tasks to individuals. Filter by assignee to see workload distribution.
- **Comments & Activity Log** — Threaded discussions on tasks. Chronological changelog tracks every edit.
- **Mentions** — Notify teammates with `@username` in comments.

### Data & Sync

- **Offline-First** — Full functionality without a connection. Changes sync when you're back online.
- **Cross-Device Sync** — Real-time sync across all your devices.
- **Import / Export** — CSV, JSON, and iCal. Migrate from Todoist, TickTick, or Microsoft To Do.
- **Archive & Backup** — Archive completed work to declutter. Automatic periodic backups with snapshot restore.

### UI & Accessibility

- **Dark & Light Mode** — Follows system preference with manual override.
- **Custom Themes** — User-defined accent colors.
- **Responsive** — Desktop, tablet, and mobile browsers.
- **Keyboard Driven** — Nearly every action has a shortcut.
- **Screen Reader Friendly** — ARIA labels, semantic HTML, focus management.
- **i18n** — English, Spanish, French, German, Japanese, and more.

---

## Keyboard Shortcuts

| Shortcut               | Action                                                 |
| ---------------------- | ------------------------------------------------------ |
| `q`                    | Quick-add task                                         |
| `/`                    | Focus search                                           |
| `Ctrl/Cmd + Enter`     | Submit form                                            |
| `Ctrl/Cmd + Z`         | Undo                                                   |
| `Ctrl/Cmd + Shift + Z` | Redo                                                   |
| `e`                    | Edit selected task                                     |
| `Delete`               | Delete selected task(s)                                |
| `Ctrl/Cmd + D`         | Duplicate task                                         |
| `Space`                | Toggle complete                                        |
| `p`                    | Set priority                                           |
| `s`                    | Set status                                             |
| `d`                    | Set due date                                           |
| `l`                    | Add label/tag                                          |
| `f`                    | Focus search bar                                       |
| `1`–`5`                | Switch views (List, Kanban, Calendar, Today, Projects) |
| `↑ ↓`                  | Navigate tasks                                         |
| `Esc`                  | Close modal / clear focus                              |

---

## Tech Stack

| Layer     | Options                                            |
| --------- | -------------------------------------------------- |
| Frontend  | React, Next.js, or Vue                             |
| Backend   | Node.js, Python, or Go                             |
| Database  | PostgreSQL, SQLite (local), or IndexedDB (offline) |
| Real-time | WebSockets or CRDT                                 |
| Mobile    | Responsive Web, React Native, or Flutter           |
| Auth      | OAuth 2.0, Passkeys, Magic Links                   |

---

## Getting Started

```bash
git clone https://github.com/username/todoish.git
cd todoish
npm install
npm run dev
```

> Requirements and detailed setup instructions coming once the stack is finalized.

---

## License

MIT © Todoish Contributors
