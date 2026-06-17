import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthSessionService } from './auth-session.service';

describe('AuthSessionService', () => {
  let service: AuthSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSessionService],
    });

    service = TestBed.inject(AuthSessionService);
  });

  it('should have null email by default', () => {
    expect(service.email()).toBeNull();
  });

  it('should have null token by default', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should not be authenticated by default', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should store email', () => {
    service.setSession({
      email: 'user@email.com',
      token: 'token-123',
    });

    expect(service.getEmail()).toBe('user@email.com');
  });

  it('should store token', () => {
    service.setSession({
      email: 'user@email.com',
      token: 'token-123',
    });

    expect(service.getToken()).toBe('token-123');
  });

  it('should be authenticated when token exists', () => {
    service.setSession({
      email: 'user@email.com',
      token: 'token-123',
    });

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear email', () => {
    service.setSession({
      email: 'user@email.com',
      token: 'token-123',
    });

    service.clearSession();

    expect(service.getEmail()).toBeNull();
  });

  it('should clear token', () => {
    service.setSession({
      email: 'user@email.com',
      token: 'token-123',
    });

    service.clearSession();

    expect(service.getToken()).toBeNull();
  });

  it('should not be authenticated after clear session', () => {
    service.setSession({
      email: 'user@email.com',
      token: 'token-123',
    });

    service.clearSession();

    expect(service.isAuthenticated()).toBe(false);
  });
});
