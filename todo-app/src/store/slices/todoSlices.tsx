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

// ИЗМЕНИТЬ: fetchTodos принимает userId
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ page, limit, userId }: FetchTodosParams, { rejectWithValue }) => {
    try {
      // ВРЕМЕННО: используем моки с привязкой к пользователю
      console.log('Загрузка задач для пользователя:', userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTodos: Todo[] = [
        { 
          id: 1, 
          text: 'Личная задача пользователя ' + userId, 
          completed: false, 
          userId, 
          createdAt: new Date().toISOString() 
        },
        { 
          id: 2, 
          text: 'Еще задача пользователя ' + userId, 
          completed: true, 
          userId, 
          createdAt: new Date().toISOString() 
        },
        { 
          id: 3, 
          text: 'Важная задача пользователя ' + userId, 
          completed: false, 
          userId, 
          createdAt: new Date().toISOString() 
        },
      ];
      
      // Фильтруем задачи по userId (в реальном API это делает сервер)
      const userTodos = mockTodos.filter(todo => todo.userId === userId);
      
      const response: TodosResponse = {
        data: userTodos,
        page,
        limit,
        total: userTodos.length,
        totalPages: Math.ceil(userTodos.length / limit),
      };
      
      return response;
      
      // КОГДА API БУДЕТ РАБОТАТЬ, РАСКОММЕНТИРУЙ:
      // const response = await todosAPI.getTodos(userId);
      // return {
      //   data: response.data,
      //   page,
      //   limit,
      //   total: response.data.length,
      //   totalPages: Math.ceil(response.data.length / limit),
      // };
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка");
    }
  }
);

// ИЗМЕНИТЬ: addTodo принимает объект с title и userId
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async ({ text, userId }: AddTodoParams, { rejectWithValue }) => {
    try {
      // ВРЕМЕННО: мок создания задачи
      console.log('Создание задачи для пользователя:', userId);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
        userId,
        createdAt: new Date().toISOString(),
      };
      
      return newTodo;
      
      // КОГДА API БУДЕТ РАБОТАТЬ, РАСКОММЕНТИРУЙ:
      // const response = await todosAPI.createTodo({ title, userId });
      // return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка добавления");
    }
  }
);

// Остальные actions (toggleTodo, updateTodo, deleteTodo) остаются без изменений
export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async (
    { id, completed }: { id: number; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      // Временный мок
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedTodo: Todo = {
        id,
        text: 'Обновленная задача',
        completed,
        userId: 1, // временно
        createdAt: new Date().toISOString(),
      };
      return updatedTodo;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка переключения ");
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, text }: { id: number; text: string }, { rejectWithValue }) => {
    try {
      // Временный мок
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedTodo: Todo = {
        id,
        text: text,
        completed: false,
        userId: 1, // временно
        createdAt: new Date().toISOString(),
      };
      return updatedTodo;
    } catch (error: any) {
      return rejectWithValue(error.message || "ошибка обновления");
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number, { rejectWithValue }) => {
    try {
      // Временный мок
      await new Promise(resolve => setTimeout(resolve, 200));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "оштбка удаления");
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