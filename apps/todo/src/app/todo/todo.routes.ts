import { Route } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { TodoEventBridgeService } from './services/todo-event-bridge.service';
import { TodoService } from './services/todo.service';

export const todoRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: '/i18n/todo/',
          suffix: '.json',
        }),
      }),
      TodoEventBridgeService,
      TodoService,
    ],
    loadComponent: () => import('./todo.component').then((m) => m.TodoComponent),
  },
];
