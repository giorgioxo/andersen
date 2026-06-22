import { inject, Injectable } from '@angular/core';

import { IAuthApiResponse, IAuthResult } from '../core/auth.model';
import { IRegistrationPayload } from '../registration/registration.model';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { mapAuthResponse, normalizeAuthEmail } from '../core/auth.helper';
import { ISignInPayload } from '../sign-in/sign-in.model';
import { IResetPasswordPayload } from '../reset-password/reset-password.model';

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

  public signIn({ username, password }: ISignInPayload): Observable<IAuthResult> {
    return this.http
      .post<IAuthApiResponse>(
        `${BASE_API_URL}/sign-in`,
        {
          email: normalizeAuthEmail(username),
          password,
        },
        { observe: 'response' },
      )
      .pipe(map(mapAuthResponse));
  }

  public resetPassword({ username, newPassword }: IResetPasswordPayload): Observable<IAuthApiResponse> {
    return this.http.post<IAuthApiResponse>(`${BASE_API_URL}/sign-in/reset`, {
      email: normalizeAuthEmail(username),
      password: newPassword,
    });
  }
}
