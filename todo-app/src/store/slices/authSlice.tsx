import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  authAPI,
  type RegisterData,
  type LoginData,
  type ChangePasswordData,
  type User,
} from "../../services/formApi";

export enum AuthStatus {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed",
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken"),
  status: AuthStatus.IDLE,
  error: null,
};

// Вспомогательная функция для сохранения токенов
const saveTokensToStorage = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// Вспомогательная функция для обработки ошибок
const handleAuthError = (error: any): string => {
  return error.response?.data?.message || "Произошла ошибка";
};

// Регистрация с автоматическим входом
export const registerAndLogin = createAsyncThunk(
  "auth/registerAndLogin",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, user } = response.data;

      saveTokensToStorage(accessToken, refreshToken);
      return { user, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Обычная регистрация
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, user } = response.data;

      saveTokensToStorage(accessToken, refreshToken);
      return { user, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Логин пользователя
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      // TODO: Заменить мок на реальный API вызов когда бэкенд будет готов
      console.log("Моковый вход для:", credentials.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        user: {
          id: 1,
          email: credentials.email,
          age: 25,
          createdAt: new Date().toISOString(),
        },
        accessToken: "mock-token-" + Date.now(),
        refreshToken: "mock-refresh-" + Date.now(),
      };

      saveTokensToStorage(mockResponse.accessToken, mockResponse.refreshToken);
      return { user: mockResponse.user, token: mockResponse.accessToken };
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Получение профиля пользователя
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Смена пароля
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords: ChangePasswordData, { rejectWithValue }) => {
    try {
      await authAPI.changePassword(passwords);
      return { message: "Пароль успешно изменен" };
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.status = AuthStatus.IDLE;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    resetStatus: (state) => {
      state.status = AuthStatus.IDLE;
    },
  },
  extraReducers: (builder) => {
    // Общий обработчик для всех pending действий
    const handlePending = (state: AuthState) => {
      state.status = AuthStatus.LOADING;
      state.error = null;
    };

    // Общий обработчик для успешных auth действий
    const handleAuthFulfilled = (
      state: AuthState,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.status = AuthStatus.IDLE;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    };

    // Общий обработчик для ошибок
    const handleRejected = (state: AuthState, action: any) => {
      state.status = AuthStatus.FAILED;
      state.error = action.payload as string;

      // Если ошибка авторизации, очищаем токен
      if (
        action.payload?.includes("auth") ||
        action.payload?.includes("token")
      ) {
        state.token = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    };

    builder
      // Регистрация с автоматическим входом
      .addCase(registerAndLogin.pending, handlePending)
      .addCase(registerAndLogin.fulfilled, handleAuthFulfilled)
      .addCase(registerAndLogin.rejected, handleRejected)

      // Обычная регистрация
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, handleRejected)

      // Логин
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleRejected)

      // Получение профиля
      .addCase(fetchUserProfile.pending, handlePending)
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = AuthStatus.IDLE;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, handleRejected)

      // Смена пароля
      .addCase(changePassword.pending, handlePending)
      .addCase(changePassword.fulfilled, (state) => {
        state.status = AuthStatus.IDLE;
        state.error = null;
      })
      .addCase(changePassword.rejected, handleRejected);
  },
});

export const { logoutUser, clearError, setToken, setUser, resetStatus } =
  authSlice.actions;

export default authSlice.reducer;
