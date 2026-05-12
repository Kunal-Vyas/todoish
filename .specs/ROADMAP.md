# Roadmap

Release staging plan for Todoish. Each stage builds on the previous one, delivering a fully functional, shippable increment.

---

## Stage Summary

| Stage          | Theme                              | # Specs            | ACs  | Target |
| -------------- | ---------------------------------- | ------------------ | ---- | ------ |
| 🟢 **MVP**     | Core todo — capture & organize     | 7                  | ~118 | v0.1   |
| 🟡 **Stage 2** | Better organization & views        | 6                  | ~128 | v0.3   |
| 🟠 **Stage 3** | Power, connectivity & multi-device | 5                  | ~137 | v0.6   |
| 🔵 **Stage 4** | Team collaboration & polish        | 1 (+ polish items) | ~29  | v1.0   |

---

## 🟢 MVP — v0.1

**Goal:** A single-user, local-only todo app that can capture, organize, and filter tasks. Ship in 2–4 weeks.

### Specs

| Spec                 | ACs | Key Deliverables                                                                      |
| -------------------- | --- | ------------------------------------------------------------------------------------- |
| `task-crud`          | 33  | Create, read, update, delete tasks. Status transitions. Validation.                   |
| `projects`           | 21  | Create, rename, archive projects. Default "Uncategorized" section.                    |
| `priorities`         | 9   | P1–P4 levels. Color-coded. Default P4.                                                |
| `inbox`              | 13  | Uncategorized tasks view. Quick-add targets inbox.                                    |
| `search-filter-sort` | 27  | Full-text search, filter by status/priority/project, sort by due date/priority/alpha. |
| `keyboard-shortcuts` | 8   | `q` quick-add, `/` search, `Esc` dismiss, `↑↓` navigate, `Ctrl+Z` undo (basic).       |
| `theming`            | 6   | System light/dark detection, manual toggle, CSS custom properties for all colors.     |

### MVP Implementation Order

The build order is designed so every step produces something visible and testable. Nothing is blocked waiting for a future step.

---

#### Step 0: Project Scaffolding _(no spec — infrastructure)_

Set up the repository before touching any feature code. Full design and executable tasks: `designs/scaffolding.design.md`.

10 tasks, each independently committable: init Vite, TS strict mode, ESLint flat config, Prettier, pre-commit hooks, Vitest + RTL, directory structure, Zod, CI pipeline, final verification.

**Deliverable:** ✅ Complete. Green build, zero warnings. 14 tests passing (4 files).

---

#### Step 1: Design Tokens & Theme System ✅

**Spec:** `theming.spec.md` (AC-001, AC-002, AC-003, AC-005, AC-010)

Why first: Every component built afterward uses these tokens. Doing this now prevents color-hardcoding that would need to be ripped out later.

- [x] Define all CSS custom properties from `designs/theme.design.md` on `:root` → `src/styles/tokens.css`
- [x] Add `[data-theme="dark"]` overrides → same file, 38 overrides
- [x] Write the blocking `<script>` in `<head>` that reads `localStorage` and sets `data-theme` before first paint → `index.html`
- [x] Build the theme toggle button (sun/moon icon). Clicking cycles light → dark → system → `src/components/theme-toggle/`
- [x] Persist choice to `localStorage`. Listen to `matchMedia('prefers-color-scheme')` changes when set to "system" → `src/hooks/use-theme.ts`
- [x] Verify: Page loads in correct theme. Toggle works. No flash on reload. OS preference change is live-reflected.
- [x] Test: AC-001, AC-002, AC-003, AC-005 → 14 tests (7 useTheme + 4 ThemeToggle + 2 App + 1 task scaffold)

**Deliverable:** ✅ Complete. Themed shell with light/dark/system toggle. All colors sourced from CSS custom properties.

---

#### Step 2: Data Contracts & Persistence Layer

**Contract:** `task-api.contract.md`, `project-api.contract.md`

Why second: Before creating tasks, the data shapes and the store must exist.

