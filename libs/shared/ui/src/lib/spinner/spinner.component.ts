import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SPINNER_DIAMETER, UiSpinnerSize } from './spinner.model';

@Component({
  selector: 'ui-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSpinnerComponent {
  public readonly size = input<UiSpinnerSize>('medium');

  protected readonly diameter = computed(() => SPINNER_DIAMETER[this.size()]);
}
