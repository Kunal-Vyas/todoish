import { ThemeToggle } from "./components/theme-toggle";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todoish</h1>
        <ThemeToggle />
      </header>
    </div>
  );
}

export default App;
