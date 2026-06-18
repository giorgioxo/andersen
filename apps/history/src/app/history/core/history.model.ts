export enum HistoryEventType {
  CreateTodo = 'CREATE_TODO',
  DeleteTodo = 'DELETE_TODO',
  CreateTask = 'CREATE_TASK',
  DeleteTask = 'DELETE_TASK',
  UpdateTask = 'UPDATE_TASK',
}

export interface IHistoryEvent {
  id: string;
  type: HistoryEventType;
  createdAt: Date;
  additionalInfo: string;
}
