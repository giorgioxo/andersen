import { inject, Injectable, signal } from '@angular/core';
import { NotificationService } from '@andersen/shared-ui';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';

import { INITIAL_HISTORY_QUERY } from '../core/history.constants';
import { IHistoryEvent, IHistoryQuery, IHistoryResponse } from '../core/history.model';
import { HistoryApiService } from './history-api.service';
import { HistorySessionService } from './history-session.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly historyApiService = inject(HistoryApiService);
  private readonly historySessionService = inject(HistorySessionService);
  private readonly notificationService = inject(NotificationService);

  private readonly historyItems = signal<IHistoryEvent[]>([]);
  private readonly totalItems = signal(0);
  private readonly loading = signal(false);
  private readonly query = signal<IHistoryQuery>(INITIAL_HISTORY_QUERY);

  public readonly historyEvents = this.historyItems.asReadonly();
  public readonly historyTotal = this.totalItems.asReadonly();
  public readonly isLoading = this.loading.asReadonly();
  public readonly historyQuery = this.query.asReadonly();

  public updateQuery(query: IHistoryQuery): void {
    this.query.set(query);
  }

  public loadHistory(): Observable<IHistoryResponse> {
    const token = this.historySessionService.getToken();

    if (!token) {
      this.notificationService.error('Authentication token is missing');
      return EMPTY;
    }

    this.loading.set(true);

    return this.historyApiService.getHistory(token, this.query()).pipe(
      tap(({ items, total }) => {
        this.historyItems.set(items);
        this.totalItems.set(total);
      }),
      catchError(() => {
        this.notificationService.error('Failed to load history');

        return EMPTY;
      }),
      finalize(() => {
        this.loading.set(false);
      }),
    );
  }
}
