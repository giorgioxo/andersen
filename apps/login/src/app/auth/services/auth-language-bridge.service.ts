import { DestroyRef, Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MFE_LANGUAGE_REQUEST_EVENT, SHELL_LANGUAGE_CHANGE_EVENT } from '../core/auth-events.constants';
import { IShellLanguageChangeEventDetail } from '../core/auth-events.model';

@Injectable()
export class AuthLanguageBridgeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) {
      return;
    }

    window.addEventListener(SHELL_LANGUAGE_CHANGE_EVENT, this.handleLanguageChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener(SHELL_LANGUAGE_CHANGE_EVENT, this.handleLanguageChange);
    });

    this.isInitialized = true;

    window.dispatchEvent(new CustomEvent(MFE_LANGUAGE_REQUEST_EVENT));
  }

  private readonly handleLanguageChange = (event: Event): void => {
    const { language } = (event as CustomEvent<IShellLanguageChangeEventDetail>).detail;

    this.translateService.use(language);
  };
}
