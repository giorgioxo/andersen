import { computed, Injectable, signal } from '@angular/core';

import { AuthTokenStorage } from '@andersen/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService implements AuthTokenStorage {
  private readonly emailState = signal<string | null>(null);
  private readonly tokenState = signal<string | null>(null);

  public readonly email = computed(() => this.emailState());
  public readonly isAuthenticated = computed(() => Boolean(this.tokenState()));

  public setEmail(email: string): void {
    this.emailState.set(email);
  }

  public getEmail(): string | null {
    return this.emailState();
  }

  public getToken(): string | null {
    return this.tokenState();
  }

  public setToken(token: string): void {
    this.tokenState.set(token);
  }

  public clearSession(): void {
    this.emailState.set(null);
    this.tokenState.set(null);
  }
}
