import React from "react";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import { Pagination } from "./Pagination";
import { useAppLogic } from "../hooks/useAppLogic";
import { useTheme } from "../hooks/useTheme";
import type { FilterStatusType, SortOrderType } from "../types";
import {
  Card,
  Title,
  ThemeButton,
  FilterSortRow,
  ErrorAlert,
  CloseButton,
  LoadingOverlay,
  LoadingSpinner,
  EmptyState,
} from "../styles/AppStyles";

export const TodoDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const {
    isLoading,
    isFilterSortDisabled,
    error,
    displayedTodos,
    pagination,
    filters,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handlePageChange,
    handleItemsPerPageChange,
    handleClearError,
    handleSetFilter,
    handleSetSortOrder,
  } = useAppLogic();

  return (
    <Card $themeMode={theme} style={{ position: "relative" }}>
      <LoadingOverlay $visible={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>

      <ThemeButton
        $themeMode={theme}
        onClick={toggleTheme}
        disabled={isLoading}
      >
        🌗 {isLoading ? "Загрузка..." : "Переключить тему"}
      </ThemeButton>

      <Title>📝 Todo App</Title>

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
            onChange={(e) =>
              handleSetFilter(e.target.value as FilterStatusType)
            }
            disabled={isFilterSortDisabled}
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
            onChange={(e) =>
              handleSetSortOrder(e.target.value as SortOrderType)
            }
            disabled={isFilterSortDisabled}
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
            disabled={isFilterSortDisabled}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </FilterSortRow>

      <AddTodo onAdd={handleAddTodo} theme={theme} disabled={isLoading} />

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <LoadingSpinner />
          <div style={{ marginTop: "16px" }}>Загрузка задач...</div>
        </div>
      ) : displayedTodos.length === 0 ? (
        <EmptyState>
          <h3>Нет задач =)</h3>
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

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              theme={theme}
            />
          )}
        </>
      )}
    </Card>
  );
};
