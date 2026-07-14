import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_ROUTES } from '../core/auth-routes.constants';
import { AuthApiService } from '../services/auth-api.service';
import { ResetPasswordComponent } from './reset-password.component';

const TEST_EMAIL = 'user@email.com';
const TEST_PASSWORD = '@@1234AB';

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
    vi.resetAllMocks();

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidResetPasswordForm = (): void => {
    component['resetPasswordForm'].setValue({
      username: TEST_EMAIL,
      newPassword: TEST_PASSWORD,
      repeatPassword: TEST_PASSWORD,
    });
  };

  const mockSuccessfulResetPassword = (): void => {
    authApiServiceMock.resetPassword.mockReturnValue(
      of({
        email: TEST_EMAIL,
      }),
    );
  };

  const mockFailedResetPassword = (): void => {
    authApiServiceMock.resetPassword.mockReturnValue(EMPTY);
  };

  it('should not call reset password api when form is invalid', () => {
    component['submitResetPassword']();

    expect(authApiServiceMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should call reset password api with form value', () => {
    mockSuccessfulResetPassword();
    setValidResetPasswordForm();

    component['submitResetPassword']();

    expect(authApiServiceMock.resetPassword).toHaveBeenCalledExactlyOnceWith({
      username: TEST_EMAIL,
      newPassword: TEST_PASSWORD,
    });
  });

  it('should navigate to sign in after successful password reset', () => {
    mockSuccessfulResetPassword();
    setValidResetPasswordForm();

    component['submitResetPassword']();

    expect(routerMock.navigate).toHaveBeenCalledExactlyOnceWith([AUTH_ROUTES.SignIn]);
  });

  it('should not navigate when reset password fails', () => {
    mockFailedResetPassword();
    setValidResetPasswordForm();

    component['submitResetPassword']();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not submit while reset password is pending', () => {
    component['isResetPasswordPending'].set(true);
    setValidResetPasswordForm();

    component['submitResetPassword']();

    expect(authApiServiceMock.resetPassword).not.toHaveBeenCalled();
  });
});
