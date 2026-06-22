import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  HISTORY_AUTH_TOKEN_REQUEST_EVENT,
  HISTORY_UPDATED_EVENT,
  MFE_LANGUAGE_REQUEST_EVENT,
  SHELL_AUTH_TOKEN_EVENT,
  SHELL_LANGUAGE_CHANGE_EVENT,
} from '../core/history-events.constants';
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
    getToken: vi.fn(),
  };

  const translateServiceMock = {
    use: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    historyServiceMock.loadHistory.mockReturnValue(of([]));
    historySessionServiceMock.getToken.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        HistoryEventBridgeService,
        {
          provide: HistoryService,
          useValue: historyServiceMock,
        },
        {
          provide: HistorySessionService,
          useValue: historySessionServiceMock,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(HistoryEventBridgeService);
  });

  it('should request language on init', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    service.init();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MFE_LANGUAGE_REQUEST_EVENT,
      }),
    );
  });

  it('should request auth token on init', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    service.init();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: HISTORY_AUTH_TOKEN_REQUEST_EVENT,
      }),
    );
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

  it('should change language when shell language event is received', () => {
    service.init();

    window.dispatchEvent(new CustomEvent(SHELL_LANGUAGE_CHANGE_EVENT, { detail: { language: 'ka' } }));

    expect(translateServiceMock.use).toHaveBeenCalledWith('ka');
  });

  it('should load history when history updated event is received and token exists', () => {
    historySessionServiceMock.getToken.mockReturnValue('token-123');
    service.init();

    window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT));

    expect(historyServiceMock.loadHistory).toHaveBeenCalled();
  });

  it('should not load history when history updated event is received and token is missing', () => {
    service.init();

    window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT));

    expect(historyServiceMock.loadHistory).not.toHaveBeenCalled();
  });
});
