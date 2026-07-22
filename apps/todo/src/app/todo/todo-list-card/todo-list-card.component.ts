import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { TodoListFormGroup } from '../core/todo.models';
import { TodoFormService } from '../services/todo-form.service';
import { TodoTaskItemComponent } from '../todo-task-item/todo-task-item.component';

@Component({
  selector: 'app-todo-list-card',
  imports: [MatCardModule, UiButtonComponent, ReactiveFormsModule, UiInputComponent, TodoTaskItemComponent],
  templateUrl: './todo-list-card.component.html',
  styleUrl: './todo-list-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListCardComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoFormService = inject(TodoFormService);

  public readonly todoListForm = input.required<TodoListFormGroup>();

  public readonly deleteTodoList = output<void>();

  protected readonly uiInputType = UiInputType;
  protected readonly todoTasksArray = computed(() => this.todoListForm().controls.tasks);

  protected readonly taskCreationForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  protected onDeleteTodoList(): void {
    this.deleteTodoList.emit();
  }

  protected addTodoTask(): void {
    if (this.taskCreationForm.invalid) {
      this.taskCreationForm.markAllAsTouched();
      return;
    }

    const { name } = this.taskCreationForm.getRawValue();
    const todoTaskGroup = this.todoFormService.createTodoTaskGroup(name);

    if (!todoTaskGroup) {
      return;
    }

    this.todoTasksArray().push(todoTaskGroup);
    this.resetTaskCreationForm();
  }

  protected deleteTodoTask(todoTaskIndex: number): void {
    this.todoTasksArray().removeAt(todoTaskIndex);
  }

  private resetTaskCreationForm(): void {
    this.taskCreationForm.reset();
    this.taskCreationForm.controls.name.setErrors(null);
  }
}
