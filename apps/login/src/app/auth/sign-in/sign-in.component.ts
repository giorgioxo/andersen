import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { AuthApiService } from '../services/auth-api.service';
import { EMAIL_VALIDATORS, SING_IN_PASSWORD_VALIDATORS } from '../core/auth.validator';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthSessionService } from '../services/auth-session.service';
import { getAuthErrorMessage } from '../core/auth.helper';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly router = inject(Router);

  protected readonly isSignInPending = signal(false);

  protected readonly uiInputType = UiInputType;

  protected readonly signInForm = this.formBuilder.group({
    username: ['', EMAIL_VALIDATORS],
    password: ['', SING_IN_PASSWORD_VALIDATORS],
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
          this.authSessionService.setSession({ email, token });
          console.log('saved token:', this.authSessionService.getToken());
          this.notificationService.success(`${email} signed in successfully`);
          this.router.navigate(['/auth/profile']);
        },
        error: (err) => {
          this.notificationService.error(getAuthErrorMessage(err));
        },
      });
  }
}
