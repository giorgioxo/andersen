import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiButtonPriority, UiButtonType } from './button.model';

@Component({
  selector: 'ui-button',
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  public readonly priority = input<UiButtonPriority>('primary');
  public readonly type = input<UiButtonType>('button');
  public readonly disabled = input(false);
}
