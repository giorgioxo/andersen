import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { HistorySessionService } from './history-session.service';

describe('HistorySessionService', () => {
  let service: HistorySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistorySessionService],
    });

    service = TestBed.inject(HistorySessionService);
  });

  it('should have null token by default', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should store token', () => {
    service.setToken('token-123');

    expect(service.getToken()).toBe('token-123');
  });

  it('should clear token', () => {
    service.setToken('token-123');

    service.clearToken();

    expect(service.getToken()).toBeNull();
  });
});
