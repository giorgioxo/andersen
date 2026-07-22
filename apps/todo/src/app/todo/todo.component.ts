import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiButtonComponent, UiDialogService, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { DELETE_TODO_DIALOG_DATA } from './core/todo.constants';
import { TodoFormService } from './services/todo-form.service';
import { TodoListCardComponent } from './todo-list-card/todo-list-card.component';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, UiInputComponent, UiButtonComponent, TodoListCardComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoFormService = inject(TodoFormService);
  private readonly dialogService = inject(UiDialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly uiInputType = UiInputType;

  protected readonly todoListsForm = this.todoFormService.createTodoListsForm();
  protected readonly todoListsArray = this.todoListsForm.controls.todoLists;

  protected readonly listCreationForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  protected addTodoList(): void {
    if (this.listCreationForm.invalid) {
      this.listCreationForm.markAllAsTouched();
      return;
    }

    const { name } = this.listCreationForm.getRawValue();
    const todoListGroup = this.todoFormService.createTodoListGroup(name);

    if (!todoListGroup) {
      return;
    }

    this.todoListsArray.push(todoListGroup);
    this.resetListCreationForm();
  }

  protected deleteTodoList(todoListIndex: number): void {
    this.dialogService
      .open(DELETE_TODO_DIALOG_DATA)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (!isConfirmed) {
          return;
        }

        this.todoListsArray.removeAt(todoListIndex);
      });
  }

  private resetListCreationForm(): void {
    this.listCreationForm.reset();
    this.listCreationForm.controls.name.setErrors(null);
  }
}
