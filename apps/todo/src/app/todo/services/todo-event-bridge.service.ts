import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SHELL_AUTH_TOKEN_EVENT, TODO_AUTH_TOKEN_REQUEST_EVENT, TODO_LOGOUT_EVENT } from '../core/todo-events.constants';
import { IShellAuthTokenEventDetail } from '../core/todo-events.model';
import { TodoService } from './todo.service';
import { TodoSessionService } from './todo-session.service';

@Injectable({
  providedIn: 'root',
})
export class TodoEventBridgeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly todoService = inject(TodoService);
  private readonly todoSessionService = inject(TodoSessionService);

  private isInitialized = false;

  public init(): void {
    if (!this.isInitialized) {
      window.addEventListener(SHELL_AUTH_TOKEN_EVENT, this.handleAuthToken);
      this.isInitialized = true;
    }

    this.requestAuthToken();
  }

  public dispatchLogout(): void {
    this.todoSessionService.clearToken();
    window.dispatchEvent(new CustomEvent(TODO_LOGOUT_EVENT));
  }

  private readonly handleAuthToken = (event: Event): void => {
    const { token } = (event as CustomEvent<IShellAuthTokenEventDetail>).detail;

    this.todoSessionService.setToken(token);

    this.todoService.loadTodos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  };

  private requestAuthToken(): void {
    window.dispatchEvent(new CustomEvent(TODO_AUTH_TOKEN_REQUEST_EVENT));
  }
}
