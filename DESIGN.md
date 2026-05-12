# Design

Technical architecture and design for the Todoish application. This document covers agent architecture, data models, contracts, protocols, and system boundaries.

---

## Table of Contents

- [Agent Architecture](#agent-architecture)
- [1. Task Agent](#1-task-agent)
- [2. UI Agent](#2-ui-agent)
- [3. Sync Agent](#3-sync-agent)
- [4. Auth Agent](#4-auth-agent)
- [5. Search Agent](#5-search-agent)
- [6. Notify Agent](#6-notify-agent)
- [Agent Communication Rules](#agent-communication-rules)
- [Agent Scaffolding](#agent-scaffolding)

---

## Agent Architecture

The system is composed of six specialized agents. Each agent has a well-scoped domain, clear responsibilities, and explicit boundaries. Agents communicate through defined interfaces and data contracts — never through side effects or shared mutable state.

```
┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│  Task Agent  │  │  UI Agent   │  │  Sync Agent  │  │ Auth Agent  │
│  (Core CRUD) │  │  (Frontend) │  │  (Offline &  │  │ (Login &    │
│              │  │             │  │   Real-time) │  │  Permissions)│
└──────┬───────┘  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘
       │                 │               │                  │
       └─────────┬───────┴───────┬───────┘──────────────────┘
                 │               │
          ┌──────┴───────┐ ┌─────┴──────┐
          │  Search Agent │ │  Notify    │
          │  (Indexing,   │ │  Agent     │
          │   Full-Text)  │ │ (Reminders)│
          └──────────────┘ └────────────┘
```

---

## 1. Task Agent

**Domain:** Task lifecycle — create, read, update, delete, and all task-related mutations.

### Responsibilities

- Task CRUD operations (create, read, update, delete)
- Subtask and checklist management
- Task status transitions (todo → in progress → done) with validation rules
- Recurring task generation (next-instance calculation)
- Priority assignment and validation
- Bulk operations (multi-select edit, archive, delete)
- Project, section, tag, and label assignment
- Time estimate storage and time-tracking log
- Task duplication and template instantiation
- Soft-delete and archive/unarchive flows

### Contracts

| Interface | Input | Output |
|-----------|-------|--------|
| `createTask(payload)` | `CreateTaskPayload` | `Task` |
| `updateTask(id, payload)` | `TaskId`, `UpdateTaskPayload` | `Task` |
| `deleteTask(id)` | `TaskId` | `void` |
| `bulkUpdate(ids, payload)` | `TaskId[]`, `BulkUpdatePayload` | `Task[]` |
| `addSubtask(taskId, payload)` | `TaskId`, `CreateSubtaskPayload` | `Subtask` |
| `completeSubtask(taskId, subtaskId)` | `TaskId`, `SubtaskId` | `Subtask` |
| `setTaskStatus(id, status)` | `TaskId`, `TaskStatus` | `Task` |
| `generateNextRecurrence(id)` | `TaskId` | `Task` (next instance) |
| `startTimer(id)` / `stopTimer(id)` | `TaskId` | `TimeLogEntry` |

### Data Model (Core)

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;          // Rich-text / Markdown
  status: TaskStatus;            // "todo" | "in_progress" | "done"
  priority: Priority;            // "P0" | "P1" | "P2" | "P3" | "P4"
  projectId?: string;
  sectionId?: string;
  tags: string[];
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
  dueTime?: string;              // "HH:mm"
  estimatedMinutes?: number;
  isRecurring: boolean;
  recurrenceRule?: string;       // RRULE or cron expression
  parentTaskId?: string;         // For subtasks
  subtasks: Subtask[];
  isPinned: boolean;
  sortOrder: number;             // Manual ordering
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  archivedAt?: Date;
}

interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}
```

### Boundaries

- Does NOT handle UI rendering or user input capture.
- Does NOT manage authentication or authorization (calls Auth Agent to verify permissions).
- Does NOT push notifications (emits events that the Notify Agent subscribes to).
- Does NOT index tasks for search (emits change events consumed by Search Agent).

---

## 2. UI Agent

**Domain:** All user-facing rendering, interaction, and accessibility.

### Responsibilities

- Render all views: List, Kanban, Calendar, Today, Project, Inbox
- Handle user input — forms, modals, inline edits, drag & drop
- Manage client-side state (selected task, active view, open modals, filters)
- Implement keyboard shortcuts and bind them to Task Agent actions
- Enforce responsive layout across breakpoints
- Apply theming (dark/light/custom), respecting system preferences
- Ensure WCAG 2.1 AA compliance — ARIA labels, focus traps, semantic HTML
- Render notifications/toasts for success, error, and undo actions
- Optimistic UI updates with rollback on failure
- Internationalization (i18n) — load and render localized strings

### Contracts

| Interface | Input | Output |
|-----------|-------|--------|
| `renderView(viewType, context)` | `ViewType`, `ViewContext` | Rendered component tree |
| `showTaskDetail(taskId)` | `TaskId` | opens detail panel/modal |
| `showQuickAdd(defaults?)` | `QuickAddDefaults?` | renders inline quick-add |
| `applyFilters(filters)` | `FilterSet` | filtered visible tasks |
| `setSortOrder(sort)` | `SortSpec` | re-ordered visible tasks |
| `toggleTheme()` | — | updated CSS variables |

### Component Tree (partial)

```
<App>
  <Sidebar>
    <InboxLink />
    <TodayLink />
    <ProjectList />
    <SmartListList />
  </Sidebar>
  <MainContent>
    <ViewToolbar>       <!-- search, sort, filter, view switcher -->
    <TaskList />        <!-- or <KanbanBoard />, <CalendarView />, etc. -->
    <TaskDetailPanel /> <!-- slide-over or modal -->
    <QuickAddInput />
  </MainContent>
</App>
```

### Boundaries

- Does NOT mutate task data directly — calls Task Agent interfaces.
- Does NOT manage persistence — delegates to Sync Agent.
- Does NOT authenticate users — calls Auth Agent.
- Does NOT compute recurring-task logic — that is the Task Agent's domain.

---

## 3. Sync Agent

**Domain:** Data persistence, offline support, conflict resolution, and cross-device synchronization.

### Responsibilities

- Persist all data locally (IndexedDB / SQLite) for offline-first operation
- Synchronize local state with remote server when online
- Queue offline mutations and replay them in order on reconnect
- Conflict detection and resolution (last-write-wins with CRDT-backed merge for collaborative fields)
- Delta sync — send/receive only changed records, not full dataset
- Manage sync status indicators (synced, syncing, offline, error)
- Handle import/export (CSV, JSON, iCal) with format validation
- Run periodic local backups and manage snapshot rotation
- Data migration scripts for schema version upgrades

### Contracts

| Interface | Input | Output |
|-----------|-------|--------|
| `persistMutation(mutation)` | `Mutation` | `Promise<void>` (queued) |
| `getLocalState()` | — | `LocalStateSnapshot` |
| `syncNow()` | — | `SyncResult` |
| `getSyncStatus()` | — | `SyncStatus` |
| `exportData(format)` | `ExportFormat` | `Blob` (download trigger) |
| `importData(file, format)` | `File`, `ImportFormat` | `ImportResult` |
| `createBackup()` | — | `BackupMetadata` |
| `restoreBackup(id)` | `BackupId` | `void` |

### Sync Protocol

```
Client                          Server
  │                                │
  │──── syncRequest(lastSeqNo) ───→│
  │←── changesSince(seqNo) [delta] │
  │──── pushPendingMutations() ───→│
  │←── ack(seqNo, conflicts?) ─────│
  │                                │
```

### Boundaries

- Does NOT understand task domain logic — treats data as opaque records.
- Does NOT render UI — reports sync status; UI Agent renders it.
- Does NOT authenticate — passes auth tokens from Auth Agent.
- Does NOT decide what to notify — publishes sync events; Notify Agent consumes them.

---

## 4. Auth Agent

**Domain:** User identity, authentication, and authorization.

### Responsibilities

- User sign-up, sign-in, sign-out flows
- OAuth 2.0 integration (Google, GitHub, Apple)
- Passkey / WebAuthn support
- Magic-link email authentication
- Session management and token refresh
- Role-Based Access Control (RBAC) — owner, editor, viewer per project
- Permission checks for every mutating operation
- User profile management (avatar, display name, preferences)

### Contracts

| Interface | Input | Output |
|-----------|-------|--------|
| `signUp(email, password)` | `Credentials` | `Session` |
| `signIn(email, password)` | `Credentials` | `Session` |
| `signInWithProvider(provider)` | `OAuthProvider` | redirect flow |
| `signOut()` | — | `void` |
| `getSession()` | — | `Session \| null` |
| `refreshToken()` | — | `Session` |
| `canEdit(taskId)` | `TaskId` | `boolean` |
| `canView(projectId)` | `ProjectId` | `boolean` |
| `getUserProfile(userId)` | `UserId` | `UserProfile` |

### Permission Matrix

| Role   | View Tasks | Edit Tasks | Delete Tasks | Manage Members | Edit Project |
|--------|------------|------------|--------------|----------------|--------------|
| Owner  | ✅         | ✅         | ✅           | ✅             | ✅           |
| Editor | ✅         | ✅         | ✅           | ❌             | ✅           |
| Viewer | ✅         | ❌         | ❌           | ❌             | ❌           |

### Boundaries

- Does NOT store or manage task data.
- Does NOT render login/signup UI — provides interfaces that UI Agent calls.
- Does NOT send emails directly — triggers events that Notify Agent handles.

---

## 5. Search Agent

**Domain:** Full-text indexing, querying, and search result ranking.

### Responsibilities

- Build and maintain an inverted index of tasks, projects, and comments
- Re-index on every mutation (incremental updates via change events)
- Execute full-text search queries with typo tolerance (fuzzy matching)
- Rank results by relevance (TF-IDF or BM25) and apply user's current filters
- Highlight matching terms in results
- Support advanced query syntax — `project:`, `priority:`, `due:`, `tag:`, `assignee:`
- Persist search index locally for offline search capability

### Contracts

| Interface | Input | Output |
|-----------|-------|--------|
| `search(query, filters?)` | `string`, `FilterSet?` | `SearchResult[]` |
| `reindex(taskId)` | `TaskId` | `void` |
| `reindexAll()` | — | `void` |
| `getSuggestions(prefix)` | `string` | `Suggestion[]` |
| `parseAdvancedQuery(raw)` | `string` | `ParsedQuery` |

### Query Syntax Reference

```
"buy groceries"                     # Free-text search
"project:Website priority:P0"       # Scoped search
"due:today"                         # Natural date parsing
"due:2025-01-01..2025-01-31"        # Date range
"tag:@errand assignee:alice"        # Tag + assignee filter
"is:pinned"                         # Special filter
```

### Boundaries

- Does NOT mutate tasks — read-only access to the index.
- Does NOT render search results — provides ranked results; UI Agent renders them.
- Does NOT manage filters — receives `FilterSet` from UI Agent, applies alongside text query.

---

## 6. Notify Agent

**Domain:** Push notifications, email reminders, in-app alerts, and activity feeds.

### Responsibilities

- Schedule and dispatch push notifications for upcoming task deadlines
- Send email reminders with configurable lead time
- Render in-app toast notifications for transient events (save confirmed, sync error)
- Build and maintain per-user activity feed (task assigned, commented, status changed)
- Manage notification preferences per user (channels, quiet hours, digest frequency)
- Handle web-push subscription lifecycle (subscribe, unsubscribe, VAPID key rotation)

### Contracts

| Interface | Input | Output |
|-----------|-------|--------|
| `scheduleReminder(taskId, leadTime)` | `TaskId`, `Duration` | `ReminderId` |
| `cancelReminder(reminderId)` | `ReminderId` | `void` |
| `sendPush(subscription, payload)` | `PushSubscription`, `NotificationPayload` | `void` |
| `sendEmail(to, template, context)` | `Email`, `TemplateId`, `Context` | `void` |
| `getActivityFeed(userId, opts?)` | `UserId`, `PaginationOpts?` | `ActivityEvent[]` |
| `updatePreferences(userId, prefs)` | `UserId`, `NotificationPreferences` | `NotificationPreferences` |
| `toast(message, type)` | `string`, `ToastType` | renders in-app toast |

### Event Subscriptions

This agent listens for internal events emitted by other agents:

| Event | Publisher | Action |
|-------|-----------|--------|
| `task.due_soon` | Task Agent (via cron check) | Dispatch push/email reminder |
| `task.assigned` | Task Agent | Add to activity feed, notify assignee |
| `task.commented` | Task Agent | Notify task watchers |
| `sync.conflict` | Sync Agent | Toast alert to user |
| `sync.offline` / `sync.online` | Sync Agent | Toast connectivity status |
| `auth.magic_link_requested` | Auth Agent | Send magic link email |

### Boundaries

- Does NOT store task data — references task IDs only.
- Does NOT render persistent UI — only transient toasts; activity feed is rendered by UI Agent.
- Does NOT manage auth tokens — uses Auth Agent to resolve user contact info.
- Does NOT decide when a task is due — Task Agent provides due-date; this agent schedules around it.

---

## Agent Communication Rules

1. **All inter-agent communication is through defined contracts** — no agent directly accesses another agent's internal state or database tables.
2. **Events are fire-and-forget** — emitting agent does not await or depend on the consumer's response.
3. **Every mutation is permission-checked** — Auth Agent must approve before Task Agent, Sync Agent, or Search Agent performs a mutating operation on behalf of a user.
4. **Optimistic updates respect agent boundaries** — UI Agent may optimistically render, but the authoritative state lives in Task Agent + Sync Agent.
5. **Errors propagate as typed results** — every contract returns either a success value or a structured error, never throws across agent boundaries.
6. **Agents are independently testable** — each agent can be unit-tested by mocking its dependency contracts.

---

## Agent Scaffolding (per agent)

Each agent lives in its own directory under `packages/` or `src/agents/`:

```
src/agents/task/
├── index.ts              # Public contract exports
├── task.agent.ts         # Agent implementation
├── task.contracts.ts     # TypeScript interfaces & types
├── task.validation.ts    # Input validation (Zod / Yup)
├── task.test.ts          # Unit tests
└── README.md             # Agent-specific docs

src/agents/ui/            # (mirrors structure above)
src/agents/sync/
src/agents/auth/
src/agents/search/
src/agents/notify/
```
