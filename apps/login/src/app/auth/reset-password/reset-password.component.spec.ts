import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotificationService } from '@andersen/shared-ui';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthApiService } from '../services/auth-api.service';

describe('ResetPasswordComponent', () => {
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let component: ResetPasswordComponent;

  const authApiServiceMock = {
    resetPassword: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        {
          provide: AuthApiService,
          useValue: authApiServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: NotificationService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call reset password api when form is invalid', () => {
    component['submitResetPassword']();

    expect(authApiServiceMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should call reset password api with form value', () => {
    authApiServiceMock.resetPassword.mockReturnValue(
      of({
        email: 'user@email.com',
      }),
    );

    component['resetPasswordForm'].setValue({
      username: 'user@email.com',
      newPassword: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitResetPassword']();

    expect(authApiServiceMock.resetPassword).toHaveBeenCalledWith({
      username: 'user@email.com',
      newPassword: '@@1234AB',
    });
  });

  it('should navigate to sign in after successful password reset', () => {
    authApiServiceMock.resetPassword.mockReturnValue(
      of({
        email: 'user@email.com',
      }),
    );

    component['resetPasswordForm'].setValue({
      username: 'user@email.com',
      newPassword: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitResetPassword']();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('should not navigate when reset password fails', () => {
    authApiServiceMock.resetPassword.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Reset password failed',
        },
      })),
    );

    component['resetPasswordForm'].setValue({
      username: 'user@email.com',
      newPassword: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitResetPassword']();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not submit while reset password is pending', () => {
    component['isResetPasswordPending'].set(true);

    component['resetPasswordForm'].setValue({
      username: 'user@email.com',
      newPassword: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitResetPassword']();

    expect(authApiServiceMock.resetPassword).not.toHaveBeenCalled();
  });
});