import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import {
  fetchTodos,
  setFilter,
  setSortOrder,
  setPage,
  setItemsPerPage,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  clearError, // Добавьте этот импорт
} from "./store/slices/todoSlices";

import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import Pagination from "./components/Pagination";
import styled, {
  ThemeProvider,
  createGlobalStyle,
  keyframes,
} from "styled-components";

const GlobalStyle = createGlobalStyle<{ $themeMode: "light" | "dark" }>`
  body {
    margin: 0;
    font-family: "Inter", system-ui, sans-serif;
    background: ${({ $themeMode }) =>
      $themeMode === "light"
        ? "linear-gradient(135deg, #e0f7fa, #ffffff)"
        : "linear-gradient(135deg, #1e1e2f, #121212)"};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#111" : "#f1f1f1")};
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

const Card = styled.div<{ $themeMode: "light" | "dark" }>`
  background: ${({ $themeMode }) =>
    $themeMode === "light"
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

const ThemeButton = styled.button<{ $themeMode: "light" | "dark" }>`
  margin-bottom: 16px;
  padding: 10px 18px;
  background: ${({ $themeMode }) =>
    $themeMode === "light"
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

const ErrorAlert = styled.div<{ $themeMode: "light" | "dark" }>`
  background-color: ${({ $themeMode }) => 
    $themeMode === "light" ? "#ffebee" : "#d32f2f"};
  color: ${({ $themeMode }) => 
    $themeMode === "light" ? "#c62828" : "#fff"};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid ${({ $themeMode }) => 
    $themeMode === "light" ? "#ffcdd2" : "#b71c1c"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const LoadingOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2196f3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

// Основной компонент приложения
function AppContent() {
  const dispatch = useAppDispatch();
  const {
    items: todos,
    loading,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.todos);

  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  const [localLoading, setLocalLoading] = useState(false);

  // Загружаем задачи при загрузке приложения и при изменении фильтров/пагинации
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters.status]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleAddTodo = async (text: string) => {
    setLocalLoading(true);
    try {
      await dispatch(addTodo(text)).unwrap();
      dispatch(fetchTodos());
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      await dispatch(toggleTodo({ id, completed })).unwrap();
      dispatch(fetchTodos());
    } catch (error) {
      console.error("Ошибка при переключении задачи:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      dispatch(fetchTodos());
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  const handleEditTodo = async (id: number, text: string) => {
    try {
      await dispatch(updateTodo({ id, text })).unwrap();
      dispatch(fetchTodos());
    } catch (error) {
      console.error("Ошибка при редактировании задачи:", error);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    dispatch(setItemsPerPage(itemsPerPage));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // Защита от неитерируемого todos
  const safeTodos = Array.isArray(todos) ? todos : [];

  // Фильтрация и сортировка
  let displayedTodos = safeTodos;
  if (filters.status === "completed") {
    displayedTodos = displayedTodos.filter((t) => t.completed);
  } else if (filters.status === "active") {
    displayedTodos = displayedTodos.filter((t) => !t.completed);
  }

  displayedTodos = [...displayedTodos].sort((a, b) =>
    filters.sortOrder === "newest" ? b.id - a.id : a.id - b.id
  );

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <GlobalStyle $themeMode={theme} />
      <AppContainer>
        <MainContainer>
          <Card $themeMode={theme} style={{ position: 'relative' }}>
            {/* Loading Overlay */}
            <LoadingOverlay $visible={loading}>
              <LoadingSpinner />
            </LoadingOverlay>

            <ThemeButton $themeMode={theme} onClick={toggleTheme}>
              🌗 Переключить тему
            </ThemeButton>

            <Title>📝 Todo App</Title>

            {/* Error Alert */}
            {error && (
              <ErrorAlert $themeMode={theme}>
                <span>❌ {error}</span>
                <CloseButton onClick={handleClearError}>×</CloseButton>
              </ErrorAlert>
            )}

            <FilterSortRow>
              <div>
                <label>Фильтр: </label>
                <select
                  value={filters.status}
                  onChange={(e) => dispatch(setFilter(e.target.value as any))}
                  disabled={loading}
                >
                  <option value="all">Все</option>
                  <option value="active">Активные</option>
                  <option value="completed">Готовые</option>
                </select>
              </div>

              <div>
                <label>Сортировка: </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => dispatch(setSortOrder(e.target.value as any))}
                  disabled={loading}
                >
                  <option value="newest">Новые сначала</option>
                  <option value="oldest">Старые сначала</option>
                </select>
              </div>

              <div>
                <label>На странице: </label>
                <select
                  value={pagination.itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  disabled={loading}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </FilterSortRow>

            <AddTodo onAdd={handleAddTodo} theme={theme} disabled={localLoading} />

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <LoadingSpinner />
                <div style={{ marginTop: '16px' }}>Загрузка задач...</div>
              </div>
            ) : displayedTodos.length === 0 ? (
              <EmptyState>
                <h3>📭 Нет задач</h3>
                <p>
                  {filters.status === "completed" 
                    ? "У вас нет выполненных задач" 
                    : filters.status === "active" 
                    ? "Все задачи выполнены!" 
                    : "Добавьте первую задачу"}
                </p>
              </EmptyState>
            ) : (
              <>
                <TodoList
                  todos={displayedTodos}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEditSave={handleEditTodo}
                />

                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  theme={theme}
                />
              </>
            )}
          </Card>
        </MainContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

// Главный компонент с Provider
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}