import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NotificationData } from './notification.model';



@Component({
  selector: 'ui-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  protected readonly notification = inject<NotificationData>(MAT_SNACK_BAR_DATA);
}
