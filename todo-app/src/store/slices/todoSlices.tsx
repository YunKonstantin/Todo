import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type FilterStatusType, type SortOrderType, type Todo, FilterStatus, SortOrder } from "../../types/types";
import { todoApi } from "../../services/todoApi";

interface TodoState {
  items: Todo[];
  loading: boolean; //ТИПИПЗАЦИЯ ОБЬЕКТА
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

const initialState: TodoState = {
  items: [],
  loading: false, //НАЧАЛЬНОЕ СОСТОЯНИЕ
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

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState }) => {
    const state = getState() as { todos: TodoState };
    const { currentPage, itemsPerPage } = state.todos.pagination;
    const { status } = state.todos.filters;

    const response = await todoApi.getTodos(currentPage, itemsPerPage, status); //ЗАПРОС К СЕРВАКУ
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
  //СТАТУС
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
    },
    setSortOrder: (state, action: PayloadAction<SortOrderType>) => {
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
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todos";
      })

      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state) => {
        state.loading = false;
        state.pagination.totalItems += 1;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add todo";
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
      });
  },
});

export const { setFilter, setSortOrder, setPage, setItemsPerPage, clearError } =
  todosSlice.actions;
export default todosSlice.reducer;
