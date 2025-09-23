// src/App.tsx
import { useEffect, useState } from "react";
import { loadTasks, saveTasks, type Todo } from "./utils/localStorage";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle<{ themeMode: "light" | "dark" }>`
  body {
    margin: 0;
    font-family: sans-serif;
    background-color: ${({ themeMode }) => (themeMode === "light" ? "#f5f5f5" : "#222")};
    color: ${({ themeMode }) => (themeMode === "light" ? "#000" : "#fff")};
  }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
`;

const ThemeButton = styled.button<{ themeMode: "light" | "dark" }>`
  margin-bottom: 12px;
  padding: 6px 12px;
  background-color: ${({ themeMode }) => (themeMode === "light" ? "#2196f3" : "#90caf9")};
  color: ${({ themeMode }) => (themeMode === "light" ? "#fff" : "#000")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const FilterSortRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    setTodos(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(todos);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  const addTodo = (text: string) => setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  const toggleTodo = (id: number) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTodo = (id: number) => setTodos(prev => prev.filter(t => t.id !== id));
  const editTodo = (id: number, text: string) => setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));

  // фильтрация
  let displayedTodos = todos;
  if (filter === "completed") displayedTodos = displayedTodos.filter(t => t.completed);
  if (filter === "incomplete") displayedTodos = displayedTodos.filter(t => !t.completed);

  // сортировка
  displayedTodos = displayedTodos.sort((a, b) => 
    sortOrder === "newest" ? b.id - a.id : a.id - b.id
  );

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <GlobalStyle themeMode={theme} />
      <Container>
        <ThemeButton themeMode={theme} onClick={toggleTheme}>
          Переключить тему
        </ThemeButton>

        <h1>📝 Todo App</h1>

        <FilterSortRow>
          <div>
            <label>Фильтр: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">Все</option>
              <option value="completed">Готовые</option>
              <option value="incomplete">Неготовые</option>
            </select>
          </div>

          <div>
            <label>Сортировка: </label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
              <option value="newest">Новые сначала</option>
              <option value="oldest">Старые сначала</option>
            </select>
          </div>
        </FilterSortRow>

        <AddTodo onAdd={addTodo} theme={theme} />
        <TodoList
          todos={displayedTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEditSave={editTodo}
        />
      </Container>
    </ThemeProvider>
  );
}
