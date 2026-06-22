import type { SortDirection } from '@angular/material/sort';

import { HistoryEventType, IHistoryQuery } from './history.model';

export const HISTORY_EVENT_OPTIONS = [
  {
    value: HistoryEventType.CreateTodo,
    translationKey: 'history.events.createTodo',
  },
  {
    value: HistoryEventType.DeleteTodo,
    translationKey: 'history.events.deleteTodo',
  },
  {
    value: HistoryEventType.CreateTask,
    translationKey: 'history.events.createTask',
  },
  {
    value: HistoryEventType.DeleteTask,
    translationKey: 'history.events.deleteTask',
  },
  {
    value: HistoryEventType.UpdateTask,
    translationKey: 'history.events.updateTask',
  },
] as const;

export const HISTORY_EVENT_TYPES: HistoryEventType[] = HISTORY_EVENT_OPTIONS.map(({ value }) => value);

export const HISTORY_PAGINATOR_TRANSLATION_KEYS = {
  itemsPerPage: 'history.paginator.itemsPerPage',
  nextPage: 'history.paginator.nextPage',
  previousPage: 'history.paginator.previousPage',
  firstPage: 'history.paginator.firstPage',
  lastPage: 'history.paginator.lastPage',
  range: 'history.paginator.range',
} as const;

export const DEFAULT_HISTORY_SORT_DIRECTION: Exclude<SortDirection, ''> = 'desc';

export const HISTORY_PAGE_SIZE = 20;

export const INITIAL_HISTORY_QUERY: IHistoryQuery = {
  limit: HISTORY_PAGE_SIZE,
  page: 1,
  event: [...HISTORY_EVENT_TYPES],
  sort: DEFAULT_HISTORY_SORT_DIRECTION,
};
