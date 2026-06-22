import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AUTH_LOGIN_SUCCESS_EVENT } from '../core/auth-events.constants';
import { IAuthLoginSuccessEventDetail } from '../core/auth-events.model';
import { EMAIL_VALIDATORS, SIGN_IN_PASSWORD_VALIDATORS } from '../core/auth.validator';
import { AuthApiService } from '../services/auth-api.service';
import { AuthValidationMessagesService } from '../services/auth-validation-messages.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, RouterLink, TranslatePipe],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly validationMessagesService = inject(AuthValidationMessagesService);

  protected readonly isSignInPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly validationMessages = this.validationMessagesService.messages;

  protected readonly signInForm = this.formBuilder.group({
    username: ['', EMAIL_VALIDATORS],
    password: ['', SIGN_IN_PASSWORD_VALIDATORS],
  });

  protected submitSignIn(): void {
    if (this.isSignInPending()) {
      return;
    }

    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.signInForm.getRawValue();

    this.isSignInPending.set(true);

    this.authApiService
      .signIn({ username, password })
      .pipe(
        finalize(() => this.isSignInPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ email, token }) => {
          this.notificationService.success(this.translateService.instant('login.notifications.signInSuccess', { email }) as string);

          window.dispatchEvent(
            new CustomEvent<IAuthLoginSuccessEventDetail>(AUTH_LOGIN_SUCCESS_EVENT, {
              detail: {
                email,
                token,
              },
            }),
          );
        },
        error: () => {
          this.notificationService.error(this.translateService.instant('login.notifications.signInFailed') as string);
        },
      });
  }
}
