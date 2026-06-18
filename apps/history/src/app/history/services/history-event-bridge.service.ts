import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HISTORY_AUTH_TOKEN_REQUEST_EVENT, SHELL_AUTH_TOKEN_EVENT } from '../core/history-events.constants';
import { IShellAuthTokenEventDetail } from '../core/history-events.model';
import { HistoryService } from './history.service';
import { HistorySessionService } from './history-session.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryEventBridgeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly historyService = inject(HistoryService);
  private readonly historySessionService = inject(HistorySessionService);

  private isInitialized = false;

  public init(): void {
    if (!this.isInitialized) {
      window.addEventListener(SHELL_AUTH_TOKEN_EVENT, this.handleAuthToken);
      this.isInitialized = true;
    }

    this.requestAuthToken();
  }

  private readonly handleAuthToken = (event: Event): void => {
    const { token } = (event as CustomEvent<IShellAuthTokenEventDetail>).detail;

    this.historySessionService.setToken(token);

    this.historyService.loadHistory().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  };

  private requestAuthToken(): void {
    window.dispatchEvent(new CustomEvent(HISTORY_AUTH_TOKEN_REQUEST_EVENT));
  }
}
