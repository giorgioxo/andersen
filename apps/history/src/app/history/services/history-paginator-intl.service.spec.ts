import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HISTORY_PAGINATOR_TRANSLATION_KEYS } from '../core/history.constants';
import { HistoryPaginatorIntlService } from './history-paginator-intl.service';

describe('HistoryPaginatorIntlService', () => {
  let service: HistoryPaginatorIntlService;
  let nextPageTranslation: string;
  let languageChange: Subject<void>;

  beforeEach(() => {
    nextPageTranslation = 'Next page';
    languageChange = new Subject<void>();

    TestBed.configureTestingModule({
      providers: [
        HistoryPaginatorIntlService,
        {
          provide: TranslateService,
          useValue: {
            onLangChange: languageChange,
            instant: vi.fn((key: string, params?: Record<string, number>): string => {
              if (key === HISTORY_PAGINATOR_TRANSLATION_KEYS.nextPage) {
                return nextPageTranslation;
              }

              if (key === HISTORY_PAGINATOR_TRANSLATION_KEYS.range) {
                return `${params?.['start']}-${params?.['end']} of ${params?.['total']}`;
              }

              return key;
            }),
          },
        },
      ],
    });

    service = TestBed.inject(HistoryPaginatorIntlService);
  });

  it('should calculate translated range label', () => {
    expect(service.getRangeLabel(1, 20, 45)).toBe('21-40 of 45');
  });

  it('should update labels when language changes', () => {
    const changesSpy = vi.spyOn(service.changes, 'next');

    nextPageTranslation = 'შემდეგი გვერდი';
    languageChange.next();

    expect(service.nextPageLabel).toBe('შემდეგი გვერდი');

    expect(changesSpy).toHaveBeenCalled();
  });
});
