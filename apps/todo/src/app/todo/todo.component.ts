import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiButtonComponent, UiDialogService, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { DELETE_TODO_DIALOG_DATA } from './core/todo.constants';
import { ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from './core/todo.models';
import { TodoService } from './services/todo.service';
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

  protected addTask(event: ITodoTaskNameEvent): void {
    this.todoService.addTask(event);
  }

  protected deleteTask(event: ITodoTaskTargetEvent): void {
    this.todoService.deleteTask(event);
  }

  protected toggleTaskCompleted(event: ITodoTaskTargetEvent): void {
    this.todoService.toggleTaskCompleted(event);
  }

  protected updateTask(event: ITodoTaskFullEvent): void {
    this.todoService.updateTaskName(event);
  }
}
