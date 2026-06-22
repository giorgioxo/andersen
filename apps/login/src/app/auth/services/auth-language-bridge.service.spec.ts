import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MFE_LANGUAGE_REQUEST_EVENT, SHELL_LANGUAGE_CHANGE_EVENT } from '../core/auth-events.constants';
import { AuthLanguageBridgeService } from './auth-language-bridge.service';

describe('AuthLanguageBridgeService', () => {
  let service: AuthLanguageBridgeService;

  const translateServiceMock = {
    use: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthLanguageBridgeService,
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(AuthLanguageBridgeService);
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

  it('should use shell language when language change event is received', () => {
    service.init();

    window.dispatchEvent(
      new CustomEvent(SHELL_LANGUAGE_CHANGE_EVENT, {
        detail: {
          language: 'ka',
        },
      }),
    );

    expect(translateServiceMock.use).toHaveBeenCalledWith('ka');
  });
});
