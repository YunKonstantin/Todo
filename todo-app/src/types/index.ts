export interface Todo {
  id: number;
  text: string;
  title?:string;
  completed: boolean;
  userId:number;
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
  userId: number;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}

export const enum FilterStatus {
  ALL = "all",
  COMPLETED = "completed",
  ACTIVE = "active",
}
export const enum SortOrder {
  NEWEST = "newest",
  OLDEST = "oldest",
}
export type FilterStatusType =
  | FilterStatus.ALL
  | FilterStatus.COMPLETED
  | FilterStatus.ACTIVE;

export type SortOrderType = SortOrder.NEWEST | SortOrder.OLDEST;
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
