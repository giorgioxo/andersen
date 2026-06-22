import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthComponent } from './auth.component';
import { AuthLanguageBridgeService } from './services/auth-language-bridge.service';

describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;

  const authLanguageBridgeServiceMock = {
    init: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        {
          provide: AuthLanguageBridgeService,
          useValue: authLanguageBridgeServiceMock,
        },
      ],
    })
      .overrideComponent(AuthComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
  });

  it('should initialize auth language bridge on init', () => {
    fixture.detectChanges();

    expect(authLanguageBridgeServiceMock.init).toHaveBeenCalled();
  });
});
