export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "todos";

export function loadTasks(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Ошибка чтения localStorage:", e);
    return [];
  }
}

export function saveTasks(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Ошибка сохранения localStorage:", e);
  }
}
