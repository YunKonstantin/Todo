import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum AuthStatus {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed",
}

export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt?: string;
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
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
});

export const { logoutUser, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
