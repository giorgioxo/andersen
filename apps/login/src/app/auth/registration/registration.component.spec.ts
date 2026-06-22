import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotificationService } from '@andersen/shared-ui';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegistrationComponent } from './registration.component';
import { AuthApiService } from '../services/auth-api.service';
import { AuthValidationMessagesService } from '../services/auth-validation-messages.service';

describe('RegistrationComponent', () => {
  let fixture: ComponentFixture<RegistrationComponent>;
  let component: RegistrationComponent;

  const authApiServiceMock = {
    register: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
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
    vi.restoreAllMocks();
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
      .overrideComponent(RegistrationComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidRegistrationForm = (): void => {
    component['registrationForm'].setValue({
      username: 'user@email.com',
      password: '@@1234AB',
      repeatPassword: '@@1234AB',
    });
  };

  const mockSuccessfulRegistration = (): void => {
    authApiServiceMock.register.mockReturnValue(
      of({
        email: 'user@email.com',
      }),
    );
  };

  const mockFailedRegistration = (): void => {
    authApiServiceMock.register.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Registration failed',
        },
      })),
    );
  };

  it('should not call register api when form is invalid', () => {
    component['submitRegistration']();

    expect(authApiServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call register api with form value', () => {
    mockSuccessfulRegistration();
    setValidRegistrationForm();

    component['submitRegistration']();

    expect(authApiServiceMock.register).toHaveBeenCalledWith({
      username: 'user@email.com',
      password: '@@1234AB',
    });
  });

  it('should navigate to sign in after successful registration', () => {
    mockSuccessfulRegistration();
    setValidRegistrationForm();

    component['submitRegistration']();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('should not navigate when registration fails', () => {
    mockFailedRegistration();
    setValidRegistrationForm();

    component['submitRegistration']();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not submit while registration is pending', () => {
    component['isRegistrationPending'].set(true);
    setValidRegistrationForm();

    component['submitRegistration']();

    expect(authApiServiceMock.register).not.toHaveBeenCalled();
  });
});
