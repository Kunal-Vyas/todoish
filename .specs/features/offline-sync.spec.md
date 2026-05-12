# Offline & Sync

Full offline support with automatic sync when connectivity is restored.

**Stage:** 🟠 Stage 3 &nbsp;|&nbsp; **Depends on:** `features/task-crud.spec.md`, `contracts/sync-protocol.contract.md`

> **MVP note:** The MVP uses synchronous localStorage for persistence. Offline queue, sync protocol, and IndexedDB are Stage 3. Import/export (AC-019 to AC-024) and backup/restore (AC-025 to AC-028) are Stage 4.

---

## Acceptance Criteria

### Offline Operation

- [ ] **AC-001: Create task while offline.** A task created without a network connection is saved locally and queued for sync.
- [ ] **AC-002: Edit task while offline.** Changes to a task while offline are applied locally and queued.
- [ ] **AC-003: Delete task while offline.** Deletion is queued and applied locally immediately.
- [ ] **AC-004: Read tasks while offline.** All previously synced tasks are readable without a connection.
- [ ] **AC-005: Offline indicator.** The UI shows a clear "Offline" badge or indicator when the network is unavailable.
- [ ] **AC-006: Pending changes indicator.** A count of queued, unsynced mutations is shown.

### Sync on Reconnect

- [ ] **AC-007: Automatic sync on reconnect.** When the network returns, queued mutations are pushed in FIFO order.
- [ ] **AC-008: Pull remote changes on reconnect.** After pushing local mutations, the client pulls any changes made on other devices while offline.
- [ ] **AC-009: Sync status indicator.** The UI shows "Syncing…" during active sync and "All synced" when complete.
- [ ] **AC-010: Sync retry on failure.** If a sync push fails (e.g., server error), it retries with exponential backoff (1s, 2s, 4s, 8s, max 30s).

### Conflict Resolution

- [ ] **AC-011: Same-field conflict.** If two devices edit the same field on the same task, the server's last-write-wins timestamp determines the final value.
- [ ] **AC-012: Different-field merge.** If device A changes the title and device B changes the priority, both changes are applied.
- [ ] **AC-013: Delete vs. edit conflict.** If device A deletes a task and device B edits it, the delete wins. The edit is discarded and device B sees the task removed.
- [ ] **AC-014: Conflict notification.** When a local mutation is rejected due to conflict, the user sees a brief toast: "A change couldn't be saved due to a conflict."

### Data Persistence

- [ ] **AC-015: Local database survives page reload.** Tasks remain available after closing and reopening the browser.
- [ ] **AC-016: Local database survives browser restart.** Data persists across system restarts (IndexedDB).
- [ ] **AC-017: Clear local data.** A user can clear all local data (sign-out clears local state).
- [ ] **AC-018: Storage quota handling.** If the local database exceeds the browser's storage quota, the user is warned and old archived tasks are evicted first.

### Import / Export

- [ ] **AC-019: Export to JSON.** All tasks (or a filtered subset) can be exported as a JSON file.
- [ ] **AC-020: Export to CSV.** Tasks export to CSV with columns: title, description, status, priority, project, tags, dueDate.
- [ ] **AC-021: Export to iCal.** Tasks with due dates export as an `.ics` file.
- [ ] **AC-022: Import from JSON.** A valid JSON export can be imported, creating all tasks. Duplicate IDs are skipped.
- [ ] **AC-023: Import validation.** Invalid JSON or malformed task objects are rejected with a descriptive error.
- [ ] **AC-024: Migrate from Todoist.** A Todoist export (CSV or JSON) can be imported with field mapping.

### Backup & Restore

- [ ] **AC-025: Automatic backups.** A snapshot is created automatically every 24 hours (local IndexedDB).
- [ ] **AC-026: Manual backup.** A user can trigger an immediate snapshot.
- [ ] **AC-027: Restore from backup.** A previous snapshot can be restored, replacing the current local state.
- [ ] **AC-028: Snapshot rotation.** A maximum of 7 snapshots are kept. Oldest is evicted when a new one is created.
