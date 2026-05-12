# Project API Contract

Defines the data shapes and validation rules for projects and sections.

---

## Project

```typescript
interface Project {
  id: string;
  name: string;           // 1–120 chars, required
  color: string;          // hex color, e.g. "#3B82F6"
  description: string | null;
  isArchived: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

## Section

```typescript
interface Section {
  id: string;
  projectId: string;
  name: string;           // 1–120 chars
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

## Validation Rules

| Field | Rule |
|-------|------|
| `name` | Required. 1–120 chars. Trimmed. Unique within scope. |
| `color` | Must be a valid 6-character hex color including `#`. |
| `description` | Max 5,000 chars. Null allowed. |

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `PROJECT_NOT_FOUND` | 404 | Project does not exist |
| `PROJECT_NAME_REQUIRED` | 422 | Name is empty or missing |
| `PROJECT_NAME_DUPLICATE` | 409 | Project with same name already exists |
| `SECTION_NOT_FOUND` | 404 | Section does not exist |
| `SECTION_NAME_REQUIRED` | 422 | Section name is empty |
| `SECTION_NOT_IN_PROJECT` | 422 | Section does not belong to the given project |
