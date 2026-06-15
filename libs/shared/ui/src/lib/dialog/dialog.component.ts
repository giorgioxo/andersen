import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { UiDialogData } from './dialog.model';
import { UiButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-dialog',
  imports: [MatDialogModule, UiButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDialogComponent {
  protected readonly dialogData = inject<UiDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UiDialogComponent>);

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected confirm(): void {
    this.dialogRef.close(true);
  }
}
