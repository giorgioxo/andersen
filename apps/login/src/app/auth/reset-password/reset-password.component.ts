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
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isResetPasswordPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly passwordErrorMessages = AUTH_PASSWORD_ERROR_MESSAGES;

  protected readonly resetPasswordForm = this.formBuilder.group(
    {
      username: ['', EMAIL_VALIDATORS],
      newPassword: ['', PASSWORD_VALIDATORS],
      repeatPassword: ['', Validators.required],
    },
    {
      validators: passwordsMatchValidator('newPassword', 'repeatPassword'),
    },
  );

  protected submitResetPassword(): void {
    if (this.isResetPasswordPending()) {
      return;
    }

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const { username, newPassword } = this.resetPasswordForm.getRawValue();

    this.isResetPasswordPending.set(true);

    this.authApiService
      .resetPassword({ username, newPassword })
      .pipe(
        finalize(() => this.isResetPasswordPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ email }) => {
          this.notificationService.success(`${email} password reset successfully`);
          this.router.navigate(['/auth/sign-in']);
        },
        error: (err) => {
          this.notificationService.error(getAuthErrorMessage(err));
        },
      });
  }
}
