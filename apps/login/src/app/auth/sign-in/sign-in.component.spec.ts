import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { EMPTY, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_ROUTES } from '../core/auth-routes.constants';
import { AuthApiService } from '../services/auth-api.service';
import { AuthSessionService } from '../services/auth-session.service';
import { SignInComponent } from './sign-in.component';

const USERNAME = 'user@email.com';
const PASSWORD = '@@1234AB';

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>;
  let component: SignInComponent;
  let router: Router;

  const authApiServiceMock = {
    signIn: vi.fn(),
  };

  const authSessionServiceMock = {
    setEmail: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

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
      username: USERNAME,
      password: PASSWORD,
    });
  };

  const mockSuccessfulSignIn = (): void => {
    authApiServiceMock.signIn.mockReturnValue(
      of({
        email: USERNAME,
      }),
    );
  };

  const mockFailedSignIn = (): void => {
    authApiServiceMock.signIn.mockReturnValue(EMPTY);
  };

  it('should not call sign in api when form is invalid', () => {
    component['submitSignIn']();

    expect(authApiServiceMock.signIn).not.toHaveBeenCalled();
  });

  it('should call sign in api with form value', () => {
    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(authApiServiceMock.signIn).toHaveBeenCalledExactlyOnceWith({
      username: USERNAME,
      password: PASSWORD,
    });
  });

  it('should save email after successful sign in', () => {
    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(authSessionServiceMock.setEmail).toHaveBeenCalledExactlyOnceWith(USERNAME);
  });

  it('should navigate to profile after successful sign in', () => {
    mockSuccessfulSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith([AUTH_ROUTES.Profile]);
  });

  it('should not save email when sign in fails', () => {
    mockFailedSignIn();
    setValidSignInForm();

    component['submitSignIn']();

    expect(authSessionServiceMock.setEmail).not.toHaveBeenCalled();
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
