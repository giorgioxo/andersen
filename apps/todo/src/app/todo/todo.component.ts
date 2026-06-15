import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButtonComponent, UiDialogService, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { TodoListCardComponent } from './todo-list-card/todo-list-card.component';

import { TodoService } from './services/todo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DELETE_TODO_DIALOG_DATA } from './core/todo.constants';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, UiInputComponent, UiButtonComponent, TodoListCardComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly dialogService = inject(UiDialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly todos = this.todoService.todos;
  protected readonly uiInputType = UiInputType;

  protected readonly todoForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  protected addTodo(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const { name } = this.todoForm.getRawValue();

    this.todoService.addTodo(name);
    this.todoForm.reset();

    this.todoForm.controls.name.setErrors(null);
  }

  protected deleteTodo(todoId: string): void {
    this.dialogService
      .open(DELETE_TODO_DIALOG_DATA)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (!isConfirmed) {
          return;
        }

        this.todoService.deleteTodo(todoId);
        this.todoForm.reset();
        this.todoForm.controls.name.setErrors(null);
      });
  }

  protected addTask(event: { todoId: string; name: string }): void {
    this.todoService.addTask(event.todoId, event.name);
  }
  protected deleteTask(event: { todoId: string; taskId: string }): void {
    this.todoService.deleteTask(event.todoId, event.taskId);
  }
  protected toggleTaskCompleted(event: { todoId: string; taskId: string }): void {
    this.todoService.toggleTaskCompleted(event.todoId, event.taskId);
  }

  protected updateTask(event: { todoId: string; taskId: string; name: string }): void {
    this.todoService.updateTaskName(event.todoId, event.taskId, event.name);
  }
}
