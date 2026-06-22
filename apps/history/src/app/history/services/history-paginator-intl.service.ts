import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

import { HISTORY_PAGINATOR_TRANSLATION_KEYS } from '../core/history.constants';

@Injectable()
export class HistoryPaginatorIntlService extends MatPaginatorIntl {
  private readonly translateService = inject(TranslateService);

  constructor() {
    super();

    this.updateLabels();

    this.translateService.onLangChange.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateLabels();
      this.changes.next();
    });
  }

  public override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const isEmpty = length === 0 || pageSize === 0;
    const start = isEmpty ? 0 : page * pageSize + 1;
    const end = isEmpty ? 0 : Math.min(start + pageSize - 1, length);

    return this.translate(HISTORY_PAGINATOR_TRANSLATION_KEYS.range, {
      start,
      end,
      total: length,
    });
  };

  private updateLabels(): void {
    this.itemsPerPageLabel = this.translate(HISTORY_PAGINATOR_TRANSLATION_KEYS.itemsPerPage);
    this.nextPageLabel = this.translate(HISTORY_PAGINATOR_TRANSLATION_KEYS.nextPage);
    this.previousPageLabel = this.translate(HISTORY_PAGINATOR_TRANSLATION_KEYS.previousPage);
    this.firstPageLabel = this.translate(HISTORY_PAGINATOR_TRANSLATION_KEYS.firstPage);
    this.lastPageLabel = this.translate(HISTORY_PAGINATOR_TRANSLATION_KEYS.lastPage);
  }

  private translate(key: string, params?: Record<string, number>): string {
    return String(this.translateService.instant(key, params));
  }
}
