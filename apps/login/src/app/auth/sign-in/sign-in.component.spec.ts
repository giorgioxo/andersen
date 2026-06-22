import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@andersen/shared-ui';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_LOGIN_SUCCESS_EVENT } from '../core/auth-events.constants';
import { AuthApiService } from '../services/auth-api.service';
import { AuthValidationMessagesService } from '../services/auth-validation-messages.service';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>;
  let component: SignInComponent;

  const authApiServiceMock = {
    signIn: vi.fn(),
  };

  const notificationServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const translateServiceMock = {
    instant: vi.fn((key: string) => key),
  };

  const authValidationMessagesServiceMock = {
    messages: {},
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        {
          provide: AuthApiService,
          useValue: authApiServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
        {
          provide: AuthValidationMessagesService,
          useValue: authValidationMessagesServiceMock,
        },
      ],
    })
      .overrideComponent(SignInComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidSignInForm = (): void => {
    component['signInForm'].setValue({
      username: 'user@email.com',
      password: '@@1234AB',
    });
  };

  const mockSuccessfulSignIn = (): void => {
    authApiServiceMock.signIn.mockReturnValue(
      of({
        email: 'user@email.com',
        token: 'token-123',
        statusCode: 200,
      }),
    );
  };

  const mockFailedSignIn = (): void => {
    authApiServiceMock.signIn.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Invalid credentials',
        },
      })),
    );
  };

  it('should not call sign in api when form is invalid', () => {
    component['submitSignIn']();

    expect(authApiServiceMock.signIn).not.toHaveBeenCalled();
  });

  it('should call sign in api with form value', () => {
    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(authApiServiceMock.signIn).toHaveBeenCalledWith({
      username: 'user@email.com',
      password: '@@1234AB',
    });
  });

  it('should dispatch login success event after successful sign in', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AUTH_LOGIN_SUCCESS_EVENT,
      }),
    );
  });

  it('should not dispatch login success event when sign in fails', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    mockFailedSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  it('should not submit while sign in is pending', () => {
    component['isSignInPending'].set(true);
    setValidSignInForm();

    component['submitSignIn']();

    expect(authApiServiceMock.signIn).not.toHaveBeenCalled();
  });
});
