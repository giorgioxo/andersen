import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_ROUTES } from './core/auth-routes.constants';
import { ProfileComponent } from './profile.component';
import { AuthApiService } from './services/auth-api.service';
import { AuthSessionService } from './services/auth-session.service';

const EMAIL = 'user@email.com';
const PASSWORD = '@@1234AB';

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  const authApiServiceMock = {
    logout: vi.fn(),
  };

  const authSessionServiceMock = {
    getEmail: vi.fn(),
    clearSession: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: AuthApiService,
          useValue: authApiServiceMock,
        },
        {
          provide: AuthSessionService,
          useValue: authSessionServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidSignOutForm = (): void => {
    component['signOutForm'].setValue({
      password: PASSWORD,
    });
  };

  const mockExistingSession = (): void => {
    authSessionServiceMock.getEmail.mockReturnValue(EMAIL);
  };

  const mockSuccessfulLogout = (): void => {
    authApiServiceMock.logout.mockReturnValue(of(null));
  };

  it('should not call logout api when form is invalid', () => {
    component['submitSignOut']();

    expect(authApiServiceMock.logout).not.toHaveBeenCalled();
  });

  it('should not submit while sign out is pending', () => {
    component['isSignOutPending'].set(true);
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authApiServiceMock.logout).not.toHaveBeenCalled();
  });

  it('should clear session and navigate to sign in when email does not exist', () => {
    authSessionServiceMock.getEmail.mockReturnValue(null);
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authSessionServiceMock.clearSession).toHaveBeenCalledExactlyOnceWith();
    expect(routerMock.navigate).toHaveBeenCalledExactlyOnceWith([AUTH_ROUTES.SignIn]);
    expect(authApiServiceMock.logout).not.toHaveBeenCalled();
  });

  it('should call logout api with email and password', () => {
    mockExistingSession();
    mockSuccessfulLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authApiServiceMock.logout).toHaveBeenCalledExactlyOnceWith({
      email: EMAIL,
      password: PASSWORD,
    });
  });

  it('should clear session after successful logout', () => {
    mockExistingSession();
    mockSuccessfulLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authSessionServiceMock.clearSession).toHaveBeenCalledExactlyOnceWith();
  });

  it('should navigate to sign in after successful logout', () => {
    mockExistingSession();
    mockSuccessfulLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(routerMock.navigate).toHaveBeenCalledExactlyOnceWith([AUTH_ROUTES.SignIn]);
  });

  it('should not clear session when logout does not complete successfully', () => {
    mockExistingSession();
    authApiServiceMock.logout.mockReturnValue(EMPTY);
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authSessionServiceMock.clearSession).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
