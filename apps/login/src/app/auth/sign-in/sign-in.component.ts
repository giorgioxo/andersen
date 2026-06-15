import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LOCK_PASSWORD_VISIBILITY_CONFIG, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { finalize } from 'rxjs';

import { EMAIL_VALIDATORS, SIGN_IN_PASSWORD_VALIDATORS } from '../core/auth.validator';
import { AuthApiService } from '../services/auth-api.service';
import { AuthSessionService } from '../services/auth-session.service';
import { AUTH_ROUTES } from '../core/auth-routes.constants';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly router = inject(Router);

  protected readonly isSignInPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly signInPasswordVisibilityConfig = LOCK_PASSWORD_VISIBILITY_CONFIG;

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
        next: ({ email }) => {
          this.authSessionService.setEmail(email);
          this.router.navigate([AUTH_ROUTES.SignIn]);
        },
      });
  }
}
