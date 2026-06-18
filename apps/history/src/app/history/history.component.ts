import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HistoryTableComponent } from './history-table/history-table.component';
import { IHistoryQuery } from './core/history.model';
import { HistoryEventBridgeService } from './services/history-event-bridge.service';
import { HistoryService } from './services/history.service';

@Component({
  selector: 'app-history',
  imports: [HistoryTableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly historyService = inject(HistoryService);
  private readonly historyEventBridgeService = inject(HistoryEventBridgeService);

  protected readonly historyEvents = this.historyService.historyEvents;
  protected readonly historyTotal = this.historyService.historyTotal;
  protected readonly historyQuery = this.historyService.historyQuery;
  protected readonly isLoading = this.historyService.isLoading;

  ngOnInit(): void {
    this.historyEventBridgeService.init();
  }

  protected onQueryChange(query: IHistoryQuery): void {
    this.historyService.updateQuery(query);

    this.historyService.loadHistory().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
