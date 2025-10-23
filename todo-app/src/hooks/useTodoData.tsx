import { useMemo } from "react";
import type { Todo } from "../types";
import type { FilterStatusType, SortOrderType } from "../types";

interface UseTodoDataProps {
  todos: Todo[];
  filters: {
    status: FilterStatusType;
    sortOrder: SortOrderType;
  };
}

export const useTodoData = ({ todos, filters }: UseTodoDataProps) => {
  const displayedTodos = useMemo(() => {//useCallback
    const safeTodos = Array.isArray(todos) ? todos : [];

    let filteredTodos = safeTodos;
    if (filters.status === "completed") {
      filteredTodos = filteredTodos.filter((t) => t.completed);
    } else if (filters.status === "active") {
      filteredTodos = filteredTodos.filter((t) => !t.completed);
    }

    return [...filteredTodos].sort((a, b) =>
      filters.sortOrder === "newest" ? b.id - a.id : a.id - b.id
    );
  }, [todos, filters.status, filters.sortOrder]);

  return { displayedTodos };
};
