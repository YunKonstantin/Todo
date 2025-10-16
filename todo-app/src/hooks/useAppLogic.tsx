import { useTheme } from "./useTheme";
import { useTodos } from "./useTodos";
import { useTodoData } from "./useTodoData";
import { useLoadingStates } from "./useLoadingStates";

export const useAppLogic = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    todos,
    loading,
    error,
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
    localLoading,
  } = useTodos();

  const { displayedTodos } = useTodoData({ todos, filters });
  const { isLoading, isFilterSortDisabled } = useLoadingStates({
    loading,
    localLoading,
  });

  return {
    theme,
    toggleTheme,
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
  };
};
