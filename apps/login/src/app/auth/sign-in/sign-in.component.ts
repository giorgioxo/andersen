import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NotificationService, UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';
import { AuthService } from '../auth.service';
import { PASSWORD_VALIDATORS, USERNAME_VALIDATORS } from '../auth.validator';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  protected readonly uiInputType = UiInputType;

  protected readonly signInForm = this.formBuilder.group({
    username: ['', USERNAME_VALIDATORS],
    password: ['', PASSWORD_VALIDATORS],
  });

  protected submitSignIn(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const isSignedIn = this.authService.signIn(this.signInForm.getRawValue());

    if (!isSignedIn) {
      this.notificationService.error('Invalid username or password');
      return;
    }

    this.notificationService.success('Signed in successfully');
  }
}
