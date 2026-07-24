import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiButtonComponent, UiDialogService, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { filter, finalize, Observable, switchMap } from 'rxjs';

import { DELETE_TASK_DIALOG_DATA, DELETE_TODO_DIALOG_DATA } from './core/todo.constants';
import { ITodo, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from './core/todo.models';
import { TodoService } from './services/todo.service';
import { TodoSessionService } from './services/todo-session.service';
import { TodoListCardComponent } from './todo-list-card/todo-list-card.component';

const TODO_AUTH_TOKEN = 'REAL_TOKEN_HERE'; // i'll rmeove it whens hell manage apps

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
  private readonly todoSessionService = inject(TodoSessionService);
  private readonly dialogService = inject(UiDialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isAddTodoPending = signal(false);
  protected readonly loadingTodoId = signal<string | null>(null);

  protected readonly todos = this.todoService.todos;
  protected readonly uiInputType = UiInputType;

  protected readonly todoForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.todoSessionService.setToken(TODO_AUTH_TOKEN);
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
      .addTodo(name)
      .pipe(
        finalize(() => this.isAddTodoPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        todoFormDirective.resetForm({ name: '' });
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

          return this.todoService.deleteTodo(todoId).pipe(finalize(() => this.loadingTodoId.set(null)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected addTask(event: ITodoTaskNameEvent): void {
    this.runTodoAction(event.todoId, () => this.todoService.addTask(event));
  }

  protected deleteTask(event: ITodoTaskTargetEvent): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.dialogService
      .open(DELETE_TASK_DIALOG_DATA)
      .pipe(
        filter(Boolean),
        switchMap(() => {
          this.loadingTodoId.set(event.todoId);

          return this.todoService.deleteTask(event).pipe(finalize(() => this.loadingTodoId.set(null)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected toggleTaskCompleted(event: ITodoTaskTargetEvent): void {
    this.runTodoAction(event.todoId, () => this.todoService.toggleTaskCompleted(event));
  }

  protected updateTask(event: ITodoTaskFullEvent): void {
    this.runTodoAction(event.todoId, () => this.todoService.updateTaskName(event));
  }

  private runTodoAction(todoId: string, action: () => Observable<ITodo>): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.loadingTodoId.set(todoId);

    action()
      .pipe(
        finalize(() => this.loadingTodoId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
