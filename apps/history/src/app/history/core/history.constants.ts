import { HistoryEventType, HistorySortDirection, IHistoryQuery } from './history.model';

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

export const DEFAULT_HISTORY_SORT_DIRECTION: HistorySortDirection = 'desc';

export const INITIAL_HISTORY_QUERY: IHistoryQuery = {
  limit: 5,
  page: 1,
  event: [...HISTORY_EVENT_TYPES],
  sort: DEFAULT_HISTORY_SORT_DIRECTION,
};
