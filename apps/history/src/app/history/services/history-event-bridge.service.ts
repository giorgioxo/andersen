import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Subject, switchMap } from 'rxjs';

import {
  HISTORY_AUTH_TOKEN_REQUEST_EVENT,
  HISTORY_UPDATED_EVENT,
  MFE_LANGUAGE_REQUEST_EVENT,
  SHELL_AUTH_TOKEN_EVENT,
  SHELL_LANGUAGE_CHANGE_EVENT,
} from '../core/history-events.constants';
import { IShellAuthTokenEventDetail, IShellLanguageChangeEventDetail } from '../core/history-events.model';
import { HistoryService } from './history.service';
import { HistorySessionService } from './history-session.service';

@Injectable()
export class HistoryEventBridgeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly historyService = inject(HistoryService);
  private readonly sessionService = inject(HistorySessionService);
  private readonly translateService = inject(TranslateService);

  private readonly reloadHistory = new Subject<void>();
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) {
      return;
    }

    this.reloadHistory
      .pipe(
        switchMap(() => this.historyService.loadHistory()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    window.addEventListener(SHELL_AUTH_TOKEN_EVENT, this.handleAuthToken);
    window.addEventListener(SHELL_LANGUAGE_CHANGE_EVENT, this.handleLanguageChange);
    window.addEventListener(HISTORY_UPDATED_EVENT, this.handleHistoryUpdated);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener(SHELL_AUTH_TOKEN_EVENT, this.handleAuthToken);
      window.removeEventListener(SHELL_LANGUAGE_CHANGE_EVENT, this.handleLanguageChange);
      window.removeEventListener(HISTORY_UPDATED_EVENT, this.handleHistoryUpdated);
    });

    this.isInitialized = true;

    this.requestLanguage();
    this.requestAuthToken();
  }

  private readonly handleAuthToken = (event: Event): void => {
    const { token } = (event as CustomEvent<IShellAuthTokenEventDetail>).detail;

    this.sessionService.setToken(token);
    this.reloadHistory.next();
  };

  private readonly handleHistoryUpdated = (): void => {
    if (!this.sessionService.getToken()) {
      return;
    }

    this.reloadHistory.next();
  };

  private readonly handleLanguageChange = (event: Event): void => {
    const { language } = (event as CustomEvent<IShellLanguageChangeEventDetail>).detail;

    this.translateService.use(language);
  };

  private requestLanguage(): void {
    window.dispatchEvent(new CustomEvent(MFE_LANGUAGE_REQUEST_EVENT));
  }

  private requestAuthToken(): void {
    window.dispatchEvent(new CustomEvent(HISTORY_AUTH_TOKEN_REQUEST_EVENT));
  }
}
