import { Injectable, signal } from '@angular/core';

import { ITodo, ITodoTask } from '../core/todo.models';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todoItems = signal<ITodo[]>([]);

  public readonly todos = this.todoItems.asReadonly();

  public addTodo(name: string): void {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    this.todoItems.update((todos) => [
      ...todos,
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        tasks: [],
      },
    ]);
  }

  public deleteTodo(todoId: string): void {
    this.todoItems.update((todos) => todos.filter(({ id }) => id !== todoId));
  }

  public addTask(todoId: string, name: string): void {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const task: ITodoTask = {
      id: crypto.randomUUID(),
      name: trimmedName,
      completed: false,
    };

    this.todoItems.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            tasks: [...todo.tasks, task],
          }
          : todo,
      ),
    );
  }

  public deleteTask(todoId: string, taskId: string): void {
    this.todoItems.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            tasks: todo.tasks.filter(({ id }) => id !== taskId),
          }
          : todo,
      ),
    );
  }

  public toggleTaskCompleted(todoId: string, taskId: string): void {
    this.todoItems.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            tasks: todo.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  completed: !task.completed,
                }
                : task,
            ),
          }
          : todo,
      ),
    );
  }

  public updateTaskName(todoId: string, taskId: string, name: string): void {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    this.todoItems.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            tasks: todo.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  name: trimmedName,
                }
                : task,
            ),
          }
          : todo,
      ),
    );
  }
}
