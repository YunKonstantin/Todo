import { useState } from "react";
import type { Todo } from "./types";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
        <p style={{ color: "#555", marginTop: "4px" }}>
          by YunKonstantin
        </p>
        
      </header>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

export default App;
