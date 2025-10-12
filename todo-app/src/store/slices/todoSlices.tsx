import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Todo, FilterStatus, SortOrder } from "../../types/types";
import { todoApi } from "../../services/todoApi";

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
    status: FilterStatus;
    sortOrder: SortOrder;
  };
}

const initialState: TodoState = {
  items: [], // гарантируем, что это массив
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    status: "all",
    sortOrder: "newest",
  },
};

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
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.filters.sortOrder = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        // Гарантируем, что items всегда массив
        state.items = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.total,
          itemsPerPage: action.payload.limit,
        };
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todos";
      })
      // addTodo
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        // Гарантируем, что items всегда массив перед использованием unshift
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        state.items.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add todo";
      })
      // toggleTodo
      .addCase(toggleTodo.fulfilled, (state, action) => {
        // Гарантируем, что items всегда массив
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // updateTodo
      .addCase(updateTodo.fulfilled, (state, action) => {
        // Гарантируем, что items всегда массив
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // deleteTodo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        // Гарантируем, что items всегда массив
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        state.items = state.items.filter(todo => todo.id !== action.payload);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
      });
  },
});

export const { setFilter, setSortOrder, setPage, setItemsPerPage, clearError } =
  todosSlice.actions;
export default todosSlice.reducer;