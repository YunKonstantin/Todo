// App.tsx
import { useState, useEffect } from "react";
import type { Todo } from "./components/localStorage";
import { loadTasks, saveTasks } from "./components/localStorage";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTodos(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, text: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <header
        style={{
          marginBottom: "20px",
          padding: "10px 0",
          borderBottom: "2px solid #eee",
        }}
      >
        <h1 style={{ margin: 0 }}>📝 Задачи йоу</h1>
        <p style={{ color: "#555", marginTop: "4px" }}>by YunKonstantin</p>
      </header>
      <AddTodo onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEditSave={editTodo}
      />
    </div>
  );
}

export default App;
