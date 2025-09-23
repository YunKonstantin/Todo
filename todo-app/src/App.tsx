// src/App.tsx
import React, { useEffect, useState } from "react";

/** ---- Типы ---- */
type Todo = { id: number; text: string; completed: boolean };

/** ---- localStorage helpers ---- */
const STORAGE_KEY = "todos";

function loadTasks(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error parsing localStorage todos:", e);
    // Если storage битый — очистим его (или вернём пустой список)
    // localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveTasks(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Error saving todos to localStorage:", e);
  }
}

/** ---- Компоненты ---- */
const AddTodo: React.FC<{ onAdd: (text: string) => void }> = ({ onAdd }) => {
  const [text, setText] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (text.trim()) {
              onAdd(text.trim());
              setText("");
            }
          }
        }}
        placeholder="Новая задача..."
        style={{ flex: 1, padding: 8 }}
      />
      <button
        onClick={() => {
          if (text.trim()) {
            onAdd(text.trim());
            setText("");
          }
        }}
      >
        Добавить
      </button>
    </div>
  );
};

const EditTodo: React.FC<{
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}> = ({ initialText, onSave, onCancel }) => {
  const [v, setV] = useState(initialText);
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input value={v} onChange={(e) => setV(e.target.value)} style={{ flex: 1, padding: 6 }} />
      <button onClick={() => v.trim() && onSave(v.trim())}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

const TodoItem: React.FC<{
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}> = ({ todo, onToggle, onDelete, onEdit }) => (
  <li style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0" }}>
    <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
    <span
      onDoubleClick={() => onEdit(todo.id)}
      style={{ flex: 1, cursor: "pointer", textDecoration: todo.completed ? "line-through" : "none" }}
    >
      {todo.text}
    </span>
    <button onClick={() => onEdit(todo.id)}>✎</button>
    <button onClick={() => onDelete(todo.id)} style={{ color: "red" }}>
      ✕
    </button>
  </li>
);

const TodoList: React.FC<{
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEditSave: (id: number, text: string) => void;
}> = ({ todos, onToggle, onDelete, onEditSave }) => {
  const [editId, setEditId] = useState<number | null>(null);

  if (todos.length === 0) return <p>Нет задач</p>;

  return (
    <ul style={{ padding: 0, listStyle: "none" }}>
      {todos.map((t) =>
        editId === t.id ? (
          <li key={t.id}>
            <EditTodo
              initialText={t.text}
              onSave={(text) => {
                onEditSave(t.id, text);
                setEditId(null);
              }}
              onCancel={() => setEditId(null)}
            />
          </li>
        ) : (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={() => setEditId(t.id)}
          />
        )
      )}
    </ul>
  );
};

/** ---- App ---- */
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Загрузка из localStorage (только в клиенте)
  useEffect(() => {
    // защита от SSR (если вдруг в Next.js)
    if (typeof window === "undefined") return;
    const loaded = loadTasks();
    console.log("Loaded from localStorage:", loaded);
    setTodos(loaded);
  }, []);

  // Сохранение при изменении
  useEffect(() => {
    console.log("Saving to localStorage:", todos);
    saveTasks(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: number, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>📝 Задачи йоу</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onEditSave={editTodo} />
    </div>
  );
}
