import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { AuthService } from '../auth.service';
import { PASSWORD_VALIDATORS, passwordsMatchValidator, USERNAME_VALIDATORS } from '../auth.validator';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly uiInputType = UiInputType;

  protected readonly registrationForm = this.formBuilder.group(
    {
      username: ['', USERNAME_VALIDATORS],
      password: ['', PASSWORD_VALIDATORS],
      repeatPassword: ['', Validators.required],
    },
    {
      validators: passwordsMatchValidator('password', 'repeatPassword'),
    },
  );

  protected submitRegistration(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.registrationForm.getRawValue();
    const isRegistered = this.authService.register({ username, password });

    if (!isRegistered) {
      this.notificationService.error('User already exists');
      return;
    }

    this.notificationService.success('Registered successfully');
    this.router.navigate(['/auth/sign-in']);
  }
}
