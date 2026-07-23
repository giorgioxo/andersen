import { Injectable } from '@angular/core';

import { TodoCollectionState } from '../core/todo-collection-state';
import { ITodoTask } from '../core/todo.models';

@Injectable({
  providedIn: 'root',
})
export class TodoTaskManagementService extends TodoCollectionState {
  public createTask(name: string): ITodoTask | null {
    let task: ITodoTask | null = null;

    this.withNormalizedName(name, (normalizedName) => {
      task = this.createNamedItem<ITodoTask>({
        name: normalizedName,
        completed: false,
      });
    });

    return task;
  }

  public addTask(tasks: ITodoTask[], task: ITodoTask): ITodoTask[] {
    return this.addItem(tasks, task);
  }

  public deleteTask(tasks: ITodoTask[], taskId: string): ITodoTask[] {
    return this.deleteItem(tasks, taskId);
  }

  public updateTask(tasks: ITodoTask[], taskId: string, updater: (task: ITodoTask) => ITodoTask): ITodoTask[] {
    return this.updateItem(tasks, taskId, updater);
  }
}
