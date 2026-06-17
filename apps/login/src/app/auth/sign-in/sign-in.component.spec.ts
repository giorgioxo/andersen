import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NotificationService } from '@andersen/shared-ui';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SignInComponent } from './sign-in.component';
import { AuthApiService } from '../services/auth-api.service';
import { AuthSessionService } from '../services/auth-session.service';

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>;
  let component: SignInComponent;
  let router: Router;

  const authApiServiceMock = {
    signIn: vi.fn(),
  };

  const authSessionServiceMock = {
    setSession: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthApiService,
          useValue: authApiServiceMock,
        },
        {
          provide: AuthSessionService,
          useValue: authSessionServiceMock,
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

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);

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

  it('should save session after successful sign in', () => {
    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(authSessionServiceMock.setSession).toHaveBeenCalledWith({
      email: 'user@email.com',
      token: 'token-123',
    });
  });

  it('should navigate to profile after successful sign in', () => {
    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/profile']);
  });

  it('should not save session when sign in fails', () => {
    mockFailedSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(authSessionServiceMock.setSession).not.toHaveBeenCalled();
  });

  it('should not navigate when sign in fails', () => {
    mockFailedSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not submit while sign in is pending', () => {
    component['isSignInPending'].set(true);
    setValidSignInForm();

    component['submitSignIn']();

    expect(authApiServiceMock.signIn).not.toHaveBeenCalled();
  });
});
