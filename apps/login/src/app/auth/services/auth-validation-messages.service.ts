import { Injectable, Signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AUTH_VALIDATION_TRANSLATION_KEY, AuthValidationMessages } from '../core/auth.constants';

const DEFAULT_AUTH_VALIDATION_MESSAGES: AuthValidationMessages = {
  required: '',
  email: '',
  minlength: '',
  pattern: '',
  passwordPolicy: '',
  passwordMismatch: '',
  invalid: '',
};

function normalizeValidationMessages(messages: unknown): AuthValidationMessages {
  if (!messages || typeof messages !== 'object') {
    return DEFAULT_AUTH_VALIDATION_MESSAGES;
  }

  return {
    ...DEFAULT_AUTH_VALIDATION_MESSAGES,
    ...(messages as Partial<AuthValidationMessages>),
  };
}

@Injectable()
export class AuthValidationMessagesService {
  private readonly translateService = inject(TranslateService);

  public readonly messages: Signal<AuthValidationMessages> = toSignal(
    this.translateService.stream(AUTH_VALIDATION_TRANSLATION_KEY).pipe(map(normalizeValidationMessages)),
    {
      initialValue: DEFAULT_AUTH_VALIDATION_MESSAGES,
    },
  );
}
