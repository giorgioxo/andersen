import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { AuthApiService } from '../services/auth-api.service';
import { EMAIL_VALIDATORS, PASSWORD_VALIDATORS, passwordsMatchValidator } from '../core/auth.validator';

import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH_PASSWORD_ERROR_MESSAGES } from '../core/auth.constants';
import { getAuthErrorMessage } from '../core/auth.helper';

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
  private readonly notificationService = inject(NotificationService);
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
        next: ({ email }) => {
          this.notificationService.success(`${email} registered successfully`);
          this.router.navigate(['/auth/sign-in']);
        },
        error: (err) => {
          this.notificationService.error(getAuthErrorMessage(err));
        },
      });
  }
}
