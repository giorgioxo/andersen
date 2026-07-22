import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { TodoTaskFormGroup } from '../core/todo.models';

@Component({
  selector: 'app-todo-task-item',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, MatCheckboxModule],
  templateUrl: './todo-task-item.component.html',
  styleUrl: './todo-task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTaskItemComponent {
  public readonly todoTaskForm = input.required<TodoTaskFormGroup>();

  public readonly deleteTodoTask = output<void>();

  protected readonly isEditing = signal(false);
  protected readonly previousTaskName = signal<string | null>(null);
  protected readonly uiInputType = UiInputType;

  protected readonly controls = computed(() => this.todoTaskForm().controls);

  protected onDeleteTodoTask(): void {
    this.deleteTodoTask.emit();
  }

  protected startEdit(): void {
    this.previousTaskName.set(this.controls().name.value);
    this.isEditing.set(true);
  }

  protected saveEdit(): void {
    const normalizedName = this.controls().name.value.trim();

    if (!normalizedName) {
      this.controls().name.setErrors({ required: true });
      this.todoTaskForm().markAllAsTouched();
      return;
    }

    this.controls().name.setValue(normalizedName);
    this.previousTaskName.set(null);
    this.isEditing.set(false);
  }

  protected cancelEdit(): void {
    const previousTaskName = this.previousTaskName();

    if (previousTaskName !== null) {
      this.controls().name.setValue(previousTaskName);
    }

    this.controls().name.setErrors(null);
    this.previousTaskName.set(null);
    this.isEditing.set(false);
  }
}
