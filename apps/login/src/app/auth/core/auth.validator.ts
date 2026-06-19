import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { AUTH_VALIDATION_ERROR_KEYS } from './auth.constants';

export const USERNAME_VALIDATORS: ValidatorFn[] = [Validators.required, Validators.minLength(8), Validators.pattern(/^[A-Za-z0-9]+$/)];

export const EMAIL_VALIDATORS: ValidatorFn[] = [Validators.required, Validators.email];

export const PASSWORD_VALIDATORS: ValidatorFn[] = [Validators.required, passwordPolicyValidator];

export const SIGN_IN_PASSWORD_VALIDATORS: ValidatorFn[] = [Validators.required, Validators.minLength(8)];

export const REPEAT_PASSWORD_VALIDATORS: ValidatorFn[] = [Validators.required];

export function passwordPolicyValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');

  if (!value) {
    return null;
  }

  const hasMinimumLength = value.length >= 8;
  const uppercaseLettersCount = (value.match(/[A-Z]/g) ?? []).length;
  const hasEnoughUppercaseLetters = uppercaseLettersCount >= 2;
  const hasNumber = /\d/.test(value);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value);

  const isPasswordValid = hasMinimumLength && hasEnoughUppercaseLetters && hasNumber && hasSpecialCharacter;

  return isPasswordValid ? null : { [AUTH_VALIDATION_ERROR_KEYS.passwordPolicy]: true };
}

export function passwordsMatchValidator(passwordControlName: string, repeatPasswordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName)?.value;
    const repeatPassword = control.get(repeatPasswordControlName)?.value;

    if (!password || !repeatPassword) {
      return null;
    }

    return password === repeatPassword ? null : { [AUTH_VALIDATION_ERROR_KEYS.passwordMismatch]: true };
  };
}
