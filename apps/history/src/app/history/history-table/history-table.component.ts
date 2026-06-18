import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, input, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { HISTORY_EVENT_LABELS, HISTORY_EVENT_TYPES } from '../core/history.constants';
import { HistoryEventType, IHistoryEvent } from '../core/history.model';

@Component({
  selector: 'app-history-table',
  imports: [DatePipe, FormsModule, MatFormFieldModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTableComponent implements OnInit, AfterViewInit {
  private readonly paginator = viewChild.required(MatPaginator);
  private readonly sort = viewChild.required(MatSort);
  private readonly tableContent = viewChild.required<ElementRef<HTMLElement>>('tableContent');

  public readonly events = input.required<IHistoryEvent[]>();

  protected readonly eventTypes = HISTORY_EVENT_TYPES;
  protected readonly eventLabels = HISTORY_EVENT_LABELS;
  protected readonly displayedColumns = ['index', 'eventName', 'createdAt', 'additionalInfo'];
  protected readonly dataSource = new MatTableDataSource<IHistoryEvent>();

  protected selectedEventTypes: HistoryEventType[] = [...HISTORY_EVENT_TYPES];

  ngOnInit(): void {
    this.dataSource.filterPredicate = (event) => this.selectedEventTypes.includes(event.type);
    this.dataSource.data = this.events();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  protected applyEventTypeFilter(): void {
    this.dataSource.filter = String(Date.now());
    this.dataSource.paginator?.firstPage();
    this.onPageChange();
  }

  protected getRowIndex(rowIndex: number): number {
    const paginator = this.dataSource.paginator;

    if (!paginator) {
      return rowIndex + 1;
    }

    return paginator.pageIndex * paginator.pageSize + rowIndex + 1;
  }

  protected getEventLabel(event: IHistoryEvent): string {
    return this.eventLabels[event.type];
  }

  protected onPageChange(): void {
    this.tableContent().nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
