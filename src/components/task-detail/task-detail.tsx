import { useState, useCallback, useEffect, type FormEvent } from "react";
import type { Task } from "../../contracts/task";
import type { UpdateTaskInput } from "../../agents/task";
import styles from "./task-detail.module.css";

interface TaskDetailProps {
  task: Task;
  onUpdate: (id: string, input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TaskDetail({ task, onUpdate, onDelete, onClose }: TaskDetailProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [dueTime, setDueTime] = useState(task.dueTime ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setDueDate(task.dueDate ?? "");
    setDueTime(task.dueTime ?? "");
    setShowDeleteConfirm(false);
  }, [task]);

  const handleSave = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const input: UpdateTaskInput = {
        title: title.trim() || task.title,
        description: description.trim() || null,
        priority,
        dueDate: dueDate || null,
        dueTime: dueTime || null,
      };
      onUpdate(task.id, input);
    },
    [task, title, description, priority, dueDate, dueTime, onUpdate],
  );

  const handleDelete = useCallback(() => {
    onDelete(task.id);
    onClose();
  }, [task.id, onDelete, onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} data-testid="task-detail-overlay">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()} data-testid="task-detail">
        <form onSubmit={handleSave}>
          <div className={styles.field}>
            <input
              className={styles.titleInput}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              aria-label="Task title"
              data-testid="detail-title"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="detail-desc">
              Description
            </label>
            <textarea
              id="detail-desc"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows={3}
              placeholder="Add description…"
              data-testid="detail-description"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="detail-priority">
                Priority
              </label>
              <select
                id="detail-priority"
                className={styles.select}
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value as Task["priority"]);
                }}
                onBlur={handleSave}
                data-testid="detail-priority"
              >
                <option value="P1">P1 — Critical</option>
                <option value="P2">P2 — High</option>
                <option value="P3">P3 — Medium</option>
                <option value="P4">P4 — Low</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="detail-due-date">
                Due date
              </label>
              <input
                id="detail-due-date"
                className={styles.input}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={handleSave}
                data-testid="detail-due-date"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="detail-due-time">
                Due time
              </label>
              <input
                id="detail-due-time"
                className={styles.input}
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                onBlur={handleSave}
                data-testid="detail-due-time"
              />
            </div>
          </div>
        </form>

        <div className={styles.footer}>
          <span className={styles.meta}>
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {!showDeleteConfirm ? (
            <button
              className={styles.deleteBtn}
              onClick={() => setShowDeleteConfirm(true)}
              data-testid="detail-delete-btn"
            >
              Delete task
            </button>
          ) : (
            <span className={styles.confirmGroup}>
              <span className={styles.confirmText}>Delete?</span>
              <button
                className={styles.confirmYes}
                onClick={handleDelete}
                data-testid="detail-confirm-delete"
              >
                Yes
              </button>
              <button className={styles.confirmNo} onClick={() => setShowDeleteConfirm(false)}>
                No
              </button>
            </span>
          )}
        </div>

        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close task detail"
          data-testid="detail-close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
