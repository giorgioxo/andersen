import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IAuthApiResponse, ILogoutPayload } from '../core/auth.model';
import { normalizeAuthEmail } from '../core/auth.helper';
import { IRegistrationPayload } from '../registration/registration.model';
import { IResetPasswordPayload } from '../reset-password/reset-password.model';
import { ISignInPayload } from '../sign-in/sign-in.model';

const BASE_API_URL = environment.authApiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  public register({ username, password }: IRegistrationPayload): Observable<IAuthApiResponse> {
    return this.http.post<IAuthApiResponse>(`${BASE_API_URL}/sign-up`, {
      email: normalizeAuthEmail(username),
      password,
    });
  }

  public signIn({ username, password }: ISignInPayload): Observable<IAuthApiResponse> {
    return this.http.post<IAuthApiResponse>(`${BASE_API_URL}/sign-in`, {
      email: normalizeAuthEmail(username),
      password,
    });
  }

  public resetPassword({ username, newPassword }: IResetPasswordPayload): Observable<IAuthApiResponse> {
    return this.http.post<IAuthApiResponse>(`${BASE_API_URL}/sign-in/reset`, {
      email: normalizeAuthEmail(username),
      password: newPassword,
    });
  }

  public logout({ email, password }: ILogoutPayload): Observable<void> {
    return this.http.delete<void>(`${BASE_API_URL}/sign-in/out`, {
      body: {
        email: normalizeAuthEmail(email),
        password,
      },
    });
  }
}
