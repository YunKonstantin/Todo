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
} from "../../services/formApi";

interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStateStatus;
  error: string | null;
}
export const enum AuthStateStatus  {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed"

}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken"),
  status: AuthStateStatus.IDLE,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      const { user, accessToken, refreshToken } = response.data;

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
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(data);
      const { user, accessToken, refreshToken } = response.data;

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
  async (data: ChangePasswordData, { rejectWithValue }) => {
    try {
      await authAPI.changePassword(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка смены пароля"
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
        state.status = AuthStateStatus.LOADING;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = AuthStateStatus.IDLE;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = AuthStateStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = AuthStateStatus.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = AuthStateStatus.LOADING;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = AuthStateStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logoutUser, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
