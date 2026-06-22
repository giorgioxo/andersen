import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { environment } from '../../../environments/environment';
import { TodoHistoryEventType } from '../core/todo-history-tracking.model';
import { TodoHistoryTrackingApiService } from './todo-history-tracking-api.service';

describe('TodoHistoryTrackingApiService', () => {
  let service: TodoHistoryTrackingApiService;
  let httpTestingController: HttpTestingController;

  const payload = {
    event: TodoHistoryEventType.CreateTodo,
    todo_id: 'todo-123',
    data: {
      name: 'Work',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoHistoryTrackingApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const getTrackRequest = () => {
    service.track('token-123', 'todo-123', payload).subscribe();

    return httpTestingController.expectOne(`${environment.todoApiBaseUrl}/history?id=todo-123`);
  };

  it('should send post request', () => {
    const request = getTrackRequest();

    expect(request.request.method).toBe('POST');

    request.flush({});
  });

  it('should send tracking payload', () => {
    const request = getTrackRequest();

    expect(request.request.body).toEqual(payload);

    request.flush({});
  });

  it('should send auth token header', () => {
    const request = getTrackRequest();

    expect(request.request.headers.get('T-Auth')).toBe('token-123');

    request.flush({});
  });

  it('should send todo id query param', () => {
    const request = getTrackRequest();

    expect(request.request.params.get('id')).toBe('todo-123');

    request.flush({});
  });
});
