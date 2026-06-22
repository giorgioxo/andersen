import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DEFAULT_LANGUAGE } from '../constants/language.constants';
import { SHELL_LANGUAGE_CHANGE_EVENT } from '../constants/mfe-events.constants';
import { Language } from '../models/language.model';

@Injectable({
  providedIn: 'root',
})
export class ShellLanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(TranslateService);

  private readonly language = signal(DEFAULT_LANGUAGE);

  public readonly currentLanguage = this.language.asReadonly();

  public setLanguage(language: Language): void {
    this.language.set(language);
    this.translateService.use(language);
    this.document.documentElement.lang = language;
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
