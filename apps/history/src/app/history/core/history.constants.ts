import { HistoryEventType } from './history.model';

export const HISTORY_EVENT_TYPES: HistoryEventType[] = [
  HistoryEventType.CreateTodo,
  HistoryEventType.DeleteTodo,
  HistoryEventType.CreateTask,
  HistoryEventType.DeleteTask,
  HistoryEventType.UpdateTask,
];

export const HISTORY_EVENT_LABELS: Record<HistoryEventType, string> = {
  [HistoryEventType.CreateTodo]: 'Todo List Created',
  [HistoryEventType.DeleteTodo]: 'Todo List Deleted',
  [HistoryEventType.CreateTask]: 'Task Created',
  [HistoryEventType.DeleteTask]: 'Task Deleted',
  [HistoryEventType.UpdateTask]: 'Task Status Updated',
};
