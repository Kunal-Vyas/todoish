import { type Task } from "../../contracts/task";
import { TaskRow } from "../task-row";
import styles from "./task-list.module.css";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: "todo" | "in_progress" | "done") => void;
  onTaskClick: (task: Task) => void;
}

export function TaskList({ tasks, onStatusChange, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty} data-testid="task-list-empty">
        <p className={styles.emptyText}>No tasks yet</p>
        <p className={styles.emptyHint}>Add your first task above</p>
      </div>
    );
  }

  return (
    <div className={styles.list} role="list" data-testid="task-list">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onStatusChange={onStatusChange} onClick={onTaskClick} />
      ))}
    </div>
  );
}
