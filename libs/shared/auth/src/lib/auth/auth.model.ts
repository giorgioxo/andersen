import { InjectionToken } from '@angular/core';

export const AUTH_TOKEN_HEADER = 'T-Auth';

export interface AuthTokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
}

export const AUTH_TOKEN_STORAGE = new InjectionToken<AuthTokenStorage>('AUTH_TOKEN_STORAGE');

export interface AuthResponseBody {
  email?: string;
}

export interface AuthErrorBody {
  error?: string;
  message?: string;
}
