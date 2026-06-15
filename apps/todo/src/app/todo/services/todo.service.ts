import { Injectable, signal } from '@angular/core';

import { TodoCollectionState } from '../core/todo-collection-state';
import { ITodo, ITodoTask, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from '../core/todo.models';

@Injectable({
  providedIn: 'root',
})
export class TodoService extends TodoCollectionState {
  private readonly todoItems = signal<ITodo[]>([]);

  public readonly todos = this.todoItems.asReadonly();

  public addTodo(name: string): void {
    this.withNormalizedName(name, (normalizedName) => {
      const todo = this.createNamedItem<ITodo>({
        name: normalizedName,
        tasks: [],
      });

      this.todoItems.update((todos) => this.addItem(todos, todo));
    });
  }

  public deleteTodo(todoId: string): void {
    this.todoItems.update((todos) => this.deleteItem(todos, todoId));
  }

  public addTask({ todoId, name }: ITodoTaskNameEvent): void {
    this.withNormalizedName(name, (normalizedName) => {
      const task = this.createNamedItem<ITodoTask>({
        name: normalizedName,
        completed: false,
      });

      this.updateTodo(todoId, (todo) => ({
        ...todo,
        tasks: this.addItem(todo.tasks, task),
      }));
    });
  }

  public deleteTask({ todoId, taskId }: ITodoTaskTargetEvent): void {
    this.updateTodo(todoId, (todo) => ({
      ...todo,
      tasks: this.deleteItem(todo.tasks, taskId),
    }));
  }

  public toggleTaskCompleted({ todoId, taskId }: ITodoTaskTargetEvent): void {
    this.updateTask(todoId, taskId, (task) => ({
      ...task,
      completed: !task.completed,
    }));
  }

  public updateTaskName({ todoId, taskId, name }: ITodoTaskFullEvent): void {
    this.withNormalizedName(name, (normalizedName) => {
      this.updateTask(todoId, taskId, (task) => ({
        ...task,
        name: normalizedName,
      }));
    });
  }

  private updateTodo(todoId: string, updater: (todo: ITodo) => ITodo): void {
    this.todoItems.update((todos) => this.updateItem(todos, todoId, updater));
  }

  private updateTask(todoId: string, taskId: string, updater: (task: ITodoTask) => ITodoTask): void {
    this.updateTodo(todoId, (todo) => ({
      ...todo,
      tasks: this.updateItem(todo.tasks, taskId, updater),
    }));
  }
}
