import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { AuthApiService } from './auth-api.service';
import { AUTH_TOKEN_HEADER } from '@andersen/auth';

const USERNAME = ' User@Email.COM ';
const NORMALIZED_EMAIL = 'user@email.com';
const PASSWORD = '@@1234AB';
const NEW_PASSWORD = '@@9999AB';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const expectRegisterRequest = () => {
    service.register({ username: USERNAME, password: PASSWORD }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-up`);
  };

  const expectSignInRequest = () => {
    service.signIn({ username: USERNAME, password: PASSWORD }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in`);
  };

  const expectResetPasswordRequest = () => {
    service.resetPassword({ username: USERNAME, newPassword: NEW_PASSWORD }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in/reset`);
  };

  const expectLogoutRequest = () => {
    service.logout({ email: USERNAME, password: PASSWORD }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in/out`);
  };

  it('should send register request with post method', () => {
    const request = expectRegisterRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should send register request with normalized email payload', () => {
    const request = expectRegisterRequest();

    expect(request.request.body).toEqual({
      email: NORMALIZED_EMAIL,
      password: PASSWORD,
    });

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should send sign in request with post method', () => {
    const request = expectSignInRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should send sign in request with normalized email payload', () => {
    const request = expectSignInRequest();

    expect(request.request.body).toEqual({
      email: NORMALIZED_EMAIL,
      password: PASSWORD,
    });

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should return sign in response body', () => {
    service.signIn({ username: USERNAME, password: PASSWORD }).subscribe((response) => {
      expect(response).toEqual({
        email: NORMALIZED_EMAIL,
      });
    });

    const request = httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in`);

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should send reset password request with post method', () => {
    const request = expectResetPasswordRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should send reset password request with new password payload', () => {
    const request = expectResetPasswordRequest();

    expect(request.request.body).toEqual({
      email: NORMALIZED_EMAIL,
      password: NEW_PASSWORD,
    });

    request.flush({ email: NORMALIZED_EMAIL });
  });

  it('should send logout request with delete method', () => {
    const request = expectLogoutRequest();

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('should not set auth token header directly', () => {
    const request = expectLogoutRequest();

    expect(request.request.headers.has(AUTH_TOKEN_HEADER)).toBe(false);

    request.flush(null);
  });

  it('should send logout request with normalized email body', () => {
    const request = expectLogoutRequest();

    expect(request.request.body).toEqual({
      email: NORMALIZED_EMAIL,
      password: PASSWORD,
    });

    request.flush(null);
  });
});
