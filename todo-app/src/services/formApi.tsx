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
  id: number;
  text: string;
  completed: boolean;
  userId: number;
  createdAt: string;
}

export interface CreateTodoData {
  text: string; // Изменено с title на text
  completed?: boolean;
  userId: number;
}

// Создаем экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Интерцептор для логирования запросов
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Логирование запросов
    console.log(`🎯 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error("❌ Ошибка в интерцепторе запроса:", error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Логирование успешных ответов
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    // Детальное логирование ошибок
    console.error(`❌ Ошибка ${error.response?.status} ${error.config?.url}`, {
      error: error.response?.data,
      requestData: error.config?.data,
      headers: error.config?.headers
    });

    const originalRequest = error.config;

    // Обработка 401 ошибки (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          console.log("🔄 Попытка обновления токена...");
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          store.dispatch(setToken(accessToken));

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log("✅ Токен успешно обновлен");
          return api(originalRequest);
        } catch (refreshError) {
          console.error("❌ Ошибка обновления токена:", refreshError);
          store.dispatch(logoutUser());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        console.error("❌ Refresh token отсутствует");
        store.dispatch(logoutUser());
        window.location.href = "/login";
      }
    }

    // Обработка 400 ошибки (Bad Request)
    if (error.response?.status === 400) {
      console.error("🛑 Bad Request - неверные данные:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

// API для аутентификации
export const authAPI = {
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),

  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  getProfile: (): Promise<AxiosResponse<User>> => 
    api.get("/auth/me"),

  changePassword: (data: ChangePasswordData): Promise<AxiosResponse<void>> =>
    api.post("/auth/change-password", data),

  refreshToken: (refreshToken: string): Promise<AxiosResponse<{ accessToken: string }>> =>
    api.post("/auth/refresh", { refreshToken }),
};

// API для работы с задачами
export const todosAPI = {
  getTodos: (): Promise<AxiosResponse<Todo[]>> =>
    api.get("/todos"),

  getTodosByUser: (userId: number): Promise<AxiosResponse<Todo[]>> =>
    api.get(`/todos/user/${userId}`),

  createTodo: (data: CreateTodoData): Promise<AxiosResponse<Todo>> =>
    api.post("/todos", data),

  updateTodo: (
    id: number,
    data: Partial<CreateTodoData>
  ): Promise<AxiosResponse<Todo>> => 
    api.patch(`/todos/${id}`, data),

  deleteTodo: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/todos/${id}`),

  toggleTodo: (id: number): Promise<AxiosResponse<Todo>> =>
    api.patch(`/todos/${id}/toggle`),
};

// Вспомогательные функции для тестирования
export const testAPI = {
  testConnection: (): Promise<AxiosResponse<{ message: string }>> =>
    api.get("/health"),

  testAuth: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get("/auth/test"),
};

export default api;