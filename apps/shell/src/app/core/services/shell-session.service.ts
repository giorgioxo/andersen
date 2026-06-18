import { Injectable, signal } from '@angular/core';

const SHELL_AUTH_TOKEN_KEY = 'shell-auth-token';

@Injectable({
  providedIn: 'root',
})
export class ShellSessionService {
  private readonly token = signal<string | null>(
    sessionStorage.getItem(SHELL_AUTH_TOKEN_KEY),
  );

  public readonly currentToken = this.token.asReadonly();

  public setToken(token: string): void {
    sessionStorage.setItem(SHELL_AUTH_TOKEN_KEY, token);
    this.token.set(token);
  }

  public getToken(): string | null {
    return this.token();
  }

  public clearToken(): void {
    sessionStorage.removeItem(SHELL_AUTH_TOKEN_KEY);
    this.token.set(null);
  }

  public isAuthenticated(): boolean {
    return Boolean(this.token());
  }
}