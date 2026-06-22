import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { LANGUAGE_OPTIONS } from '../core/constants/language.constants';
import { Language } from '../core/models/language.model';

@Component({
  selector: 'app-language-picker',
  imports: [MatFormFieldModule, MatSelectModule, TranslatePipe],
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePickerComponent {
  public readonly selectedLanguage = input.required<Language>();
  public readonly languageSelected = output<Language>();

  protected readonly languageOptions = LANGUAGE_OPTIONS;

  protected selectLanguage(event: MatSelectChange): void {
    this.languageSelected.emit(event.value as Language);
  }
}
