import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HistoryPaginatorIntlService extends MatPaginatorIntl {
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    super();

    this.updateLabels();

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateLabels();
        this.changes.next();
      });
  }

  public override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ): string => {
    const isEmpty = length === 0 || pageSize === 0;
    const start = isEmpty ? 0 : page * pageSize + 1;
    const end = isEmpty
      ? 0
      : Math.min(start + pageSize - 1, length);

    return this.translate('history.paginator.range', {
      start,
      end,
      total: length,
    });
  };

  private updateLabels(): void {
    this.itemsPerPageLabel = this.translate(
      'history.paginator.itemsPerPage',
    );
    this.nextPageLabel = this.translate(
      'history.paginator.nextPage',
    );
    this.previousPageLabel = this.translate(
      'history.paginator.previousPage',
    );
    this.firstPageLabel = this.translate(
      'history.paginator.firstPage',
    );
    this.lastPageLabel = this.translate(
      'history.paginator.lastPage',
    );
  }

  private translate(
    key: string,
    params?: Record<string, number>,
  ): string {
    return String(this.translateService.instant(key, params));
  }
}