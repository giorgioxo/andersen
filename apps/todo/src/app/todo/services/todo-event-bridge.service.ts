import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import {
  MFE_LANGUAGE_REQUEST_EVENT,
  SHELL_AUTH_TOKEN_EVENT,
  SHELL_LANGUAGE_CHANGE_EVENT,
  TODO_AUTH_TOKEN_REQUEST_EVENT,
  TODO_LOGOUT_EVENT,
} from '../core/todo-events.constants';
import {
  IShellAuthTokenEventDetail,
  IShellLanguageChangeEventDetail,
} from '../core/todo-events.model';
import { TodoService } from './todo.service';
import { TodoSessionService } from './todo-session.service';

@Injectable()
export class TodoEventBridgeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly todoService = inject(TodoService);
  private readonly todoSessionService = inject(TodoSessionService);
  private readonly translateService = inject(TranslateService);

  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) {
      return;
    }

    window.addEventListener(
      SHELL_AUTH_TOKEN_EVENT,
      this.handleAuthToken,
    );
    window.addEventListener(
      SHELL_LANGUAGE_CHANGE_EVENT,
      this.handleLanguageChange,
    );

    this.destroyRef.onDestroy(() => {
      window.removeEventListener(
        SHELL_AUTH_TOKEN_EVENT,
        this.handleAuthToken,
      );
      window.removeEventListener(
        SHELL_LANGUAGE_CHANGE_EVENT,
        this.handleLanguageChange,
      );
    });

    this.isInitialized = true;

    this.requestLanguage();
    this.requestAuthToken();
  }

  public dispatchLogout(): void {
    this.todoSessionService.clearToken();
    window.dispatchEvent(new CustomEvent(TODO_LOGOUT_EVENT));
  }

  private readonly handleAuthToken = (event: Event): void => {
    const { token } = (
      event as CustomEvent<IShellAuthTokenEventDetail>
    ).detail;

    this.todoSessionService.setToken(token);

    this.todoService
      .loadTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };

  private readonly handleLanguageChange = (event: Event): void => {
    const { language } = (
      event as CustomEvent<IShellLanguageChangeEventDetail>
    ).detail;

    this.translateService.use(language);
  };

  private requestLanguage(): void {
    window.dispatchEvent(
      new CustomEvent(MFE_LANGUAGE_REQUEST_EVENT),
    );
  }

  private requestAuthToken(): void {
    window.dispatchEvent(
      new CustomEvent(TODO_AUTH_TOKEN_REQUEST_EVENT),
    );
  }
}