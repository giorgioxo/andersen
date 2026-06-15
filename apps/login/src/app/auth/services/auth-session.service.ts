import { computed, Injectable, signal } from '@angular/core';

import { IAuthSession } from '../core/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly session = signal<IAuthSession | null>(null);

  public readonly email = computed(() => this.session()?.email ?? null);
  public readonly isAuthenticated = computed(() => Boolean(this.session()?.token));

  public setSession(session: IAuthSession): void {
    this.session.set(session);
  }

  public getEmail(): string | null {
    return this.session()?.email ?? null;
  }

  public getToken(): string | null {
    return this.session()?.token ?? null;
  }

  public clearSession(): void {
    this.session.set(null);
  }
}
