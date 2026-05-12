# Sync Protocol Contract

Defines the synchronization protocol between client and server for offline-first operation.

---

## Sequence

```
Client                          Server
  │                                │
  │──── syncRequest(lastSeqNo) ───→│  GET /sync?since={seqNo}
  │←── { changes: [], seqNo: N } ──│  200 + delta payload
  │──── pushMutations([ ... ]) ───→│  POST /sync/mutations
  │←── { accepted, conflicts? } ───│  200 + ack
  │                                │
```

## Delta Sync Request

```
GET /sync?since={seqNo}

Response 200:
{
  "seqNo": 42,
  "changes": [
    {
      "type": "task" | "project" | "section" | "subtask",
      "operation": "create" | "update" | "delete" | "archive",
      "entity": { ... },
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ]
}
```

## Mutation Push

```
POST /sync/mutations
Body: {
  "mutations": [
    {
      "clientId": "uuid",
      "clientTimestamp": "2025-01-15T10:30:00Z",
      "type": "task",
      "operation": "update",
      "entityId": "task-uuid",
      "patch": { "title": "Updated title" }
    }
  ]
}

Response 200:
{
  "accepted": ["uuid-1", "uuid-2"],
  "conflicts": [
    {
      "clientId": "uuid-3",
      "serverEntity": { ... },
      "reason": "concurrent_edit"
    }
  ]
}
```

## Conflict Resolution

| Conflict | Resolution Strategy |
|----------|-------------------|
| Concurrent edit (same field) | Last-write-wins by server timestamp |
| Concurrent edit (different fields) | Merge both changes |
| Delete vs. Edit | Delete wins; subsequent edit creates a new entity |
| Archived entity edited | Edit rejected with `ENTITY_ARCHIVED` error |

## Offline Queue

- Mutations are queued locally in IndexedDB/SQLite.
- Queue is replayed in FIFO order on reconnect.
- If a mutation fails with a conflict, it is removed from the queue and the server version is accepted.
- Queue persists across browser restarts.

## Sync Status

| Status | Description |
|--------|-------------|
| `idle` | Synced, no pending changes |
| `pending` | Local changes queued, waiting for network |
| `syncing` | Actively pushing/pulling |
| `error` | Last sync failed, will retry |
| `offline` | No network connection detected |

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `SYNC_STALE_SEQ` | 409 | Client seqNo too old; full re-sync required |
| `SYNC_CONFLICT` | 409 | Mutation conflicts with server state |
| `ENTITY_ARCHIVED` | 422 | Cannot mutate an archived entity |
| `ENTITY_NOT_FOUND` | 404 | Referenced entity does not exist |
