import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { UiInputAutocomplete, UiInputType } from './input.model';

@Component({
  selector: 'ui-input',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent {
  public readonly label = input.required<string>();
  public readonly control = input.required<FormControl<string>>();
  public readonly type = input<UiInputType>(UiInputType.Text);
  public readonly autocomplete = input<UiInputAutocomplete>(UiInputAutocomplete.Off);

  public readonly errorMessages = input<Partial<Record<string, string>>>({});

  public readonly showPasswordLabel = input('Show password');
  public readonly hidePasswordLabel = input('Hide password');

  protected readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  protected readonly isPasswordHidden = signal(true);

  protected readonly isPasswordInput = computed(() => this.type() === UiInputType.Password);

  protected readonly isRequired = computed(() => this.control().hasValidator(Validators.required));

  protected readonly inputType = computed(() => {
    if (!this.isPasswordInput()) {
      return this.type();
    }

    return this.isPasswordHidden() ? UiInputType.Password : UiInputType.Text;
  });

  protected readonly passwordToggleIcon = computed(() => (this.isPasswordHidden() ? 'visibility_off' : 'visibility'));

  protected readonly passwordToggleLabel = computed(() => (this.isPasswordHidden() ? this.showPasswordLabel() : this.hidePasswordLabel()));

  protected togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.isPasswordHidden.update((isHidden) => !isHidden);
    this.inputElement()?.nativeElement.focus();
  }

  protected getErrorMessage(): string | null {
    const control = this.control();

    if (!control.touched || !control.errors) {
      return null;
    }

    for (const errorKey of Object.keys(control.errors)) {
      const message = this.errorMessages()[errorKey];

      if (message) {
        return message;
      }
    }

    return this.errorMessages()['invalid'] ?? null;
  }
}
