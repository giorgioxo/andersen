import { IHistoryApiEvent, IHistoryEvent } from './history.model';

export const mapHistoryApiEvent = (event: IHistoryApiEvent): IHistoryEvent => ({
  id: `${event.todo_id}-${event.event}-${event.date}`,
  type: event.event,
  createdAt: event.date,
  additionalInfo: formatHistoryAdditionalInfo(event.data),
});

const formatHistoryAdditionalInfo = (data: Record<string, unknown>): string => {
  const entries = Object.entries(data);

  if (!entries.length) {
    return 'No additional info';
  }

  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(', ');
};
