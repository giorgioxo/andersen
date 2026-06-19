import { Injectable, signal } from '@angular/core';

import { DEFAULT_LANGUAGE } from '../constants/language.constants';
import { SHELL_LANGUAGE_CHANGE_EVENT } from '../constants/mfe-events.constants';
import { Language } from '../models/language.model';

@Injectable({
  providedIn: 'root',
})
export class ShellLanguageService {
  private readonly language = signal(DEFAULT_LANGUAGE);

  public readonly currentLanguage = this.language.asReadonly();

  public setLanguage(language: Language): void {
    this.language.set(language);
    this.dispatchCurrentLanguage();
  }

  public dispatchCurrentLanguage(): void {
    window.dispatchEvent(
      new CustomEvent(SHELL_LANGUAGE_CHANGE_EVENT, {
        detail: {
          language: this.language(),
        },
      }),
    );
  }
}
