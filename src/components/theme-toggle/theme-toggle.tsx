import { useTheme } from "../../hooks/use-theme";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const label = theme === "light" ? "Dark mode" : theme === "dark" ? "System mode" : "Light mode";

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻"}
      </span>
    </button>
  );
}
