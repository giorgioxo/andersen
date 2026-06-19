export enum HistoryEventType {
  CreateTodo = 'CREATE_TODO',
  DeleteTodo = 'DELETE_TODO',
  CreateTask = 'CREATE_TASK',
  DeleteTask = 'DELETE_TASK',
  UpdateTask = 'UPDATE_TASK',
}

export type HistorySortDirection = 'asc' | 'desc';

export interface IHistoryApiEvent {
  todo_id: string;
  event: HistoryEventType;
  data: Record<string, unknown>;
  date: string;
}

export interface IHistoryEvent {
  id: string;
  type: HistoryEventType;
  createdAt: string;
  additionalInfo: string;
}

export interface IHistoryQuery {
  limit: number;
  page: number;
  event: HistoryEventType[];
  sort: HistorySortDirection;
}
