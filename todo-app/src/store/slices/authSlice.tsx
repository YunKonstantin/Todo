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

// Регистрация с автоматическим входом
export const registerAndLogin = createAsyncThunk(
  "auth/registerAndLogin",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // 1. Регистрируем пользователя
      const registerResponse = await authAPI.register(userData);
      const { accessToken, refreshToken } = registerResponse.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 2. Автоматически логиним пользователя
      const loginResponse = await authAPI.login({
        email: userData.email,
        password: userData.password,
      });

      const finalToken = loginResponse.data.accessToken;
      const finalUser = loginResponse.data.user;

      localStorage.setItem("accessToken", finalToken);
      localStorage.setItem("refreshToken", loginResponse.data.refreshToken);

      return { user: finalUser, token: finalToken };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка регистрации"
      );
    }
  }
);

// Обычная регистрация (если нужна отдельно)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка регистрации"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      // ВРЕМЕННО: мок для тестирования
      console.log("Моковый вход для:", credentials.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        user: {
          id: 1,
          email: credentials.email,
          age: 25,
          createdAt: new Date().toISOString(),
        },
        accessToken: "mock-token-123",
        refreshToken: "mock-refresh-123",
      };

      localStorage.setItem("accessToken", mockResponse.accessToken);
      localStorage.setItem("refreshToken", mockResponse.refreshToken);

      return { user: mockResponse.user, token: mockResponse.accessToken };
    } catch (error: any) {
      return rejectWithValue("Ошибка входа");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки профиля"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords: ChangePasswordData, { rejectWithValue }) => {
    try {
      await authAPI.changePassword(passwords);
      return { message: "Пароль успешно изменен" };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка изменения пароля"
      );
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
  },
  extraReducers: (builder) => {
    builder
      // Регистрация с автоматическим входом
      .addCase(registerAndLogin.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(registerAndLogin.fulfilled, (state, action) => {
        state.status = AuthStatus.IDLE;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerAndLogin.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload as string;
      })

      // Обычная регистрация
      .addCase(registerUser.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = AuthStatus.IDLE;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload as string;
      })

      // Логин
      .addCase(loginUser.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = AuthStatus.IDLE;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload as string;
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = AuthStatus.IDLE;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = AuthStatus.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
