import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MFE_AUTH_LOGIN_SUCCESS_EVENT,
  MFE_AUTH_LOGOUT_EVENT,
  SHELL_AUTH_TOKEN_EVENT,
  TODO_AUTH_TOKEN_REQUEST_EVENT,
} from '../constants/mfe-events.constants';
import { IAuthLoginSuccessEventDetail } from '../models/mfe-events.model';
import { MfeEventBridgeService } from './mfe-event-bridge.service';
import { ShellSessionService } from './shell-session.service';

describe('MfeEventBridgeService', () => {
  let service: MfeEventBridgeService;
  let eventListeners: Array<{
    type: string;
    listener: EventListenerOrEventListenerObject;
  }>;

  const routerMock = {
    navigate: vi.fn(),
  };

  const shellSessionServiceMock = {
    setToken: vi.fn(),
    getToken: vi.fn(),
    clearToken: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    eventListeners = [];
    routerMock.navigate.mockResolvedValue(true);
    shellSessionServiceMock.getToken.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        MfeEventBridgeService,
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ShellSessionService,
          useValue: shellSessionServiceMock,
        },
      ],
    });

    service = TestBed.inject(MfeEventBridgeService);

    vi.spyOn(window, 'addEventListener').mockImplementation((type, listener) => {
      eventListeners.push({
        type,
        listener,
      });
    });
  });

  const dispatchCapturedEvent = (type: string, event: Event): void => {
    const eventListener = eventListeners.find((item) => item.type === type)?.listener as EventListener;

    eventListener(event);
  };

  const initAndDispatchLoginSuccess = (): void => {
    service.init();

    dispatchCapturedEvent(
      MFE_AUTH_LOGIN_SUCCESS_EVENT,
      new CustomEvent<IAuthLoginSuccessEventDetail>(MFE_AUTH_LOGIN_SUCCESS_EVENT, {
        detail: {
          email: 'user@email.com',
          token: 'token-123',
        },
      }),
    );
  };

  it('should save token after login success event', () => {
    initAndDispatchLoginSuccess();

    expect(shellSessionServiceMock.setToken).toHaveBeenCalledWith('token-123');
  });

  it('should navigate to dashboard after login success event', () => {
    initAndDispatchLoginSuccess();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should clear token after logout event', () => {
    service.init();

    dispatchCapturedEvent(MFE_AUTH_LOGOUT_EVENT, new CustomEvent(MFE_AUTH_LOGOUT_EVENT));

    expect(shellSessionServiceMock.clearToken).toHaveBeenCalled();
  });

  it('should navigate to sign in after logout event', () => {
    service.init();

    dispatchCapturedEvent(MFE_AUTH_LOGOUT_EVENT, new CustomEvent(MFE_AUTH_LOGOUT_EVENT));

    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('should dispatch auth token when todo requests token', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    shellSessionServiceMock.getToken.mockReturnValue('token-123');
    service.init();

    dispatchCapturedEvent(TODO_AUTH_TOKEN_REQUEST_EVENT, new CustomEvent(TODO_AUTH_TOKEN_REQUEST_EVENT));

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SHELL_AUTH_TOKEN_EVENT,
      }),
    );
  });

  it('should not dispatch auth token when token is missing', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    service.init();

    dispatchCapturedEvent(TODO_AUTH_TOKEN_REQUEST_EVENT, new CustomEvent(TODO_AUTH_TOKEN_REQUEST_EVENT));

    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });
});