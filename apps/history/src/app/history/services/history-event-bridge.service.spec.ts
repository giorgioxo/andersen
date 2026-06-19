import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HISTORY_AUTH_TOKEN_REQUEST_EVENT, SHELL_AUTH_TOKEN_EVENT } from '../core/history-events.constants';
import { HistoryEventBridgeService } from './history-event-bridge.service';
import { HistoryService } from './history.service';
import { HistorySessionService } from './history-session.service';

describe('HistoryEventBridgeService', () => {
  let service: HistoryEventBridgeService;

  const historyServiceMock = {
    loadHistory: vi.fn(),
  };

  const historySessionServiceMock = {
    setToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    historyServiceMock.loadHistory.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        HistoryEventBridgeService,
        { provide: HistoryService, useValue: historyServiceMock },
        { provide: HistorySessionService, useValue: historySessionServiceMock },
      ],
    });

    service = TestBed.inject(HistoryEventBridgeService);
  });

  it('should request auth token on init', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    service.init();

    expect(dispatchEventSpy).toHaveBeenCalledWith(new CustomEvent(HISTORY_AUTH_TOKEN_REQUEST_EVENT));
  });

  it('should store token when shell auth token event is received', () => {
    service.init();

    window.dispatchEvent(new CustomEvent(SHELL_AUTH_TOKEN_EVENT, { detail: { token: 'token-123' } }));

    expect(historySessionServiceMock.setToken).toHaveBeenCalledWith('token-123');
  });

  it('should load history when shell auth token event is received', () => {
    service.init();

    window.dispatchEvent(new CustomEvent(SHELL_AUTH_TOKEN_EVENT, { detail: { token: 'token-123' } }));

    expect(historyServiceMock.loadHistory).toHaveBeenCalled();
  });
});
