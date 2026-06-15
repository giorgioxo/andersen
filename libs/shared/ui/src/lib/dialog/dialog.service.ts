import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { UiDialogComponent } from './dialog.component';
import { UiDialogData } from './dialog.model';

@Injectable({
  providedIn: 'root',
})
export class UiDialogService {
  private readonly dialog = inject(MatDialog);

  public open(data: UiDialogData): Observable<boolean> {
    return this.dialog.open(UiDialogComponent, { data }).afterClosed();
  }
}
