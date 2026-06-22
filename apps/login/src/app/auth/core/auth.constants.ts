export const AUTH_VALIDATION_TRANSLATION_KEY = 'login.validation';

export const AUTH_VALIDATION_ERROR_KEYS = {
  required: 'required',
  email: 'email',
  minlength: 'minlength',
  pattern: 'pattern',
  passwordPolicy: 'passwordPolicy',
  passwordMismatch: 'passwordMismatch',
  invalid: 'invalid',
} as const;

export type AuthValidationErrorKey = keyof typeof AUTH_VALIDATION_ERROR_KEYS;

export type AuthValidationMessages = Record<AuthValidationErrorKey, string>;
