import axios from "axios";
import {
  type Todo,
  type TodosResponse,
  type CreateTodoRequest,
  type UpdateTodoRequest,
} from "../types";

const API_BASE_URL = "http://localhost:3001";

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
    try {
      const params: any = {//any
        page: page,
        limit: limit,
      };

      if (filter && filter !== "all") {
        params.filter = filter;
      }

      const response = await api.get("/todos", { params });
      return response.data;
    } catch (error: any) {
      console.error("Ошибка загрузки задач:", error);
      throw new Error(
        error.response?.data?.message || "ошибка загрузки задачи"
      );
    }
  },

  createTodo: async (todoData: CreateTodoRequest): Promise<Todo> => {
    try {
      const response = await api.post("/todos", {
        text: todoData.text,
      });
      return response.data;
    } catch (error: any) {
      console.error("Ошибка создания задачи:", error);
      throw new Error(
        error.response?.data?.message || "ошибка создания задачи"
      );
    }
  },

  updateTodo: async (
    id: number,
    todoData: UpdateTodoRequest
  ): Promise<Todo> => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error: any) {
      console.error("ошибка обновления задачи:", error);
      throw new Error(
        error.response?.data?.message || "не вышло обнооить"
      );
    }
  },

  deleteTodo: async (id: number): Promise<void> => {
    try {
      await api.delete(`/todos/${id}`);
    } catch (error: any) {
      console.error("ошибка удаления задачи:", error);
      throw new Error(
        error.response?.data?.message || "не удалось удалить задачу"
      );
    }
  },

  toggleTodo: async (id: number, _completed: boolean): Promise<Todo> => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      return response.data;
    } catch (error: any) {
      console.error("ошибка переключения задачи:", error);
      throw new Error(
        error.response?.data?.message || "не вышло переключить задачу"
      );
    }
  },
};
