import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const USERNAME_VALIDATORS = [Validators.required, Validators.minLength(8), Validators.pattern(/^[A-Za-z0-9]+$/)];

export const PASSWORD_VALIDATORS = [Validators.required, Validators.minLength(8)];

export function passwordsMatchValidator(passwordControlName: string, repeatPasswordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName)?.value;
    const repeatPassword = control.get(repeatPasswordControlName)?.value;

    if (!password || !repeatPassword) {
      return null;
    }

    return password === repeatPassword ? null : { passwordMismatch: true };
  };
}
