// utils/localStorage.ts
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "todos";

export function loadTasks(): Todo[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveTasks(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
