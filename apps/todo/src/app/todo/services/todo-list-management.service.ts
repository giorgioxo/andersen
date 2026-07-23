import { Injectable } from '@angular/core';

import { TodoCollectionState } from '../core/todo-collection-state';
import { ITodo } from '../core/todo.models';

@Injectable({
  providedIn: 'root',
})
export class TodoListManagementService extends TodoCollectionState {
  public createTodo(name: string): ITodo | null {
    let todo: ITodo | null = null;

    this.withNormalizedName(name, (normalizedName) => {
      todo = this.createNamedItem<ITodo>({
        name: normalizedName,
        tasks: [],
      });
    });

    return todo;
  }

  public addTodo(todos: ITodo[], todo: ITodo): ITodo[] {
    return this.addItem(todos, todo);
  }

  public deleteTodo(todos: ITodo[], todoId: string): ITodo[] {
    return this.deleteItem(todos, todoId);
  }

  public updateTodo(todos: ITodo[], todoId: string, updater: (todo: ITodo) => ITodo): ITodo[] {
    return this.updateItem(todos, todoId, updater);
  }
}
