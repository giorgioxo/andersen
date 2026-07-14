import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthSessionService } from './auth-session.service';

const EMAIL = 'user@email.com';
const TOKEN = 'token-123';

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
    service.setEmail(EMAIL);

    expect(service.getEmail()).toBe(EMAIL);
  });

  it('should expose email signal after storing email', () => {
    service.setEmail(EMAIL);

    expect(service.email()).toBe(EMAIL);
  });

  it('should store token', () => {
    service.setToken(TOKEN);

    expect(service.getToken()).toBe(TOKEN);
  });

  it('should be authenticated when token exists', () => {
    service.setToken(TOKEN);

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear email', () => {
    service.setEmail(EMAIL);
    service.setToken(TOKEN);

    service.clearSession();

    expect(service.getEmail()).toBeNull();
  });

  it('should clear token', () => {
    service.setEmail(EMAIL);
    service.setToken(TOKEN);

    service.clearSession();

    expect(service.getToken()).toBeNull();
  });

  it('should not be authenticated after clear session', () => {
    service.setToken(TOKEN);

    service.clearSession();

    expect(service.isAuthenticated()).toBe(false);
  });
});
