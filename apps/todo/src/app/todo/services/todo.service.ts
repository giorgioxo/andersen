import { Injectable, inject, signal } from '@angular/core';

import { NotificationService } from '@andersen/shared-ui';

import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { ITodo, ITodoTask, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from '../core/todo.models';
import { TodoApiService } from './todo-api.service';
import { TodoListManagementService } from './todo-list-management.service';
import { TodoTaskManagementService } from './todo-task-management.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todoApiService = inject(TodoApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly todoListManagementService = inject(TodoListManagementService);
  private readonly todoTaskManagementService = inject(TodoTaskManagementService);

  private readonly todoItems = signal<ITodo[]>([]);

  public readonly todos = this.todoItems.asReadonly();

  public loadTodos(): Observable<ITodo[]> {
    return this.todoApiService.getTodos().pipe(
      tap((todos) => this.todoItems.set(todos)),
      catchError(() => this.handleError('Failed to load todos')),
    );
  }

  public addTodo(name: string): Observable<ITodo> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return EMPTY;
    }

    return this.todoApiService.createTodo({ name: normalizedName }).pipe(
      tap((todo) => {
        this.todoItems.update((todos) => this.todoListManagementService.addTodo(todos, todo));
        this.notificationService.success('Todo added successfully');
      }),
      catchError(() => this.handleError('Failed to add todo')),
    );
  }

  public deleteTodo(todoId: string): Observable<{ deleted: boolean }> {
    return this.todoApiService.deleteTodo(todoId).pipe(
      tap(() => {
        this.todoItems.update((todos) => this.todoListManagementService.deleteTodo(todos, todoId));
        this.notificationService.success('Todo deleted successfully');
      }),
      catchError(() => this.handleError('Failed to delete todo')),
    );
  }

  public addTask({ todoId, name }: ITodoTaskNameEvent): Observable<ITodo> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return EMPTY;
    }

    return this.todoApiService.createTask(todoId, { name: normalizedName }).pipe(
      tap((updatedTodo) => this.replaceTodo(updatedTodo)),
      catchError(() => this.handleError('Failed to add task')),
    );
  }

  public deleteTask({ todoId, taskId }: ITodoTaskTargetEvent): Observable<ITodo> {
    return this.todoApiService.deleteTask(todoId, taskId).pipe(
      tap((updatedTodo) => {
        this.replaceTodo(updatedTodo);
        this.notificationService.success('Task deleted successfully');
      }),
      catchError(() => this.handleError('Failed to delete task')),
    );
  }

  public toggleTaskCompleted({ todoId, taskId }: ITodoTaskTargetEvent): Observable<ITodo> {
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

  public updateTaskName({ todoId, taskId, name }: ITodoTaskFullEvent): Observable<ITodo> {
    const task = this.findTask(todoId, taskId);
    const normalizedName = name.trim();

    if (!task || !normalizedName) {
      this.notificationService.error('Task was not found');
      return EMPTY;
    }

    return this.updateTask(todoId, taskId, {
      name: normalizedName,
      completed: task.completed,
    }).pipe(tap(() => this.notificationService.success('Task updated successfully')));
  }

  private updateTask(todoId: string, taskId: string, payload: { name: string; completed: boolean }): Observable<ITodo> {
    return this.todoApiService.updateTask(todoId, taskId, payload).pipe(
      tap((updatedTodo) => this.replaceTodo(updatedTodo)),
      catchError(() => this.handleError('Failed to update task')),
    );
  }

  private replaceTodo(updatedTodo: ITodo): void {
    this.todoItems.update((todos) =>
      this.todoListManagementService.updateTodo(todos, updatedTodo.id, (todo) => ({
        ...todo,
        name: updatedTodo.name,
        tasks: this.replaceTasks(todo.tasks, updatedTodo.tasks),
      })),
    );
  }

  private replaceTasks(currentTasks: ITodoTask[], updatedTasks: ITodoTask[]): ITodoTask[] {
    const updatedTaskIds = new Set(updatedTasks.map(({ id }) => id));
    const existingTasks = currentTasks.filter(({ id }) => updatedTaskIds.has(id));

    return updatedTasks.reduce((tasks, updatedTask) => {
      const hasTask = tasks.some(({ id }) => id === updatedTask.id);

      if (hasTask) {
        return this.todoTaskManagementService.updateTask(tasks, updatedTask.id, () => updatedTask);
      }

      return this.todoTaskManagementService.addTask(tasks, updatedTask);
    }, existingTasks);
  }

  private findTask(todoId: string, taskId: string): ITodoTask | undefined {
    const todo = this.todos().find(({ id }) => id === todoId);

    return todo?.tasks.find(({ id }) => id === taskId);
  }

  private handleError(message: string): Observable<never> {
    this.notificationService.error(message);

    return EMPTY;
  }
}
