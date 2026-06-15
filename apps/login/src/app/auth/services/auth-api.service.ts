import { inject, Injectable } from '@angular/core';

import { IAuthApiResponse, IAuthResult, ILogoutPayload } from '../core/auth.model';
import { IRegistrationPayload } from '../registration/registration.model';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { mapAuthResponse } from '../core/auth.helper';
import { ISignInPayload } from '../sign-in/sign-in.model';
import { IResetPasswordPayload } from '../reset-password/reset-password.model';

const BASE_API_URL = environment.authApiBaseUrl;
const BASE_LOGOUT_API_URL = environment.logoutApiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);

  public register({ username, password }: IRegistrationPayload): Observable<IAuthApiResponse> {
    return this.http.post<IAuthApiResponse>(`${BASE_API_URL}/sign-up`, {
      email: username.trim().toLowerCase(),
      password,
    });
  }

  public signIn({ username, password }: ISignInPayload): Observable<IAuthResult> {
    return this.http
      .post<IAuthApiResponse>(
        `${BASE_API_URL}/sign-in`,
        {
          email: username.trim().toLowerCase(),
          password,
        },
        { observe: 'response' },
      )
      .pipe(map(mapAuthResponse));
  }

  public resetPassword({ username, newPassword }: IResetPasswordPayload): Observable<IAuthApiResponse> {
    return this.http.post<IAuthApiResponse>(`${BASE_API_URL}/sign-in/reset`, {
      email: username.trim().toLowerCase(),
      password: newPassword,
    });
  }

  public logout({ email, password, token }: ILogoutPayload): Observable<void> {
    return this.http.delete<void>(`${BASE_LOGOUT_API_URL}/sign-in/out`, {
      headers: {
        'T-Auth': token,
      },
      body: {
        email,
        password,
      },
    });
  }
}
