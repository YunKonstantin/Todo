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
    todos,
    status: loading,
    error,
  } = useAppSelector((state) => state.todos);

  const { user } = useAppSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchTodos());
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
      try {
        await dispatch(toggleTodo(id)).unwrap();
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

  const handlePageChange = useCallback((page: number) => {
    console.log("Page change:", page);
  }, []);

  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    console.log("Items per page change:", itemsPerPage);
  }, []);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetFilter = useCallback((filter: FilterStatusType) => {
    console.log("Filter change:", filter);
  }, []);

  const handleSetSortOrder = useCallback((sortOrder: SortOrderType) => {
    console.log("Sort order change:", sortOrder);
  }, []);

  return {
    todos,
    loading: loading === "loading",
    error,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: todos.length,
      totalPages: Math.ceil(todos.length / 10),
    },
    filters: {
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
