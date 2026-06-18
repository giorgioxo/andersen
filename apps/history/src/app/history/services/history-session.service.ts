import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistorySessionService {
  private readonly token = signal<string | null>(null);

  public readonly currentToken = this.token.asReadonly();

  public setToken(token: string): void {
    this.token.set(token);
  }

  public getToken(): string | null {
    return this.token();
  }

  public clearToken(): void {
    this.token.set(null);
  }
}