- [ ] Define TypeScript types for `Task`, `Subtask`, `Project`, `Section` in `src/contracts/`.
- [ ] Implement Zod schemas for runtime validation (mirrors the contract validation rules).
- [ ] Build a simple `localStorage` store:
  - `load(): { tasks, projects }` — reads from `localStorage`, returns empty defaults if nothing stored.
  - `save({ tasks, projects })` — writes to `localStorage`.
- [ ] Write unit tests for Zod validators (title required, invalid status rejected, etc.).
- [ ] Write unit tests for the store (round-trip: save then load returns the same data).

**Deliverable:** Typed data models, validated inputs, and a persistence layer. Still no UI for tasks, but the store is testable.

---

#### Step 3: Task CRUD

**Spec:** `task-crud.spec.md` (all 33 ACs)

This is the core. Every other feature operates on tasks. Build the full CRUD with a minimal but functional list UI.

- [ ] Implement the Task Agent (`createTask`, `updateTask`, `deleteTask`, `getTask`, `listTasks`).
- [ ] Wire to the localStorage store from Step 2.
- [ ] Build a minimal **List View** component:
  - Task rows showing title, priority dot, due date, status badge.
  - Click to select. Double-click to inline-edit title.
  - Status dropdown per task (todo / in_progress / done).
- [ ] Build the **Quick-Add** input:
  - Text input at the top of the list. `Enter` to submit.
  - Creates a task with defaults (status: todo, priority: P4, no project).
- [ ] Build the **Task Detail Panel** (slide-over):
  - Edit title, description, start date, due date, due time.
  - Change priority.
  - Assign to project.
  - Delete button with confirmation.
- [ ] Implement all status transition rules (done → in_progress is invalid, etc.).
- [ ] Set `completedAt` on completion, clear on reopen.
- [ ] Test: All 33 task-crud ACs pass.

**Deliverable:** A working task list. You can create, edit, complete, and delete tasks. Tasks persist across page reloads.

---

#### Step 4: Projects

**Spec:** `projects.spec.md` (AC-001 to AC-021 ; sections AC-022 to AC-028 are Stage 2)

Tasks exist, but they're all in one flat list. Projects add grouping.

- [ ] Implement Project Agent (`createProject`, `updateProject`, `deleteProject`, `listProjects`).
- [ ] Automatically create a default "Uncategorized" section when a project is created.
- [ ] Build the **Project Sidebar**:
  - List of projects with their colors.
  - Click to filter tasks by project.
  - "+ New Project" button → inline name + color picker.
  - Right-click / ••• menu: Rename, Change color, Archive, Delete.
- [ ] Add project assignment to the Task Detail Panel (dropdown of projects).
- [ ] Add project color bar to task rows.
- [ ] Archive/unarchive projects. Archived projects are hidden from the sidebar by default.
- [ ] Test: AC-001 to AC-021 pass. (Skip sections ACs for now.)

**Deliverable:** Tasks can be grouped into projects. Sidebar filters the task list by project.

---

#### Step 5: Priorities

**Spec:** `priorities.spec.md` (all 9 ACs)

Priorities are partially implemented from Step 3 (the field exists). This step adds the visual treatment and edge cases.

