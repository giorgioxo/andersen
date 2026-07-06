import { Injectable } from '@angular/core';

import { IAuthAccount } from './auth.model';
import { IRegistrationPayload } from './registration/registration.model';
import { IResetPasswordPayload } from './reset-password/reset-password.model';
import { ISignInPayload } from './sign-in/sign-in.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accounts: IAuthAccount[] = [];

  public register({ username, password }: IRegistrationPayload): boolean {
    const accountExists = this.accounts.some(({ username: accountUsername }) => accountUsername === username);

    if (accountExists) {
      return false;
    }

    this.accounts.push({
      username,
      password,
    });

    return true;
  }

  public signIn({ username, password }: ISignInPayload): boolean {
    return this.accounts.some(
      ({ username: accountUsername, password: accountPassword }) =>
        accountUsername === username && accountPassword === password,
    );
  }

  public resetPassword({ username, oldPassword, newPassword }: IResetPasswordPayload): boolean {
    const account = this.accounts.find(
      ({ username: accountUsername, password: accountPassword }) =>
        accountUsername === username && accountPassword === oldPassword,
    );

    if (!account) {
      return false;
    }

    account.password = newPassword;

    return true;
  }
}
