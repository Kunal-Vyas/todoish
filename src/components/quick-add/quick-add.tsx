import { useState, useCallback, type FormEvent } from "react";
import styles from "./quick-add.module.css";

interface QuickAddProps {
  onAdd: (title: string) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (trimmed.length === 0) return;
      onAdd(trimmed);
      setTitle("");
    },
    [title, onAdd],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Quick-add a new task"
        data-testid="quick-add-input"
      />
    </form>
  );
}
