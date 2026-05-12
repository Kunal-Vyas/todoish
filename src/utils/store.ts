import type { Task } from "../contracts/task";
import type { Project } from "../contracts/project";

const TASKS_KEY = "todoish_tasks";
const PROJECTS_KEY = "todoish_projects";

interface StoreData {
  tasks: Task[];
  projects: Project[];
}

export function load(): StoreData {
  try {
    const rawTasks = localStorage.getItem(TASKS_KEY);
    const rawProjects = localStorage.getItem(PROJECTS_KEY);

    return {
      tasks: rawTasks ? (JSON.parse(rawTasks) as Task[]) : [],
      projects: rawProjects ? (JSON.parse(rawProjects) as Project[]) : [],
    };
  } catch {
    return { tasks: [], projects: [] };
  }
}

export function save(data: StoreData): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(data.tasks));
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(data.projects));
}
