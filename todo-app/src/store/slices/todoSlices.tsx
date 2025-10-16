import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  type FilterStatusType,
  type SortOrderType,
  type Todo,
  FilterStatus,
  SortOrder,
} from "../../types/types";
import { todoApi } from "../../services/todoApi";

// 🔥 ФУНКЦИИ ДЛЯ СОХРАНЕНИЯ СОСТОЯНИЯ
const loadInitialState = (): TodoState => {
  try {
    const saved = localStorage.getItem("todos_state");
    if (saved) {
      const parsedState = JSON.parse(saved);
      console.log("Загружено сохранённое состояние:", parsedState);
      return parsedState;
    }
  } catch (error) {
    console.error("Ошибка загрузки состояния:", error);
  }

  // Если нет сохранённого состояния, возвращаем initialState
  return {
    items: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    filters: {
      status: FilterStatus.ALL,
      sortOrder: SortOrder.NEWEST,
    },
  };
};

// Функция для сохранения состояния
const saveState = (state: TodoState) => {
  try {
    localStorage.setItem("todos_state", JSON.stringify(state));
  } catch (error) {
    console.error("Ошибка сохранения состояния:", error);
  }
};

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    status: FilterStatusType;
    sortOrder: SortOrderType;
  };
}

// 🔥 ИСПОЛЬЗУЕМ ФУНКЦИЮ ДЛЯ НАЧАЛЬНОГО СОСТОЯНИЯ
const initialState: TodoState = loadInitialState();

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState }) => {
    const state = getState() as { todos: TodoState };
    const { currentPage, itemsPerPage } = state.todos.pagination;
    const { status } = state.todos.filters;

    const response = await todoApi.getTodos(currentPage, itemsPerPage, status);
    return response;
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (text: string) => {
    const response = await todoApi.createTodo({ text });
    return response;
  }
);

export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async ({ id, completed }: { id: number; completed: boolean }) => {
    const response = await todoApi.toggleTodo(id, completed);
    return response;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, text }: { id: number; text: string }) => {
    const response = await todoApi.updateTodo(id, { text });
    return response;
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number) => {
    await todoApi.deleteTodo(id);
    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterStatusType>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
      saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ИЗМЕНЕНИЯ
    },
    setSortOrder: (state, action: PayloadAction<SortOrderType>) => {
      state.filters.sortOrder = action.payload;
      saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ИЗМЕНЕНИЯ
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
      saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ИЗМЕНЕНИЯ
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
      saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ИЗМЕНЕНИЯ
    },
    clearError: (state) => {
      state.error = null;
      saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ИЗМЕНЕНИЯ
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.total,
          itemsPerPage: action.payload.limit,
        };
        saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ЗАГРУЗКИ ЗАДАЧ
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todos";
        saveState(state); // 🔥 СОХРАНЯЕМ ДАЖЕ ПРИ ОШИБКЕ
      })

      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state) => {
        state.loading = false;
        state.pagination.totalItems += 1;
        saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ДОБАВЛЕНИЯ
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add todo";
        saveState(state); // 🔥 СОХРАНЯЕМ ДАЖЕ ПРИ ОШИБКЕ
      })

      .addCase(toggleTodo.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ ИЗМЕНЕНИЯ СТАТУСА
      })

      .addCase(updateTodo.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ РЕДАКТИРОВАНИЯ
      })

      .addCase(deleteTodo.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        state.items = state.items.filter((todo) => todo.id !== action.payload);
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems - 1
        );
        saveState(state); // 🔥 СОХРАНЯЕМ ПОСЛЕ УДАЛЕНИЯ
      });
  },
});

export const { setFilter, setSortOrder, setPage, setItemsPerPage, clearError } =
  todosSlice.actions;
export default todosSlice.reducer;
