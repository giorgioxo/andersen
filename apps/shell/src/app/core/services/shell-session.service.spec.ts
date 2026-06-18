import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ShellSessionService } from './shell-session.service';

describe('ShellSessionService', () => {
  let service: ShellSessionService;

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [ShellSessionService],
    });

    service = TestBed.inject(ShellSessionService);
  });

  const setToken = (): void => {
    service.setToken('token-123');
  };

  it('should have null token by default', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should not be authenticated by default', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should store token in service state', () => {
    setToken();

    expect(service.getToken()).toBe('token-123');
  });

  it('should store token in session storage', () => {
    setToken();

    expect(sessionStorage.getItem('shell-auth-token')).toBe('token-123');
  });

  it('should restore token from session storage', () => {
    sessionStorage.setItem('shell-auth-token', 'token-123');

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [ShellSessionService],
    });

    service = TestBed.inject(ShellSessionService);

    expect(service.getToken()).toBe('token-123');
  });

  it('should be authenticated when token exists', () => {
    setToken();

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear token from service state', () => {
    setToken();

    service.clearToken();

    expect(service.getToken()).toBeNull();
  });

  it('should clear token from session storage', () => {
    setToken();

    service.clearToken();

    expect(sessionStorage.getItem('shell-auth-token')).toBeNull();
  });

  it('should not be authenticated after token is cleared', () => {
    setToken();

    service.clearToken();

    expect(service.isAuthenticated()).toBe(false);
  });
});