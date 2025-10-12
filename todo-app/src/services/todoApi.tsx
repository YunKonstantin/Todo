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
  // Получить задачи с ПАГИНАЦИЕЙ
  getTodos: async (
    page: number = 1,
    limit: number = 10,
    filter?: string
  ): Promise<TodosResponse> => {
    const params: any = { _page: page, _limit: limit }; // Исправлено: json-server использует _page и _limit
    if (filter && filter !== "all") {
      params.completed = filter === "completed";
    }

    const response = await api.get("/todos", { params });
    
    // Для json-server структура ответа
    return {
      data: response.data, // данные приходят напрямую в response.data
      total: parseInt(response.headers['x-total-count'] || '0'),
      page: page,
      limit: limit,
      totalPages: Math.ceil(parseInt(response.headers['x-total-count'] || '0') / limit)
    };
  },

  // создать новое
  createTodo: async (todoData: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post("/todos", {
      ...todoData,
      completed: false // добавляем значение по умолчанию
    });
    return response.data;
  },

  // обновить 
  updateTodo: async (
    id: number,
    todoData: UpdateTodoRequest
  ): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, todoData);
    return response.data;
  },

  // удалить 
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Переключить статус задачи
  toggleTodo: async (id: number, completed: boolean): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, { completed });
    return response.data;
  },
};