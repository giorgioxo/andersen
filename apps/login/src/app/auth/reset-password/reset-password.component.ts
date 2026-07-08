import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { AuthService } from '../auth.service';
import { PASSWORD_VALIDATORS, passwordsMatchValidator, USERNAME_VALIDATORS } from '../auth.validator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly uiInputType = UiInputType;

  protected readonly resetPasswordForm = this.formBuilder.group(
    {
      username: ['', USERNAME_VALIDATORS],
      oldPassword: ['', PASSWORD_VALIDATORS],
      newPassword: ['', PASSWORD_VALIDATORS],
      repeatPassword: ['', Validators.required],
    },
    {
      validators: passwordsMatchValidator('newPassword', 'repeatPassword'),
    },
  );

  protected submitResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const { username, oldPassword, newPassword } = this.resetPasswordForm.getRawValue();
    const isPasswordReset = this.authService.resetPassword({
      username,
      oldPassword,
      newPassword,
    });

    if (!isPasswordReset) {
      this.notificationService.error('Invalid username or old password');
      return;
    }

    this.notificationService.success('Password reset successfully');
    this.router.navigate(['/auth/sign-in']);
  }
}
