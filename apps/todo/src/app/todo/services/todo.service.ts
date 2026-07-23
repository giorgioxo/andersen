import { Injectable, inject, signal } from '@angular/core';

import { ITodo, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from '../core/todo.models';
import { TodoListManagementService } from './todo-list-management.service';
import { TodoTaskManagementService } from './todo-task-management.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todoListManagementService = inject(TodoListManagementService);
  private readonly todoTaskManagementService = inject(TodoTaskManagementService);

  private readonly todoItems = signal<ITodo[]>([]);

  public readonly todos = this.todoItems.asReadonly();

  public addTodo(name: string): void {
    const todo = this.todoListManagementService.createTodo(name);

    if (!todo) {
      return;
    }

    this.todoItems.update((todos) => this.todoListManagementService.addTodo(todos, todo));
  }

  public deleteTodo(todoId: string): void {
    this.todoItems.update((todos) => this.todoListManagementService.deleteTodo(todos, todoId));
  }

  public addTask({ todoId, name }: ITodoTaskNameEvent): void {
    const task = this.todoTaskManagementService.createTask(name);

    if (!task) {
      return;
    }

    this.updateTodo(todoId, (todo) => ({
      ...todo,
      tasks: this.todoTaskManagementService.addTask(todo.tasks, task),
    }));
  }

  public deleteTask({ todoId, taskId }: ITodoTaskTargetEvent): void {
    this.updateTodo(todoId, (todo) => ({
      ...todo,
      tasks: this.todoTaskManagementService.deleteTask(todo.tasks, taskId),
    }));
  }

  public toggleTaskCompleted({ todoId, taskId }: ITodoTaskTargetEvent): void {
    this.updateTask(todoId, taskId, (task) => ({
      ...task,
      completed: !task.completed,
    }));
  }

  public updateTaskName({ todoId, taskId, name }: ITodoTaskFullEvent): void {
    const updatedTask = this.todoTaskManagementService.createTask(name);

    if (!updatedTask) {
      return;
    }

    this.updateTask(todoId, taskId, (task) => ({
      ...task,
      name: updatedTask.name,
    }));
  }

  private updateTodo(todoId: string, updater: (todo: ITodo) => ITodo): void {
    this.todoItems.update((todos) => this.todoListManagementService.updateTodo(todos, todoId, updater));
  }

  private updateTask(
    todoId: string,
    taskId: string,
    updater: Parameters<TodoTaskManagementService['updateTask']>[2],
  ): void {
    this.updateTodo(todoId, (todo) => ({
      ...todo,
      tasks: this.todoTaskManagementService.updateTask(todo.tasks, taskId, updater),
    }));
  }
}
