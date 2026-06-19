import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  HISTORY_AUTH_TOKEN_REQUEST_EVENT,
  MFE_AUTH_LOGIN_SUCCESS_EVENT,
  MFE_AUTH_LOGOUT_EVENT,
  SHELL_AUTH_TOKEN_EVENT,
  TODO_AUTH_TOKEN_REQUEST_EVENT,
  MFE_LANGUAGE_REQUEST_EVENT,
} from '../constants/mfe-events.constants';
import { IAuthLoginSuccessEventDetail } from '../models/mfe-events.model';
import { ShellSessionService } from './shell-session.service';
import { ShellLanguageService } from './shell-language.service';

@Injectable({
  providedIn: 'root',
})
export class MfeEventBridgeService {
  private readonly router = inject(Router);
  private readonly shellSessionService = inject(ShellSessionService);
  private readonly shellLanguageService = inject(ShellLanguageService);

  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) {
      return;
    }

    window.addEventListener(MFE_AUTH_LOGIN_SUCCESS_EVENT, this.handleLoginSuccess);
    window.addEventListener(MFE_AUTH_LOGOUT_EVENT, this.handleLogout);
    window.addEventListener(TODO_AUTH_TOKEN_REQUEST_EVENT, this.handleAuthTokenRequest);
    window.addEventListener(HISTORY_AUTH_TOKEN_REQUEST_EVENT, this.handleAuthTokenRequest);
    window.addEventListener(MFE_LANGUAGE_REQUEST_EVENT, this.handleLanguageRequest);

    this.isInitialized = true;
  }

  private readonly handleLoginSuccess = (event: Event): void => {
    const { token } = (event as CustomEvent<IAuthLoginSuccessEventDetail>).detail;

    this.shellSessionService.setToken(token);
    this.router.navigate(['/dashboard']);
  };

  private readonly handleLogout = (): void => {
    this.shellSessionService.clearToken();
    this.router.navigate(['/auth/sign-in']);
  };

  private readonly handleAuthTokenRequest = (): void => {
    const token = this.shellSessionService.getToken();

    if (!token) {
      return;
    }

    this.dispatchAuthToken(token);
  };

  private dispatchAuthToken(token: string): void {
    window.dispatchEvent(
      new CustomEvent(SHELL_AUTH_TOKEN_EVENT, {
        detail: {
          token,
        },
      }),
    );
  }

  private readonly handleLanguageRequest = (): void => {
    this.shellLanguageService.dispatchCurrentLanguage();
  };
}
