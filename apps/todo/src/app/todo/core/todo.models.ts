import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface ITodoTaskPayload {
  id: string;
  name: string;
  completed: boolean;
}

export interface ITodoListPayload {
  id: string;
  name: string;
  tasks: ITodoTaskPayload[];
}

export type TodoTaskFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  completed: FormControl<boolean>;
}>;

export type TodoListFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  tasks: FormArray<TodoTaskFormGroup>;
}>;

export type TodoListsFormGroup = FormGroup<{
  todoLists: FormArray<TodoListFormGroup>;
}>;
