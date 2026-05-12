# List View Design

UI behavior, component states, and interaction patterns for the List view — the default view.

**References:** `features/search-filter-sort.spec.md`, `features/pinned-tasks.spec.md`

---

## Component States

### Task Row

| State            | Visual Treatment                                                         |
| ---------------- | ------------------------------------------------------------------------ |
| **Default**      | Title, priority dot, project color bar, due date (if set)                |
| **Hover**        | Subtle background highlight, action buttons appear (complete, edit, pin) |
| **Focused**      | Visible focus ring, keyboard-navigable                                   |
| **Selected**     | Checkbox checked, row highlighted with accent color background           |
| **Completed**    | Title struck through, reduced opacity, muted colors                      |
| **Overdue**      | Due date in red with warning icon                                        |
| **Pinned**       | Pin icon visible, sorted to top of list                                  |
| **Has subtasks** | Progress indicator (e.g., "3/5") next to title                           |
| **Loading**      | Skeleton placeholder rows with shimmer animation                         |
| **Empty**        | Illustration + "No tasks yet" message + "Add your first task" button     |

### Section Header (when grouped)

| State         | Visual Treatment                                    |
| ------------- | --------------------------------------------------- |
| **Default**   | Section name, task count badge, collapsible chevron |
| **Collapsed** | Chevron rotated, tasks hidden, count still visible  |
| **Expanded**  | Chevron pointing down, tasks visible                |

### Quick-Add Input

| State          | Visual Treatment                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **Closed**     | "+" button or placeholder bar at top/bottom of list                                                             |
| **Open**       | Text input with placeholder "Add a task…", natural language hint, project/date/priority pills as they're parsed |
| **Submitting** | Input disabled, spinner, then task appears at top of list and input clears                                      |

### View Toolbar

| Element               | Behavior                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Search input**      | Type to search. Results update as you type (debounced 150ms). Clear button when text present |
| **Filter chips**      | Active filters shown as removable chips (e.g., "P1 ✕", "Due this week ✕")                    |
| **Sort dropdown**     | Current sort field + direction. Click to change                                              |
| **View switcher**     | Icons for List, Kanban, Calendar. Active view highlighted                                    |
| **Selection toolbar** | Appears when tasks selected: "N selected" + bulk action buttons                              |

## Interaction Patterns

- **Click task title:** Opens task detail panel (slide-over on desktop, full-screen on mobile)
- **Click checkbox:** Toggles selection
- **Double-click task:** Opens inline edit for title
- **Drag task:** If grouping is disabled, tasks can be reordered by dragging the drag handle
- **Drag to project:** Dragging a task to a project in the sidebar moves it

## Responsive Behavior

| Breakpoint | Layout                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| < 640px    | Single column, sidebar hidden (hamburger menu), task detail as full-screen modal |
| 640–1024px | Sidebar collapses to icons only, task detail as slide-over                       |
| > 1024px   | Full sidebar, task detail as persistent side panel                               |

## Accessibility

- Task rows are `<li>` elements inside a `<ul>` with `role="list"`
- Each row has `aria-label` summarizing task: "Buy groceries, priority P2, due February 14, 2 tasks selected"
- Checkboxes have `aria-label="Select Buy groceries"`
- Drag handle has `aria-label="Drag to reorder Buy groceries"`
- Progress indicators have `aria-label="3 of 5 subtasks completed"`
- Focus follows drag-and-drop: after dropping, focus moves to the moved task
