export enum TodoHistoryEventType {
  CreateTodo = 'CREATE_TODO',
  DeleteTodo = 'DELETE_TODO',
  CreateTask = 'CREATE_TASK',
  DeleteTask = 'DELETE_TASK',
  UpdateTask = 'UPDATE_TASK',
}

export interface ITodoHistoryTrackingPayload {
  event: TodoHistoryEventType;
  todo_id: string;
  data: Record<string, unknown>;
}

export interface ITodoHistoryTrackingResponse {
  created: boolean;
}
