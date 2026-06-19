import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UiSpinnerComponent } from '@andersen/shared-ui';

import { DEFAULT_HISTORY_SORT_DIRECTION, HISTORY_EVENT_OPTIONS, HISTORY_EVENT_TYPES } from '../core/history.constants';
import { HistoryEventType, IHistoryEvent, IHistoryQuery } from '../core/history.model';

@Component({
  selector: 'app-history-table',
  imports: [
    DatePipe,
    FormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    UiSpinnerComponent,
  ],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTableComponent implements OnInit {
  private readonly tableContent = viewChild.required<ElementRef<HTMLElement>>('tableContent');

  public readonly events = input.required<IHistoryEvent[]>();
  public readonly totalItems = input.required<number>();
  public readonly query = input.required<IHistoryQuery>();
  public readonly isLoading = input(false);

  public readonly queryChange = output<IHistoryQuery>();

  protected readonly eventTypes = HISTORY_EVENT_TYPES;
  protected readonly eventOptions = HISTORY_EVENT_OPTIONS;
  protected readonly displayedColumns = ['index', 'eventName', 'createdAt', 'additionalInfo'];

  protected selectedEventTypes: HistoryEventType[] = [];

  ngOnInit(): void {
    this.selectedEventTypes = [...this.query().event];
  }

  protected applyEventTypeFilter(): void {
    if (this.isLoading()) {
      return;
    }

    this.queryChange.emit({
      ...this.query(),
      page: 1,
      event: this.selectedEventTypes,
    });

    this.scrollToTableTop();
  }

  protected onPageChange(event: PageEvent): void {
    if (this.isLoading()) {
      return;
    }

    this.queryChange.emit({
      ...this.query(),
      page: event.pageIndex + 1,
      limit: event.pageSize,
    });

    this.scrollToTableTop();
  }

  protected onSortChange(event: Sort): void {
    if (this.isLoading()) {
      return;
    }

    this.queryChange.emit({
      ...this.query(),
      page: 1,
      sort: event.direction || DEFAULT_HISTORY_SORT_DIRECTION,
    });

    this.scrollToTableTop();
  }

  protected getRowIndex(rowIndex: number): number {
    return (this.query().page - 1) * this.query().limit + rowIndex + 1;
  }

  protected getEventLabel(event: IHistoryEvent): string {
    return this.eventOptions.find(({ value }) => value === event.type)?.label ?? event.type;
  }

  private scrollToTableTop(): void {
    this.tableContent().nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
