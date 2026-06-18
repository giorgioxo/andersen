import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HistoryTableComponent } from './history-table/history-table.component';
import { HistoryEventType, IHistoryEvent } from './core/history.model';

@Component({
  selector: 'app-history',
  imports: [HistoryTableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {
  protected readonly historyEvents: IHistoryEvent[] = [
    {
      id: '1',
      type: HistoryEventType.CreateTodo,
      createdAt: new Date('2026-06-18T10:00:00'),
      additionalInfo: 'List: Work',
    },
    {
      id: '2',
      type: HistoryEventType.CreateTask,
      createdAt: new Date('2026-06-18T10:05:00'),
      additionalInfo: 'Task: Prepare report',
    },
    {
      id: '3',
      type: HistoryEventType.UpdateTask,
      createdAt: new Date('2026-06-18T10:10:00'),
      additionalInfo: 'Task: Prepare report',
    },
    {
      id: '4',
      type: HistoryEventType.DeleteTask,
      createdAt: new Date('2026-06-18T10:15:00'),
      additionalInfo: 'Task: Old note',
    },
    {
      id: '5',
      type: HistoryEventType.DeleteTodo,
      createdAt: new Date('2026-06-18T10:20:00'),
      additionalInfo: 'List: Archive',
    },
    {
      id: '6',
      type: HistoryEventType.CreateTodo,
      createdAt: new Date('2026-06-18T10:25:00'),
      additionalInfo: 'List: Personal',
    },
    {
      id: '7',
      type: HistoryEventType.CreateTask,
      createdAt: new Date('2026-06-18T10:30:00'),
      additionalInfo: 'Task: Buy groceries',
    },
    {
      id: '8',
      type: HistoryEventType.UpdateTask,
      createdAt: new Date('2026-06-18T10:35:00'),
      additionalInfo: 'Task: Buy groceries',
    },
    {
      id: '9',
      type: HistoryEventType.CreateTask,
      createdAt: new Date('2026-06-18T10:40:00'),
      additionalInfo: 'Task: Call client',
    },
    {
      id: '10',
      type: HistoryEventType.DeleteTask,
      createdAt: new Date('2026-06-18T10:45:00'),
      additionalInfo: 'Task ID: task-910',
    },
  ];
}
