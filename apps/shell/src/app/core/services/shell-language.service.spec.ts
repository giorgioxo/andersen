import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_LANGUAGE } from '../constants/language.constants';
import { SHELL_LANGUAGE_CHANGE_EVENT } from '../constants/mfe-events.constants';
import { Language } from '../models/language.model';
import { ShellLanguageService } from './shell-language.service';

describe('ShellLanguageService', () => {
  let service: ShellLanguageService;
  let fakeDocument: Document;

  const translateServiceMock = {
    use: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    fakeDocument = document.implementation.createHTMLDocument('test');

    TestBed.configureTestingModule({
      providers: [
        ShellLanguageService,
        {
          provide: DOCUMENT,
          useValue: fakeDocument,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(ShellLanguageService);
  });

  it('should have default language', () => {
    expect(service.currentLanguage()).toBe(DEFAULT_LANGUAGE);
  });

  it('should update current language', () => {
    const language = 'ka' as Language;

    service.setLanguage(language);

    expect(service.currentLanguage()).toBe(language);
  });

  it('should use selected language in translate service', () => {
    const language = 'ka' as Language;

    service.setLanguage(language);

    expect(translateServiceMock.use).toHaveBeenCalledWith(language);
  });

  it('should update document language', () => {
    const language = 'ka' as Language;

    service.setLanguage(language);

    expect(fakeDocument.documentElement.lang).toBe(language);
  });

  it('should dispatch language change event when language is set', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    service.setLanguage('ka' as Language);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SHELL_LANGUAGE_CHANGE_EVENT,
      }),
    );
  });

  it('should dispatch current language', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    service.dispatchCurrentLanguage();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SHELL_LANGUAGE_CHANGE_EVENT,
      }),
    );
  });
});
