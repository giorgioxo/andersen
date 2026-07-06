import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationComponent } from './notification.component';
import { NotificationStatus } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationBar = inject(MatSnackBar);

  public success(message: string): void {
    this.open(message, 'success');
  }

  public error(message: string): void {
    this.open(message, 'error');
  }

  private open(message: string, status: NotificationStatus): void {
    this.notificationBar.openFromComponent(NotificationComponent, {
      data: {
        message,
        status,
      },
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
