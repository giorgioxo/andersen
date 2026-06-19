import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ITodoHistoryTrackingPayload, ITodoHistoryTrackingResponse } from '../core/todo-history-tracking.model';

const BASE_API_URL = environment.todoApiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class TodoHistoryTrackingApiService {
  private readonly http = inject(HttpClient);

  public track(token: string, todoId: string, payload: ITodoHistoryTrackingPayload): Observable<ITodoHistoryTrackingResponse> {
    return this.http.post<ITodoHistoryTrackingResponse>(`${BASE_API_URL}/history`, payload, {
      headers: {
        'T-Auth': token,
      },
      params: {
        id: todoId,
      },
    });
  }
}
