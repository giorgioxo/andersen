import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { finalize } from 'rxjs';

import { AUTH_PASSWORD_ERROR_MESSAGES } from '../core/auth.constants';
import { EMAIL_VALIDATORS, PASSWORD_VALIDATORS, passwordsMatchValidator } from '../core/auth.validator';
import { AuthApiService } from '../services/auth-api.service';
import { AUTH_ROUTES } from '../core/auth-routes.constants';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isRegistrationPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly passwordErrorMessages = AUTH_PASSWORD_ERROR_MESSAGES;

  protected readonly registrationForm = this.formBuilder.group(
    {
      username: ['', EMAIL_VALIDATORS],
      password: ['', PASSWORD_VALIDATORS],
      repeatPassword: ['', Validators.required],
    },
    {
      validators: passwordsMatchValidator('password', 'repeatPassword'),
    },
  );

  protected submitRegistration(): void {
    if (this.isRegistrationPending()) {
      return;
    }
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.registrationForm.getRawValue();

    this.isRegistrationPending.set(true);

    this.authApiService
      .register({ username, password })
      .pipe(
        finalize(() => this.isRegistrationPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.router.navigate([AUTH_ROUTES.SignIn]);
        },
      });
  }
}
