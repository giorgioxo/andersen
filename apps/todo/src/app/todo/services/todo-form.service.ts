import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ITodoListPayload, TodoListFormGroup, TodoListsFormGroup, TodoTaskFormGroup } from '../core/todo.models';

@Injectable({
  providedIn: 'root',
})
export class TodoFormService {
  public createTodoListsForm(): TodoListsFormGroup {
    return new FormGroup({
      todoLists: new FormArray<TodoListFormGroup>([]),
    });
  }

  public createTodoListGroup(name: string): TodoListFormGroup | null {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return null;
    }

    return new FormGroup({
      id: new FormControl(this.createId(), { nonNullable: true }),
      name: new FormControl(normalizedName, {
        nonNullable: true,
        validators: Validators.required,
      }),
      tasks: new FormArray<TodoTaskFormGroup>([]),
    });
  }

  public createTodoTaskGroup(name: string): TodoTaskFormGroup | null {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return null;
    }

    return new FormGroup({
      id: new FormControl(this.createId(), { nonNullable: true }),
      name: new FormControl(normalizedName, {
        nonNullable: true,
        validators: Validators.required,
      }),
      completed: new FormControl(false, { nonNullable: true }),
    });
  }

  public getPayload(form: TodoListsFormGroup): ITodoListPayload[] {
    return form.getRawValue().todoLists;
  }

  private createId(): string {
    return crypto.randomUUID();
  }

  private normalizeName(name: string): string {
    return name.trim();
  }
}
