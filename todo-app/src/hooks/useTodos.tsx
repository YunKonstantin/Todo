import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  fetchTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  clearError,
  setFilter,
  setSortOrder,
  setItemsPerPage,
  setCurrentPage,
  selectFilteredTodos,
  selectPaginatedTodos,
  type TodoFilterStatus,
  type TodoSortOrder,
} from "../store/slices/todoSlices";

export const useTodos = () => {
  const dispatch = useAppDispatch();

  const filteredTodos = useAppSelector(selectFilteredTodos);
  const paginatedTodos = useAppSelector(selectPaginatedTodos);

  const {
    status: loading,
    error,
    filters,
    pagination,
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
        throw error;
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
        throw error;
      }
    },
    [dispatch, user]
  );

  const handleEditTodo = useCallback(
    async (id: number, text: string) => {
      try {
        if (!text || !text.trim()) {
          throw new Error("Текст задачи не может быть пустым");
        }

        await dispatch(
          updateTodo({
            id,
            data: { text: text.trim() },
          })
        ).unwrap();

        if (user) {
          dispatch(fetchTodos());
        }
      } catch (error) {
        console.error("Ошибка РЕДАКТИРОВАНИЯ", error);
        throw error;
      }
    },
    [dispatch, user]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage: number) => {
      dispatch(setItemsPerPage(itemsPerPage));
      dispatch(setCurrentPage(1));
    },
    [dispatch]
  );

  const handleSetFilter = useCallback(
    (filter: TodoFilterStatus) => {
      dispatch(setFilter(filter));
      dispatch(setCurrentPage(1));
    },
    [dispatch]
  );

  const handleSetSortOrder = useCallback(
    (sortOrder: TodoSortOrder) => {
      dispatch(setSortOrder(sortOrder));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    todos: paginatedTodos,
    allFilteredTodos: filteredTodos,
    loading: loading === "loading",
    localLoading,

    error,

    pagination: {
      currentPage: pagination.currentPage,
      itemsPerPage: pagination.itemsPerPage,
      totalItems: filteredTodos.length,
      totalPages: Math.ceil(filteredTodos.length / pagination.itemsPerPage),
    },
    filters: {
      status: filters.status,
      sortOrder: filters.sortOrder,
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
  };
};
