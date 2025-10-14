import axios from "axios";
import {
  type Todo,
  type TodosResponse,
  type CreateTodoRequest,
  type UpdateTodoRequest,
} from "../types/types";

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const todoApi = {
  getTodos: async (
    page: number = 1,
    limit: number = 10,
    filter?: string
  ): Promise<TodosResponse> => {
    const params: any = { 
      page: page, 
      limit: limit 
    };
    
    // Ваш сервер использует filter вместо completed
    if (filter && filter !== "all") {
      params.filter = filter; // active или completed
    }

    const response = await api.get("/todos", { params });
    
    // Ваш сервер уже возвращает правильную структуру
    return response.data;
  },

  createTodo: async (todoData: CreateTodoRequest): Promise<Todo> => {
    // Ваш сервер ожидает только text
    const response = await api.post("/todos", {
      text: todoData.text
    });
    return response.data;
  },

  updateTodo: async (id: number, todoData: UpdateTodoRequest): Promise<Todo> => {
    // Ваш сервер использует PUT вместо PATCH
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  toggleTodo: async (id: number, _completed: boolean): Promise<Todo> => {
    // Ваш сервер имеет специальный endpoint для переключения
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },
};