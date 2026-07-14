import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_ROUTES } from '../core/auth-routes.constants';
import { AuthApiService } from '../services/auth-api.service';
import { RegistrationComponent } from './registration.component';

const TEST_EMAIL = 'user@email.com';
const TEST_PASSWORD = '@@1234AB';

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
    vi.resetAllMocks();

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidRegistrationForm = (): void => {
    component['registrationForm'].setValue({
      username: TEST_EMAIL,
      password: TEST_PASSWORD,
      repeatPassword: TEST_PASSWORD,
    });
  };

  const mockSuccessfulRegistration = (): void => {
    authApiServiceMock.register.mockReturnValue(
      of({
        email: TEST_EMAIL,
      }),
    );
  };

  const mockFailedRegistration = (): void => {
    authApiServiceMock.register.mockReturnValue(EMPTY);
  };

  it('should not call register api when form is invalid', () => {
    component['submitRegistration']();

    expect(authApiServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call register api with form value', () => {
    mockSuccessfulRegistration();
    setValidRegistrationForm();

    component['submitRegistration']();

    expect(authApiServiceMock.register).toHaveBeenCalledExactlyOnceWith({
      username: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
  });

  it('should navigate to sign in after successful registration', () => {
    mockSuccessfulRegistration();
    setValidRegistrationForm();

    component['submitRegistration']();

    expect(routerMock.navigate).toHaveBeenCalledWith([AUTH_ROUTES.SignIn]);
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
