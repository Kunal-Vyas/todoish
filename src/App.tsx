import { useState, useCallback, useMemo } from "react";
import { ThemeToggle } from "./components/theme-toggle";
import { QuickAdd } from "./components/quick-add";
import { TaskList } from "./components/task-list";
import { TaskDetail } from "./components/task-detail";
import { createTask, listTasks, updateTask, deleteTask, type UpdateTaskInput } from "./agents/task";
import type { Task } from "./contracts/task";
import styles from "./App.module.css";

function loadTasks(): Task[] {
  return listTasks();
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const refreshTasks = useCallback(() => {
    setTasks(loadTasks());
  }, []);

  const handleAdd = useCallback(
    (title: string) => {
      const result = createTask({ title });
      if (result.success) refreshTasks();
    },
    [refreshTasks],
  );

  const handleStatusChange = useCallback(
    (id: string, status: "todo" | "in_progress" | "done") => {
      const result = updateTask(id, { status });
      if (result.success) refreshTasks();
    },
    [refreshTasks],
  );

  const handleUpdate = useCallback(
    (id: string, input: UpdateTaskInput) => {
      const result = updateTask(id, input);
      if (result.success) {
        refreshTasks();
        setSelectedTask(result.data);
      }
    },
    [refreshTasks],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteTask(id);
      refreshTasks();
    },
    [refreshTasks],
  );

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [tasks]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todoish</h1>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.quickAddWrapper}>
            <QuickAdd onAdd={handleAdd} />
          </div>
          <TaskList
            tasks={sortedTasks}
            onStatusChange={handleStatusChange}
            onTaskClick={setSelectedTask}
          />
        </div>
      </main>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default App;
