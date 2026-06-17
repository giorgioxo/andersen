import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { AuthApiService } from './auth-api.service';

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
    service.register({ username: ' Test@Email.COM ', password: '@@1234AB' }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-up`);
  };

  const expectSignInRequest = () => {
    service.signIn({ username: ' User@Email.COM ', password: '@@1234AB' }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in`);
  };

  const expectResetPasswordRequest = () => {
    service.resetPassword({ username: ' Reset@Email.COM ', newPassword: '@@9999AB' }).subscribe();

    return httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in/reset`);
  };

  const expectLogoutRequest = () => {
    service.logout({ email: 'user@email.com', password: '@@1234AB', token: 'token-123' }).subscribe();

    return httpTestingController.expectOne(`${environment.logoutApiBaseUrl}/sign-in/out`);
  };

  it('should send register request with post method', () => {
    const request = expectRegisterRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ email: 'test@email.com' });
  });

  it('should send register request with normalized email payload', () => {
    const request = expectRegisterRequest();

    expect(request.request.body).toEqual({
      email: 'test@email.com',
      password: '@@1234AB',
    });

    request.flush({ email: 'test@email.com' });
  });

  it('should send sign in request with post method', () => {
    const request = expectSignInRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ email: 'user@email.com' }, { headers: { 'T-Auth': 'token-123' } });
  });

  it('should send sign in request with normalized email payload', () => {
    const request = expectSignInRequest();

    expect(request.request.body).toEqual({
      email: 'user@email.com',
      password: '@@1234AB',
    });

    request.flush({ email: 'user@email.com' }, { headers: { 'T-Auth': 'token-123' } });
  });

  it('should map sign in response with auth token header', () => {
    service.signIn({ username: ' User@Email.COM ', password: '@@1234AB' }).subscribe((response) => {
      expect(response).toEqual({
        email: 'user@email.com',
        token: 'token-123',
        statusCode: 200,
      });
    });

    const request = httpTestingController.expectOne(`${environment.authApiBaseUrl}/sign-in`);

    request.flush(
      { email: 'user@email.com' },
      {
        status: 200,
        statusText: 'OK',
        headers: {
          'T-Auth': 'token-123',
        },
      },
    );
  });

  it('should send reset password request with post method', () => {
    const request = expectResetPasswordRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ email: 'reset@email.com' });
  });

  it('should send reset password request with new password payload', () => {
    const request = expectResetPasswordRequest();

    expect(request.request.body).toEqual({
      email: 'reset@email.com',
      password: '@@9999AB',
    });

    request.flush({ email: 'reset@email.com' });
  });

  it('should send logout request with delete method', () => {
    const request = expectLogoutRequest();

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('should send logout request with auth token header', () => {
    const request = expectLogoutRequest();

    expect(request.request.headers.get('T-Auth')).toBe('token-123');

    request.flush(null);
  });

  it('should send logout request with body', () => {
    const request = expectLogoutRequest();

    expect(request.request.body).toEqual({
      email: 'user@email.com',
      password: '@@1234AB',
    });

    request.flush(null);
  });
});
