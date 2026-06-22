import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TodoSessionService } from './todo-session.service';

describe('TodoSessionService', () => {
  let service: TodoSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoSessionService],
    });

    service = TestBed.inject(TodoSessionService);
  });

  it('should have empty token by default', () => {
    expect(service.currentToken()).toBeNull();
  });

  it('should set token', () => {
    service.setToken('token-123');

    expect(service.currentToken()).toBe('token-123');
  });

  it('should return current token', () => {
    service.setToken('token-123');

    expect(service.getToken()).toBe('token-123');
  });

  it('should clear token', () => {
    service.setToken('token-123');

    service.clearToken();

    expect(service.currentToken()).toBeNull();
  });
});
