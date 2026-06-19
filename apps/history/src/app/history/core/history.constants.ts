import { HistoryEventType, HistorySortDirection, IHistoryQuery } from './history.model';

export const HISTORY_EVENT_OPTIONS: Array<{
  value: HistoryEventType;
  label: string;
}> = [
  {
    value: HistoryEventType.CreateTodo,
    label: 'Todo List Created',
  },
  {
    value: HistoryEventType.DeleteTodo,
    label: 'Todo List Deleted',
  },
  {
    value: HistoryEventType.CreateTask,
    label: 'Task Created',
  },
  {
    value: HistoryEventType.DeleteTask,
    label: 'Task Deleted',
  },
  {
    value: HistoryEventType.UpdateTask,
    label: 'Task Status Updated',
  },
];

export const HISTORY_EVENT_TYPES = HISTORY_EVENT_OPTIONS.map(({ value }) => value);

export const DEFAULT_HISTORY_SORT_DIRECTION: HistorySortDirection = 'desc';

export const HISTORY_PAGE_SIZE = 20;

export const INITIAL_HISTORY_QUERY: IHistoryQuery = {
  limit: HISTORY_PAGE_SIZE,
  page: 1,
  event: [...HISTORY_EVENT_TYPES],
  sort: DEFAULT_HISTORY_SORT_DIRECTION,
};
