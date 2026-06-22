import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_VALIDATION_TRANSLATION_KEY, AuthValidationMessages } from '../core/auth.constants';
import { AuthValidationMessagesService } from './auth-validation-messages.service';

describe('AuthValidationMessagesService', () => {
  let service: AuthValidationMessagesService;
  let validationMessages$: Subject<unknown>;

  const defaultValidationMessages: AuthValidationMessages = {
    required: '',
    email: '',
    minlength: '',
    pattern: '',
    passwordPolicy: '',
    passwordMismatch: '',
    invalid: '',
  };

  const translateServiceMock = {
    stream: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    validationMessages$ = new Subject<unknown>();
    translateServiceMock.stream.mockReturnValue(validationMessages$);

    TestBed.configureTestingModule({
      providers: [
        AuthValidationMessagesService,
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(AuthValidationMessagesService);
  });

  it('should listen to auth validation translation key', () => {
    expect(translateServiceMock.stream).toHaveBeenCalledWith(AUTH_VALIDATION_TRANSLATION_KEY);
  });

  it('should have default validation messages initially', () => {
    expect(service.messages()).toEqual(defaultValidationMessages);
  });

  it('should normalize translated validation messages', () => {
    validationMessages$.next({
      required: 'Required',
    });

    expect(service.messages()).toEqual({
      ...defaultValidationMessages,
      required: 'Required',
    });
  });

  it('should fallback to default validation messages when translation value is invalid', () => {
    validationMessages$.next(null);

    expect(service.messages()).toEqual(defaultValidationMessages);
  });
});
