import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { HistoryEventType } from '../core/history.model';
import { HistoryApiService } from './history-api.service';

describe('HistoryApiService', () => {
  let service: HistoryApiService;
  let httpTestingController: HttpTestingController;

  const token = 'token-123';
  const historyUrl = `${environment.historyApiBaseUrl}/history`;

  const query = {
    limit: 20,
    page: 1,
    event: [HistoryEventType.CreateTodo, HistoryEventType.DeleteTask],
    sort: 'desc' as const,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HistoryApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const expectHistoryRequest = () => {
    service.getHistory(token, query).subscribe();

    return httpTestingController.expectOne((request) => request.url === historyUrl);
  };

  it('should send history request with get method', () => {
    const request = expectHistoryRequest();

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });

  it('should send history request with auth token header', () => {
    const request = expectHistoryRequest();

    expect(request.request.headers.get('T-Auth')).toBe(token);

    request.flush([]);
  });

  it('should send history request with limit query param', () => {
    const request = expectHistoryRequest();

    expect(request.request.params.get('limit')).toBe('20');

    request.flush([]);
  });

  it('should send history request with joined event query param', () => {
    const request = expectHistoryRequest();

    expect(request.request.params.get('event')).toBe('CREATE_TODO,DELETE_TASK');

    request.flush([]);
  });

  it('should send history request with uppercase sort query param', () => {
    const request = expectHistoryRequest();

    expect(request.request.params.get('sort')).toBe('DESC');

    request.flush([]);
  });
});
