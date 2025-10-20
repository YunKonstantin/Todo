import axios from "axios";
import type {
  Todo,
  TodosResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types";

const API_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const todosApi = {
  fetchTodos: async (
    page: number,
    limit: number,
    filter: "active" | "completed" | "all"
  ): Promise<TodosResponse> => {
    const params: any = {
      _page: page,
      _limit: limit,
      _sort: "id",
      _order: "desc",
    };

    if (filter && filter !== "all") {
      params.completed = filter === "completed";
    }

    const response = await api.get("/todos", { params });

    return {
      data: response.data,
      total: parseInt(response.headers["x-total-count"] || "0"),
      page: page,
      limit: limit,
      totalPages: Math.ceil(
        parseInt(response.headers["x-total-count"] || "0") / limit
      ),
    };
  },

  createTodo: async (todoData: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post("/todos", {
      ...todoData,
      completed: todoData.completed || false,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  updateTodo: async (
    id: number,
    todoData: UpdateTodoRequest
  ): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, todoData);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  toggleTodo: async (id: number, completed: boolean): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, { completed });
    return response.data;
  },
};
