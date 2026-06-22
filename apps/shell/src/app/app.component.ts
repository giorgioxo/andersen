import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LanguagePickerComponent } from './components/language-picker.component';
import { Language } from './core/models/language.model';
import { MfeEventBridgeService } from './core/services/mfe-event-bridge.service';
import { ShellLanguageService } from './core/services/shell-language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguagePickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly shellLanguageService = inject(ShellLanguageService);
  private readonly mfeEventBridgeService = inject(MfeEventBridgeService);

  protected readonly currentLanguage = this.shellLanguageService.currentLanguage;

  ngOnInit(): void {
    this.mfeEventBridgeService.init();
  }

  protected changeLanguage(language: Language): void {
    this.shellLanguageService.setLanguage(language);
  }
}
