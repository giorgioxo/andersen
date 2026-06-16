import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButtonComponent, UiDialogService, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { filter, finalize, switchMap } from 'rxjs';

import { DELETE_TASK_DIALOG_DATA, DELETE_TODO_DIALOG_DATA } from './core/todo.constants';
import { TodoListCardComponent } from './todo-list-card/todo-list-card.component';
import { TodoService } from './services/todo.service';
import { TodoSessionService } from './services/todo-session.service';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, UiInputComponent, UiButtonComponent, TodoListCardComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly dialogService = inject(UiDialogService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly todoSessionService = inject(TodoSessionService); // hardcoded, remove in next US

  protected readonly isAddTodoPending = signal(false);
  protected readonly loadingTodoId = signal<string | null>(null);

  protected readonly todos = this.todoService.todos;
  protected readonly uiInputType = UiInputType;

  protected readonly todoForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.todoSessionService.setToken('PASTE_Real_TOKEN_HERE'); // just remove then till shell 
    this.todoService.loadTodos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected addTodo(todoFormDirective: FormGroupDirective): void {
    if (this.todoForm.invalid || this.isAddTodoPending()) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const { name } = this.todoForm.getRawValue();

    this.isAddTodoPending.set(true);

    this.todoService
      .addTodo(name.trim())
      .pipe(
        finalize(() => this.isAddTodoPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        todoFormDirective.resetForm({
          name: '',
        });

        this.todoForm.updateValueAndValidity();
      });
  }

  protected deleteTodo(todoId: string): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.dialogService
      .open(DELETE_TODO_DIALOG_DATA)
      .pipe(
        filter(Boolean),
        switchMap(() => {
          this.loadingTodoId.set(todoId);

          return this.todoService.deleteTodo(todoId).pipe(
            finalize(() => {
              this.loadingTodoId.set(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.todoForm.reset();
        this.todoForm.controls.name.setErrors(null);
      });
  }

  protected addTask(event: { todoId: string; name: string }): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.loadingTodoId.set(event.todoId);

    this.todoService
      .addTask(event.todoId, event.name.trim())
      .pipe(
        finalize(() => {
          this.loadingTodoId.set(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected deleteTask(event: { todoId: string; taskId: string }): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.dialogService
      .open(DELETE_TASK_DIALOG_DATA)
      .pipe(
        filter(Boolean),
        switchMap(() => {
          this.loadingTodoId.set(event.todoId);

          return this.todoService.deleteTask(event.todoId, event.taskId).pipe(
            finalize(() => {
              this.loadingTodoId.set(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected toggleTaskCompleted(event: { todoId: string; taskId: string }): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.loadingTodoId.set(event.todoId);

    this.todoService
      .toggleTaskCompleted(event.todoId, event.taskId)
      .pipe(
        finalize(() => {
          this.loadingTodoId.set(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected updateTask(event: { todoId: string; taskId: string; name: string }): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.loadingTodoId.set(event.todoId);

    this.todoService
      .updateTaskName(event.todoId, event.taskId, event.name.trim())
      .pipe(
        finalize(() => {
          this.loadingTodoId.set(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
