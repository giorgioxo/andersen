import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';

import { HISTORY_UPDATED_EVENT } from '../core/todo-events.constants';
import { ITodoHistoryTrackingPayload, TodoHistoryEventType } from '../core/todo-history-tracking.model';
import { TodoHistoryTrackingApiService } from './todo-history-tracking-api.service';
import { TodoSessionService } from './todo-session.service';

@Injectable({
  providedIn: 'root',
})
export class TodoHistoryTrackingService {
  private readonly todoSessionService = inject(TodoSessionService);
  private readonly apiService = inject(TodoHistoryTrackingApiService);

  public trackCreateTodo(todoId: string, name: string): void {
    this.track(todoId, {
      event: TodoHistoryEventType.CreateTodo,
      todo_id: todoId,
      data: { name },
    });
  }

  public trackDeleteTodo(todoId: string): void {
    this.track(todoId, {
      event: TodoHistoryEventType.DeleteTodo,
      todo_id: todoId,
      data: { todoId },
    });
  }

  public trackCreateTask(todoId: string, name: string): void {
    this.track(todoId, {
      event: TodoHistoryEventType.CreateTask,
      todo_id: todoId,
      data: { name },
    });
  }

  public trackDeleteTask(todoId: string, taskId: string): void {
    this.track(todoId, {
      event: TodoHistoryEventType.DeleteTask,
      todo_id: todoId,
      data: { taskId },
    });
  }

  public trackUpdateTask(todoId: string, taskId: string, name: string, completed: boolean): void {
    this.track(todoId, {
      event: TodoHistoryEventType.UpdateTask,
      todo_id: todoId,
      data: { taskId, name, completed },
    });
  }

  private track(todoId: string, payload: ITodoHistoryTrackingPayload): void {
    const token = this.todoSessionService.getToken();

    if (!token) {
      return;
    }

    this.apiService
      .track(token, todoId, payload)
      .pipe(
        tap(() => {
          window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT));
        }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }
}
