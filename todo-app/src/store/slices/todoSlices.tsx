import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  type FilterStatusType,
  type SortOrderType,
  type Todo,
  type TodosResponse,
  FilterStatus,
  SortOrder,
} from "../../types";
import { todoApi } from "../../services/todoApi";

const loadInitialState = (): TodoState => {
  try {
    const saved = localStorage.getItem("todos_state");
    if (saved) {
      const parsedState = JSON.parse(saved);
      return parsedState;
    }
  } catch (error) {
    console.error("ошибка в localStorage! :", error);
  }

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

const saveState = (state: TodoState) => {
  try {
    localStorage.setItem("todos_state", JSON.stringify(state));
  } catch (error) {
    console.error("ошибка сохранения", error);
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

const initialState: TodoState = loadInitialState();

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { todos: TodoState };
      const { currentPage, itemsPerPage } = state.todos.pagination;
      const { status } = state.todos.filters;

      const response = await todoApi.getTodos(
        currentPage,
        itemsPerPage,
        status
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка");
    }
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (text: string, { rejectWithValue }) => {
    try {
      const response = await todoApi.createTodo({ text });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка добавления");
    }
  }
);
export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async (
    { id, completed }: { id: number; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await todoApi.toggleTodo(id, completed);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка переключения ");
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, text }: { id: number; text: string }, { rejectWithValue }) => {
    try {
      const response = await todoApi.updateTodo(id, { text });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка обновления");
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number, { rejectWithValue }) => {
    try {
      await todoApi.deleteTodo(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "оштбка удаления");
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterStatusType>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
      saveState(state);
    },
    setSortOrder: (state, action: PayloadAction<SortOrderType>) => {
      state.filters.sortOrder = action.payload;
      saveState(state);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
      saveState(state);
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
      saveState(state);
    },
    clearError: (state) => {
      state.error = null;
      saveState(state);
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
        const payload = action.payload as TodosResponse;
        state.items = Array.isArray(payload.data) ? payload.data : [];
        state.pagination = {
          currentPage: payload.page,
          totalPages: payload.totalPages,
          totalItems: payload.total,
          itemsPerPage: payload.limit,
        };
        saveState(state);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "ошибка запроса";
      })

      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state) => {
        state.loading = false;
        state.pagination.totalItems += 1;
        saveState(state);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "ошибка обновления";
        saveState(state);
      })

      .addCase(toggleTodo.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const payload = action.payload as Todo;
        const index = state.items.findIndex((todo) => todo.id === payload.id);
        if (index !== -1) {
          state.items[index] = payload;
        }
        saveState(state);
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "ошибка переключения";
        saveState(state);
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
        saveState(state);
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "ошибка обновления";
        saveState(state);
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
        saveState(state);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "ошибка удаления";
        saveState(state);
      });
  },
});

export const { setFilter, setSortOrder, setPage, setItemsPerPage, clearError } =
  todosSlice.actions;
export default todosSlice.reducer;
