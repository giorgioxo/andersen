import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { UiInputType } from './input.model';

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
  public readonly errorMessages = input<Partial<Record<string, string>>>({});

  protected readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');
  protected readonly isPasswordHidden = signal(true);

  protected readonly isPasswordInput = computed(() => this.type() === UiInputType.Password);

  protected readonly inputType = computed(() => {
    if (!this.isPasswordInput()) {
      return this.type();
    }

    return this.isPasswordHidden() ? UiInputType.Password : UiInputType.Text;
  });

  protected readonly passwordToggleIcon = computed(() => (this.isPasswordHidden() ? 'visibility_off' : 'visibility'));

  protected togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.isPasswordHidden.update((isHidden) => !isHidden);
    this.inputElement()?.nativeElement.focus();
  }

  protected readonly passwordToggleLabel = computed(() => (this.isPasswordHidden() ? 'Show password' : 'Hide password'));

  protected getErrorMessage(): string | null {
    const control = this.control();

    if (!control.touched || !control.errors) {
      return null;
    }

    for (const errorKey of Object.keys(control.errors)) {
      const customMessage = this.errorMessages()[errorKey];

      if (customMessage) {
        return customMessage;
      }
    }

    if (control.hasError('required')) {
      return `${this.label()} is required`;
    }

    if (control.hasError('email')) {
      return `${this.label()} must be a valid email`;
    }

    if (control.hasError('minlength')) {
      return `${this.label()} must be at least 8 characters`;
    }

    if (control.hasError('pattern')) {
      return `${this.label()} has invalid format`;
    }

    return `${this.label()} is invalid`;
  }
}
