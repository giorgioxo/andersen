import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AUTH_PASSWORD_ERROR_MESSAGES } from './core/auth.constants';
import { PASSWORD_VALIDATORS } from './core/auth.validator';
import { Router } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';
import { AuthSessionService } from './services/auth-session.service';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getAuthErrorMessage } from './core/auth.helper';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent],
  template: `
    @let controls = signOutForm.controls;

    <form [formGroup]="signOutForm" (ngSubmit)="submitSignOut()">
      <h1>Profile</h1>

      <ui-input label="Password" [type]="uiInputType.Password" [control]="controls.password" [errorMessages]="passwordErrorMessages" />

      <ui-button type="submit" [disabled]="signOutForm.invalid" [loading]="isSignOutPending()">Sign Out</ui-button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isSignOutPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly passwordErrorMessages = AUTH_PASSWORD_ERROR_MESSAGES;

  protected readonly signOutForm = this.formBuilder.group({
    password: ['', PASSWORD_VALIDATORS],
  });

  protected submitSignOut(): void {
    if (this.isSignOutPending()) {
      return;
    }

    if (this.signOutForm.invalid) {
      this.signOutForm.markAllAsTouched();
      return;
    }

    const email = this.authSessionService.getEmail();
    const token = this.authSessionService.getToken();

    if (!email || !token) {
      this.authSessionService.clearSession();
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    const { password } = this.signOutForm.getRawValue();

    this.isSignOutPending.set(true);

    this.authApiService
      .logout({ email, password, token })
      .pipe(
        finalize(() => this.isSignOutPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.authSessionService.clearSession();
          this.notificationService.success('Signed out successfully');
          this.router.navigate(['/auth/sign-in']).then(() => {
            this.notificationService.success('Signed out successfully');
          });
        },
        error: (err) => {
          this.notificationService.error(getAuthErrorMessage(err));
        },
      });
  }
}
