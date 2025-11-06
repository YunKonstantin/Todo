import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { store } from "../store";
import { logoutUser, setToken } from "../store/slices/authSlice";

export interface RegisterData {
  email: string;
  password: string;
  age?: number;
}

export interface TodosResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_URL = "http://localhost:3001";

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface Todo {
  todo: Todo;
  data: Todo;
  id: number;
  text: string;
  completed: boolean;
  userId: number;
  createdAt: string;
}

export interface CreateTodoData {
  text: string;
  completed?: boolean;
  userId: number;
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          store.dispatch(setToken(accessToken));

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logoutUser());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        store.dispatch(logoutUser());
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),

  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  getProfile: (): Promise<AxiosResponse<User>> => api.get("/auth/me"),

  changePassword: (data: ChangePasswordData): Promise<AxiosResponse<void>> =>
    api.post("/auth/change-password", data),

  refreshToken: (
    refreshToken: string
  ): Promise<AxiosResponse<{ accessToken: string }>> =>
    api.post("/auth/refresh", { refreshToken }),
};

export const todosAPI = {
  getTodos: (): Promise<AxiosResponse<TodosResponse>> => api.get("/todos"),

  getTodosByUser: (userId: number): Promise<AxiosResponse<TodosResponse>> =>
    api.get(`/todos/user/${userId}`),

  createTodo: (data: CreateTodoData): Promise<AxiosResponse<Todo>> =>
    api.post("/todos", data),

  updateTodo: (
    id: number,
    data: Partial<CreateTodoData>
  ): Promise<AxiosResponse<Todo>> => api.patch(`/todos/${id}`, data),

  deleteTodo: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/todos/${id}`),

  toggleTodo: (id: number): Promise<AxiosResponse<Todo>> =>
    api.patch(`/todos/${id}/toggle`),
};

export const testAPI = {
  testConnection: (): Promise<AxiosResponse<{ message: string }>> =>
    api.get("/health"),

  testAuth: (): Promise<AxiosResponse<{ user: User }>> => api.get("/auth/test"),
};

export default api;
