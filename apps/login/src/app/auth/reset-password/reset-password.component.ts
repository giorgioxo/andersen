import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EMAIL_VALIDATORS, PASSWORD_VALIDATORS, REPEAT_PASSWORD_VALIDATORS, passwordsMatchValidator } from '../core/auth.validator';
import { AuthApiService } from '../services/auth-api.service';
import { AuthValidationMessagesService } from '../services/auth-validation-messages.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, TranslatePipe],
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
  private readonly translateService = inject(TranslateService);
  private readonly validationMessagesService = inject(AuthValidationMessagesService);

  protected readonly isResetPasswordPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly validationMessages = this.validationMessagesService.messages;

  protected readonly resetPasswordForm = this.formBuilder.group(
    {
      username: ['', EMAIL_VALIDATORS],
      newPassword: ['', PASSWORD_VALIDATORS],
      repeatPassword: ['', REPEAT_PASSWORD_VALIDATORS],
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
          this.notificationService.success(this.translateService.instant('login.notifications.passwordResetSuccess', { email }) as string);

          this.router.navigate(['/auth/sign-in']);
        },
        error: () => {
          this.notificationService.error(this.translateService.instant('login.notifications.passwordResetFailed') as string);
        },
      });
  }
}
