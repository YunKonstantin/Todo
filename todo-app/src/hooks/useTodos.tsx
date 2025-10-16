import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
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
  clearError,
} from "../store/slices/todoSlices";
import type { FilterStatusType, SortOrderType } from "../types/types";

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const {
    items: todos,
    loading,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.todos);

  // 🔥 Добавляем состояние для локальной загрузки
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodoWithLoading = useCallback(
    async (text: string) => {
      setLocalLoading(true);
      try {
        await dispatch(addTodo(text)).unwrap();
        dispatch(fetchTodos());
      } catch (error) {
        console.error("Ошибка добавления", error);
        throw error;
      } finally {
        setLocalLoading(false);
      }
    },
    [dispatch]
  );

  const handleToggleTodo = useCallback(
    async (id: number, completed: boolean) => {
      try {
        await dispatch(toggleTodo({ id, completed })).unwrap();
        dispatch(fetchTodos());
      } catch (error) {
        console.error("ОШИБКА ПЕРЕКЛЮЧЕНИЯ", error);
      }
    },
    [dispatch]
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteTodo(id)).unwrap();
        dispatch(fetchTodos());
      } catch (error) {
        console.error("ОШИБКА УДАЛЕНИЯ", error);
      }
    },
    [dispatch]
  );

  const handleEditTodo = useCallback(
    async (id: number, text: string) => {
      try {
        await dispatch(updateTodo({ id, text })).unwrap();
        dispatch(fetchTodos());
      } catch (error) {
        console.error("Ошибка РЕДАКТИРОВАНИЯ", error);
      }
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setPage(page));
    },
    [dispatch]
  );

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage: number) => {
      dispatch(setItemsPerPage(itemsPerPage));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetFilter = useCallback(
    (filter: FilterStatusType) => {
      dispatch(setFilter(filter));
    },
    [dispatch]
  );

  const handleSetSortOrder = useCallback(
    (sortOrder: SortOrderType) => {
      dispatch(setSortOrder(sortOrder));
    },
    [dispatch]
  );

  return {
    todos,
    loading,
    error,
    pagination,
    filters,
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
