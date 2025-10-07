// src/App.tsx
import { useEffect, useState } from "react";
import { loadTasks, saveTasks, type Todo } from "./utils/localStorage";
import Header from "./components/Header";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import styled, {
  ThemeProvider,
  createGlobalStyle,
  keyframes,
} from "styled-components";

const GlobalStyle = createGlobalStyle<{ themeMode: "light" | "dark" }>`
  body {
    margin: 0;
    font-family: "Inter", system-ui, sans-serif;
    background: ${({ themeMode }) =>
      themeMode === "light"
        ? "linear-gradient(135deg, #e0f7fa, #ffffff)"
        : "linear-gradient(135deg, #1e1e2f, #121212)"};
    color: ${({ themeMode }) => (themeMode === "light" ? "#111" : "#f1f1f1")};
    transition: background 0.4s ease, color 0.3s ease;
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const MainContainer = styled.div`
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Card = styled.div<{ themeMode: "light" | "dark" }>`
  background: ${({ themeMode }) =>
    themeMode === "light"
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(40, 40, 40, 0.7)"};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
  width: 100%;
  animation: ${fadeIn} 0.5s ease;
  margin-top: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 20px;
  text-align: center;
  font-weight: 700;
`;

const ThemeButton = styled.button<{ themeMode: "light" | "dark" }>`
  margin-bottom: 16px;
  padding: 10px 18px;
  background: ${({ themeMode }) =>
    themeMode === "light"
      ? "linear-gradient(135deg, #2196f3, #64b5f6)"
      : "linear-gradient(135deg, #90caf9, #42a5f5)"};
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;

const FilterSortRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;

  select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    cursor: pointer;
    transition: border 0.2s ease;
    &:focus {
      outline: none;
      border: 1px solid #2196f3;
    }
  }
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

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const addTodo = (text: string) =>
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);

  const toggleTodo = (id: number) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const editTodo = (id: number, text: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));

  let displayedTodos = todos;
  if (filter === "completed")
    displayedTodos = displayedTodos.filter((t) => t.completed);
  if (filter === "incomplete")
    displayedTodos = displayedTodos.filter((t) => !t.completed);

  displayedTodos = displayedTodos.sort((a, b) =>
    sortOrder === "newest" ? b.id - a.id : a.id - b.id
  );

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <GlobalStyle themeMode={theme} />
      <AppContainer>
        <Header />
        <MainContainer>
          <Card themeMode={theme}>
            <ThemeButton themeMode={theme} onClick={toggleTheme}>
              🌗 Переключить тему
            </ThemeButton>

            <Title>📝 Todo App</Title>

            <FilterSortRow>
              <div>
                <label>Фильтр: </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">Все</option>
                  <option value="completed">Готовые</option>
                  <option value="incomplete">Неготовые</option>
                </select>
              </div>

              <div>
                <label>Сортировка: </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                >
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
          </Card>
        </MainContainer>
      </AppContainer>
    </ThemeProvider>
  );
}