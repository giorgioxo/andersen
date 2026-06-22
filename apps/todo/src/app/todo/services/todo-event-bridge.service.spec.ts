import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MFE_LANGUAGE_REQUEST_EVENT,
  SHELL_AUTH_TOKEN_EVENT,
  SHELL_LANGUAGE_CHANGE_EVENT,
  TODO_AUTH_TOKEN_REQUEST_EVENT,
  TODO_LOGOUT_EVENT,
} from '../core/todo-events.constants';
import { TodoEventBridgeService } from './todo-event-bridge.service';
import { TodoService } from './todo.service';
import { TodoSessionService } from './todo-session.service';

describe('TodoEventBridgeService', () => {
  let service: TodoEventBridgeService;
  let eventListeners: Array<{
    type: string;
    listener: EventListenerOrEventListenerObject;
  }>;

  const todoServiceMock = {
    loadTodos: vi.fn(),
  };

  const todoSessionServiceMock = {
    setToken: vi.fn(),
    clearToken: vi.fn(),
  };

  const translateServiceMock = {
    use: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    eventListeners = [];
    todoServiceMock.loadTodos.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        TodoEventBridgeService,
        {
          provide: TodoService,
          useValue: todoServiceMock,
        },
        {
          provide: TodoSessionService,
          useValue: todoSessionServiceMock,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(TodoEventBridgeService);

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

  it('should request language on init', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    service.init();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MFE_LANGUAGE_REQUEST_EVENT,
      }),
    );
  });

  it('should request auth token on init', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    service.init();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TODO_AUTH_TOKEN_REQUEST_EVENT,
      }),
    );
  });

  it('should store token when shell auth token event is received', () => {
    service.init();

    dispatchCapturedEvent(
      SHELL_AUTH_TOKEN_EVENT,
      new CustomEvent(SHELL_AUTH_TOKEN_EVENT, {
        detail: {
          token: 'token-123',
        },
      }),
    );

    expect(todoSessionServiceMock.setToken).toHaveBeenCalledWith('token-123');
  });

  it('should load todos when shell auth token event is received', () => {
    service.init();

    dispatchCapturedEvent(
      SHELL_AUTH_TOKEN_EVENT,
      new CustomEvent(SHELL_AUTH_TOKEN_EVENT, {
        detail: {
          token: 'token-123',
        },
      }),
    );

    expect(todoServiceMock.loadTodos).toHaveBeenCalled();
  });

  it('should use shell language when language change event is received', () => {
    service.init();

    dispatchCapturedEvent(
      SHELL_LANGUAGE_CHANGE_EVENT,
      new CustomEvent(SHELL_LANGUAGE_CHANGE_EVENT, {
        detail: {
          language: 'ka',
        },
      }),
    );

    expect(translateServiceMock.use).toHaveBeenCalledWith('ka');
  });

  it('should clear token on logout', () => {
    service.dispatchLogout();

    expect(todoSessionServiceMock.clearToken).toHaveBeenCalled();
  });

  it('should dispatch logout event', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    service.dispatchLogout();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TODO_LOGOUT_EVENT,
      }),
    );
  });
});
