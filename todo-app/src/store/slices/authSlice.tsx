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
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка входа");
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
