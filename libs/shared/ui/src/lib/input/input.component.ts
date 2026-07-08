import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DEFAULT_PASSWORD_VISIBILITY_CONFIG } from './password-visibility.config';
import {
  UiInputType,
  UiPasswordVisibilityConfig,
  UiPasswordVisibilityIconType,
  UiPasswordVisibilityState,
} from './input.model';

@Component({
  selector: 'ui-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent {
  public readonly label = input.required<string>();
  public readonly control = input.required<FormControl<string>>();
  public readonly type = input<UiInputType>(UiInputType.Text);

  public readonly passwordVisibilityConfig = input<UiPasswordVisibilityConfig>(DEFAULT_PASSWORD_VISIBILITY_CONFIG);

  protected readonly uiPasswordVisibilityIconType = UiPasswordVisibilityIconType;

  protected readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');
  protected readonly isPasswordHidden = signal(true);

  protected readonly isPasswordInput = computed(() => this.type() === UiInputType.Password);

  protected readonly passwordVisibilityState = computed(() =>
    this.isPasswordHidden() ? UiPasswordVisibilityState.Hidden : UiPasswordVisibilityState.Visible,
  );

  protected readonly passwordVisibilityView = computed(() => {
    return this.passwordVisibilityConfig()[this.passwordVisibilityState()];
  });

  protected readonly inputType = computed(() => {
    if (!this.isPasswordInput()) {
      return this.type();
    }

    return this.passwordVisibilityView().type;
  });

  protected togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.isPasswordHidden.update((isHidden) => !isHidden);
    this.inputElement()?.nativeElement.focus();
  }
}
