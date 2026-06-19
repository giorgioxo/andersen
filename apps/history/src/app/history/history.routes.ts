import { MatPaginatorIntl } from '@angular/material/paginator';
import { Route } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { HistoryEventBridgeService } from './services/history-event-bridge.service';
import { HistoryPaginatorIntlService } from './services/history-paginator-intl.service';
import { HistoryService } from './services/history.service';

export const historyRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: '/i18n/history/',
          suffix: '.json',
        }),
      }),
      {
        provide: MatPaginatorIntl,
        useClass: HistoryPaginatorIntlService,
      },
      HistoryEventBridgeService,
      HistoryService,
    ],
    loadComponent: () => import('./history.component').then((m) => m.HistoryComponent),
  },
];
