import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { ITodo } from '../core/todo.models';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  public readonly todo = input.required<ITodo>();

  public readonly deleteTodo = output<string>();
  public readonly addTask = output<{ todoId: string; name: string }>();
  public readonly deleteTask = output<{ todoId: string; taskId: string }>();
  public readonly toggleTaskCompleted = output<{ todoId: string; taskId: string }>();
  public readonly updateTask = output<{ todoId: string; taskId: string; name: string }>();

  protected readonly uiInputType = UiInputType;

  protected readonly taskForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  protected onDeleteTodo(): void {
    this.deleteTodo.emit(this.todo().id);
  }

  protected onAddTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { name } = this.taskForm.getRawValue();

    this.addTask.emit({
      todoId: this.todo().id,
      name,
    });

    this.taskForm.reset();
    this.taskForm.controls.name.setErrors(null);
  }

  protected onDeleteTask(taskId: string): void {
    this.deleteTask.emit({
      todoId: this.todo().id,
      taskId,
    });
  }

  protected onToggleTaskCompleted(taskId: string): void {
    this.toggleTaskCompleted.emit({
      todoId: this.todo().id,
      taskId,
    });
  }

  protected onUpdateTask(event: { taskId: string; name: string }): void {
    this.updateTask.emit({
      todoId: this.todo().id,
      taskId: event.taskId,
      name: event.name,
    });
  }
}
