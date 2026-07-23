import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import {
  ITodo,
  ITodoTaskFullEvent,
  ITodoTaskItemUpdateEvent,
  ITodoTaskNameEvent,
  ITodoTaskTargetEvent,
} from '../core/todo.models';
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
  public readonly addTask = output<ITodoTaskNameEvent>();
  public readonly deleteTask = output<ITodoTaskTargetEvent>();
  public readonly toggleTaskCompleted = output<ITodoTaskTargetEvent>();
  public readonly updateTask = output<ITodoTaskFullEvent>();

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

  protected onUpdateTask(event: ITodoTaskItemUpdateEvent): void {
    this.updateTask.emit({
      todoId: this.todo().id,
      taskId: event.taskId,
      name: event.name,
    });
  }
}
