import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  fetchTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  clearError,
} from "../store/slices/todoSlices";
import type { FilterStatusType, SortOrderType } from "../types";

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const {
    todos, // было items
    status: loading, // было loading
    error,
    // pagination и filters удалены, т.к. их нет в новом TodoState
  } = useAppSelector((state) => state.todos);

  const { user } = useAppSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);

  // Упрощенный useEffect без пагинации и фильтров
  useEffect(() => {
    if (user) {
      dispatch(fetchTodos()); // убраны параметры
    }
  }, [dispatch, user]);

  const handleAddTodoWithLoading = useCallback(
    async (text: string) => {
      if (!user) return;

      setLocalLoading(true);
      try {
        await dispatch(createTodo({ text, completed: false })).unwrap();

        dispatch(fetchTodos());
      } catch (error) {
        console.error("Ошибка добавления", error);
        throw error;
      } finally {
        setLocalLoading(false);
      }
    },
    [dispatch, user]
  );

  const handleToggleTodo = useCallback(
    async (id: number) => {
      // убран параметр completed
      try {
        await dispatch(toggleTodo(id)).unwrap(); // передаем только id
        if (user) {
          dispatch(fetchTodos());
        }
      } catch (error) {
        console.error("ОШИБКА ПЕРЕКЛЮЧЕНИЯ", error);
      }
    },
    [dispatch, user]
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteTodo(id)).unwrap();
        if (user) {
          dispatch(fetchTodos());
        }
      } catch (error) {
        console.error("ОШИБКА УДАЛЕНИЯ", error);
      }
    },
    [dispatch, user]
  );

  const handleEditTodo = useCallback(
    async (id: number, text: string) => {
      try {
        // Используем правильную структуру для updateTodo
        await dispatch(
          updateTodo({
            id,
            data: { text },
          })
        ).unwrap();
        if (user) {
          dispatch(fetchTodos());
        }
      } catch (error) {
        console.error("Ошибка РЕДАКТИРОВАНИЯ", error);
      }
    },
    [dispatch, user]
  );

  // Временные заглушки для пагинации и фильтров
  const handlePageChange = useCallback((page: number) => {
    console.log("Page change:", page);
    // dispatch(setPage(page)); // убрано, т.к. setPage не экспортируется
  }, []);

  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    console.log("Items per page change:", itemsPerPage);
    // dispatch(setItemsPerPage(itemsPerPage)); // убрано
  }, []);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetFilter = useCallback((filter: FilterStatusType) => {
    console.log("Filter change:", filter);
    // dispatch(setFilter(filter)); // убрано
  }, []);

  const handleSetSortOrder = useCallback((sortOrder: SortOrderType) => {
    console.log("Sort order change:", sortOrder);
    // dispatch(setSortOrder(sortOrder)); // убрано
  }, []);

  return {
    todos,
    loading: loading === "loading", // преобразуем статус в boolean
    error,
    pagination: {
      // временный объект для совместимости
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: todos.length,
      totalPages: Math.ceil(todos.length / 10),
    },
    filters: {
      // временный объект для совместимости
      status: "all",
      sortOrder: "newest",
    },
    handleAddTodo: handleAddTodoWithLoading,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handlePageChange,
    handleItemsPerPageChange,
    handleClearError,
    handleSetFilter,
    handleSetSortOrder,
    localLoading,
  };
};
