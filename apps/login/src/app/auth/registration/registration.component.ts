import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputAutocomplete, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EMAIL_VALIDATORS, PASSWORD_VALIDATORS, REPEAT_PASSWORD_VALIDATORS, passwordsMatchValidator } from '../core/auth.validator';
import { AuthApiService } from '../services/auth-api.service';
import { AuthValidationMessagesService } from '../services/auth-validation-messages.service';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, TranslatePipe],
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
  private readonly translateService = inject(TranslateService);
  private readonly validationMessagesService = inject(AuthValidationMessagesService);

  protected readonly isRegistrationPending = signal(false);

  protected readonly uiInputType = UiInputType;
  protected readonly uiInputAutocomplete = UiInputAutocomplete;
  protected readonly validationMessages = this.validationMessagesService.messages;

  protected readonly registrationForm = this.formBuilder.group(
    {
      username: ['', EMAIL_VALIDATORS],
      password: ['', PASSWORD_VALIDATORS],
      repeatPassword: ['', REPEAT_PASSWORD_VALIDATORS],
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
          this.notificationService.success(this.translateService.instant('login.notifications.registrationSuccess', { email }) as string);

          this.router.navigate(['/auth/sign-in']);
        },
        error: () => {
          this.notificationService.error(this.translateService.instant('login.notifications.registrationFailed') as string);
        },
      });
  }
}
