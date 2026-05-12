import type { Task } from "../../contracts/task";
import styles from "./task-row.module.css";

const PRIORITY_LABELS: Record<string, string> = {
  P1: "P1",
  P2: "P2",
  P3: "P3",
  P4: "P4",
};

interface TaskRowProps {
  task: Task;
  onStatusChange: (id: string, status: "todo" | "in_progress" | "done") => void;
  onClick: (task: Task) => void;
}

export function TaskRow({ task, onStatusChange, onClick }: TaskRowProps) {
  const isCompleted = task.status === "done";

  return (
    <div
      className={`${styles.row} ${isCompleted ? styles.completed : ""}`}
      onClick={() => onClick(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(task);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}, priority ${task.priority}`}
      data-testid="task-row"
    >
      <button
        className={`${styles.checkbox} ${isCompleted ? styles.checkboxDone : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onStatusChange(task.id, isCompleted ? "todo" : "done");
        }}
        aria-label={`Mark ${task.title} as ${isCompleted ? "todo" : "done"}`}
        data-testid="task-checkbox"
      >
        {isCompleted ? "✓" : ""}
      </button>

      <div className={styles.content}>
        <span className={styles.title}>{task.title}</span>
        {task.dueDate && (
          <span className={`${styles.dueDate} ${isOverdue(task) ? styles.overdue : ""}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <span
        className={styles.priority}
        data-priority={task.priority}
        aria-label={`Priority ${task.priority}`}
      >
        {PRIORITY_LABELS[task.priority]}
      </span>
    </div>
  );
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "done") return false;
  return task.dueDate < new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === now.toISOString().slice(0, 10)) return "Today";
  if (dateStr === tomorrow.toISOString().slice(0, 10)) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
