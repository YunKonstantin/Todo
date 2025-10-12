export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodosResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTodoRequest {
  text: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}

export type FilterStatus = "all" | "completed" | "active";
export type SortOrder = "newest" | "oldest";

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface FiltersState {
  status: FilterStatus;
  sortOrder: SortOrder;
}

export interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: FiltersState;
}