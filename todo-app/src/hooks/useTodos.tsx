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
import type { FilterStatusType, SortOrderType } from "../types";

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const {
    items: todos,
    loading,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.todos);

  const { user } = useAppSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchTodos({
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          userId: user.id,
        })
      );
    }
  }, [
    dispatch,
    pagination.currentPage,
    pagination.itemsPerPage,
    filters.status,
    filters.sortOrder,
    user,
  ]);

  const handleAddTodoWithLoading = useCallback(
    async (text: string) => {
      if (!user) return;

      setLocalLoading(true);
      try {
        await dispatch(addTodo({ text: text, userId: user.id })).unwrap(); // ← text вместо title
        dispatch(
          fetchTodos({
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            userId: user.id,
          })
        );
      } catch (error) {
        console.error("Ошибка добавления", error);
        throw error;
      } finally {
        setLocalLoading(false);
      }
    },
    [dispatch, user, pagination.currentPage, pagination.itemsPerPage]
  );

  const handleToggleTodo = useCallback(
    async (id: number, completed: boolean) => {
      try {
        await dispatch(toggleTodo({ id, completed })).unwrap();
        if (user) {
          dispatch(
            fetchTodos({
              page: pagination.currentPage,
              limit: pagination.itemsPerPage,
              userId: user.id,
            })
          );
        }
      } catch (error) {
        console.error("ОШИБКА ПЕРЕКЛЮЧЕНИЯ", error);
      }
    },
    [dispatch, user, pagination.currentPage, pagination.itemsPerPage]
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteTodo(id)).unwrap();
        if (user) {
          dispatch(
            fetchTodos({
              page: pagination.currentPage,
              limit: pagination.itemsPerPage,
              userId: user.id,
            })
          );
        }
      } catch (error) {
        console.error("ОШИБКА УДАЛЕНИЯ", error);
      }
    },
    [dispatch, user, pagination.currentPage, pagination.itemsPerPage]
  );

  const handleEditTodo = useCallback(
    async (id: number, text: string) => {
      try {
        await dispatch(updateTodo({ id, text })).unwrap();
        if (user) {
          dispatch(
            fetchTodos({
              page: pagination.currentPage,
              limit: pagination.itemsPerPage,
              userId: user.id,
            })
          );
        }
      } catch (error) {
        console.error("Ошибка РЕДАКТИРОВАНИЯ", error);
      }
    },
    [dispatch, user, pagination.currentPage, pagination.itemsPerPage]
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
