import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@andersen/shared-ui';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { INITIAL_HISTORY_QUERY } from '../core/history.constants';
import { HistoryEventType } from '../core/history.model';
import { HistoryApiService } from './history-api.service';
import { HistoryService } from './history.service';
import { HistorySessionService } from './history-session.service';

describe('HistoryService', () => {
  let service: HistoryService;

  const historyApiEvent = {
    todo_id: 'todo-123',
    event: HistoryEventType.CreateTodo,
    data: {
      name: 'Work',
    },
    date: '2026-06-18T10:00:00.000Z',
  };

  const historyApiServiceMock = {
    getHistory: vi.fn(),
  };

  const historySessionServiceMock = {
    getToken: vi.fn(),
  };

  const notificationServiceMock = {
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    historySessionServiceMock.getToken.mockReturnValue('token-123');
    historyApiServiceMock.getHistory.mockReturnValue(of([historyApiEvent]));

    TestBed.configureTestingModule({
      providers: [
        HistoryService,
        { provide: HistoryApiService, useValue: historyApiServiceMock },
        { provide: HistorySessionService, useValue: historySessionServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    });

    service = TestBed.inject(HistoryService);
  });

  it('should update query', () => {
    service.updateQuery(INITIAL_HISTORY_QUERY);

    expect(service.historyQuery()).toEqual(INITIAL_HISTORY_QUERY);
  });

  it('should call history api with current query', () => {
    service.loadHistory().subscribe();

    expect(historyApiServiceMock.getHistory).toHaveBeenCalledWith('token-123', INITIAL_HISTORY_QUERY);
  });

  it('should map history events after load', () => {
    service.loadHistory().subscribe();

    expect(service.historyEvents()[0]).toEqual(expect.objectContaining({ additionalInfo: 'name: Work' }));
  });

  it('should estimate total items after load', () => {
    service.loadHistory().subscribe();

    expect(service.historyTotal()).toBe(1);
  });

  it('should show error when token is missing', () => {
    historySessionServiceMock.getToken.mockReturnValue(null);

    service.loadHistory().subscribe();

    expect(notificationServiceMock.error).toHaveBeenCalledWith('Authentication token is missing');
  });
});
