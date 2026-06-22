import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { NotificationData, NotificationStatus } from './notification.model';

@Component({
  selector: 'ui-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  protected readonly notification = inject<NotificationData>(MAT_SNACK_BAR_DATA);

  protected readonly isSuccess = computed(() => this.notification.status === NotificationStatus.Success);

  protected readonly isError = computed(() => this.notification.status === NotificationStatus.Error);
}
