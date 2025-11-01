import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  todosAPI,
  type Todo,
  type CreateTodoData,
} from "../../services/formApi";

export enum TodoStatus {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed",
}

// Используем другие имена для типов чтобы избежать конфликта
export type TodoFilterStatus = "all" | "active" | "completed";
export type TodoSortOrder = "newest" | "oldest";

export interface TodoState {
  todos: Todo[];
  status: TodoStatus;
  error: string | null;
  filters: {
    status: TodoFilterStatus;
    sortOrder: TodoSortOrder;
  };
  pagination: {
    itemsPerPage: number;
    currentPage: number;
  };
}

const initialState: TodoState = {
  todos: [],
  status: TodoStatus.IDLE,
  error: null,
  filters: {
    status: "all",
    sortOrder: "newest",
  },
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
  },
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await todosAPI.getTodos();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки задач"
      );
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (
    todoData: Omit<CreateTodoData, "userId">,
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as any;
      const userId = state.auth.user?.id || 1;

      const data: CreateTodoData = {
        ...todoData,
        userId,
      };

      const response = await todosAPI.createTodo(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка создания задачи"
      );
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (
    { id, data }: { id: number; data: Partial<CreateTodoData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await todosAPI.updateTodo(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка обновления задачи"
      );
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number, { rejectWithValue }) => {
    try {
      await todosAPI.deleteTodo(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка удаления задачи"
      );
    }
  }
);

export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await todosAPI.toggleTodo(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка обновления задачи"
      );
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = TodoStatus.IDLE;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      if (!state.todos) {
        state.todos = [];
      }
      state.todos.push(action.payload);
    },
    updateTodoLocal: (state, action: PayloadAction<Todo>) => {
      if (!state.todos) {
        state.todos = [];
        return;
      }
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      if (!state.todos) {
        state.todos = [];
        return;
      }
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleTodoLocal: (state, action: PayloadAction<number>) => {
      if (!state.todos) {
        state.todos = [];
        return;
      }
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    resetTodos: (state) => {
      state.todos = [];
      state.status = TodoStatus.IDLE;
      state.error = null;
    },
    // Новые actions для фильтров и пагинации
    setFilter: (state, action: PayloadAction<TodoFilterStatus>) => {
      state.filters.status = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<TodoSortOrder>) => {
      state.filters.sortOrder = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = TodoStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = TodoStatus.IDLE;

        const responseData = action.payload;

        if (responseData && Array.isArray(responseData.data)) {
          state.todos = responseData.data;
          console.log("📋 Задачи загружены:", state.todos.length);
        } else if (Array.isArray(responseData)) {
          state.todos = responseData;
        } else {
          state.todos = [];
          console.warn(
            "⚠️ Неверная структура ответа от сервера:",
            responseData
          );
        }

        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = TodoStatus.FAILED;
        state.error = action.payload as string;
        if (!state.todos) {
          state.todos = [];
        }
      })

      .addCase(createTodo.pending, (state) => {
        state.status = TodoStatus.LOADING;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.status = TodoStatus.IDLE;

        if (!Array.isArray(state.todos)) {
          state.todos = [];
        }

        let newTodo = action.payload;

        if (action.payload && action.payload.data) {
          newTodo = action.payload.data;
        }

        if (action.payload && action.payload.todo) {
          newTodo = action.payload.todo;
        }

        if (
          newTodo &&
          typeof newTodo === "object" &&
          newTodo.id !== undefined
        ) {
          state.todos.push(newTodo);
          console.log("✅ Задача добавлена:", newTodo.text);
        } else {
          console.warn("⚠️ Неверная структура задачи:", newTodo);
        }

        state.error = null;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.status = TodoStatus.FAILED;
        state.error = action.payload as string;
        if (!Array.isArray(state.todos)) {
          state.todos = [];
        }
      })

      .addCase(updateTodo.pending, (state) => {
        state.status = TodoStatus.LOADING;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = TodoStatus.IDLE;
        if (!Array.isArray(state.todos)) {
          state.todos = [];
          return;
        }
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = TodoStatus.FAILED;
        state.error = action.payload as string;
      })

      .addCase(deleteTodo.pending, (state) => {
        state.status = TodoStatus.LOADING;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = TodoStatus.IDLE;
        if (!Array.isArray(state.todos)) {
          state.todos = [];
          return;
        }
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = TodoStatus.FAILED;
        state.error = action.payload as string;
      })

      .addCase(toggleTodo.pending, (state) => {
        state.status = TodoStatus.LOADING;
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.status = TodoStatus.IDLE;
        if (!Array.isArray(state.todos)) {
          state.todos = [];
          return;
        }
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.status = TodoStatus.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  resetStatus,
  addTodo,
  updateTodoLocal,
  removeTodo,
  toggleTodoLocal,
  resetTodos,
  setFilter,
  setSortOrder,
  setItemsPerPage,
  setCurrentPage,
} = todoSlice.actions;

export default todoSlice.reducer;
