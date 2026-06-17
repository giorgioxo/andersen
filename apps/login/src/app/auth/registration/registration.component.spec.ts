import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotificationService } from '@andersen/shared-ui';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegistrationComponent } from './registration.component';
import { AuthApiService } from '../services/auth-api.service';

describe('RegistrationComponent', () => {
  let fixture: ComponentFixture<RegistrationComponent>;
  let component: RegistrationComponent;

  const authApiServiceMock = {
    register: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
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

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call register api when form is invalid', () => {
    component['submitRegistration']();

    expect(authApiServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call register api with form value', () => {
    authApiServiceMock.register.mockReturnValue(
      of({
        email: 'user@email.com',
      }),
    );

    component['registrationForm'].setValue({
      username: 'user@email.com',
      password: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitRegistration']();

    expect(authApiServiceMock.register).toHaveBeenCalledWith({
      username: 'user@email.com',
      password: '@@1234AB',
    });
  });

  it('should navigate to sign in after successful registration', () => {
    authApiServiceMock.register.mockReturnValue(
      of({
        email: 'user@email.com',
      }),
    );

    component['registrationForm'].setValue({
      username: 'user@email.com',
      password: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitRegistration']();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('should not navigate when registration fails', () => {
    authApiServiceMock.register.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Registration failed',
        },
      })),
    );

    component['registrationForm'].setValue({
      username: 'user@email.com',
      password: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitRegistration']();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not submit while registration is pending', () => {
    component['isRegistrationPending'].set(true);

    component['registrationForm'].setValue({
      username: 'user@email.com',
      password: '@@1234AB',
      repeatPassword: '@@1234AB',
    });

    component['submitRegistration']();

    expect(authApiServiceMock.register).not.toHaveBeenCalled();
  });
});
