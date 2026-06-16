import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UiButtonComponent, UiInputComponent, UiInputType, UiSpinnerComponent } from '@andersen/shared-ui';

import { ITodo } from '../core/todo.models';
import { FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoTaskItemComponent } from '../todo-task-item/todo-task-item.component';

@Component({
  selector: 'app-todo-list-card',
  imports: [MatCardModule, UiButtonComponent, ReactiveFormsModule, UiInputComponent, TodoTaskItemComponent, UiSpinnerComponent],
  templateUrl: './todo-list-card.component.html',
  styleUrl: './todo-list-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListCardComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  public readonly todo = input.required<ITodo>();
  public readonly isLoading = input(false);

  public readonly deleteTodo = output<string>();
  public readonly addTask = output<{ todoId: string; name: string }>();
  public readonly deleteTask = output<{ todoId: string; taskId: string }>();
  public readonly toggleTaskCompleted = output<{
    todoId: string;
    taskId: string;
  }>();
  public readonly updateTask = output<{
    todoId: string;
    taskId: string;
    name: string;
  }>();

  protected readonly uiInputType = UiInputType;

  protected readonly taskForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  protected onDeleteTodo(): void {
    if (this.isLoading()) {
      return;
    }

    this.deleteTodo.emit(this.todo().id);
  }

  protected onAddTask(taskFormDirective: FormGroupDirective): void {
    if (this.taskForm.invalid || this.isLoading()) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { name } = this.taskForm.getRawValue();

    this.addTask.emit({
      todoId: this.todo().id,
      name: name.trim(),
    });

    taskFormDirective.resetForm({
      name: '',
    });

    this.taskForm.updateValueAndValidity();
  }

  protected onDeleteTask(taskId: string): void {
    if (this.isLoading()) {
      return;
    }

    this.deleteTask.emit({
      todoId: this.todo().id,
      taskId,
    });
  }

  protected onToggleTaskCompleted(taskId: string): void {
    if (this.isLoading()) {
      return;
    }

    this.toggleTaskCompleted.emit({
      todoId: this.todo().id,
      taskId,
    });
  }

  protected onUpdateTask(event: { taskId: string; name: string }): void {
    if (this.isLoading()) {
      return;
    }

    this.updateTask.emit({
      todoId: this.todo().id,
      taskId: event.taskId,
      name: event.name,
    });
  }
}
