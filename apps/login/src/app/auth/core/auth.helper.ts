import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IAuthApiResponse, IAuthResult } from './auth.model';

export const mapAuthResponse = (resp: HttpResponse<IAuthApiResponse>): IAuthResult => {
  const token = resp.headers.get('T-Auth');

  if (!resp.body || !token) {
    throw new Error('Invalid auth response');
  }

  return {
    email: resp.body.email,
    token,
    statusCode: resp.status,
  };
};

export const getAuthErrorMessage = (httpError: HttpErrorResponse): string => {
  const responseBody = httpError.error as { error: string };

  return responseBody.error;
};
