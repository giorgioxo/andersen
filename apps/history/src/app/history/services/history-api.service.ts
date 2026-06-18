import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IHistoryQuery, IHistoryResponse } from '../core/history.model';

const BASE_API_URL = environment.historyApiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class HistoryApiService {
  private readonly http = inject(HttpClient);

  public getHistory(token: string, query: IHistoryQuery): Observable<IHistoryResponse> {
    return this.http.get<IHistoryResponse>(`${BASE_API_URL}/history`, {
      headers: {
        'T-Auth': token,
      },
      params: {
        limit: query.limit,
        page: query.page,
        event: query.event.join(','),
        sort: query.sort.toUpperCase(),
      },
    });
  }
}
