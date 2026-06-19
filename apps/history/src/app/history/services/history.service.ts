import { Injectable, inject, signal } from '@angular/core';
import { NotificationService } from '@andersen/shared-ui';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable, catchError, finalize, tap } from 'rxjs';

import { INITIAL_HISTORY_QUERY } from '../core/history.constants';
import { mapHistoryApiEvent } from '../core/history.mapper';
import { IHistoryApiEvent, IHistoryEvent, IHistoryQuery } from '../core/history.model';
import { HistoryApiService } from './history-api.service';
import { HistorySessionService } from './history-session.service';

@Injectable()
export class HistoryService {
  private readonly historyApiService = inject(HistoryApiService);
  private readonly historySessionService = inject(HistorySessionService);
  private readonly notificationService = inject(NotificationService);
  private readonly translateService = inject(TranslateService);

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

  public loadHistory(): Observable<IHistoryApiEvent[]> {
    const token = this.historySessionService.getToken();

    if (!token) {
      this.notificationService.error(this.translate('history.notifications.tokenMissing'));
      return EMPTY;
    }

    this.loading.set(true);

    return this.historyApiService.getHistory(token, this.query()).pipe(
      tap((events) => {
        const historyEvents = events.map(mapHistoryApiEvent);

        this.historyItems.set(historyEvents);
        this.totalItems.set(this.getEstimatedTotal(historyEvents.length));
      }),
      catchError(() => {
        this.notificationService.error(this.translate('history.notifications.loadFailed'));
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  private getEstimatedTotal(currentPageItemsCount: number): number {
    const { page, limit } = this.query();
    const loadedItemsCount = (page - 1) * limit + currentPageItemsCount;

    return currentPageItemsCount === limit ? loadedItemsCount + 1 : loadedItemsCount;
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
