import { inject, Injectable, signal } from '@angular/core';
import { NotificationService } from '@andersen/shared-ui';
import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { ITodo } from '../core/todo.models';
import { TodoApiService } from './todo-api.service';
import { TodoHistoryTrackingService } from './todo-history-tracking.service';
import { TodoSessionService } from './todo-session.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todoApiService = inject(TodoApiService);
  private readonly todoHistoryTrackingService = inject(TodoHistoryTrackingService);
  private readonly todoSessionService = inject(TodoSessionService);
  private readonly notificationService = inject(NotificationService);

  private readonly todoItems = signal<ITodo[]>([]);

  public readonly todos = this.todoItems.asReadonly();

  public loadTodos(): Observable<ITodo[]> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this.todoApiService.getTodos(token).pipe(
      tap((todos) => {
        this.todoItems.set(todos);
      }),
      catchError(() => this.handleError('Failed to load todos')),
    );
  }

  public addTodo(name: string): Observable<ITodo> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this.todoApiService.createTodo(token, { name }).pipe(
      tap((todo) => {
        this.todoItems.update((todos) => [...todos, todo]);
        this.todoHistoryTrackingService.trackCreateTodo(todo.id, todo.name);
        this.notificationService.success('Todo added successfully');
      }),
      catchError(() => this.handleError('Failed to add todo')),
    );
  }

  public deleteTodo(todoId: string): Observable<{ deleted: boolean }> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this.todoApiService.deleteTodo(token, todoId).pipe(
      tap(() => {
        this.todoItems.update((todos) => todos.filter(({ id }) => id !== todoId));
        this.todoHistoryTrackingService.trackDeleteTodo(todoId);
        this.notificationService.success('Todo deleted successfully');
      }),
      catchError(() => this.handleError('Failed to delete todo')),
    );
  }

  public addTask(todoId: string, name: string): Observable<ITodo> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this.todoApiService.createTask(token, todoId, { name }).pipe(
      tap((updatedTodo) => {
        this.updateTodoItem(updatedTodo);
        this.todoHistoryTrackingService.trackCreateTask(todoId, name);
      }),
      catchError(() => this.handleError('Failed to add task')),
    );
  }

  public deleteTask(todoId: string, taskId: string): Observable<ITodo> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this.todoApiService.deleteTask(token, todoId, taskId).pipe(
      tap((updatedTodo) => {
        this.updateTodoItem(updatedTodo);
        this.todoHistoryTrackingService.trackDeleteTask(todoId, taskId);
        this.notificationService.success('Task deleted successfully');
      }),
      catchError(() => this.handleError('Failed to delete task')),
    );
  }

  public toggleTaskCompleted(todoId: string, taskId: string): Observable<ITodo> {
    const task = this.findTask(todoId, taskId);

    if (!task) {
      this.notificationService.error('Task was not found');
      return EMPTY;
    }

    return this.updateTask(todoId, taskId, {
      name: task.name,
      completed: !task.completed,
    });
  }

  public updateTaskName(todoId: string, taskId: string, name: string): Observable<ITodo> {
    const task = this.findTask(todoId, taskId);

    if (!task) {
      this.notificationService.error('Task was not found');
      return EMPTY;
    }

    return this.updateTask(todoId, taskId, {
      name,
      completed: task.completed,
    }).pipe(
      tap(() => {
        this.notificationService.success('Task updated successfully');
      }),
    );
  }

  private updateTask(todoId: string, taskId: string, payload: { name: string; completed: boolean }): Observable<ITodo> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this.todoApiService.updateTask(token, todoId, taskId, payload).pipe(
      tap((updatedTodo) => {
        this.updateTodoItem(updatedTodo);
        this.todoHistoryTrackingService.trackUpdateTask(todoId, taskId, payload.name, payload.completed);
      }),
      catchError(() => this.handleError('Failed to update task')),
    );
  }

  private updateTodoItem(updatedTodo: ITodo): void {
    this.todoItems.update((todos) => todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  }

  private findTask(todoId: string, taskId: string): ITodo['tasks'][number] | undefined {
    const todo = this.todoItems().find(({ id }) => id === todoId);

    return todo?.tasks.find(({ id }) => id === taskId);
  }

  private getToken(): string | null {
    const token = this.todoSessionService.getToken();

    if (!token) {
      this.notificationService.error('Authentication token is missing');
      return null;
    }

    return token;
  }

  private handleError(message: string): Observable<never> {
    this.notificationService.error(message);

    return EMPTY;
  }
}
