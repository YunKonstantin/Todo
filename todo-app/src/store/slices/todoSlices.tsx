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
import { todosAPI } from "../../services/formApi";

interface FetchTodosParams {
  page: number;
  limit: number;
  userId: number; 
}

interface AddTodoParams {
  text: string;
  userId: number; 
}

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
      itemsPerPage: 5,
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
  async ({ page, limit, userId }: FetchTodosParams, { rejectWithValue }) => {
    try {
      // РЕАЛЬНЫЙ API вызов
      const response = await todosAPI.getTodos(userId);
      return {
        data: response.data,
        page,
        limit,
        total: response.data.length,
        totalPages: Math.ceil(response.data.length / limit),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка загрузки задач");
    }
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async ({ text, userId }: AddTodoParams, { rejectWithValue }) => {
    try {
      // РЕАЛЬНЫЙ API вызов
      const response = await todosAPI.createTodo({ 
        title:text, 
        userId,
        completed: false 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка добавления задачи");
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
      // РЕАЛЬНЫЙ API вызов
      const response = await todosAPI.updateTodo(id, { completed });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка переключения задачи");
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, text }: { id: number; text: string }, { rejectWithValue }) => {
    try {
      // РЕАЛЬНЫЙ API вызов
      const response = await todosAPI.updateTodo(id, { title:text });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка обновления задачи");
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number, { rejectWithValue }) => {
    try {
      // РЕАЛЬНЫЙ API вызов
      await todosAPI.deleteTodo(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка удаления задачи");
    }
  }
);

// Slice остается без изменений
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
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload as Todo);
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

        const itemsOnCurrentPage = state.items.length;
        if (itemsOnCurrentPage === 0 && state.pagination.currentPage > 1) {
          state.pagination.currentPage = state.pagination.currentPage - 1;
        }

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