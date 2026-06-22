import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_LANGUAGE } from './core/constants/language.constants';
import { Language } from './core/models/language.model';
import { MfeEventBridgeService } from './core/services/mfe-event-bridge.service';
import { ShellLanguageService } from './core/services/shell-language.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  const shellLanguageServiceMock = {
    currentLanguage: signal(DEFAULT_LANGUAGE).asReadonly(),
    setLanguage: vi.fn(),
  };

  const mfeEventBridgeServiceMock = {
    init: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ShellLanguageService,
          useValue: shellLanguageServiceMock,
        },
        {
          provide: MfeEventBridgeService,
          useValue: mfeEventBridgeServiceMock,
        },
      ],
    })
      .overrideComponent(AppComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should init mfe event bridge on init', () => {
    fixture.detectChanges();

    expect(mfeEventBridgeServiceMock.init).toHaveBeenCalled();
  });

  it('should set selected language', () => {
    const language = 'ka' as Language;

    component['changeLanguage'](language);

    expect(shellLanguageServiceMock.setLanguage).toHaveBeenCalledWith(language);
  });
});