- [ ] Add priority color dots (red P1, amber P2, blue P3, gray P4) to task rows.
- [ ] Add priority selector in the Quick-Add input (parse `!p1`, `!high`, `!critical` in natural language).
- [ ] Ensure new tasks default to P4 when no priority is specified.
- [ ] Verify priority persists through updates (changing title doesn't reset priority).
- [ ] Test: All 9 priorities ACs pass.

**Deliverable:** Every task has a visible, changeable priority. Color-coded for scanning.

---

#### Step 6: Inbox

**Spec:** `inbox.spec.md` (all 13 ACs)

All new tasks currently appear in the main list. The Inbox gives uncategorized tasks a dedicated home.

- [ ] Add **Inbox** as the first item in the sidebar (above projects).
- [ ] Show count of tasks with `projectId === null`.
- [ ] Clicking Inbox filters the task list to only uncategorized tasks.
- [ ] Quick-add from anywhere (except inside a project view) creates tasks in the Inbox.
- [ ] Quick-add from inside a project view creates tasks in that project.
- [ ] Allow assigning a task to a project directly from the Inbox (drag to sidebar project, or dropdown in row).
- [ ] Empty state: "All caught up! Your Inbox is empty." when count is 0.
- [ ] Test: All 13 inbox ACs pass.

**Deliverable:** Inbox as the default landing. GTD-style capture → organize flow.

---

#### Step 7: Search, Filter & Sort

**Spec:** `search-filter-sort.spec.md` (AC-001 to AC-027 ; saved filters AC-028 to AC-032 are Stage 2)

Tasks are piling up. Users need to find and organize them.

- [ ] Build the **Search Bar**:
  - Text input with debounced search (150ms).
  - Searches title + description (case-insensitive).
  - Clear button when text is present.
  - Highlight matching text in results.
  - Empty query returns all tasks.
- [ ] Build **Filter Chips**:
  - Status filter: Todo / In Progress / Done / All.
  - Priority filter: P1 / P2 / P3 / P4 / All.
  - Project filter: driven by sidebar selection.
  - Active filters shown as removable chips.
  - Clear all filters button.
- [ ] Build **Sort Dropdown**:
  - Options: Due date (default), Priority, Created, Alphabetical.
  - Ascending/descending toggle.
  - Pinned tasks always sort first (prepare for Stage 2).
  - Tasks without due dates sort last when sorting by due date.
- [ ] Compose search + filters + sort: results satisfy all three.
- [ ] Test: AC-001 to AC-027 pass.

**Deliverable:** Users can find any task instantly and reorder the list however they want.

---

#### Step 8: Keyboard Shortcuts

**Spec:** `keyboard-shortcuts.spec.md` (MVP scope: AC-001 to AC-006, AC-017, AC-018)

Power users need speed. This step binds keyboard shortcuts to the features already built.

- [ ] Build a global keyboard event handler.
- [ ] `q` — focus the quick-add input.
- [ ] `/` or `f` — focus the search bar.
- [ ] `Esc` — close any open modal/panel, clear focus, cancel inline edit.
- [ ] `↑` / `↓` — move focus between task rows.
- [ ] `Enter` on a focused task — open detail panel.
- [ ] `Space` on a focused task — toggle complete.
- [ ] `Ctrl/Cmd + Z` — undo last mutation.
- [ ] `Ctrl/Cmd + Shift + Z` — redo.
- [ ] Shortcuts must not fire when an input/textarea is focused (except `Esc`).
- [ ] Test: All MVP-scoped keyboard ACs pass.

**Deliverable:** The app is fully keyboard-drivable for core actions.

---

#### Step 9: Integration & Polish

The features are built. This step wires loose ends and hardens the experience.

- [ ] Verify all cross-feature interactions:
  - Creating a task in Inbox, then assigning it to a project, removes it from Inbox.
  - Filters persist when switching between Inbox and project views.
  - Theme toggle works from any view.
  - Keyboard shortcuts work with every view/filter/sort combination.
- [ ] Edge case sweep:
  - Empty states for every view (no tasks, no projects, no search results).
  - Error states (localStorage full, corrupted data).
  - Very long titles (truncation with ellipsis).
  - Rapid interactions (double-click, quick successive keypresses).
- [ ] Manual QA:
  - Keyboard navigation pass (Tab through every interactive element).
  - Screen reader pass (VoiceOver/NVDA on critical flows).
  - Mobile viewport pass (320px width).
- [ ] Performance check:
  - List renders 500 tasks without jank.
  - No unnecessary re-renders on keystroke.
- [ ] Run the full test suite. All ~118 MVP ACs must pass.

**Deliverable:** MVP is complete. Ready for release.

---

### MVP Build Order Summary

```
Step 0: Scaffolding        [x] Complete
    │
Step 1: Theme System       [x] Complete
    │
Step 2: Contracts & Store  [ ] task-api.contract, project-api.contract
    │
Step 3: Task CRUD          [ ] task-crud (33 ACs)
    │
Step 4: Projects           [ ] projects (21 ACs)
    │
Step 5: Priorities         [ ] priorities (9 ACs)
    │
Step 6: Inbox              [ ] inbox (13 ACs)
    │
Step 7: Search/Filter/Sort [ ] search-filter-sort (27 ACs)
    │
Step 8: Keyboard Shortcuts [ ] keyboard-shortcuts (8 ACs)
    │
Step 9: Integration/Polish [ ] Cross-feature testing, edge cases, a11y
```

### What's NOT in MVP

- No auth (local-only, single user)
- No tags, subtasks, pinned tasks
- No Kanban or Calendar views
- No recurring tasks, bulk operations, undo/redo
- No sync, offline support, or multi-device
- No collaboration, comments, notifications
- No import/export
- Persistence via `localStorage` (synchronous, no sync protocol)

### MVP Architecture

```
┌─────────────────────────────────┐
│  Browser (single-user, local)   │
│                                 │
│  React UI                       │
│    ├── List View                │
│    ├── Inbox View               │
│    ├── Project sidebar          │
│    └── Search/Filter/Sort bar   │
│                                 │
│  Task Agent (in-memory + store) │
│                                 │
│  localStorage (JSON blob)       │
└─────────────────────────────────┘
```

---

## 🟡 Stage 2 — v0.3

**Goal:** Richer task organization, alternative views, and efficiency features. Ship in 3–5 weeks after MVP.

### Specs

| Spec              | ACs | Key Deliverables                                                               |
| ----------------- | --- | ------------------------------------------------------------------------------ |
| `tags`            | 18  | Free-form tags. Add, remove, filter by tag. Case-insensitive. Max 20 per task. |
| `subtasks`        | 19  | Checklists with progress tracking. 1-level depth. Reorder.                     |
| `pinned-tasks`    | 10  | Pin/unpin. Pinned tasks sort first in all views.                               |
| `kanban-board`    | 20  | Drag-and-drop columns (Todo/In Progress/Done). Custom columns. Project-scoped. |
| `calendar-view`   | 18  | Month, week, day views. Drag to reschedule. Multi-day task bars.               |
| `bulk-operations` | 20  | Multi-select, bulk status/priority/project, bulk delete/archive.               |

### MVP Additions (extend existing specs)

| Spec                 | New ACs | What's Added                                                                                 |
| -------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `search-filter-sort` | 5       | Saved filters (AC-028 to AC-032)                                                             |
| `keyboard-shortcuts` | 11      | Editing shortcuts, view switching, shortcut help dialog (AC-007 to AC-016, AC-019 to AC-021) |
| `projects`           | 7       | Sections — create, rename, delete, reorder (AC-022 to AC-028)                                |

### Stage 2 Architecture

```
┌──────────────────────────────────────────┐
│  Browser (single-user, local)            │
│                                          │
│  React UI                                │
│    ├── List View  ├── Kanban Board       │
│    ├── Inbox       ├── Calendar View     │
│    ├── Project sidebar                   │
│    └── Tag management, Bulk actions      │
│                                          │
│  Task Agent  ───  localStorage           │
└──────────────────────────────────────────┘
```

---

## 🟠 Stage 3 — v0.6

**Goal:** Multi-device support, offline resilience, and power-user features. Ship in 4–6 weeks after Stage 2.

### Specs

| Spec              | ACs | Key Deliverables                                                                |
| ----------------- | --- | ------------------------------------------------------------------------------- |
| `auth`            | 20  | Email+password sign-up/sign-in, OAuth, magic links, RBAC (owner/editor/viewer). |
| `recurring-tasks` | 20  | RRULE-based recurrence. Auto-generate next instance on completion.              |
| `undo-redo`       | 18  | 100-entry undo stack. Undo any mutation. Redo. Per-session.                     |
| `offline-sync`    | 18  | IndexedDB persistence. Offline queue. Reconnect sync. Conflict resolution.      |
| `notifications`   | 17  | Push notifications (via service worker). Reminders. In-app toasts.              |

### Stage 3 Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Browser  │     │ Browser  │     │   Server      │
│ (device1)│     │ (device2)│     │               │
│          │     │          │     │ Auth Service  │
│ IndexedDB│     │ IndexedDB│     │ Sync Service  │
│ Sync Q   │     │ Sync Q   │     │ Push Service  │
└────┬─────┘     └────┬─────┘     └──────┬───────┘
     │                │                  │
     └────────────────┼──────────────────┘
                      │
              Delta sync protocol
              Conflict resolution (LWW)
```

---

## 🔵 Stage 4 — v1.0

**Goal:** Team collaboration, data portability, and production polish. Ship in 4–6 weeks after Stage 3.

### Specs

| Spec            | ACs | Key Deliverables                                                                                    |
| --------------- | --- | --------------------------------------------------------------------------------------------------- |
| `collaboration` | 29  | Shared projects (owner/editor/viewer). Task assignment. Threaded comments. @mentions. Activity log. |

### Polish Items (extend existing specs)

| Spec            | What's Added                                                                |
| --------------- | --------------------------------------------------------------------------- |
| `offline-sync`  | Import/export (JSON, CSV, iCal). Todoist migration. Backup & restore.       |
| `theming`       | Custom accent colors, high-contrast mode, reduced motion, print stylesheet. |
| `notifications` | Email reminders, quiet hours, daily digest mode.                            |

### Stage 4 Architecture (Final)

```
┌──────────┐     ┌──────────┐     ┌──────────────────┐
│ Browser  │     │ Browser  │     │   Server          │
│ (device1)│     │ (device2)│     │                   │
│          │     │          │     │ Auth Service      │
│ IndexedDB│     │ IndexedDB│     │ Sync Service      │
│ Sync Q   │     │ Sync Q   │     │ Push Service      │
└────┬─────┘     └────┬─────┘     │ Email Service     │
     │                │           │ Collab Service    │
     └────────────────┼───────────┤ Import/Export     │
                      │           └──────────────────┘
               Full collaboration
               Real-time comments
               Cross-device sync
               Data import/export
```

---

## Dependency Graph

```
🟢 MVP                🟡 Stage 2           🟠 Stage 3           🔵 Stage 4
───────              ──────────           ──────────           ──────────

task-crud ──────────→ tags               auth ───────────────→ collaboration
    │       ┌───────→ subtasks           recurring-tasks
    │       │───────→ pinned-tasks       undo-redo
    │       │───────→ bulk-operations    offline-sync
    │       │───────→ kanban-board       notifications
    │       │───────→ calendar-view
    │       │
projects ─┼───────→ sections (ext)
    │     │
inbox ────┘
priorities
search-filter-sort ──→ saved-filters (ext)
keyboard-shortcuts ──→ editing shortcuts (ext)
theming ─────────────────────────────────────────────────────→ polish (ext)
```

---

## AC Count by Stage

```
MVP (7 specs)          ████████████  118 ACs
Stage 2 (6 specs)      █████████████  128 ACs
Stage 3 (5 specs)      ██████████████  137 ACs
Stage 4 (1 spec)       ████  29 ACs
                                   + polish items
                                   ─────────
                                    ~412 total ACs
```

---

## Key Design Decisions

1. **MVP is local-only.** No server, no auth, no sync. This eliminates an enormous amount of complexity and lets us validate the core UX before building infrastructure.
2. **localStorage for MVP, IndexedDB for Stage 3.** localStorage is synchronous and simpler but has a ~5MB limit. IndexedDB is async, larger, and needed for offline queue.
3. **Auth deferred to Stage 3.** Until there's a server and multi-device sync, there's nothing to authenticate against. The MVP user doesn't sign in.
4. **Collaboration is the final frontier.** Shared projects, real-time comments, and activity logs require auth, sync, and a server — all three prior stages must be solid first.
5. **Each stage ships.** No stage is a "partial" build. Every stage produces a working, usable application that could be released.
