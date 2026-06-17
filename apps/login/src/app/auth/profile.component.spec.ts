import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotificationService } from '@andersen/shared-ui';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfileComponent } from './profile.component';
import { AuthApiService } from './services/auth-api.service';
import { AuthSessionService } from './services/auth-session.service';

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  const authApiServiceMock = {
    logout: vi.fn(),
  };

  const authSessionServiceMock = {
    getEmail: vi.fn(),
    getToken: vi.fn(),
    clearSession: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

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
        {
          provide: NotificationService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidSignOutForm = (): void => {
    component['signOutForm'].setValue({
      password: '@@1234AB',
    });
  };

  const mockActiveSession = (): void => {
    authSessionServiceMock.getEmail.mockReturnValue('user@email.com');
    authSessionServiceMock.getToken.mockReturnValue('token-123');
  };

  const mockMissingSession = (): void => {
    authSessionServiceMock.getEmail.mockReturnValue(null);
    authSessionServiceMock.getToken.mockReturnValue(null);
  };

  const mockSuccessfulLogout = (): void => {
    authApiServiceMock.logout.mockReturnValue(of(null));
  };

  const mockFailedLogout = (): void => {
    authApiServiceMock.logout.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Logout failed',
        },
      })),
    );
  };

  it('should not call logout api when form is invalid', () => {
    component['submitSignOut']();

    expect(authApiServiceMock.logout).not.toHaveBeenCalled();
  });

  it('should clear session when session data is missing', () => {
    mockMissingSession();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authSessionServiceMock.clearSession).toHaveBeenCalled();
  });

  it('should navigate to sign in when session data is missing', () => {
    mockMissingSession();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('should not call logout api when session data is missing', () => {
    mockMissingSession();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authApiServiceMock.logout).not.toHaveBeenCalled();
  });

  it('should call logout api with session data and password', () => {
    mockActiveSession();
    mockSuccessfulLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authApiServiceMock.logout).toHaveBeenCalledWith({
      email: 'user@email.com',
      password: '@@1234AB',
      token: 'token-123',
    });
  });

  it('should clear session after successful sign out', () => {
    mockActiveSession();
    mockSuccessfulLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authSessionServiceMock.clearSession).toHaveBeenCalled();
  });

  it('should navigate to sign in after successful sign out', () => {
    mockActiveSession();
    mockSuccessfulLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('should not clear session when sign out fails', () => {
    mockActiveSession();
    mockFailedLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authSessionServiceMock.clearSession).not.toHaveBeenCalled();
  });

  it('should not navigate when sign out fails', () => {
    mockActiveSession();
    mockFailedLogout();
    setValidSignOutForm();

    component['submitSignOut']();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not submit while sign out is pending', () => {
    component['isSignOutPending'].set(true);
    setValidSignOutForm();

    component['submitSignOut']();

    expect(authApiServiceMock.logout).not.toHaveBeenCalled();
  });
});
